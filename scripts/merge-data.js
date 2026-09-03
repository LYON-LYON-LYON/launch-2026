#!/usr/bin/env node
/**
 * merge-data.js — 把 Launch Library 抓取结果合并进 data.js
 *
 * 定位：CI / 本地维护脚本，零第三方依赖，不被浏览器加载。
 * 输入：.sync/raw-previous.json、.sync/raw-upcoming.json（由 fetch-launches.js 产出）
 * 输出：data.js（有变更才写）、docs/pending-china.md（追加）、.sync/summary.md（PR 正文）
 *
 * 核心安全机制（"宁可漏抓不可污染"）：
 *   1. 中国事件永不入库 —— 命中即分流到 docs/pending-china.md，EVENTS 一行不动；
 *   2. 全局保护字段永不覆盖（name/pl/op/opKey/cat/ty/hl/note/tbd/month/lock/llId）；
 *   3. 逐事件 lock 数组可锁住"事实字段也信人工"的场景（如垣信批次星数先于 API 公布）；
 *   4. 写盘前自检：语法可编译 + 事件不丢失 + 保护字段零漂移，任一不满足则拒绝写盘；
 *   5. 首次运行（data.js 尚无 llId）自动进入"仅回填 llId"模式，保证首个 PR 不含内容误改。
 *
 * 用法：
 *   node scripts/merge-data.js                  # 常规合并（首次运行自动仅回填 llId）
 *   node scripts/merge-data.js --dry-run        # 只报告不写盘
 *   node scripts/merge-data.js --force-update   # 首次运行也允许更新事实字段
 *
 * 退出码：恒为 0。真正的门禁是紧随其后的 scripts/validate-data.js（FAIL 则 exit 1、不建 PR）。
 */
"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");
const g = require("./glossary.js");

const ROOT = path.join(__dirname, "..");
const DATA_FILE = path.join(ROOT, "data.js");
const SYNC_DIR = path.join(ROOT, ".sync");
const DOCS_DIR = path.join(ROOT, "docs");
const PENDING_FILE = path.join(DOCS_DIR, "pending-china.md");
const SUMMARY_FILE = path.join(SYNC_DIR, "summary.md");

const argv = process.argv.slice(2);
const DRY_RUN = argv.includes("--dry-run");
const FORCE_UPDATE = argv.includes("--force-update");

/* ========================================================================== *
 * 一、data.js 加载（vm 沙箱取运行时对象）
 * ========================================================================== */

/**
 * 在沙箱中执行 data.js 源码，返回导出对象。
 * @param {string} raw data.js 源码
 * @returns {Object} {EVENTS, ROCKETS, OPERATORS, CATS, SOURCES, DATA_ASOF}
 */
function loadData(raw) {
  const sandbox = {};
  vm.createContext(sandbox);
  vm.runInContext(
    raw + "\n;__export={EVENTS,ROCKETS,OPERATORS,CATS,SOURCES,DATA_ASOF};",
    sandbox,
    { filename: "data.js" }
  );
  return sandbox.__export;
}

/**
 * 语法自检：候选源码能否被编译。
 * @param {string} raw 候选源码
 * @returns {string|null} 错误信息；可编译返回 null
 */
function compileError(raw) {
  try {
    new vm.Script(raw + "\n;({EVENTS,ROCKETS,OPERATORS});", { filename: "data.js" });
    return null;
  } catch (e) {
    return e.message;
  }
}

/* ========================================================================== *
 * 二、data.js 文本手术（保留原有排版与注释，绝不整体重新序列化）
 * ========================================================================== */

/**
 * 定位某条事件对象字面量在原文中的区间。
 * @param {string} raw 源码
 * @param {string} id 事件 id
 * @returns {{start:number, end:number}|null}
 */
function findEventSpan(raw, id) {
  const needle = `{id:"${id}",`;
  const start = raw.indexOf(needle);
  if (start < 0) return null;
  let depth = 0;
  let i = start;
  while (i < raw.length) {
    const ch = raw[i];
    if (ch === '"') {                                  // 整体跳过字符串字面量
      i++;
      while (i < raw.length && raw[i] !== '"') {
        if (raw[i] === "\\") i++;
        i++;
      }
      i++;
      continue;
    }
    if (ch === "{") depth++;
    else if (ch === "}") {
      depth--;
      if (depth === 0) {
        let end = i + 1;
        if (raw[end] === ",") end++;
        return { start, end };
      }
    }
    i++;
  }
  return null;
}

/**
 * 在事件字面量内替换某个字段的值文本。
 * 仅匹配"紧跟 { 或 , 的字段"，避免误伤字符串内部同名内容（如 note 里出现 st:）。
 * @param {string} spanText 事件对象文本
 * @param {string} field 字段名
 * @param {string} valueText 新值的**源码文本**（含引号）
 * @returns {string|null} 新文本；字段缺失或不唯一返回 null
 */
