# 口径外国际发射待办 · 2026-09

> 整理日期：2026-09-10
> 整理人：software-engineer-2
> 数据源：Launch Library 2.2（`scripts/fetch-launches.js --force --backfill`，`mode=list` 主查 + `mode=detailed` 补字段）
>
> **为什么这些不入 `data.js`**
> 本站 `data.js` 的国际板块只收三个星座口径：`spacex`（星链）/ `amazon`（Kuiper）/ `oneweb`。
> 下列 4 条均**不归属**这三个口径（Rocket Lab 商业遥感、ISRO 地球观测、Isar Aerospace 首飞验证、SpaceX 军用保密载荷），
> 硬塞进现有分类会污染「星座组网进度」的统计口径，故**暂存本文档**，待主理人决定是否扩充分类后入表。
>
> **字段可信度说明**：标「待核实」的字段表示 `mode=detailed` 也未返回该值，**未做任何推算或补全**。

---

## 1. Electron | Owl Around The World (StriX Launch 11)

| 字段 | 值 |
|---|---|
| net (UTC) | `2026-09-02T12:01:00Z` |
| 北京时间 | 2026-09-02 20:01 |
| 状态 | `Success` / Launch Successful |
| 火箭 | Electron |
| 服务商 | Rocket Lab |
| 载荷 | Owl Around The World (StriX Launch 11) |
| 任务类型 | Earth Science（对地观测） |
| 发射工位 | Rocket Lab Launch Complex 1B |
| 发射场 | Rocket Lab Launch Complex 1, Mahia Peninsula, New Zealand（新西兰玛希亚） |
| 入轨卫星数 | **待核实**（description 未给出星数，且 StriX 为单星雷达卫星，疑为 1 颗，但**不臆断**） |
| 轨道 | 待核实 |
| slug | `electron-owl-around-the-world-strix-launch-11` |
| LL uuid | `9f5a4cb6-63f9-47e1-9512-b468bae2a8e6` |
| last_updated | `2026-09-02T15:34:11Z` |

不入表原因：Synspective 公司 StriX 雷达卫星星座，非本站三大国际口径。
若要入表，需新增分类（如 `electron` / `other-intl`）并补 `cat` 颜色。

---

## 2. GSLV Mk II | GISAT-1A (EOS-05)

| 字段 | 值 |
|---|---|
| net (UTC) | `2026-09-03T21:25:00Z` |
| 北京时间 | 2026-09-04 05:25 |
| 状态 | `Success` / Launch Successful |
| 火箭 | GSLV Mk II |
| 服务商 | Indian Space Research Organization（ISRO） |
| 载荷 | GISAT-1A (EOS-05) |
| 任务类型 | Earth Science（对地观测） |
| 发射工位 | Satish Dhawan Space Centre Second Launch Pad |
| 发射场 | Satish Dhawan Space Centre, India（印度萨迪什·达万） |
| 入轨卫星数 | **待核实**（单星任务，疑为 1 颗，但 description 未明确，**不臆断**） |
| 轨道 | 待核实（GISAT 系列通常为 GEO，但本条未返回 orbit） |
| slug | `gslv-mk-ii-gisat-1a-eos-05` |
| LL uuid | `17d0ec68-f466-4916-9dc5-16123eda6484` |
| last_updated | `2026-09-03T22:09:26Z` |

不入表原因：ISRO 地球观测卫星，非本站三大国际口径。

---

## 3. Spectrum | Onward and Upward

| 字段 | 值 |
|---|---|
| net (UTC) | `2026-09-05T20:12:00Z` |
| 北京时间 | 2026-09-06 04:12 |
| 状态 | `Success` / Launch Successful |
| 火箭 | Spectrum |
| 服务商 | Isar Aerospace（德国） |
| 载荷 | Onward and Upward |
| 任务类型 | Test Flight（试飞验证） |
| 发射工位 | Orbital Launch Pad |
| 发射场 | Andøya Spaceport（挪威安德岛航天港） |
| 入轨卫星数 | **待核实**（团队外部查证称 5 颗立方星入 LEO，但 LL `mode=detailed` 的 mission description 未给出星数，**本表不填推测值**） |
| 轨道 | 待核实（外部查证称 LEO） |
| slug | `spectrum-onward-and-upward` |
| LL uuid | `1b23eb18-e06e-4058-9b42-e95ca0980511` |
| last_updated | `2026-09-05T22:56:40Z` |

不入表原因：Isar Aerospace 首飞验证任务，属「火箭验证」性质但为国外商业航天，
本站 `verify` 分类目前只用于中国民营火箭首飞与 SpaceX 星舰试飞，**口径未覆盖欧洲商业首飞**。

备注：`scripts/glossary.js` 的 `ROCKET_KEY` 中**无** `spectrum` 映射，即便修好 `mode` 参数也会走「未收录→转人工待审」的安全降级路径，属预期行为。

