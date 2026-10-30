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
## 2026-10-31 自动同步（7 条）

| LL slug | 建议名称 | 日期 | 火箭 | 发射场 | 建议 ty | 建议 opKey | 星数 | LL 状态 |
|---|---|---|---|---|---|---|---|---|
| `kinetica-2-spacesail-polar-group-tbd` | SpaceSail Polar Group TBD? | 2026-11-03 | 力箭二号（lz2） | 酒泉卫星发射中心 | 商发 | intl | 0 | Go |
| `ceres-2-unknown-payload` | Unknown Payload | 2026-11-05 | 谷神星二号（gsc2） | 酒泉卫星发射中心 | 商发 | intl | 0 | TBC |
| `long-march-2c-unknown-payload` | Unknown Payload | 2026-11-06 | 长征二号丙（cz2c） | 西昌卫星发射中心·3号工位 | 国发 | intl | 0 | Go |
| `long-march-12-satnet-leo-group-tbd` | SatNet LEO Group TBD? | 2026-11-06 | 长征十二号（cz12） | 文昌航天发射场·2号工位 | 国发 | intl | 0 | Go |
| `long-march-8a-satnet-leo-group-tbd` | SatNet LEO Group TBD? | 2026-11-20 | 长征八号甲/改进型（cz8a） | 文昌航天发射场·1号工位 | 国发 | intl | 0 | TBC |
| `long-march-12-satnet-leo-group-tbd-2` | SatNet LEO Group TBD? | 2026-11-24 | 长征十二号（cz12） | 文昌航天发射场·2号工位 | 国发 | intl | 0 | TBC |
| `long-march-2fg-shenzhou-24` | Shenzhou 24 | 2026-11-25 | 长征二号F（cz2f） | 酒泉卫星发射中心 | 国发 | intl | 0 | TBD |

### 逐条建议字段值

- **SpaceSail Polar Group TBD?**（`kinetica-2-spacesail-polar-group-tbd`）
  - 服务商：CAS Space → 建议 ty=`商发`
  - 建议 id：`m-m11-?`（需人工定序号）
  - 日期 s/e：`2026-11-03` / `2026-11-03`，时刻：`08:10`
  - 火箭 rkKey：`lz2`（力箭二号）
  - 载荷 pl：`SpaceSail Polar Group TBD?`
  - 卫星数 satCount：`0`（API 正则抓取，务必核实）
  - 运营方 opKey：`intl`，分类 cat：`other`
  - LL 状态 Go → 建议 st=`plan`

- **Unknown Payload**（`ceres-2-unknown-payload`）
  - 服务商：Galactic Energy → 建议 ty=`商发`
  - 建议 id：`m-m11-?`（需人工定序号）
  - 日期 s/e：`2026-11-05` / `2026-11-05`，时刻：`05:00`
  - 火箭 rkKey：`gsc2`（谷神星二号）
  - 载荷 pl：`Unknown Payload`
  - 卫星数 satCount：`0`（API 正则抓取，务必核实）
  - 运营方 opKey：`intl`，分类 cat：`other`
  - LL 状态 TBC → 建议 st=`plan`

- **Unknown Payload**（`long-march-2c-unknown-payload`）
  - 服务商：China Aerospace Science and Technology Corporation → 建议 ty=`国发`
  - 建议 id：`m-m11-?`（需人工定序号）
  - 日期 s/e：`2026-11-06` / `2026-11-06`，时刻：`00:00`
  - 火箭 rkKey：`cz2c`（长征二号丙）
  - 载荷 pl：`Unknown Payload`
  - 卫星数 satCount：`0`（API 正则抓取，务必核实）
  - 运营方 opKey：`intl`，分类 cat：`other`
  - LL 状态 Go → 建议 st=`plan`

- **SatNet LEO Group TBD?**（`long-march-12-satnet-leo-group-tbd`）
  - 服务商：China Aerospace Science and Technology Corporation → 建议 ty=`国发`
  - 建议 id：`m-m11-?`（需人工定序号）
  - 日期 s/e：`2026-11-06` / `2026-11-06`，时刻：`05:15`
  - 火箭 rkKey：`cz12`（长征十二号）
  - 载荷 pl：`SatNet LEO Group TBD?`
  - 卫星数 satCount：`0`（API 正则抓取，务必核实）
  - 运营方 opKey：`intl`，分类 cat：`other`
  - LL 状态 Go → 建议 st=`plan`

- **SatNet LEO Group TBD?**（`long-march-8a-satnet-leo-group-tbd`）
  - 服务商：China Aerospace Science and Technology Corporation → 建议 ty=`国发`
  - 建议 id：`m-m11-?`（需人工定序号）
  - 日期 s/e：`2026-11-20` / `2026-11-20`，时刻：`19:00`
  - 火箭 rkKey：`cz8a`（长征八号甲/改进型）
  - 载荷 pl：`SatNet LEO Group TBD?`
  - 卫星数 satCount：`0`（API 正则抓取，务必核实）
  - 运营方 opKey：`intl`，分类 cat：`other`
  - LL 状态 TBC → 建议 st=`plan`

- **SatNet LEO Group TBD?**（`long-march-12-satnet-leo-group-tbd-2`）
  - 服务商：China Aerospace Science and Technology Corporation → 建议 ty=`国发`
  - 建议 id：`m-m11-?`（需人工定序号）
  - 日期 s/e：`2026-11-24` / `2026-11-24`，时刻：`15:00`
  - 火箭 rkKey：`cz12`（长征十二号）
  - 载荷 pl：`SatNet LEO Group TBD?`
  - 卫星数 satCount：`0`（API 正则抓取，务必核实）
  - 运营方 opKey：`intl`，分类 cat：`other`
  - LL 状态 TBC → 建议 st=`plan`

- **Shenzhou 24**（`long-march-2fg-shenzhou-24`）
  - 服务商：China Aerospace Science and Technology Corporation → 建议 ty=`国发`
  - 建议 id：`m-m11-?`（需人工定序号）
  - 日期 s/e：`2026-11-25` / `2026-11-25`，时刻：`—`
  - 火箭 rkKey：`cz2f`（长征二号F）
  - 载荷 pl：`Shenzhou 24`
  - 卫星数 satCount：`0`（API 正则抓取，务必核实）
  - 运营方 opKey：`intl`，分类 cat：`other`
  - LL 状态 TBD → 建议 st=`plan`
