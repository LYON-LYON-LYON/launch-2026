#!/usr/bin/env node
/**
 * validate-data.js — data.js 数据校验器（零依赖，node 18+）
 * 用法：node scripts/validate-data.js
 * 规则：任何一项 FAIL → 整体 FAIL、exit 1（硬门禁）
 * 校验项：
 *   R1  ROCKETS / OPERATORS 重复 key（原始文本正则提取——防 JS 静默覆盖，最关键）
 *   R2  EVENTS.id 唯一
 *   R3  rkKey ∈ ROCKETS 或 ""
 *   R4  opKey ∈ OPERATORS 或 ""
 *   R5  cat ∈ CATS
 *   R6  ty ∈ {国发, 商发, 国外}
 *   R7  st ∈ {done, fail, delay, plan}
 *   R8  st 为 done/fail 的事件必须有 src 且 ∈ SOURCES（追溯性硬门禁）
 *   R9  s/e 日期格式 YYYY-MM-DD 或空串
 *   R10 tbd:1 的事件必须有 month 字段
 *   R11 MILESTONES 的 d 日期格式合法
 *   R12 OPERATORS.inOrbitBase 非负数、inOrbitBaseDate 合法日期、二者成对出现（B5 派生计算）
 *   R13 过期计划检查（warning 级，**不阻塞**：[WARN] 标注 + 报告末尾单列待清理清单，不计入 failCount）
 *   R14 llId 全表唯一（B1 流水线匹配主键，重复会导致错配）
 *   R15 lock 数组元素 ⊆ {s,e,t,st,satCount,src}（锁全局保护字段无意义，须报错提示）
 */
"use strict";
const fs = require("fs");
const path = require("path");
const vm = require("vm");
// lock 合法值取自流水线词典，避免两处各写一份常量而漂移
const GLOSSARY = require("./glossary.js");

const DATA_FILE = path.join(__dirname, "..", "data.js");
const results = [];
let failCount = 0;
/** R13 待清理清单（warning 级，报告末尾单独列出） */
let stalePlanList = [];

function record(id, pass, detail) {
  results.push({ id, pass, detail });
  if (!pass) failCount++;
}

/* ---------- R1: 重复 key 检测（原始文本层面） ---------- */
function extractDuplicateKeys(raw, tableName) {
  // 定位表定义：const NAME = { ... };  （到行首 "};" 结束）
  const startRe = new RegExp(`const\\s+${tableName}\\s*=\\s*\\{`);
  const m = raw.match(startRe);
  if (!m) return { missing: true, dups: [] };
  const body = raw.slice(m.index + m[0].length, raw.indexOf("\n};", m.index));
  // 提取顶层条目 key：逐字符扫描。body 不含表外层括号 → 顶层条目 key 位于深度 0，
  // 条目对象内部字段位于深度 ≥1（跳过）；注释与字符串内容天然跳过
  const keys = [];
  let depth = 0, i = 0;
  while (i < body.length) {
    const ch = body[i];
    if (ch === '"' || ch === "'") {                       // 字符串：整体跳过
      let end = i + 1;
      while (end < body.length && body[end] !== ch) {
        if (body[end] === "\\") end++;                     // 转义
        end++;
      }
      // 该字符串是否为顶层 key：后（跳过空白）紧跟 ":" 且当前深度为 0
      if (depth === 0) {
        let j = end + 1;
        while (j < body.length && /\s/.test(body[j])) j++;
        if (body[j] === ":") keys.push(body.slice(i + 1, end));
      }
      i = end + 1;
      continue;
    }
    if (ch === "/" && body[i + 1] === "*") { i = body.indexOf("*/", i) + 2; continue; } // 块注释
    if (ch === "/" && body[i + 1] === "/") { i = body.indexOf("\n", i); continue; }      // 行注释
    if (ch === "{") depth++;
    else if (ch === "}") depth--;
    i++;
  }
  const seen = new Map(), dups = [];
  for (const k of keys) {
    if (seen.has(k)) { if (!dups.includes(k)) dups.push(k); }
    else seen.set(k, true);
  }
  return { missing: false, dups, total: keys.length };
}

