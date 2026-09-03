#!/usr/bin/env node
/**
 * fetch-launches.js — 从 Launch Library 2.2 抓取发射数据并落盘缓存
 *
 * 定位：CI / 本地维护脚本，**零第三方依赖**（Node 18+ 内置 fetch），不被浏览器加载。
 *
 * 抓取内容：
 *   1. /2.2.0/launch/previous/  已发射（回看窗口默认 3 天，兜住 API 补录延迟）
 *   2. /2.2.0/launch/upcoming/  未来计划（默认 30 天，只用于更新已有 plan 事件日期）
 *
 * 幂等缓存：原始响应落 .sync/raw-*.json（已 gitignore），缓存新鲜则跳过请求。
 * 限额保护：单次运行总请求数硬上限 MAX_REQUESTS=6（LL 免费匿名档约 15 请求/小时/IP）。
 * 优雅降级：网络失败 / 超时不视为阻塞 —— 记日志 + 写 .sync/fetch-status.json 后 exit 0，
 *           merge-data.js 读到空结果即视为"本次无变更"，不产生 PR。
 *
 * 用法：
 *   node scripts/fetch-launches.js                 # 常规（缓存新鲜则跳过网络）
 *   node scripts/fetch-launches.js --offline       # 只读缓存，绝不发请求（本地联调用）
 *   node scripts/fetch-launches.js --force         # 忽略缓存新鲜度，强制重抓
 *   node scripts/fetch-launches.js --backfill      # 宽窗口抓取（首次为存量事件回填 llId）
 *
 * 环境变量：
 *   LL_API_KEY          认证 token（可选；缺省匿名调用，额度降低但可跑）
 *   LL_AUTH_SCHEME      Authorization 前缀，默认 Token
 *   LL_LOOKBACK_DAYS    常规回看天数，默认 3
 *   LL_UPCOMING_DAYS    计划前瞻天数，默认 30
 *   LL_BACKFILL_DAYS    回填窗口天数，默认 400（覆盖整个年度）
 *   LL_CACHE_TTL_H      缓存新鲜小时数，默认 6
 *   LL_TIMEOUT_MS       单请求超时毫秒，默认 20000
 *   LL_BACKFILL=1       等价于 --backfill
 */
"use strict";

const fs = require("fs");
const path = require("path");
const g = require("./glossary.js");

const ROOT = path.join(__dirname, "..");
const DATA_FILE = path.join(ROOT, "data.js");
const SYNC_DIR = path.join(ROOT, ".sync");

const API_BASE = "https://ll.thespacedevs.com/2.2.0/launch";
const MAX_REQUESTS = 6;          // 单次运行硬上限（设计文档要求 ≤6）
const MAX_RETRIES = 2;           // 单请求最多重试 2 次（首次 + 2 次重试）
const PAGE_LIMIT = 100;          // LL2 单页上限

/* ---------- 参数与配置 ---------- */
const argv = process.argv.slice(2);
const hasFlag = (name) => argv.includes(name);
const envInt = (name, dflt) => {
  const v = parseInt(process.env[name], 10);
  return Number.isFinite(v) && v >= 0 ? v : dflt;
};

const OFFLINE = hasFlag("--offline");
const FORCE = hasFlag("--force");
const LOOKBACK_DAYS = envInt("LL_LOOKBACK_DAYS", 3);
const UPCOMING_DAYS = envInt("LL_UPCOMING_DAYS", 30);
const BACKFILL_DAYS = envInt("LL_BACKFILL_DAYS", 400);
const CACHE_TTL_H = envInt("LL_CACHE_TTL_H", 6);
const TIMEOUT_MS = envInt("LL_TIMEOUT_MS", 20000);
const API_KEY = process.env.LL_API_KEY || "";
const AUTH_SCHEME = process.env.LL_AUTH_SCHEME || "Token";

/* 首次运行自动进入回填模式：data.js 里还没有任何 llId 时，窄窗口抓不到存量事件 */
let AUTO_BACKFILL = false;
try {
  AUTO_BACKFILL = !/\bllId\s*:/.test(fs.readFileSync(DATA_FILE, "utf8"));
} catch (e) {
  AUTO_BACKFILL = false; // data.js 读不到时不臆断，按常规窗口走
}
const BACKFILL = hasFlag("--backfill") || process.env.LL_BACKFILL === "1" || AUTO_BACKFILL;