function replaceField(spanText, field, valueText) {
  const re = new RegExp(`([{,]\\s*)${field}\\s*:\\s*(?:"[^"]*"|-?\\d+|true|false)`);
  const matches = spanText.match(re);
  if (!matches) return null;
  // 唯一性校验：同一字面量内该字段只能出现一次
  const all = spanText.match(new RegExp(`([{,]\\s*)${field}\\s*:\\s*(?:"[^"]*"|-?\\d+|true|false)`, "g"));
  if (!all || all.length !== 1) return null;
  return spanText.replace(re, (m, p1) => `${p1}${field}:${valueText}`);
}

/**
 * 在事件字面量内插入新字段（放在 note 之前；无 note 则放在结尾 } 之前），保持字段顺序可读。
 * @param {string} spanText 事件对象文本
 * @param {string} field 字段名
 * @param {string} valueText 新值的源码文本
 * @returns {string}
 */
function insertField(spanText, field, valueText) {
  const m = spanText.match(/([{,]\s*)note\s*:/);
  if (m) return spanText.slice(0, m.index) + `, ${field}:${valueText}` + spanText.slice(m.index);
  const tail = spanText.lastIndexOf("}");
  if (tail < 0) return spanText + `, ${field}:${valueText}}`;
  return spanText.slice(0, tail) + `, ${field}:${valueText}` + spanText.slice(tail);
}

/**
 * 事件对象 → 单行源码文本（对齐 data.js 现有排版：2 空格缩进 + 行尾逗号）。
 * @param {Object} ev 事件对象
 * @returns {string}
 */
function eventToText(ev) {
  const parts = [
    `id:${JSON.stringify(ev.id)}`,
    `name:${JSON.stringify(ev.name)}`,
    `s:${JSON.stringify(ev.s)}`,
    `e:${JSON.stringify(ev.e)}`,
    `t:${JSON.stringify(ev.t)}`,
    `rk:${JSON.stringify(ev.rk)}`,
    `rkKey:${JSON.stringify(ev.rkKey)}`,
    `pl:${JSON.stringify(ev.pl)}`,
    `satCount:${ev.satCount}`,
    `site:${JSON.stringify(ev.site)}`,
    `op:${JSON.stringify(ev.op)}`,
    `opKey:${JSON.stringify(ev.opKey)}`,
    `cat:${JSON.stringify(ev.cat)}`,
    `ty:${JSON.stringify(ev.ty)}`,
    `st:${JSON.stringify(ev.st)}`,
    `hl:${ev.hl}`,
    `src:${JSON.stringify(ev.src)}`,
    `note:${JSON.stringify(ev.note)}`,
  ];
  if (ev.llId) parts.push(`llId:${JSON.stringify(ev.llId)}`);
  return "  {" + parts.join(", ") + "},";
}

/* ========================================================================== *
 * 三、LL 单条发射 → 本站事件字段
 * ========================================================================== */

/**
 * 把 LL 的 launch 对象映射为本站事件字段。
 * 返回 null 表示"应当跳过"（状态未收录 / In Flight / 日期非法）。
 * @param {Object} launch LL launch 对象
 * @param {Object} data data.js 运行时对象（用于取火箭中文显示名）
 * @returns {Object|null}
 */
function mapLaunch(launch, data, today) {
  const cfg = (launch.rocket && launch.rocket.configuration) || {};
  const mission = launch.mission || {};
  const pad = launch.pad || {};
  const loc = pad.location || {};
  const lspName = (launch.launch_service_provider && launch.launch_service_provider.name) || "";

  // In Flight 或未收录状态 → 跳过待审，不抢跑
  const st = g.mapStatus(launch.status && launch.status.abbrev, launch.status && launch.status.name);
  if (st === null) return null;

  const s = g.bjDate(launch.net);
  if (!s) return null;                                   // 日期非法，无法定位，直接跳过
  const wEnd = g.bjDate(launch.window_end);
  const e = wEnd && wEnd !== s ? wEnd : s;

  // 时刻精度：LL 的 net_precision 不是时/分/秒时，视为无精确时刻
  const precision = String(
    (launch.net_precision && (launch.net_precision.name || launch.net_precision.abbrev)) || ""
  );
  const hasPreciseTime = precision === "" || /\b(second|minute|hour)\b/i.test(precision);
  const t = hasPreciseTime ? g.bjTime(launch.net) : "—";

  const rkKey = g.mapRocketKey(cfg.name);
  const rk = (rkKey && data.ROCKETS[rkKey]) ? data.ROCKETS[rkKey].name : (cfg.full_name || cfg.name || "—");

  const satCount = g.parseSatCount(launch.name, mission.description);
  const site = g.mapSite(loc.name, pad.name);
  const opInfo = g.mapOperator(lspName, launch.name, mission.name, rkKey, cfg.full_name || cfg.name);
  const ty = g.mapType(lspName);

  // name：LL 形如 "Falcon 9 Block 5 | Starlink Group 12-31"，取竖线后的载荷段
  const rawName = String(launch.name || "").trim();
  const name = rawName.includes("|") ? rawName.split("|").pop().trim() : (rawName || "—");

  let pl = String(mission.name || rawName || "—").trim();
  if (satCount > 0 && !pl.includes("×")) pl = `${pl} ×${satCount}`;

  return {
    llId: String(launch.slug || launch.id || ""),
    name,
    s, e, t,
    rk,
    rkKey,
    pl,
    satCount,
    site,
    op: opInfo.op,
    opKey: opInfo.opKey,
    cat: opInfo.cat,
    ty,
    st,
    hl: 0,
    src: "launchlib",
    note: "",                                            // note 属人工叙事字段，新建事件留空
    isChina: g.isChina(launch),
    // 未来日期标记：net 晚于今天 → 该发射"尚未发生"，不得写入任何"结果字段"（st/satCount）
    isFuture: !!s && s > today,
    lspName,
    statusText: (launch.status && launch.status.abbrev) || "",
  };
}

/* ========================================================================== *
 * 四、id 生成
 * ========================================================================== */

const ID_PREFIX = { starlink: "sx", kuiper: "kp", oneweb: "ow", spacex: "ss" };

/**
 * 为新增国际事件生成不与存量冲突的 id。
 * @param {Object} mapped 映射后的事件
 * @param {Set<string>} usedIds 已占用的 id 集合
 * @returns {string}
 */
function genEventId(mapped, usedIds) {
  const prefix = ID_PREFIX[mapped.opKey] || "il";
  const month = parseInt(String(mapped.s).slice(5, 7), 10) || 1;
  for (let n = 1; n <= 99; n++) {
    const id = `${prefix}-m${month}-${n}`;
    if (!usedIds.has(id)) {
      usedIds.add(id);
      return id;
    }
  }
  // 极端兜底：99 次仍冲突则挂时间戳后缀（实际不可能发生）
  const fallback = `${prefix}-m${month}-${Date.now()}`;
  usedIds.add(fallback);
  return fallback;
}

/* ========================================================================== *
 * 五、主流程
 * ========================================================================== */

function main() {
  const raw = fs.readFileSync(DATA_FILE, "utf8");
  const data = loadData(raw);
  const oldEvents = data.EVENTS;
  const oldById = new Map(oldEvents.map((ev) => [ev.id, ev]));

  /* ---- 读取抓取结果（缺失即视为空，降级不报错） ---- */
  const readRaw = (name) => {
    const f = path.join(SYNC_DIR, `raw-${name}.json`);
    if (!fs.existsSync(f)) return { count: 0, results: [] };
    try {
      const j = JSON.parse(fs.readFileSync(f, "utf8"));
      return { count: j.count || 0, results: Array.isArray(j.results) ? j.results : [] };
    } catch (e) {
      process.stdout.write(`[warn] ${name} 缓存解析失败，按空结果处理: ${e.message}\n`);
      return { count: 0, results: [] };
    }
  };
  const rawPrev = readRaw("previous");
  const rawUp = readRaw("upcoming");

  /* ---- 首次运行判定：存量国际事件尚无 llId → 只回填 llId，不动任何内容 ---- */
  const intlEvents = oldEvents.filter((ev) => ev.ty === "国外");
  const isFirstRun = intlEvents.length > 0 && intlEvents.every((ev) => !ev.llId);
  const backfillOnly = isFirstRun && !FORCE_UPDATE;

  /* ---- 建立匹配索引 ---- */
  const byLlId = new Map();
  for (const ev of intlEvents) if (ev.llId) byLlId.set(ev.llId, ev);

  const byDateRk = new Map();
  for (const ev of intlEvents) {
    const key = `${ev.s}|${ev.rkKey}`;
    if (!byDateRk.has(key)) byDateRk.set(key, []);
    byDateRk.get(key).push(ev);
  }
  const claimed = new Set();                              // 已被认领的存量事件 id
  const usedIds = new Set(oldEvents.map((ev) => ev.id));

  /* ---- 今天的北京时间日期：未来日期防护的基准线（YYYY-MM-DD，可直接做字符串比较） ---- */
  const TODAY = g.bjToday();

  /* ---- 文本编辑队列（最后按位置倒序应用，避免偏移） ---- */
  const edits = [];
  const queueEdit = (start, end, text) => edits.push({ start, end, text });

  const stats = {
    mode: backfillOnly ? "首次运行 · 仅回填 llId" : "常规合并",
    fetched: { previous: rawPrev.results.length, upcoming: rawUp.results.length },
    matched: 0,
    updated: 0,
    llIdBackfilled: 0,
    added: [],
    changes: [],            // {id, field, old, new}
    locked: [],             // {id, field, new}  因 lock 被跳过
    pendingChina: [],
    unmatchedUpcoming: [],  // {slug, name, reason}
    unmatchedPrevious: [],  // {slug, name, reason}
    futureAnomalies: [],    // {slug, name, date, status, reason} 未来日期异常，被拦截
    futureBlocked: [],      // {id, field, value} 因未来日期而未写入的字段
    needSatCount: [],       // {id, name} done 但 satCount=0
    dataAsof: { old: data.DATA_ASOF, new: data.DATA_ASOF },
  };

  /**
   * 处理单条已匹配事件：逐字段合并，返回是否需要回写。
   * @param {Object} ev 存量事件
   * @param {Object} mapped API 映射结果
   * @returns {{changes:Array, locked:Array, finalValues:Object}|null}
   */
  function mergeInto(ev, mapped) {
    const lockList = Array.isArray(ev.lock) ? ev.lock : [];
    const changes = [];
    const locked = [];
    const finalValues = Object.assign({}, ev);
    let span = findEventSpan(raw, ev.id);
    if (!span) {
      process.stdout.write(`[warn] 事件 ${ev.id} 未能在源码中定位，跳过\n`);
      return null;
    }
    let spanText = raw.slice(span.start, span.end);
    let dirty = false;

    // 1) llId 回填（唯一匹配主键，任何模式都要写 —— 这正是首次运行的目的）
    if (!ev.llId && mapped.llId) {
      spanText = insertField(spanText, "llId", JSON.stringify(mapped.llId));
      finalValues.llId = mapped.llId;
      changes.push({ field: "llId", old: "(空)", new: mapped.llId });
      stats.llIdBackfilled++;
      dirty = true;
    }

    // 2) 事实字段更新（首次运行跳过，保证首 PR 内容零误改）
    if (!backfillOnly) {
      const contentChanges = [];
      for (const f of g.UPDATABLE_FIELDS) {
        if (f === "src") continue;                       // src 单独处理：有实质变更才改
        if (lockList.includes(f)) {
          if (String(ev[f]) !== String(mapped[f])) locked.push({ field: f, value: mapped[f] });
          continue;
        }
        if (String(ev[f]) === String(mapped[f])) continue;

        // t 的写入约束：只在 API 有精确时刻、且当前值是占位（—/预计/窗口）时才补
        if (f === "t") {
          if (mapped.t === "—") continue;
          if (!["—", "预计", "窗口", ""].includes(String(ev.t))) continue;
        }

        // 【未来日期铁律】net 晚于今天 = 发射尚未发生，绝不允许写入"结果字段"：
        //   st     —— done/fail 表示已经打完了，未来日期下是自相矛盾的脏数据，保持原状态（多为 plan）
        //   satCount —— 尚未发射就不可能有入轨星数，保持原值（多为 0）
        // 这是防止异常/mock 数据把未来计划写成已执行记录的最后一道闸。
        if (mapped.isFuture && f === "st" && (mapped.st === "done" || mapped.st === "fail")) {
          stats.futureBlocked.push({ id: ev.id, field: f, value: mapped.st });
          continue;
        }
        if (mapped.isFuture && f === "satCount") {
          stats.futureBlocked.push({ id: ev.id, field: f, value: mapped.satCount });
          continue;
        }

        const next = replaceField(spanText, f, JSON.stringify(mapped[f]));
        if (next === null) {
          process.stdout.write(`[warn] 事件 ${ev.id} 字段 ${f} 在源码中不唯一或缺失，跳过该字段\n`);
          continue;
        }
        spanText = next;
        finalValues[f] = mapped[f];
        contentChanges.push({ field: f, old: ev[f], new: mapped[f] });
        dirty = true;
      }

      // 3) src：仅当本条确有实质变更时才切到 launchlib（避免首轮 49 条无意义翻牌）
      if (contentChanges.length > 0 && ev.src !== "launchlib") {
        if (lockList.includes("src")) {
          locked.push({ field: "src", value: "launchlib" });
        } else {
          const next = replaceField(spanText, "src", JSON.stringify("launchlib"));
          if (next !== null) {
            spanText = next;
            finalValues.src = "launchlib";
            contentChanges.push({ field: "src", old: ev.src, new: "launchlib" });
          }
        }
      }
      for (const c of contentChanges) changes.push(c);
    }

    if (dirty) queueEdit(span.start, span.end, spanText);

    // 4) done 但 0 星 → 标记人工补星数
    if (finalValues.st === "done" && Number(finalValues.satCount) === 0) {
      stats.needSatCount.push({ id: ev.id, name: ev.name });
    }
    return { changes, locked, finalValues };
  }

  /**
   * 处理一批 LL 发射（previous 或 upcoming）。
   * @param {Array<Object>} launches LL results
   * @param {"previous"|"upcoming"} source 来源端点
   */
  function processBatch(launches, source) {
    for (const launch of launches) {
      const mapped = mapLaunch(launch, data, TODAY);
      if (!mapped || !mapped.llId) continue;
      if (!mapped.s) continue;

      // 【中国铁律】中国事件一律不入库，直接进人工待审清单
      if (mapped.isChina) {
        stats.pendingChina.push(mapped);
        continue;
      }

      // 第一级：llId 精确匹配
      let ev = byLlId.get(mapped.llId);
      if (ev && claimed.has(ev.id)) ev = undefined;

      // 第二级：日期 + rkKey 兜底（首次运行靠它为存量事件回填 llId）
      if (!ev) {
        const cands = (byDateRk.get(`${mapped.s}|${mapped.rkKey}`) || []).filter((c) => !claimed.has(c.id));
        if (cands.length === 1) {
          ev = cands[0];
        } else if (cands.length > 1) {
          // 歧义：不猜，进未匹配清单由人工判断
          stats.unmatchedPrevious.push({
            slug: mapped.llId, name: mapped.name,
            reason: `日期+型号命中 ${cands.length} 条候选（${cands.map((c) => c.id).join(", ")}），存在歧义不敢自动归口`,
          });
          continue;
        }
      }

      if (ev) {
        claimed.add(ev.id);
        stats.matched++;
        const r = mergeInto(ev, mapped);
        if (!r) continue;
        if (r.changes.length > 0) {
          stats.updated++;
          for (const c of r.changes) stats.changes.push({ id: ev.id, field: c.field, old: c.old, new: c.new });
          for (const l of r.locked) stats.locked.push({ id: ev.id, field: l.field, value: l.value });
        }
        continue;
      }

      // 未匹配：计划事件不新增（避免打乱手工批次节奏）；已发射事件可新增
      if (source === "upcoming") {
        stats.unmatchedUpcoming.push({
          slug: mapped.llId, name: mapped.name,
          reason: "计划事件不自动新增（仅用于更新已有 plan 事件日期）",
        });
        continue;
      }
      if (!mapped.rkKey) {
        stats.unmatchedPrevious.push({
          slug: mapped.llId, name: mapped.name,
          reason: `火箭型号 "${launch.rocket && launch.rocket.configuration && launch.rocket.configuration.name}" 未收录于 glossary，不敢猜归口`,
        });
        continue;
      }
      if (backfillOnly) {
        stats.unmatchedPrevious.push({
          slug: mapped.llId, name: mapped.name,
          reason: "首次运行仅回填 llId，新事件暂不入库",
        });
        continue;
      }
      // 【未来日期铁律】previous 端点本不该返回未来事件；若出现即为异常数据，一律进待审不入库。
      // 这是防止 mock/异常 API 数据把"尚未发生的发射"写成已执行记录的最后一道闸。
      if (mapped.isFuture) {
        stats.futureAnomalies.push({
          slug: mapped.llId, name: mapped.name, date: mapped.s, status: mapped.statusText,
          reason: `net ${mapped.s} 晚于今天 ${TODAY}${mapped.st !== "plan" ? `，且状态为 ${mapped.statusText}（已执行类），数据自相矛盾` : ""}，不入库`,
        });
        continue;
      }
      // 新增国际事件
      const newEvent = Object.assign({}, mapped);
      newEvent.id = genEventId(mapped, usedIds);
      stats.added.push(newEvent);
      if (newEvent.st === "done" && Number(newEvent.satCount) === 0) {
        stats.needSatCount.push({ id: newEvent.id, name: newEvent.name });
      }
    }
  }

  processBatch(rawPrev.results, "previous");
  processBatch(rawUp.results, "upcoming");

  /* ---- 新增事件统一插入到 EVENTS 数组末尾 ---- */
  if (stats.added.length > 0) {
    const evStart = raw.indexOf("const EVENTS = [");
    const evEnd = raw.indexOf("\n];", evStart);
    if (evStart < 0 || evEnd < 0) {
      process.stdout.write("[error] 未能定位 EVENTS 数组结尾，放弃插入新增事件\n");
      stats.added = [];
    } else {
      const block = "\n\n  /* --- 自动同步新增（Launch Library 2.2） --- */\n" +
        stats.added.map(eventToText).join("\n");
      queueEdit(evEnd, evEnd, block);
    }
  }

  /* ---- DATA_ASOF 只推进不回退 ---- */
  const today = g.bjToday();
  if (today > data.DATA_ASOF) {
    stats.dataAsof.new = today;
    const m = raw.match(/(const DATA_ASOF = ")(\d{4}-\d{2}-\d{2})(")/);
    if (m) {
      const start = m.index + m[1].length;
      queueEdit(start, start + m[2].length, today);
    } else {
      process.stdout.write("[warn] 未能定位 DATA_ASOF 字面量，跳过基准日更新\n");
      stats.dataAsof.new = data.DATA_ASOF;
    }
  }

  /* ---- 应用所有编辑 ---- */
  let newRaw = raw;
  if (edits.length > 0) {
    const sorted = edits.slice().sort((a, b) => b.start - a.start);
    for (const e of sorted) newRaw = newRaw.slice(0, e.start) + e.text + newRaw.slice(e.end);
  }

  /* ---- 写盘前自检：语法 / 事件不丢失 / 保护字段零漂移 ---- */
  const blockers = [];
  const compileErr = compileError(newRaw);
  if (compileErr) blockers.push(`data.js 语法不可编译：${compileErr}`);

  let newData = null;
  if (!compileErr && edits.length > 0) {
    try {
      newData = loadData(newRaw);
    } catch (e) {
      blockers.push(`data.js 重新加载失败：${e.message}`);
    }
    if (newData) {
      if (newData.EVENTS.length !== oldEvents.length + stats.added.length) {
        blockers.push(`事件数异常：期望 ${oldEvents.length + stats.added.length}，实际 ${newData.EVENTS.length}`);
      }
      const newById = new Map(newData.EVENTS.map((ev) => [ev.id, ev]));
      for (const oldEv of oldEvents) {
        const newEv = newById.get(oldEv.id);
        if (!newEv) { blockers.push(`存量事件丢失：${oldEv.id}`); continue; }
        for (const f of g.PROTECTED_FIELDS) {
          if (f === "llId") continue;                    // llId 允许回填
          if (JSON.stringify(oldEv[f]) !== JSON.stringify(newEv[f])) {
            blockers.push(`保护字段被改写：${oldEv.id}.${f}（${JSON.stringify(oldEv[f])} → ${JSON.stringify(newEv[f])}）`);
          }
        }
      }
      const seen = new Set();
      for (const ev of newData.EVENTS) {
        if (seen.has(ev.id)) blockers.push(`新增后 id 重复：${ev.id}`);
        seen.add(ev.id);
      }
    }
  }

  if (blockers.length > 0) {
    process.stdout.write("========== 合并中止（自检未通过，data.js 未改动） ==========\n");
    for (const b of blockers) process.stdout.write(`  ✘ ${b}\n`);
    fs.mkdirSync(SYNC_DIR, { recursive: true });
    fs.writeFileSync(SUMMARY_FILE, [
      "## 数据自动同步摘要",
      "",
      "**状态：合并中止** —— 写盘前自检未通过，data.js 未被改动。",
      "",
      "### 阻塞项",
      ...blockers.map((b) => `- ${b}`),
      "",
    ].join("\n"), "utf8");
    process.exit(0);
  }

  /* ---- 写盘 ---- */
  const hasDataChange = edits.length > 0;
  if (hasDataChange && !DRY_RUN) {
    fs.writeFileSync(DATA_FILE, newRaw, "utf8");
  }

  /* ---- 中国待审清单（追加，按 llId 去重） ---- */
  let pendingAppended = 0;
  if (stats.pendingChina.length > 0 && !DRY_RUN) {
    fs.mkdirSync(DOCS_DIR, { recursive: true });
    const prev = fs.existsSync(PENDING_FILE) ? fs.readFileSync(PENDING_FILE, "utf8") : "";
    const fresh = stats.pendingChina.filter((m) => !prev.includes(m.llId));
    if (fresh.length > 0) {
      if (!prev) {
        fs.writeFileSync(PENDING_FILE, [
          "# 中国发射事件 · 人工待审清单",
          "",
          "> 本文件由 `scripts/merge-data.js` 自动生成：**Launch Library 发现的中国发射事件一律不自动入库**，",
          "> 只在此列出建议字段值，需人工核实后手工写入 `data.js` 的 EVENTS。",
          "> 原因：LL 对中国任务覆盖不全且字段质量不稳定，自动合并有误污染风险。",
          "> 核实完成后请删除对应条目，保持清单为空即表示无积压。",
          "",
        ].join("\n"), "utf8");
      }
      const stamp = g.bjToday();
      const lines = [`## ${stamp} 自动同步（${fresh.length} 条）`, ""];
      lines.push("| LL slug | 建议名称 | 日期 | 火箭 | 发射场 | 建议 ty | 建议 opKey | 星数 | LL 状态 |");
      lines.push("|---|---|---|---|---|---|---|---|---|");
      for (const m of fresh) {
        lines.push(`| \`${m.llId}\` | ${m.name} | ${m.s} | ${m.rk}（${m.rkKey || "未收录"}） | ${m.site} | ${m.ty} | ${m.opKey} | ${m.satCount} | ${m.statusText} |`);
      }
      lines.push("");
      lines.push("### 逐条建议字段值");
      for (const m of fresh) {
        lines.push("");
        lines.push(`- **${m.name}**（\`${m.llId}\`）`);
        lines.push(`  - 服务商：${m.lspName || "—"} → 建议 ty=\`${m.ty}\``);
        lines.push(`  - 建议 id：\`${(ID_PREFIX[m.opKey] || "m") + "-m" + (parseInt(String(m.s).slice(5, 7), 10) || 1)}-?\`（需人工定序号）`);
        lines.push(`  - 日期 s/e：\`${m.s}\` / \`${m.e}\`，时刻：\`${m.t}\``);
        lines.push(`  - 火箭 rkKey：\`${m.rkKey || "未收录，需补 glossary"}\`（${m.rk}）`);
        lines.push(`  - 载荷 pl：\`${m.pl}\``);
        lines.push(`  - 卫星数 satCount：\`${m.satCount}\`（API 正则抓取，务必核实）`);
        lines.push(`  - 运营方 opKey：\`${m.opKey}\`，分类 cat：\`${m.cat}\``);
        lines.push(`  - LL 状态 ${m.statusText} → 建议 st=\`${m.st}\``);
      }
      lines.push("");
      fs.appendFileSync(PENDING_FILE, lines.join("\n"), "utf8");
      pendingAppended = fresh.length;
    }
  }

  /* ---- R13 预警：DATA_ASOF 推进后，窗口已过的 plan 事件会被校验器拦下（流水线无权自修） ---- */
  const stalePlan = [];
  {
    const snapshot = newData || data;
    const asof = stats.dataAsof.new;
    for (const ev of snapshot.EVENTS) {
      if (ev.st === "plan" && ev.e && ev.e < asof) stalePlan.push({ id: ev.id, name: ev.name, e: ev.e });
    }
  }

  /* ---- 摘要（PR 正文） ---- */
  const stamp = new Date(Date.now() + 8 * 3600 * 1000).toISOString().slice(0, 19).replace("T", " ") + " (北京时间)";
  const L = [];
  L.push("## 数据自动同步摘要");
  L.push("");
  L.push(`- 运行时间：${stamp}`);
  L.push(`- 运行模式：**${stats.mode}**${backfillOnly ? "（检测到 data.js 尚无 llId，本轮只回填主键、不动事件内容）" : ""}`);
  L.push(`- 抓取量：previous ${stats.fetched.previous} 条 / upcoming ${stats.fetched.upcoming} 条`);
  L.push(`- 匹配到存量事件：${stats.matched} 条`);
  L.push(`- 回填 llId：${stats.llIdBackfilled} 条`);
  L.push(`- 产生字段变更的事件：${stats.updated} 条（共 ${stats.changes.length} 处）`);
  L.push(`- 新增事件：${stats.added.length} 条`);
  L.push(`- 中国事件转人工待审：${stats.pendingChina.length} 条${pendingAppended ? `（新追加 ${pendingAppended} 条）` : "（清单中已存在，未重复追加）"}`);
  L.push(`- DATA_ASOF：\`${stats.dataAsof.old}\` → \`${stats.dataAsof.new}\``);
  L.push(`- 未来日期异常拦截：新增 ${stats.futureAnomalies.length} 条 / 字段 ${stats.futureBlocked.length} 处`);
  L.push(`- data.js 变动：**${hasDataChange ? "有" : "无"}**${DRY_RUN ? "（--dry-run 未写盘）" : ""}`);
  L.push("");

  if (stats.added.length > 0) {
    L.push("### 新增事件");
    L.push("");
    L.push("| id | 名称 | 日期 | 火箭 | 运营方 | 星数 | 状态 |");
    L.push("|---|---|---|---|---|---|---|");
    for (const ev of stats.added) {
      L.push(`| ${ev.id} | ${ev.name} | ${ev.s} | ${ev.rk} | ${ev.op} | ${ev.satCount} | ${ev.st} |`);
    }
    L.push("");
  }

  if (stats.changes.length > 0) {
    L.push(`### 字段变更明细（${stats.changes.length} 处）`);
    L.push("");
    L.push("```");
    for (const c of stats.changes) {
      L.push(`${c.id} · ${c.field} · ${JSON.stringify(c.old)} → ${JSON.stringify(c.new)}`);
    }
    L.push("```");
    L.push("");
  }

  if (stats.futureAnomalies.length > 0 || stats.futureBlocked.length > 0) {
    L.push(`### 🛡 未来日期拦截（新增 ${stats.futureAnomalies.length} 条 / 字段 ${stats.futureBlocked.length} 处）`);
    L.push("");
    L.push(`> net 晚于今天（${TODAY}）的发射**尚未发生**，流水线禁止把它写成已执行记录。`);
    L.push("> 若此类条目持续出现，说明 API 数据异常或抓取窗口配置有误，需要人工介入排查。");
    L.push("");
    for (const a of stats.futureAnomalies) {
      L.push(`- **未入库**：${a.name}（\`${a.slug}\`）net=${a.date} 状态=${a.status} —— ${a.reason}`);
    }
    for (const b of stats.futureBlocked) {
      L.push(`- **字段未写入**：${b.id} · ${b.field} · API 值 ${JSON.stringify(b.value)} 被拦截`);
    }
    L.push("");
  }

  if (stats.locked.length > 0) {
    L.push(`### 已被 lock 跳过（${stats.locked.length} 处）`);
    L.push("");
    L.push("> 这些字段被事件自身的 `lock` 数组声明为人工维护，流水线未覆盖。");
    L.push("");
    for (const l of stats.locked) {
      L.push(`- ${l.id} · ${l.field} · API 值 ${JSON.stringify(l.value)} 未应用（已锁）`);
    }
    L.push("");
  }

  if (stats.needSatCount.length > 0) {
    L.push(`### ⚠ 待人工补星数（${stats.needSatCount.length} 条）`);
    L.push("");
    L.push("> 以下事件状态为 done 但 satCount=0，疑漏抓星数，仍进 PR 但需人工补齐。");
    L.push("");
    for (const n of stats.needSatCount) L.push(`- ${n.id} · ${n.name}`);
    L.push("");
  }

  if (stats.pendingChina.length > 0) {
    L.push(`### 中国事件待审（${stats.pendingChina.length} 条 → docs/pending-china.md）`);
    L.push("");
    for (const m of stats.pendingChina) {
      L.push(`- ${m.name}（\`${m.llId}\`）${m.s} · ${m.rk} · 建议 ty=${m.ty} / opKey=${m.opKey}`);
    }
    L.push("");
  }

  if (stalePlan.length > 0) {
    L.push(`### ⚠ 过期计划事件（${stalePlan.length} 条，R13 会拦截本 PR）`);
    L.push("");
    L.push("> DATA_ASOF 推进后，以下 plan 事件的窗口已过。这些多为中国事件 —— 流水线**不会**自动改动，");
    L.push("> 但校验器 R13 会把它们判为 FAIL 从而拦下本 PR。请人工回填为 done/fail/delay 后重跑 workflow_dispatch。");
    L.push("");
    for (const s of stalePlan) L.push(`- ${s.id} · ${s.name} · 窗口末日 ${s.e} < DATA_ASOF ${stats.dataAsof.new}`);
    L.push("");
  }

  const unmatched = stats.unmatchedPrevious.concat(stats.unmatchedUpcoming);
  if (unmatched.length > 0) {
    L.push(`### 未匹配、未入库（${unmatched.length} 条）`);
    L.push("");
    for (const u of unmatched) L.push(`- ${u.name}（\`${u.slug}\`）：${u.reason}`);
    L.push("");
  }

  if (!hasDataChange && stats.pendingChina.length === 0) {
    L.push("---");
    L.push("");
    L.push("本次运行**无任何变更**。");
    L.push("");
  }

  fs.mkdirSync(SYNC_DIR, { recursive: true });
  fs.writeFileSync(SUMMARY_FILE, L.join("\n"), "utf8");

  /* ---- 控制台报告 ---- */
  say("========== 数据合并报告 ==========");
  say(`模式: ${stats.mode}`);
  say(`抓取: previous ${stats.fetched.previous} / upcoming ${stats.fetched.upcoming}`);
  say(`匹配 ${stats.matched} 条  |  回填 llId ${stats.llIdBackfilled} 条  |  字段变更 ${stats.changes.length} 处  |  新增 ${stats.added.length} 条`);
  say(`中国待审 ${stats.pendingChina.length} 条  |  未匹配 ${unmatched.length} 条  |  lock 跳过 ${stats.locked.length} 处`);
  say(`未来日期拦截: 新增 ${stats.futureAnomalies.length} 条  |  字段 ${stats.futureBlocked.length} 处`);
  say(`DATA_ASOF: ${stats.dataAsof.old} → ${stats.dataAsof.new}`);
  for (const c of stats.changes) say(`  · ${c.id} · ${c.field} · ${JSON.stringify(c.old)} → ${JSON.stringify(c.new)}`);
  for (const l of stats.locked) say(`  🔒 ${l.id} · ${l.field} · API 值 ${JSON.stringify(l.value)} 未应用（已锁）`);
  for (const a of stats.futureAnomalies) say(`  🛡 未入库 ${a.name}（${a.slug}）net=${a.date} 状态=${a.status}`);
  for (const b of stats.futureBlocked) say(`  🛡 ${b.id} · ${b.field} · API 值 ${JSON.stringify(b.value)} 被未来日期拦截`);
  say(hasDataChange ? `data.js 已更新${DRY_RUN ? "（dry-run 未写盘）" : ""} ✔` : "data.js 无变更");
  say(`摘要已写入 ${path.relative(ROOT, SUMMARY_FILE)}`);
  process.exit(0);
}

/** 控制台输出（统一出口，便于重定向到日志） */
function say(line) {
  process.stdout.write(line + "\n");
}

main();