/* ---------- 主流程 ---------- */
const raw = fs.readFileSync(DATA_FILE, "utf8");

// R1
for (const t of ["ROCKETS", "OPERATORS"]) {
  const r = extractDuplicateKeys(raw, t);
  if (r.missing) record(`R1-${t}`, false, `未找到 const ${t} 表定义`);
  else record(`R1-${t}`, r.dups.length === 0,
    r.dups.length === 0 ? `${r.total} 个 key 无重复` : `重复 key: ${r.dups.join(", ")}（JS 静默覆盖，后定义会覆盖前者）`);
}

// 沙箱加载 data.js 取运行时对象（加载或导出报错均记 FAIL 后优雅退出）
let sandbox, __export;
try {
  sandbox = {};
  vm.createContext(sandbox);
  vm.runInContext(raw + "\n;__export={EVENTS,ROCKETS,OPERATORS,VENDORS,CATS,SITES,MILESTONES,SOURCES,DATA_ASOF,ST_ICON,ST_TXT};", sandbox, { filename: "data.js" });
  __export = sandbox.__export;
  if (!__export || !Array.isArray(__export.EVENTS)) throw new Error("__export 缺失或 EVENTS 非数组（表定义可能被破坏）");
} catch (e) {
  record("R0-load", false, `data.js 加载失败: ${e.message}`);
  console.log([
    "========== data.js 校验报告 ==========",
    ...results.map(r => `${r.pass ? "[PASS]" : "[FAIL]"} ${r.id}  ${r.detail}`),
    "--------------------------------------",
    `结论: FAIL（${failCount} 项不通过，禁止提交）✘`,
  ].join("\n"));
  process.exit(1);
}
const { EVENTS, ROCKETS, OPERATORS, CATS, MILESTONES, SOURCES, DATA_ASOF } = __export;

// DATA_ASOF 格式
record("R0-asof", /^\d{4}-\d{2}-\d{2}$/.test(DATA_ASOF || ""), `DATA_ASOF="${DATA_ASOF}"`);

// R2 id 唯一
{
  const seen = new Map(), dups = [];
  for (const ev of EVENTS) {
    if (seen.has(ev.id)) { if (!dups.includes(ev.id)) dups.push(ev.id); }
    else seen.set(ev.id, true);
  }
  record("R2", dups.length === 0, dups.length === 0 ? `${EVENTS.length} 条事件 id 全部唯一` : `重复 id: ${dups.join(", ")}`);
}

// R3/R4/R5/R6/R7/R8/R9/R10 逐事件
{
  const errs = { r3: [], r4: [], r5: [], r6: [], r7: [], r8: [], r9: [], r10: [] };
  const rocketKeys = new Set(Object.keys(ROCKETS));
  const opKeys = new Set(Object.keys(OPERATORS));
  const catKeys = new Set(Object.keys(CATS));
  const srcKeys = new Set(Object.keys(SOURCES));
  const dateRe = /^\d{4}-\d{2}-\d{2}$/;

  for (const ev of EVENTS) {
    if (ev.rkKey !== "" && !rocketKeys.has(ev.rkKey)) errs.r3.push(`${ev.id}: rkKey="${ev.rkKey}"`);
    if (ev.opKey !== "" && !opKeys.has(ev.opKey)) errs.r4.push(`${ev.id}: opKey="${ev.opKey}"`);
    if (!catKeys.has(ev.cat)) errs.r5.push(`${ev.id}: cat="${ev.cat}"`);
    if (!["国发", "商发", "国外"].includes(ev.ty)) errs.r6.push(`${ev.id}: ty="${ev.ty}"`);
    if (!["done", "fail", "delay", "plan"].includes(ev.st)) errs.r7.push(`${ev.id}: st="${ev.st}"`);
    if ((ev.st === "done" || ev.st === "fail") && (!ev.src || !srcKeys.has(ev.src)))
      errs.r8.push(`${ev.id}: st=${ev.st} 但 src=${JSON.stringify(ev.src)}`);
    for (const f of ["s", "e"]) {
      if (ev[f] !== "" && !dateRe.test(ev[f])) errs.r9.push(`${ev.id}: ${f}="${ev[f]}"`);
    }
    if (ev.tbd === 1 && typeof ev.month !== "number") errs.r10.push(`${ev.id}: tbd:1 但缺 month`);
  }
  const labels = { r3: "R3 rkKey∈ROCKETS", r4: "R4 opKey∈OPERATORS", r5: "R5 cat∈CATS", r6: "R6 ty 三轨", r7: "R7 st 四态", r8: "R8 done/fail 必须有 src∈SOURCES", r9: "R9 日期格式", r10: "R10 tbd 必须有 month" };
  for (const k of Object.keys(errs)) {
    record(labels[k], errs[k].length === 0, errs[k].length === 0 ? "通过" : errs[k].slice(0, 8).join("；") + (errs[k].length > 8 ? ` 等 ${errs[k].length} 处` : ""));
  }
}