/* ---------- 运行期状态 ---------- */
let requestCount = 0;
const errors = [];
const log = [];

function say(line) {
  log.push(line);
  process.stdout.write(line + "\n");
}

/** 缓存是否新鲜（mtime 在 TTL 内且可被解析） */
function cacheIsFresh(file) {
  if (FORCE || CACHE_TTL_H <= 0) return false;
  let st;
  try {
    st = fs.statSync(file);
  } catch (e) {
    return false;
  }
  const ageMs = Date.now() - st.mtimeMs;
  if (ageMs > CACHE_TTL_H * 3600 * 1000) return false;
  try {
    const j = JSON.parse(fs.readFileSync(file, "utf8"));
    return j && Array.isArray(j.results);
  } catch (e) {
    return false;
  }
}

/** 读取缓存 */
function readCache(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

/**
 * 带超时 / 重试 / 预算的 GET JSON。
 * @param {string} url 完整 URL
 * @returns {Promise<Object>} 解析后的 JSON
 */
async function getJson(url) {
  if (requestCount >= MAX_REQUESTS) {
    throw new Error(`请求预算已用尽（${MAX_REQUESTS} 次），停止翻页`);
  }
  requestCount++;

  const headers = { Accept: "application/json", "User-Agent": "space-launch-2026-site/1.0" };
  if (API_KEY) headers.Authorization = `${AUTH_SCHEME} ${API_KEY}`;

  let lastErr = null;
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const res = await fetch(url, { headers, signal: AbortSignal.timeout(TIMEOUT_MS) });
      if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
      return await res.json();
    } catch (e) {
      lastErr = e;
      if (attempt < MAX_RETRIES) {
        // 指数退避：1s、2s；预算耗尽则不再重试
        await new Promise((r) => setTimeout(r, 1000 * Math.pow(2, attempt)));
      }
    }
  }
  throw lastErr || new Error("未知网络错误");
}

/**
 * 抓一个端点并翻页合并，结果落盘缓存。
 * @param {string} name "previous" | "upcoming"
 * @param {Object} query 查询参数（不含 limit/offset/mode）
 * @param {number} maxPages 最大翻页数
 * @returns {Promise<{data:Object, fromCache:boolean}>}
 */
async function loadEndpoint(name, query, maxPages) {
  const file = path.join(SYNC_DIR, `raw-${name}.json`);

  if (cacheIsFresh(file)) {
    const data = readCache(file);
    say(`[cache] ${name}: 命中新鲜缓存（${data.results.length} 条），跳过网络请求`);
    return { data, fromCache: true };
  }
  if (OFFLINE) {
    if (fs.existsSync(file)) {
      const data = readCache(file);
      say(`[offline] ${name}: 离线模式，读本地缓存（${data.results.length} 条，新鲜度不限）`);
      return { data, fromCache: true };
    }
    errors.push(`${name}: 离线模式但无缓存文件，按空结果处理`);
    say(`[offline] ${name}: 无缓存，按空结果处理`);
    return { data: { count: 0, results: [] }, fromCache: true };
  }

  const params = new URLSearchParams(Object.assign({ limit: String(PAGE_LIMIT), mode: "list" }, query));
  let url = `${API_BASE}/${name}/?${params.toString()}`;
  let merged = [];

  for (let page = 0; page < maxPages; page++) {
    if (page > 0 && requestCount >= MAX_REQUESTS) break;
    const json = await getJson(url);
    const batch = Array.isArray(json.results) ? json.results : [];
    merged = merged.concat(batch);
    say(`[net] ${name}: 第 ${page + 1} 页取回 ${batch.length} 条（累计 ${merged.length}）`);
    if (!json.next || batch.length === 0) break;
    url = json.next;
  }

  const data = { count: merged.length, results: merged };
  fs.mkdirSync(SYNC_DIR, { recursive: true });
  fs.writeFileSync(file, JSON.stringify(data, null, 2), "utf8");
  return { data, fromCache: false };
}

/** 生成 N 天前的北京时间零点（UTC ISO 串，供 net__gte 使用） */
function isoDaysAgo(days, now) {
  const t = (now || new Date()).getTime() - days * 24 * 3600 * 1000;
  return new Date(t).toISOString().slice(0, 19) + "Z";
}

