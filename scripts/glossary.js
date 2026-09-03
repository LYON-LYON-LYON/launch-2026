#!/usr/bin/env node
/**
 * glossary.js — Launch Library 2.2 → 本站 data.js 的字段对照词典
 *
 * 定位：纯 Node CommonJS 模块，**只被 CI 与本地维护脚本 require**，
 *       绝不被 index.html 的 <script> 标签加载 —— 不违反"页面纯静态 / 零构建"硬约束。
 *
 * 职责：把 LL 2.2 的英文原始字段（火箭型号、发射场、服务商、状态、卫星数）
 *       映射为 data.js 的口径（rkKey / site / opKey / cat / ty / st / satCount）。
 *
 * 零第三方依赖，node 18+ 可直接运行。
 */
"use strict";

/* ========================================================================== *
 * 一、字段级来源保护清单（merge-data.js 与 validate-data.js 共用，单一事实源）
 * ========================================================================== */

/** 全局保护字段：任何情况流水线不得覆盖（人工独占的叙事/归口字段） */
const PROTECTED_FIELDS = [
  "name", "pl", "op", "opKey", "cat", "ty", "hl", "note", "tbd", "month", "lock", "llId",
];

/** 流水线可更新字段：仅当 API 侧确有变化时才写 */
const UPDATABLE_FIELDS = ["s", "e", "t", "st", "satCount", "src"];

/** lock 合法值：只允许锁"可更新字段"；锁全局保护字段无意义（本就不可覆盖） */
const LOCKABLE_FIELDS = UPDATABLE_FIELDS.slice();

/* ========================================================================== *
 * 二、火箭型号对照（LL rocket.configuration.name → data.js ROCKETS 的 key）
 * ========================================================================== */

/**
 * 键为 LL 的 configuration.name 归一化形式（小写、空白折叠）。
 * 值对应 data.js ROCKETS 表的 41 个 key；留空串表示"未收录"，调用方应进待审。
 */
const ROCKET_KEY = {
  /* ---- 国际火箭（13 型） ---- */
  "falcon 9": "falcon9",
  "falcon 9 block 5": "falcon9",
  "falcon heavy": "falconH",
  "starship": "starship",
  "starship/super heavy": "starship",
  "super heavy": "starship",
  "atlas v": "atlasV",
  "atlas v 401": "atlasV",
  "atlas v 501": "atlasV",
  "atlas v 551": "atlasV",
  "vulcan": "vulcan",
  "vulcan centaur": "vulcan",
  "vulcan vc2l": "vulcan",
  "ariane 6": "ariane6",
  "ariane 62": "ariane6",
  "ariane 64": "ariane6",
  "soyuz": "soyuz",
  "soyuz-2": "soyuz",
  "soyuz-2.1a": "soyuz",
  "soyuz-2.1b": "soyuz",
  "soyuz-2.1v": "soyuz",
  "soyuz-st-a": "soyuz",
  "soyuz-st-b": "soyuz",
  "proton": "proton",
  "proton-m": "proton",
  "proton m": "proton",
  "h3": "h3",
  "h-3": "h3",
  "h-ii": "h3",
  "gs lv mark iii": "gslv",
  "gslv mark iii": "gslv",
  "gslv mk iii": "gslv",
  "lvm 3": "gslv",
  "lvm3": "gslv",
  "neutron": "neutron",
  "electron": "electron",
  "rs1": "rs1",

  /* ---- 中国火箭（28 型；LL 英文名 → ROCKETS key） ---- */
  "long march 2c": "cz2c",
  "long march 2d": "cz2d",
  "long march 2f": "cz2f",
  "long march 2f/g": "cz2f",
  "long march 3b": "cz3b",
  "long march 3b/e": "cz3b",
  "long march 4b": "cz4b",
  "long march 4c": "cz4c",
  "long march 5": "cz5",
  "long march 5b": "cz5",
  "long march 6": "cz6",
  "long march 6a": "cz6a",
  "long march 6c": "cz6c",
  "long march 7": "cz7",
  "long march 7a": "cz7a",
  "long march 8": "cz8",
  "long march 8a": "cz8a",
  "long march 10": "cz10b",
  "long march 12": "cz12",
  "long march 12a": "cz12a",
  "long march 12b": "cz12b",
  "kuaizhou 11": "kz11",
  "kuaizhou-11": "kz11",
  "smart dragon 3": "jl3",
  "kinetica 1": "lz1",
  "kinetica 2": "lz2",
  "zhuque-2": "zq2",
  "zhuque 2": "zq2",
  "zhuque-2e": "zq2",
  "zhuque-3": "zq3",
  "ceres-1": "gsc1",
  "ceres 1": "gsc1",
  "ceres-2": "gsc2",
  "gravity-1": "yyl1",
  "gravity 1": "yyl1",
  "pallas-1": "zs1",
};