// R11 MILESTONES 日期
{
  const dateRe = /^\d{4}-\d{2}-\d{2}$/;
  const bad = MILESTONES.filter(mi => !dateRe.test(mi.d)).map(mi => `${mi.t}(${mi.d})`);
  record("R11", bad.length === 0, bad.length === 0 ? `${MILESTONES.length} 条大事记日期合法` : `日期非法: ${bad.join(", ")}`);
}

// R12 OPERATORS 在轨基准字段（B5 派生计算）：inOrbitBase 非负数、inOrbitBaseDate 合法日期、二者成对出现
{
  const dateRe = /^\d{4}-\d{2}-\d{2}$/;
  const errs = [];
  let baseCount = 0;
  for (const [k, op] of Object.entries(OPERATORS)) {
    const hasBase = op.inOrbitBase !== undefined;
    const hasDate = op.inOrbitBaseDate !== undefined;
    if (!hasBase && !hasDate) continue; // 不可计数运营方：两字段都不写，合法
    baseCount++;
    if (hasBase && (typeof op.inOrbitBase !== "number" || !Number.isFinite(op.inOrbitBase) || op.inOrbitBase < 0))
      errs.push(`${k}: inOrbitBase=${JSON.stringify(op.inOrbitBase)} 非非负数`);
    if (hasDate && (typeof op.inOrbitBaseDate !== "string" || !dateRe.test(op.inOrbitBaseDate) || isNaN(Date.parse(op.inOrbitBaseDate))))
      errs.push(`${k}: inOrbitBaseDate=${JSON.stringify(op.inOrbitBaseDate)} 非合法日期`);
    if (hasBase !== hasDate)
      errs.push(`${k}: inOrbitBase 与 inOrbitBaseDate 必须成对出现`);
  }
  record("R12", errs.length === 0, errs.length === 0 ? `${baseCount} 家可计数运营方基准字段合法（成对/非负数/日期合法）` : errs.join("；"));
}

// R13 过期计划检查（warning 级，不阻塞）：st=plan 且 e < DATA_ASOF 的事件（窗口已过应回填状态，参照 qf30→delay 先例）
// 定级说明：按设计文档 §3.6 第 4 条，本规则为 warning。它**不计入 failCount、不阻塞提交** ——
// 一条过期占位事件不该让整条数据同步流水线停摆（流水线无权自动回填中国事件，会永久卡死）。
// 清单在报告末尾单独列出，供人工排期清理。
{
  stalePlanList = EVENTS
    .filter(ev => ev.st === "plan" && ev.e && ev.e < DATA_ASOF)
    .map(ev => ({ id: ev.id, name: ev.name, e: ev.e }));
  if (stalePlanList.length === 0) {
    record("R13", true, "无过期计划事件");
  } else {
    // pass 保持 true → 不进 failCount；用 warn 标记让报告打 [WARN] 前缀以示区别
    results.push({
      id: "R13", pass: true, warn: true,
      detail: `过期计划事件 ${stalePlanList.length} 条（不阻塞，详见报告末尾待清理清单）：` +
        stalePlanList.map(s => `${s.id}(窗口末日 ${s.e})`).join("；"),
    });
  }
}

