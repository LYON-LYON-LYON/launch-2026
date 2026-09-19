# 中国发射事件 · 人工待审清单

> 本文件由 `scripts/merge-data.js` 自动生成：**Launch Library 发现的中国发射事件一律不自动入库**，
> 只在此列出建议字段值，需人工核实后手工写入 `data.js` 的 EVENTS。
> 原因：LL 对中国任务覆盖不全且字段质量不稳定，自动合并有误污染风险。
> 核实完成后请删除对应条目，保持清单为空即表示无积压。
## 2026-09-02 自动同步（2 条）

| LL slug | 建议名称 | 日期 | 火箭 | 发射场 | 建议 ty | 建议 opKey | 星数 | LL 状态 |
|---|---|---|---|---|---|---|---|---|
| `long-march-6a-g60-polar-05` | G60 Polar-05 | 2026-09-05 | 长征六号改/甲（cz6a） | 海南商业航天发射场 | 国发 | intl | 18 | Success |
| `long-march-5b-guowang-low-20` | Guowang Low-20 | 2026-10-03 | 长征五号（cz5） | 文昌航天发射场·101号工位 | 国发 | intl | 0 | TBD |

### 逐条建议字段值

- **G60 Polar-05**（`long-march-6a-g60-polar-05`）
  - 服务商：China Aerospace Science and Technology Corporation → 建议 ty=`国发`
  - 建议 id：`m-m9-?`（需人工定序号）
  - 日期 s/e：`2026-09-05` / `2026-09-05`，时刻：`13:00`
  - 火箭 rkKey：`cz6a`（长征六号改/甲）
  - 载荷 pl：`G60 Polar-05 ×18`
  - 卫星数 satCount：`18`（API 正则抓取，务必核实）
  - 运营方 opKey：`intl`，分类 cat：`other`
  - LL 状态 Success → 建议 st=`done`

- **Guowang Low-20**（`long-march-5b-guowang-low-20`）
  - 服务商：China Aerospace Science and Technology Corporation → 建议 ty=`国发`
  - 建议 id：`m-m10-?`（需人工定序号）
  - 日期 s/e：`2026-10-03` / `2026-10-03`，时刻：`—`
  - 火箭 rkKey：`cz5`（长征五号）
  - 载荷 pl：`Guowang Low-20`
  - 卫星数 satCount：`0`（API 正则抓取，务必核实）
  - 运营方 opKey：`intl`，分类 cat：`other`
  - LL 状态 TBD → 建议 st=`plan`
## 2026-09-20 自动同步（8 条）

| LL slug | 建议名称 | 日期 | 火箭 | 发射场 | 建议 ty | 建议 opKey | 星数 | LL 状态 |
|---|---|---|---|---|---|---|---|---|
| `long-march-2d-piesat-2-13-16` | PIESAT-2 13-16 | 2026-09-19 | 长征二号丁（cz2d） | 太原卫星发射中心·9号工位 | 国发 | intl | 0 | Success |
| `kuaizhou-11-spacety-51-52` | SpaceTY-51 & 52 | 2026-09-17 | 快舟十一号（kz11） | 酒泉卫星发射中心 | 商发 | intl | 0 | Success |
| `long-march-12-satnet-leo-group-25` | SatNet LEO Group 25 | 2026-09-17 | 长征十二号（cz12） | 文昌航天发射场·2号工位 | 国发 | intl | 0 | Success |
| `long-march-2d-piesat-2-13-16` | PIESAT-2 13-16 | 2026-09-19 | 长征二号丁（cz2d） | 太原卫星发射中心·9号工位 | 国发 | intl | 0 | Success |
| `kinetica-1-unknown-payload` | Unknown Payload | 2026-09-20 | 力箭一号（lz1） | 酒泉卫星发射中心 | 商发 | intl | 0 | Go |
| `long-march-8a-unknown-payload` | Unknown Payload | 2026-09-23 | 长征八号甲/改进型（cz8a） | 文昌航天发射场·1号工位 | 国发 | intl | 0 | Go |
| `long-march-6a-unknown-payload` | Unknown Payload | 2026-09-24 | 长征六号改/甲（cz6a） | 太原卫星发射中心·9A工位 | 国发 | intl | 0 | Go |
| `long-march-12a-flight-2` | Flight 2 | 2026-09-30 | 长征十二号甲（cz12a） | 酒泉卫星发射中心 | 国发 | intl | 0 | TBD |

### 逐条建议字段值

- **PIESAT-2 13-16**（`long-march-2d-piesat-2-13-16`）
  - 服务商：China Aerospace Science and Technology Corporation → 建议 ty=`国发`
  - 建议 id：`m-m9-?`（需人工定序号）
  - 日期 s/e：`2026-09-19` / `2026-09-19`，时刻：`18:50`
  - 火箭 rkKey：`cz2d`（长征二号丁）
  - 载荷 pl：`PIESAT-2 13-16`
  - 卫星数 satCount：`0`（API 正则抓取，务必核实）
  - 运营方 opKey：`intl`，分类 cat：`other`
  - LL 状态 Success → 建议 st=`done`