/* ========================================================================== *
 * 三、发射场对照（LL pad.location.name / pad.name → 中文 site）
 * ========================================================================== */

const LOCATION_CN = {
  "cape canaveral sfs": "佛州卡角",
  "cape canaveral air force station": "佛州卡角",
  "cape canaveral space force station": "佛州卡角",
  "kennedy space center": "佛州肯尼迪",
  "vandenberg sfb": "加州范登堡",
  "vandenberg space force base": "加州范登堡",
  "vandenberg air force base": "加州范登堡",
  "starbase": "德州博卡奇卡·Starbase",
  "boca chica": "德州博卡奇卡·Starbase",
  "wallops flight facility": "弗吉尼亚·瓦洛普斯",
  "baikonur cosmodrome": "哈萨克斯坦·拜科努尔",
  "guiana space centre": "法属圭亚那·库鲁",
  "kourou": "法属圭亚那·库鲁",
  "plesetsk cosmodrome": "俄罗斯·普列谢茨克",
  "vostochny cosmodrome": "俄罗斯·东方航天港",
  "satish dhawan space centre": "印度·萨迪什·达万",
  "tanegashima space center": "日本·种子岛",
  "uchinoura space center": "日本·内之浦",
  "rocket lab launch complex 1": "新西兰·玛西亚半岛",
  "rocket lab launch complex 2": "弗吉尼亚·瓦洛普斯",
  /* 中国发射场 */
  "xichang satellite launch center": "西昌卫星发射中心",
  "taiyuan satellite launch center": "太原卫星发射中心",
  "jiuquan satellite launch center": "酒泉卫星发射中心",
  "wenchang space launch site": "文昌航天发射场",
  "wenchang commercial space launch site": "海南商业航天发射场",
  "dongfeng commercial space innovation test zone": "东风商业航天创新试验区",
  "yellow sea": "海上发射",
  "east china sea": "海上发射",
  "south china sea": "海上发射",
};

/**
 * 中国发射场词条（LOCATION_CN 的子集）。
 * 必须显式列举：LOCATION_CN 里国际发射场同样有中文译名（如 "cape canaveral sfs" → "佛州卡角"），
 * 若写成"命中任意中文条目即判中国"，会把所有国际发射误判成中国、全部涌入待审清单。
 */
const CHINA_SITE_KEYS = [
  "xichang satellite launch center",
  "taiyuan satellite launch center",
  "jiuquan satellite launch center",
  "wenchang space launch site",
  "wenchang commercial space launch site",
  "dongfeng commercial space innovation test zone",
  "yellow sea",
  "east china sea",
  "south china sea",
];

/** 已知工位的中译（优先于正则兜底） */
const PAD_CN = {
  "space launch complex 40": "40号工位",
  "space launch complex 41": "41号工位",
  "space launch complex 4e": "4E工位",
  "space launch complex 3e": "3E工位",
  "space launch complex 6": "6号工位",
  "launch complex 39a": "39A工位",
  "launch complex 39b": "39B工位",
  "launch complex 1a": "1A工位",
  "launch complex 1b": "1B工位",
  "launch complex 2": "2号工位",
};