---

## 4. Falcon 9 Block 5 | USSF-153

| 字段 | 值 |
|---|---|
| net (UTC) | `2026-09-10T15:42:00Z` |
| 北京时间 | 2026-09-10 23:42 |
| 状态 | **`Success` / Launch Successful**（已发射成功；原记 `Go` 为发射前状态，2026-09-14 复核已变更） |
| 火箭 | Falcon 9（`full_name` = Falcon 9 Block 5） |
| 服务商 | SpaceX |
| 载荷 | USSF-153 |
| 任务类型 | 待核实（description 摘要：*USSF-153 is a classified mission for the United States Space Force…*，美国太空军保密载荷） |
| 发射工位 | Space Launch Complex 4E |
| 发射场 | Vandenberg SFB, CA, USA（加州范登堡） |
| 轨道 | Low Earth Orbit |
| net_precision | Second |
| slug | `falcon-9-block-5-ussf-153` |

不入表原因：虽为 SpaceX/Falcon 9，但载荷是**美国太空军军用任务**，不属于「星链星座组网」口径，
若计入 `spacex` 分类会虚增星链组网统计，故暂存。

补充（2026-09-14 复核）：一级 B1081 第 27 飞；为 SpaceX 2026 年第 5 次国安任务；载荷保密，外部分析疑为 Starshield 批次（**未经官方确认，不作定论**）。

---

## 5. Electron | "Happily Ever Faster"（BlackSky Gen-3 5）

| 字段 | 值 |
|---|---|
| net (UTC) | `2026-09-11T03:28:00Z` |
| 北京时间 | 2026-09-11 11:28 |
| 状态 | `Success` / Launch Successful |
| 火箭 | Electron |
| 服务商 | Rocket Lab |
| 载荷 | BlackSky Gen-3 卫星（第 5 颗 Gen-3） |
| 任务类型 | Earth Science / 商业遥感 |
| 发射工位 | Rocket Lab Launch Complex 1A |
| 发射场 | Rocket Lab Launch Complex 1, Mahia Peninsula, New Zealand（新西兰玛希亚） |
| 入轨卫星数 | **1**（外部查证口径；LL description 未明确给出星数，若以 LL 为准应记「待核实」） |
| 轨道 | Low Earth Orbit |
| slug | `electron-happily-ever-faster-blacksky-gen-3-5` |

不入表原因：BlackSky 商业遥感星座，非本站三大国际口径（starlink / kuiper / oneweb）。

---

## 6. Falcon 9 Block 5 | O3b mPower 11-13（O3b mPOWER F13）

| 字段 | 值 |
|---|---|
| net (UTC) | `2026-09-13T18:49:00Z` |
| 北京时间 | 2026-09-14 02:49 |
| 状态 | `Success` / Launch Successful |
| 火箭 | Falcon 9（`full_name` = Falcon 9 Block 5） |
| 服务商 | SpaceX（客户 SES） |
| 载荷 | O3b mPOWER 11 / 12 / 13 |
| 任务类型 | Communications（中轨宽带通信星座） |
| 发射工位 | Space Launch Complex 40 |
| 发射场 | Cape Canaveral SFS, FL, USA（佛州卡角） |
| 入轨卫星数 | **3** |
| 轨道 | Medium Earth Orbit |
| slug | `falcon-9-block-5-o3b-mpower-11-13` |

不入表原因：SES 的 O3b mPOWER 属中轨通信星座，非本站三大国际口径。

里程碑（外部查证口径，供参考）：本次为**猎鹰系列第 700 次发射**，并标志 O3b mPOWER 星座 13 星组网收官。

---

## 7. 2026-09-10 ~ 09-14 区间说明（本轮复核）

- **9/11、9/12、9/13 全球零轨道发射**；9/14 仅 O3b mPower（北京 02:49）一发。
- **中国 9/11–9/14 零发射**。
- 上述 3 条（USSF-153 / Electron BlackSky / O3b mPower）即为该区间全部已核实的口径外国际发射。

---

## 附：本次已入表的两条（对照，便于复核）

这两条已写入 `data.js`，此处仅留档对照：

| id | 批次 | net (UTC) | 北京 | 星数 | 状态 |
|---|---|---|---|---|---|
| `sx-m9-1` | Starlink Group 15-23 | 2026-09-02T08:42:12Z | 09-02 16:42 | 27 | done |
| `sx-m9-1b` | Starlink Group 15-24 | 2026-09-06T14:26:54Z | 09-06 22:26 | 27 | done |

星数取自 `mission.description`：`"A batch of 27 satellites for the Starlink mega-constellation…"`，
并经项目自带 `scripts/glossary.js` 的 `parseSatCount()` 复核 = **27**（非人工推算）。