- **SpaceTY-51 & 52**（`kuaizhou-11-spacety-51-52`）
  - 服务商：ExPace → 建议 ty=`商发`
  - 建议 id：`m-m9-?`（需人工定序号）
  - 日期 s/e：`2026-09-17` / `2026-09-17`，时刻：`10:40`
  - 火箭 rkKey：`kz11`（快舟十一号）
  - 载荷 pl：`SpaceTY-51 & 52`
  - 卫星数 satCount：`0`（API 正则抓取，务必核实）
  - 运营方 opKey：`intl`，分类 cat：`other`
  - LL 状态 Success → 建议 st=`done`

- **SatNet LEO Group 25**（`long-march-12-satnet-leo-group-25`）
  - 服务商：China Aerospace Science and Technology Corporation → 建议 ty=`国发`
  - 建议 id：`m-m9-?`（需人工定序号）
  - 日期 s/e：`2026-09-17` / `2026-09-17`，时刻：`08:32`
  - 火箭 rkKey：`cz12`（长征十二号）
  - 载荷 pl：`SatNet LEO Group 25`
  - 卫星数 satCount：`0`（API 正则抓取，务必核实）
  - 运营方 opKey：`intl`，分类 cat：`other`
  - LL 状态 Success → 建议 st=`done`

- **PIESAT-2 13-16**（`long-march-2d-piesat-2-13-16`）
  - 服务商：China Aerospace Science and Technology Corporation → 建议 ty=`国发`
  - 建议 id：`m-m9-?`（需人工定序号）
  - 日期 s/e：`2026-09-19` / `2026-09-19`，时刻：`18:50`
  - 火箭 rkKey：`cz2d`（长征二号丁）
  - 载荷 pl：`PIESAT-2 13-16`
  - 卫星数 satCount：`0`（API 正则抓取，务必核实）
  - 运营方 opKey：`intl`，分类 cat：`other`
  - LL 状态 Success → 建议 st=`done`

- **Unknown Payload**（`kinetica-1-unknown-payload`）
  - 服务商：CAS Space → 建议 ty=`商发`
  - 建议 id：`m-m9-?`（需人工定序号）
  - 日期 s/e：`2026-09-20` / `2026-09-20`，时刻：`12:00`
  - 火箭 rkKey：`lz1`（力箭一号）
  - 载荷 pl：`Unknown Payload`
  - 卫星数 satCount：`0`（API 正则抓取，务必核实）
  - 运营方 opKey：`intl`，分类 cat：`other`
  - LL 状态 Go → 建议 st=`plan`

- **Unknown Payload**（`long-march-8a-unknown-payload`）
  - 服务商：China Aerospace Science and Technology Corporation → 建议 ty=`国发`
  - 建议 id：`m-m9-?`（需人工定序号）
  - 日期 s/e：`2026-09-23` / `2026-09-23`，时刻：`21:30`
  - 火箭 rkKey：`cz8a`（长征八号甲/改进型）
  - 载荷 pl：`Unknown Payload`
  - 卫星数 satCount：`0`（API 正则抓取，务必核实）
  - 运营方 opKey：`intl`，分类 cat：`other`
  - LL 状态 Go → 建议 st=`plan`

- **Unknown Payload**（`long-march-6a-unknown-payload`）
  - 服务商：China Aerospace Science and Technology Corporation → 建议 ty=`国发`
  - 建议 id：`m-m9-?`（需人工定序号）
  - 日期 s/e：`2026-09-24` / `2026-09-24`，时刻：`16:45`
  - 火箭 rkKey：`cz6a`（长征六号改/甲）
  - 载荷 pl：`Unknown Payload`
  - 卫星数 satCount：`0`（API 正则抓取，务必核实）
  - 运营方 opKey：`intl`，分类 cat：`other`
  - LL 状态 Go → 建议 st=`plan`

- **Flight 2**（`long-march-12a-flight-2`）
  - 服务商：China Aerospace Science and Technology Corporation → 建议 ty=`国发`
  - 建议 id：`m-m9-?`（需人工定序号）
  - 日期 s/e：`2026-09-30` / `2026-09-30`，时刻：`—`
  - 火箭 rkKey：`cz12a`（长征十二号甲）
  - 载荷 pl：`Flight 2`
  - 卫星数 satCount：`0`（API 正则抓取，务必核实）
  - 运营方 opKey：`intl`，分类 cat：`other`
  - LL 状态 TBD → 建议 st=`plan`