/* ========================================================================== *
 * 四、发射服务商对照（lsp → 国别；中国 lsp 再分国发/商发）
 * ========================================================================== */

/**
 * 顺序敏感：采用"关键字命中即返回"，具体条目必须排在宽泛条目之前
 * （如 "cas space" 必须早于 "china aerospace"，否则被国家队规则吞掉）。
 * commercial=true 的条目进入"民营白名单"，ty 派生为 商发；其余中国 lsp 为 国发。
 */
const LSP_RULES = [
  /* 国际 */
  { kw: "spacex", country: "US", cn: "SpaceX" },
  { kw: "united launch alliance", country: "US", cn: "ULA(联合发射联盟)" },
  { kw: "ula", country: "US", cn: "ULA(联合发射联盟)" },
  { kw: "arianespace", country: "EU", cn: "欧洲航天局·ArianeSpace" },
  { kw: "ariane", country: "EU", cn: "欧洲航天局·ArianeSpace" },
  { kw: "roskosmos", country: "RU", cn: "俄罗斯航天局" },
  { kw: "russian federal space", country: "RU", cn: "俄罗斯航天局" },
  { kw: "jaxa", country: "JP", cn: "日本JAXA" },
  { kw: "japan aerospace", country: "JP", cn: "日本JAXA" },
  { kw: "mitsubishi heavy industries", country: "JP", cn: "日本三菱重工" },
  { kw: "isro", country: "IN", cn: "印度ISRO" },
  { kw: "indian space research", country: "IN", cn: "印度ISRO" },
  { kw: "rocket lab", country: "US", cn: "Rocket Lab" },
  { kw: "abl space", country: "US", cn: "ABL Space" },
  { kw: "blue origin", country: "US", cn: "Blue Origin" },
  { kw: "northrop", country: "US", cn: "诺斯罗普·格鲁曼" },
  { kw: "firefly", country: "US", cn: "Firefly Aerospace" },
  { kw: "relativity", country: "US", cn: "Relativity Space" },
  { kw: "stoke space", country: "US", cn: "Stoke Space" },
  /* 中国 · 民营白名单（设计文档 §1.1.4：蓝箭/中科宇航/星河动力/东方空间/快舟 → 商发） */
  { kw: "landspace", country: "CN", cn: "蓝箭航天", commercial: true },
  { kw: "cas space", country: "CN", cn: "中科宇航", commercial: true },
  { kw: "galactic energy", country: "CN", cn: "星河动力", commercial: true },
  { kw: "orienspace", country: "CN", cn: "东方空间", commercial: true },
  { kw: "expace", country: "CN", cn: "航天科工火箭（快舟）", commercial: true },
  { kw: "kuaizhou", country: "CN", cn: "航天科工火箭（快舟）", commercial: true },
  { kw: "space pioneer", country: "CN", cn: "天兵科技", commercial: true },
  { kw: "deep blue aerospace", country: "CN", cn: "深蓝航天", commercial: true },
  { kw: "interstellar glory", country: "CN", cn: "星际荣耀", commercial: true },
  /* 中国 · 国家队（其余 → 国发） */
  { kw: "china aerospace", country: "CN", cn: "中国航天（CASC/CASIC）" },
  { kw: "china rocket", country: "CN", cn: "中国长征火箭" },
  { kw: "casc", country: "CN", cn: "中国航天科技集团" },
  { kw: "casic", country: "CN", cn: "中国航天科工集团" },
  { kw: "chinarocket", country: "CN", cn: "中国长征火箭" },
];

/* ========================================================================== *
 * 五、发射状态对照（LL status.abbrev → data.js 的 st）
 * ========================================================================== */

/**
 * null 表示"跳过待审"（不入库、不改状态），调用方必须原样跳过。
 * In Flight 不抢跑标 done —— 火箭在飞不等于入轨成功。
 */