// R14 llId 全表唯一（B1 流水线匹配主键；重复会让两条事件互相抢匹配）
{
  const errs = [];
  const seen = new Map();
  let n = 0;
  for (const ev of EVENTS) {
    if (ev.llId === undefined || ev.llId === null || ev.llId === "") continue;
    if (typeof ev.llId !== "string") { errs.push(`${ev.id}: llId 非字符串（${JSON.stringify(ev.llId)}）`); continue; }
    n++;
    if (seen.has(ev.llId)) errs.push(`llId="${ev.llId}" 被 ${seen.get(ev.llId)} 与 ${ev.id} 同时占用`);
    else seen.set(ev.llId, ev.id);
  }
  record("R14", errs.length === 0,
    errs.length === 0 ? `${n} 条事件带 llId，无重复` : errs.slice(0, 8).join("；"));
}

// R15 lock 数组元素 ⊆ {s,e,t,st,satCount,src}
{
  const lockable = new Set(GLOSSARY.LOCKABLE_FIELDS);
  const errs = [];
  let n = 0;
  for (const ev of EVENTS) {
    if (ev.lock === undefined) continue;
    n++;
    if (!Array.isArray(ev.lock)) { errs.push(`${ev.id}: lock 非数组（${JSON.stringify(ev.lock)}）`); continue; }
    for (const f of ev.lock) {
      if (!lockable.has(f)) {
        errs.push(`${ev.id}: lock 含非法字段 "${f}"（合法值 {${GLOSSARY.LOCKABLE_FIELDS.join(",")}}；锁 name/op/ty 等保护字段无意义，本就不可覆盖）`);
      }
    }
  }
  record("R15", errs.length === 0,
    errs.length === 0 ? `${n} 条事件声明 lock，字段均在合法集合内` : errs.slice(0, 8).join("；"));
}

// src 分布统计（信息项，不计 PASS/FAIL）
function makeReport() {
  const dist = {};
  for (const ev of EVENTS) dist[ev.src || "(空)"] = (dist[ev.src || "(空)"] || 0) + 1;
  const distStr = Object.entries(dist).sort((a, b) => b[1] - a[1]).map(([k, n]) => `${k}=${n}`).join("  ");
  const lines = [];
  lines.push("========== data.js 校验报告 ==========");
  for (const r of results) {
    const tag = r.pass ? "[PASS]" : (r.warn ? "[WARN]" : "[FAIL]");
    lines.push(`${tag} ${r.id}  ${r.detail}`);
  }
  lines.push("--------------------------------------");
  lines.push(`事件总数: ${EVENTS.length}  |  src 分布: ${distStr}`);
  // R13 待清理清单：warning 级，不阻塞，但必须在报告末尾显眼列出
  if (stalePlanList.length > 0) {
    lines.push("");
    lines.push(`【待清理清单 · 不阻塞】过期计划事件 ${stalePlanList.length} 条（R13 / warning 级）：`);
    for (const s of stalePlanList) {
      lines.push(`  · ${s.id} · ${s.name} · 窗口末日 ${s.e} < DATA_ASOF ${DATA_ASOF} —— 应人工回填为 done/fail/delay`);
    }
  }
  lines.push(failCount === 0 ? "结论: ALL PASS ✔" : `结论: FAIL（${failCount} 项不通过，禁止提交）✘`);
  return lines.join("\n");
}

const report = makeReport();
console.log(report);
fs.writeFileSync(path.join(__dirname, "..", "validate-report.txt"), report + "\n", "utf8");
process.exit(failCount === 0 ? 0 : 1);