/** 生成 N 天后的北京时间（UTC ISO 串，供 net__lte 使用） */
function isoDaysAhead(days, now) {
  const t = (now || new Date()).getTime() + days * 24 * 3600 * 1000;
  return new Date(t).toISOString().slice(0, 19) + "Z";
}

/* ---------- 主流程 ---------- */
async function main() {
  fs.mkdirSync(SYNC_DIR, { recursive: true });

  const now = new Date();
  const previousWindow = BACKFILL ? BACKFILL_DAYS : LOOKBACK_DAYS;
  const status = {
    ranAt: new Date(now.getTime() + 8 * 3600 * 1000).toISOString().slice(0, 19) + "+08:00",
    mode: OFFLINE ? "offline" : "network",
    backfill: BACKFILL,
    autoBackfill: AUTO_BACKFILL,
    auth: API_KEY ? "token" : "anonymous",
    windows: {
      previous: `net__gte=${isoDaysAgo(previousWindow, now)}（回看 ${previousWindow} 天）`,
      upcoming: `net__lte=${isoDaysAhead(UPCOMING_DAYS, now)}（前瞻 ${UPCOMING_DAYS} 天）`,
    },
    requests: 0,
    ok: true,
    errors: [],
    files: {},
  };

  say("========== Launch Library 抓取 ==========");
  say(`模式: ${status.mode} | 认证: ${status.auth} | 回填窗口: ${BACKFILL ? `${previousWindow} 天` : `关（${previousWindow} 天）`}`);
  if (AUTO_BACKFILL) say("提示: data.js 中未发现 llId，已自动启用宽窗口回填（首次运行）");

  let previous = { count: 0, results: [] };
  let upcoming = { count: 0, results: [] };

  // previous：最多翻 3 页；upcoming：最多翻 2 页；合计 ≤5 次请求，留 1 次余量
  try {
    const r = await loadEndpoint("previous", { net__gte: isoDaysAgo(previousWindow, now), ordering: "-net" }, 3);
    previous = r.data;
    status.files.previous = { count: previous.results.length, fromCache: r.fromCache };
  } catch (e) {
    errors.push(`previous: ${e.message}`);
    say(`[warn] previous 抓取失败: ${e.message}（降级为空结果，不阻塞流程）`);
    status.files.previous = { count: 0, fromCache: false, error: e.message };
  }

  try {
    const r = await loadEndpoint("upcoming", { net__lte: isoDaysAhead(UPCOMING_DAYS, now), ordering: "net" }, 2);
    upcoming = r.data;
    status.files.upcoming = { count: upcoming.results.length, fromCache: r.fromCache };
  } catch (e) {
    errors.push(`upcoming: ${e.message}`);
    say(`[warn] upcoming 抓取失败: ${e.message}（降级为空结果，不阻塞流程）`);
    status.files.upcoming = { count: 0, fromCache: false, error: e.message };
  }

  status.requests = requestCount;
  status.errors = errors;
  status.ok = errors.length === 0;
  fs.writeFileSync(path.join(SYNC_DIR, "fetch-status.json"), JSON.stringify(status, null, 2), "utf8");

  say("------------------------------------------");
  say(`previous: ${previous.results.length} 条  |  upcoming: ${upcoming.results.length} 条  |  请求次数: ${requestCount}/${MAX_REQUESTS}`);
  say(errors.length === 0 ? "结论: 抓取完成 ✔" : `结论: 部分失败（${errors.length} 项，已降级不阻塞）⚠`);

  // 网络失败不算阻塞：始终 exit 0，交由 merge-data.js 判断是否产生变更
  process.exit(0);
}

main().catch((e) => {
  // 兜底：任何未预期异常也按降级处理，写状态文件后 exit 0
  errors.push(`unexpected: ${e && e.message ? e.message : String(e)}`);
  try {
    fs.mkdirSync(SYNC_DIR, { recursive: true });
    fs.writeFileSync(path.join(SYNC_DIR, "fetch-status.json"), JSON.stringify({
      ranAt: new Date().toISOString(), mode: OFFLINE ? "offline" : "network",
      requests: requestCount, ok: false, errors,
    }, null, 2), "utf8");
  } catch (ignore) { /* 状态文件写失败不影响退出码语义 */ }
  say(`[warn] 未预期异常，已降级: ${e && e.message ? e.message : e}`);
  process.exit(0);
});