const STATUS_MAP = {
  "success": "done",
  "failure": "fail",
  "partial failure": "fail",
  "partial-failure": "fail",
  "hold": "delay",
  "delayed": "delay",
  "scheduled": "plan",
  "go": "plan",
  "tbc": "plan",
  "tbd": "plan",
  "in flight": null,
};

/* ========================================================================== *
 * 六、工具函数
 * ========================================================================== */

/** 归一化：去首尾空格、转小写、折叠空白。用于词典查表。 */
function norm(value) {
  return String(value === null || value === undefined ? "" : value)
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

/** 宽松归一化：在 norm 基础上再去掉 . - _ / 等标点，用于兜底查表 */
function normLoose(value) {
  return norm(value).replace(/[.\-_/()]/g, "").replace(/\s+/g, "");
}

/* ---- 预建索引（模块加载时一次性完成，避免每次查表重复遍历） ---- */
const ROCKET_KEY_NORM = new Map();
for (const [k, v] of Object.entries(ROCKET_KEY)) ROCKET_KEY_NORM.set(norm(k), v);

const ROCKET_KEY_LOOSE = new Map();
for (const [k, v] of Object.entries(ROCKET_KEY)) {
  const lk = normLoose(k);
  if (!ROCKET_KEY_LOOSE.has(lk)) ROCKET_KEY_LOOSE.set(lk, v);
}

/**
 * LL 火箭型号名 → data.js rkKey。
 * 查不到返回 ""（调用方应进待审，不猜测归口）。
 * @param {string} configName LL 的 rocket.configuration.name
 * @returns {string} rkKey 或 ""
 */
function mapRocketKey(configName) {
  const key = norm(configName);
  if (!key) return "";
  if (ROCKET_KEY_NORM.has(key)) return ROCKET_KEY_NORM.get(key);
  const loose = normLoose(configName);
  if (ROCKET_KEY_LOOSE.has(loose)) return ROCKET_KEY_LOOSE.get(loose);
  return "";
}

/**
 * LL 发射场 → data.js site 中文串。
 * 先精确查表，再按最长关键字包含匹配（LL 的 location.name 常带后缀，如 "Cape Canaveral SFS, FL, USA"）。
 * @param {string} locationName LL 的 pad.location.name
 * @param {string} padName LL 的 pad.name
 * @returns {string} 形如 "佛州卡角·40号工位"
 */
function mapSite(locationName, padName) {
  const raw = norm(locationName);
  let loc = "";
  if (raw) {
    if (LOCATION_CN[raw]) {
      loc = LOCATION_CN[raw];
    } else {
      // 最长包含匹配：候选键按长度降序，避免 "cape canaveral" 抢在 "cape canaveral sfs" 前命中
      const candidates = Object.keys(LOCATION_CN).sort((a, b) => b.length - a.length);
      for (const k of candidates) {
        if (raw.includes(k)) { loc = LOCATION_CN[k]; break; }
      }
    }
  }
  if (!loc) loc = String(locationName || "").trim() || "未知发射场";
  const pad = mapPad(padName);
  return pad ? `${loc}·${pad}` : loc;
}

/**
 * LL 工位名 → 中文工位短名。查不到返回 ""（site 只保留地点）。
 * @param {string} padName LL 的 pad.name
 * @returns {string}
 */
function mapPad(padName) {
  const key = norm(padName);
  if (!key) return "";
  if (PAD_CN[key]) return PAD_CN[key];

  // 兜底：抓取 "SLC-40" / "LC-39A" / "Space Launch Complex 4E" 中的编号段
  const m = key.match(/(?:space launch complex|launch complex|slc|lc)[-\s]*([0-9]{1,3}[a-z]?)\b/);
  if (m) {
    const tok = m[1].toUpperCase();
    // 纯数字 → "40号工位"；带字母 → "4E工位"（对齐存量数据两种写法）
    return /[A-Z]$/.test(tok) ? `${tok}工位` : `${tok}号工位`;
  }
  return "";
}

/**
 * LL 发射服务商 → 国别信息。查不到返回 country:""。
 * @param {string} lspName LL 的 launch_service_provider.name
 * @returns {{country:string, cn:string, commercial:boolean}}
 */
function mapLsp(lspName) {
  const key = norm(lspName);
  if (!key) return { country: "", cn: "", commercial: false };
  for (const rule of LSP_RULES) {
    if (key.includes(rule.kw)) {
      return { country: rule.country, cn: rule.cn, commercial: !!rule.commercial };
    }
  }
  return { country: "", cn: String(lspName || "").trim(), commercial: false };
}

/**
 * LL status → data.js st。
 * @param {string} abbrev LL 的 status.abbrev
 * @param {string} [name] LL 的 status.name（abbrev 缺失时的兜底）
 * @returns {string|null} st 四态之一；null = 跳过待审
 */
function mapStatus(abbrev, name) {
  const key = norm(abbrev);
  if (Object.prototype.hasOwnProperty.call(STATUS_MAP, key)) return STATUS_MAP[key];
  const nameKey = norm(name);
  if (Object.prototype.hasOwnProperty.call(STATUS_MAP, nameKey)) return STATUS_MAP[nameKey];
  // 未收录状态一律跳过（保守：宁可不更新，不可标错状态）
  return null;
}

/**
 * 运营方 / 分类归口。
 *
 * 口径说明（重要）：设计文档 §1.1.4 原写"SpaceX 星链任务→spacex、Kuiper→amazon"，
 * 但 T2 已将星链/Kuiper 迁到 starlink/kuiper（与 inOrbitNow() 派生计算绑定，见 data.js 表头注释）。
 * 此处以 **T2 落地口径为准**：starlink / kuiper / oneweb，否则新增事件会与存量事件归口分裂，
 * 导致在轨数派生统计漏算。cat 仍取 CATS 表已有的 spacex / amazon / oneweb / verify / other。
 *
 * @param {string} lspName LL 的 launch_service_provider.name
 * @param {string} launchName LL 的 launch.name
 * @param {string} missionName LL 的 mission.name
 * @param {string} rkKey 已映射的火箭 key（用于识别 Starship 试飞）
 * @param {string} rkName 火箭显示名（用于中文 op 文案）
 * @returns {{op:string, opKey:string, cat:string}}
 */
function mapOperator(lspName, launchName, missionName, rkKey, rkName) {
  const text = `${norm(launchName)} ${norm(missionName)} ${norm(lspName)}`;
  const lsp = mapLsp(lspName);

  // Starship 试飞：归口 verify（与存量 ss-* 事件一致：op="SpaceX"、opKey="spacex"、cat="verify"）
  if (rkKey === "starship" || norm(rkKey) === "starship" || /starship|super heavy/.test(norm(rkName || ""))) {
    return { op: "SpaceX", opKey: "spacex", cat: "verify" };
  }
  if (/starlink/.test(text)) return { op: "SpaceX·星链", opKey: "starlink", cat: "spacex" };
  if (/kuiper|amazon/.test(text)) return { op: "亚马逊·Kuiper", opKey: "kuiper", cat: "amazon" };
  if (/oneweb|eutelsat/.test(text)) return { op: "OneWeb·Eutelsat", opKey: "oneweb", cat: "oneweb" };
  return { op: "国际商业任务", opKey: "intl", cat: "other" };
}

/**
 * 国别 → ty。中国 lsp 再按民营白名单分 国发/商发；非中国一律 国外。
 * @param {string} lspName LL 的 launch_service_provider.name
 * @returns {string} 国发 / 商发 / 国外
 */
function mapType(lspName) {
  const lsp = mapLsp(lspName);
  if (lsp.country !== "CN") return "国外";
  return lsp.commercial ? "商发" : "国发";
}

/**
 * 是否为中国任务。
 * 除 lsp 规则外，再用发射场国别码与中国发射场名兜底 —— 判定为中国只会进人工待审清单，
 * 属安全方向（"宁可漏抓不可污染"），因此兜底宁松不紧。
 * @param {Object} launch LL 单条发射对象
 * @returns {boolean}
 */
function isChina(launch) {
  const lspName = (launch.launch_service_provider && launch.launch_service_provider.name) || "";
  if (mapLsp(lspName).country === "CN") return true;

  const pad = launch.pad || {};
  const loc = pad.location || {};
  const cc = String(loc.country_code || "").toUpperCase();
  if (cc.includes("CHN") || cc.includes("CHI")) return true;

  const locName = norm(loc.name || "");
  for (const k of CHINA_SITE_KEYS) {
    if (locName.includes(k)) return true;
  }
  return false;
}

/**
 * 从发射名 / 任务描述里正则抓卫星数。抓不到返回 0（调用方对 done 且 0 星的事件进待审）。
 * @param {string} launchName LL 的 launch.name
 * @param {string} missionDesc LL 的 mission.description
 * @returns {number}
 */
function parseSatCount(launchName, missionDesc) {
  const text = `${launchName || ""} ${missionDesc || ""}`;
  // 注意：× 是 U+00D7 非词字符，前面是空格时 \b 不成立，故乘号式不能加前导 \b；
  // ASCII 的 x 必须加前导 \b，否则 "Max 3" 之类的词内 x 会被误当成乘号。
  const patterns = [
    /一箭\s*(\d{1,3})\s*星/,              // 一箭22星
    /×\s*(\d{1,3})\b/,                    // ×22（U+00D7）
    /\bx\s*(\d{1,3})\b/i,                 // x 22（ASCII 乘号）
    /\b(\d{1,3})\s*satellites?\b/i,       // 22 satellites
    /\b(\d{1,3})\s*spacecraft\b/i,        // 36 spacecraft
    /\b(\d{1,3})\s*stars?\b/i,            // 22 stars
  ];
  for (const re of patterns) {
    const m = text.match(re);
    if (m) {
      const n = parseInt(m[1], 10);
      if (Number.isFinite(n) && n > 0) return n;
    }
  }
  return 0;
}

/* ---- 北京时间换算（LL 的 net 为 UTC ISO 串） ---- */
const BJ_OFFSET_MS = 8 * 60 * 60 * 1000;

/**
 * UTC ISO 串 → 北京时间日期部分。
 * @param {string} iso ISO 8601（如 "2026-08-25T12:34:00Z"）
 * @returns {string} "YYYY-MM-DD"；非法返回 ""
 */
function bjDate(iso) {
  const t = Date.parse(iso);
  if (!Number.isFinite(t)) return "";
  return new Date(t + BJ_OFFSET_MS).toISOString().slice(0, 10);
}

/**
 * UTC ISO 串 → 北京时间时刻。
 * @param {string} iso ISO 8601
 * @returns {string} "HH:MM"；非法返回 "—"
 */
function bjTime(iso) {
  const t = Date.parse(iso);
  if (!Number.isFinite(t)) return "—";
  return new Date(t + BJ_OFFSET_MS).toISOString().slice(11, 16);
}

/**
 * 今天的北京时间日期（用于 DATA_ASOF 推进）。
 * @param {Date} [now] 注入的当前时刻，便于测试
 * @returns {string} "YYYY-MM-DD"
 */
function bjToday(now) {
  return new Date((now || new Date()).getTime() + BJ_OFFSET_MS).toISOString().slice(0, 10);
}

module.exports = {
  PROTECTED_FIELDS,
  UPDATABLE_FIELDS,
  LOCKABLE_FIELDS,
  ROCKET_KEY,
  LOCATION_CN,
  CHINA_SITE_KEYS,
  PAD_CN,
  LSP_RULES,
  STATUS_MAP,
  norm,
  normLoose,
  mapRocketKey,
  mapSite,
  mapPad,
  mapLsp,
  mapStatus,
  mapOperator,
  mapType,
  isChina,
  parseSatCount,
  bjDate,
  bjTime,
  bjToday,
};
