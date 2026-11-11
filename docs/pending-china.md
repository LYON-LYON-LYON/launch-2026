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
## 2026-11-11 自动同步（98 条）

| LL slug | 建议名称 | 日期 | 火箭 | 发射场 | 建议 ty | 建议 opKey | 星数 | LL 状态 |
|---|---|---|---|---|---|---|---|---|
| `long-march-12-satnet-leo-group-29` | SatNet LEO Group 29 | 2026-11-09 | 长征十二号（cz12） | 文昌航天发射场·2号工位 | 国发 | intl | 0 | Success |
| `ceres-2-4-satellites` | 4 satellites | 2026-11-07 | 谷神星二号（gsc2） | 酒泉卫星发射中心 | 商发 | intl | 4 | Success |
| `long-march-2c-yaogan-51-07-to-09` | Yaogan 51-07 to 09 | 2026-11-05 | 长征二号丙（cz2c） | 西昌卫星发射中心·3号工位 | 国发 | intl | 0 | Success |
| `kinetica-2-spacesail-polar-group-17` | SpaceSail Polar Group #17 | 2026-11-03 | 力箭二号（lz2） | 酒泉卫星发射中心 | 商发 | intl | 0 | Success |
| `long-march-8a-satnet-leo-group-28` | SatNet LEO Group 28 | 2026-10-25 | 长征八号甲/改进型（cz8a） | 文昌航天发射场·1号工位 | 国发 | intl | 0 | Success |
| `long-march-4b-yaogan-53-07-to-0956-19-to-21` | Yaogan 53-07 to 09/56-19 to 21 | 2026-10-24 | 长征四号乙（cz4b） | 酒泉卫星发射中心 | 国发 | intl | 0 | Success |
| `long-march-6a-yaogan-50-03` | Yaogan 50-03 | 2026-10-23 | 长征六号改/甲（cz6a） | 太原卫星发射中心·9A工位 | 国发 | intl | 0 | Success |
| `ceres-1s-xiguang-4-01` | Xiguang-4 01 | 2026-10-21 | Ceres-1S（未收录） | Haiyang Oriental Spaceport | 商发 | intl | 25 | Success |
| `zhuque-2e-block-2-10-satellites` | 10 satellites | 2026-10-14 | Zhuque-2E Block 2（未收录） | 酒泉卫星发射中心 | 商发 | intl | 10 | Success |
| `long-march-12-satnet-leo-group-27` | SatNet LEO Group 27 | 2026-10-10 | 长征十二号（cz12） | 文昌航天发射场·2号工位 | 国发 | intl | 0 | Success |
| `long-march-6a-yaogan-40-group-04` | Yaogan 40 Group 04 | 2026-09-24 | 长征六号改/甲（cz6a） | 太原卫星发射中心·9A工位 | 国发 | intl | 0 | Success |
| `long-march-8a-satnet-leo-group-26` | SatNet LEO Group 26 | 2026-09-23 | 长征八号甲/改进型（cz8a） | 文昌航天发射场·1号工位 | 国发 | intl | 0 | Success |
| `kinetica-1-9-satellites-2` | 9 satellites | 2026-09-20 | 力箭一号（lz1） | 酒泉卫星发射中心 | 商发 | intl | 9 | Success |
| `long-march-2d-piesat-2-13-16` | PIESAT-2 13-16 | 2026-09-19 | 长征二号丁（cz2d） | 太原卫星发射中心·9号工位 | 国发 | intl | 0 | Success |
| `kuaizhou-11-spacety-51-52` | SpaceTY-51 & 52 | 2026-09-17 | 快舟十一号（kz11） | 酒泉卫星发射中心 | 商发 | intl | 0 | Success |
| `long-march-12-satnet-leo-group-25` | SatNet LEO Group 25 | 2026-09-17 | 长征十二号（cz12） | 文昌航天发射场·2号工位 | 国发 | intl | 0 | Success |
| `gravity-1-spacesail-polar-group-16` | SpaceSail Polar Group #16 | 2026-09-16 | 引力一号（yyl1） | Haiyang Oriental Spaceport | 商发 | intl | 0 | Success |
| `zhuque-2e-block-2-spacesail-polar-group-15` | SpaceSail Polar Group #15 | 2026-09-15 | Zhuque-2E Block 2（未收录） | 酒泉卫星发射中心 | 商发 | intl | 0 | Success |
| `long-march-4b-yaogan-53-01-to-0356-01-to-03` | Yaogan 53-01 to 03/56-01 to 03 | 2026-09-10 | 长征四号乙（cz4b） | 酒泉卫星发射中心 | 国发 | intl | 0 | Success |
| `pallas-1-demo-flight` | Demo Flight | 2026-09-01 | 智神星一号（zs1） | 酒泉卫星发射中心 | 商发 | intl | 0 | Success |
| `long-march-6c-7-satellites` | 7 satellites | 2026-08-25 | 长征六号丙（cz6c） | 太原卫星发射中心·9A工位 | 国发 | intl | 7 | Success |
| `zhuque-3-honghu-03` | Honghu-03 | 2026-08-19 | 朱雀三号（zq3） | 酒泉卫星发射中心 | 商发 | intl | 0 | Success |
| `long-march-2c-satellite-for-earth-observation-seo` | Satellite for Earth Observation (SEO) | 2026-08-17 | 长征二号丙（cz2c） | 太原卫星发射中心·9号工位 | 国发 | intl | 0 | Success |
| `long-march-12-satnet-leo-group-24` | SatNet LEO Group 24 | 2026-08-16 | 长征十二号（cz12） | 文昌航天发射场·2号工位 | 国发 | intl | 0 | Success |
| `long-march-7a-chinasat-4b` | ChinaSat 4B | 2026-08-10 | 长征七号甲（cz7a） | 文昌航天发射场 | 国发 | intl | 0 | Failure |
| `smart-dragon-3-ose-hs-01-02` | OSE HS-01 & 02 | 2026-08-05 | 捷龙三号（jl3） | Haiyang Oriental Spaceport | 国发 | intl | 0 | Success |
| `long-march-8a-satnet-leo-group-23` | SatNet LEO Group 23 | 2026-08-04 | 长征八号甲/改进型（cz8a） | 文昌航天发射场·1号工位 | 国发 | intl | 0 | Success |
| `long-march-6a-tjsw-27a-b` | TJSW-27A & B | 2026-07-30 | 长征六号改/甲（cz6a） | 太原卫星发射中心·9A工位 | 国发 | intl | 0 | Success |
| `long-march-7a-tianlian-3-01` | Tianlian 3-01 | 2026-07-29 | 长征七号甲（cz7a） | 文昌航天发射场 | 国发 | intl | 0 | Success |
| `kinetica-1-5-satellites-3` | 5 satellites | 2026-07-24 | 力箭一号（lz1） | 酒泉卫星发射中心 | 商发 | intl | 5 | Success |
| `long-march-3be-tianlian-2-06` | Tianlian 2-06 | 2026-07-23 | 长征三号乙（cz3b） | 西昌卫星发射中心·2号工位 | 国发 | intl | 0 | Success |
| `gravity-1-9-satellites` | 9 satellites | 2026-07-22 | 引力一号（yyl1） | Haiyang Oriental Spaceport | 商发 | intl | 9 | Success |
| `long-march-10b-demo-flight` | Demo Flight | 2026-07-10 | Long March 10B（未收录） | 文昌航天发射场·2号工位 | 国发 | intl | 0 | Success |
| `long-march-8a-spacesail-polar-group-14` | SpaceSail Polar Group #14 | 2026-07-05 | 长征八号甲/改进型（cz8a） | 文昌航天发射场·1号工位 | 国发 | intl | 0 | Success |
| `long-march-6a-spacesail-polar-group-13` | SpaceSail Polar Group #13 | 2026-07-04 | 长征六号改/甲（cz6a） | 太原卫星发射中心·9A工位 | 国发 | intl | 0 | Success |
| `long-march-4b-haiyang-2e` | Haiyang 2E | 2026-07-02 | 长征四号乙（cz4b） | 酒泉卫星发射中心 | 国发 | intl | 0 | Success |
| `long-march-7a-tjsw-26a` | TJSW-26A | 2026-06-23 | 长征七号甲（cz7a） | 文昌航天发射场 | 国发 | intl | 0 | Success |
| `kuaizhou-11-centispace-1-group-05` | CentiSpace-1 Group 05 | 2026-06-17 | 快舟十一号（kz11） | 酒泉卫星发射中心 | 商发 | intl | 160 | Success |
| `long-march-12-satnet-leo-group-22` | SatNet LEO Group 22 | 2026-06-17 | 长征十二号（cz12） | 文昌航天发射场·2号工位 | 国发 | intl | 0 | Success |
| `long-march-3be-shijian-31` | Shijian 31 | 2026-06-16 | 长征三号乙（cz3b） | 西昌卫星发射中心·2号工位 | 国发 | intl | 0 | Success |
| `kinetica-1-8-x-jilin-1-2` | 8 x Jilin-1 | 2026-06-15 | 力箭一号（lz1） | 酒泉卫星发射中心 | 商发 | intl | 0 | Success |
| `long-march-5-tjsw-25` | TJSW-25 | 2026-06-11 | 长征五号（cz5） | 文昌航天发射场 | 国发 | intl | 0 | Success |
| `zhuque-2e-block-2-2-x-satnet-dtc-test-satellites` | 2 x SatNet DTC test satellites | 2026-06-09 | Zhuque-2E Block 2（未收录） | 酒泉卫星发射中心 | 商发 | intl | 0 | Success |
| `long-march-8-spacesail-polar-group-12` | SpaceSail Polar Group #12 | 2026-06-05 | 长征八号（cz8） | 文昌航天发射场·1号工位 | 国发 | intl | 0 | Success |
| `long-march-6a-spacesail-polar-group-11` | SpaceSail Polar Group #11 | 2026-06-04 | 长征六号改/甲（cz6a） | 太原卫星发射中心·9A工位 | 国发 | intl | 0 | Success |
| `long-march-12b-demo-flight-spacesail-polar-group-1` | Demo Flight (SpaceSail Polar Group #10) | 2026-06-01 | 长征十二号乙（cz12b） | 酒泉卫星发射中心 | 国发 | intl | 0 | Success |
| `long-march-2d-4-x-satnet-test-satellites-3` | 4 x SatNet test satellites | 2026-05-31 | 长征二号丁（cz2d） | 西昌卫星发射中心·3号工位 | 国发 | intl | 0 | Success |
| `long-march-7a-tjsw-24` | TJSW-24 | 2026-05-27 | 长征七号甲（cz7a） | 文昌航天发射场 | 国发 | intl | 0 | Success |
| `long-march-2fg-shenzhou-23` | Shenzhou 23 | 2026-05-24 | 长征二号F（cz2f） | 酒泉卫星发射中心 | 国发 | intl | 0 | Success |
| `long-march-8-spacesail-polar-group-9` | SpaceSail Polar Group #9 | 2026-05-17 | 长征八号（cz8） | 文昌航天发射场·1号工位 | 国发 | intl | 0 | Success |
| `kinetica-1-5-satellites-2` | 5 satellites | 2026-05-15 | 力箭一号（lz1） | 酒泉卫星发射中心 | 商发 | intl | 5 | Success |
| `zhuque-2e-block-2-mass-simulator` | Mass Simulator | 2026-05-14 | Zhuque-2E Block 2（未收录） | 酒泉卫星发射中心 | 商发 | intl | 0 | Success |
| `long-march-6a-spacesail-polar-group-8` | SpaceSail Polar Group #8 | 2026-05-12 | 长征六号改/甲（cz6a） | 太原卫星发射中心·9A工位 | 国发 | intl | 0 | Success |
| `long-march-7-tianzhou-10` | Tianzhou-10 | 2026-05-11 | 长征七号（cz7） | 文昌航天发射场 | 国发 | intl | 0 | Success |
| `long-march-6-prsc-eo3` | PRSC-EO3 | 2026-04-25 | 长征六号（cz6） | 太原卫星发射中心·16号工位 | 国发 | intl | 0 | Success |
| `long-march-2d-4-x-satnet-test-satellites-2` | 4 x SatNet test satellites | 2026-04-24 | 长征二号丁（cz2d） | 西昌卫星发射中心·3号工位 | 国发 | intl | 0 | Success |
| `long-march-4c-daqi-2-aems` | Daqi-2 (AEMS) | 2026-04-17 | 长征四号丙（cz4c） | 酒泉卫星发射中心 | 国发 | intl | 0 | Success |
| `kinetica-1-8-x-jilin-1` | 8 x Jilin-1 | 2026-04-14 | 力箭一号（lz1） | 酒泉卫星发射中心 | 商发 | intl | 0 | Success |
| `smart-dragon-3-satnet-test-satellite-2` | SatNet test satellite | 2026-04-11 | 捷龙三号（jl3） | Haiyang Oriental Spaceport | 国发 | intl | 0 | Success |
| `long-march-6a-satnet-leo-group-21` | SatNet LEO Group 21 | 2026-04-09 | 长征六号改/甲（cz6a） | 太原卫星发射中心·9A工位 | 国发 | intl | 0 | Success |
| `long-march-8-spacesail-polar-group-7` | SpaceSail Polar Group #7 | 2026-04-07 | 长征八号（cz8） | 文昌航天发射场·1号工位 | 国发 | intl | 0 | Success |
| `tianlong-3-demo-flight` | Demo Flight | 2026-04-03 | Tianlong-3（未收录） | 酒泉卫星发射中心 | 商发 | intl | 0 | Failure |
| `kinetica-2-demo-flight-qingzhou-prototype-spacecra` | Demo Flight (Qingzhou Prototype Spacecraft) | 2026-03-30 | 力箭二号（lz2） | 酒泉卫星发射中心 | 商发 | intl | 3 | Success |
| `long-march-2cyz-1s-shiyan-33` | Shiyan 33 | 2026-03-27 | Long March 2C/YZ-1S（未收录） | 酒泉卫星发射中心 | 国发 | intl | 0 | Success |
| `long-march-2d-superview-neo-2-05-06` | SuperView Neo 2-05 & 06 | 2026-03-26 | 长征二号丁（cz2d） | 太原卫星发射中心·9号工位 | 国发 | intl | 0 | Success |
| `smart-dragon-3-10-x-centispace-1-2` | 10 x CentiSpace-1 | 2026-03-22 | 捷龙三号（jl3） | Haiyang Oriental Spaceport | 国发 | intl | 160 | Success |
| `kuaizhou-11-8-satellites` | 8 satellites | 2026-03-16 | 快舟十一号（kz11） | 酒泉卫星发射中心 | 商发 | intl | 8 | Success |
| `long-march-6a-yaogan-50-02` | Yaogan 50-02 | 2026-03-15 | 长征六号改/甲（cz6a） | 太原卫星发射中心·9A工位 | 国发 | intl | 0 | Success |
| `long-march-2d-shiyan-30-03-04` | Shiyan 30 03-04 | 2026-03-13 | 长征二号丁（cz2d） | 西昌卫星发射中心·3号工位 | 国发 | intl | 0 | Success |
| `long-march-8a-satnet-leo-group-20` | SatNet LEO Group 20 | 2026-03-13 | 长征八号甲/改进型（cz8a） | 文昌航天发射场·1号工位 | 国发 | intl | 0 | Success |
| `smart-dragon-3-prsc-eo2-6-satellites` | PRSC-EO2 & 6 satellites | 2026-02-12 | 捷龙三号（jl3） | Haiyang Oriental Spaceport | 国发 | intl | 6 | Success |
| `long-march-2fg-chinese-reusable-space-vehicle-4` | Chinese Reusable Space Vehicle | 2026-02-07 | 长征二号F（cz2f） | 酒泉卫星发射中心 | 国发 | intl | 0 | Success |
| `long-march-2c-alsat-3b` | AlSat 3B | 2026-01-31 | 长征二号丙（cz2c） | 酒泉卫星发射中心 | 国发 | intl | 0 | Success |
| `long-march-12-satnet-leo-group-19` | SatNet LEO Group 19 | 2026-01-19 | 长征十二号（cz12） | 文昌航天发射场·2号工位 | 国发 | intl | 0 | Success |
| `ceres-2-demo-flight` | Demo Flight | 2026-01-17 | 谷神星二号（gsc2） | 酒泉卫星发射中心 | 商发 | intl | 0 | Failure |
| `long-march-3be-shijian-32` | Shijian 32 | 2026-01-17 | 长征三号乙（cz3b） | 西昌卫星发射中心·2号工位 | 国发 | intl | 0 | Failure |
| `ceres-1s-tianqi-37-40` | Tianqi 37-40 | 2026-01-16 | Ceres-1S（未收录） | Haiyang Oriental Spaceport | 商发 | intl | 0 | Success |
| `long-march-2c-alsat-3a` | AlSat 3A | 2026-01-15 | 长征二号丙（cz2c） | 酒泉卫星发射中心 | 国发 | intl | 0 | Success |
| `long-march-8a-satnet-leo-group-18` | SatNet LEO Group 18 | 2026-01-13 | 长征八号甲/改进型（cz8a） | 文昌航天发射场·1号工位 | 国发 | intl | 0 | Success |
| `long-march-6a-yaogan-50-01` | Yaogan 50-01 | 2026-01-13 | 长征六号改/甲（cz6a） | 太原卫星发射中心·9A工位 | 国发 | intl | 0 | Success |
| `long-march-7a-shijian-29-a-b` | Shijian 29 A-B | 2025-12-31 | 长征七号甲（cz7a） | 文昌航天发射场 | 国发 | intl | 2 | Success |
| `long-march-4b-tianhui-7` | Tianhui 7 | 2025-12-30 | 长征四号乙（cz4b） | 酒泉卫星发射中心 | 国发 | intl | 0 | Success |
| `long-march-3be-fengyun-4c` | Fengyun-4C | 2025-12-27 | 长征三号乙（cz3b） | 西昌卫星发射中心·2号工位 | 国发 | intl | 0 | Success |
| `long-march-8a-satnet-leo-group-17` | SatNet LEO Group 17 | 2025-12-26 | 长征八号甲/改进型（cz8a） | 文昌航天发射场·1号工位 | 国发 | intl | 0 | Success |
| `long-march-12a-demo-flight` | Demo Flight | 2025-12-23 | 长征十二号甲（cz12a） | 酒泉卫星发射中心 | 国发 | intl | 0 | Success |
| `long-march-5-tjsw-23` | TJSW-23 | 2025-12-20 | 长征五号（cz5） | 文昌航天发射场 | 国发 | intl | 0 | Success |
| `long-march-4b-ziyuan-3-04` | Ziyuan-3-04 | 2025-12-16 | 长征四号乙（cz4b） | 太原卫星发射中心·9号工位 | 国发 | intl | 0 | Success |
| `kuaizhou-11-dear-5` | DEAR-5 | 2025-12-13 | 快舟十一号（kz11） | 酒泉卫星发射中心 | 商发 | intl | 0 | Success |
| `long-march-12-satnet-leo-group-16` | SatNet LEO Group 16 | 2025-12-12 | 长征十二号（cz12） | 文昌航天发射场·2号工位 | 国发 | intl | 0 | Success |
| `kinetica-1-9-satellites` | 9 satellites | 2025-12-10 | 力箭一号（lz1） | 酒泉卫星发射中心 | 商发 | intl | 9 | Success |
| `long-march-3be-tjsw-22` | TJSW-22 | 2025-12-09 | 长征三号乙（cz3b） | 西昌卫星发射中心·3号工位 | 国发 | intl | 0 | Success |
| `long-march-4b-yaogan-47` | Yaogan 47 | 2025-12-09 | 长征四号乙（cz4b） | 酒泉卫星发射中心 | 国发 | intl | 0 | Success |
| `long-march-6a-satnet-leo-group-15` | SatNet LEO Group 15 | 2025-12-09 | 长征六号改/甲（cz6a） | 太原卫星发射中心·9A工位 | 国发 | intl | 0 | Success |
| `long-march-2d-unknown-payload` | Unknown Payload | 2026-11-11 | 长征二号丁（cz2d） | 酒泉卫星发射中心 | 国发 | intl | 0 | Go |
| `kuaizhou-11-unknown-payload` | Unknown Payload | 2026-11-13 | 快舟十一号（kz11） | 酒泉卫星发射中心 | 商发 | intl | 0 | Go |
| `long-march-8a-satnet-leo-group-tbd` | SatNet LEO Group TBD? | 2026-11-20 | 长征八号甲/改进型（cz8a） | 文昌航天发射场·1号工位 | 国发 | intl | 0 | TBC |
| `long-march-12-satnet-leo-group-tbd` | SatNet LEO Group TBD? | 2026-11-24 | 长征十二号（cz12） | 文昌航天发射场·2号工位 | 国发 | intl | 0 | TBC |
| `long-march-2fg-shenzhou-24` | Shenzhou 24 | 2026-11-25 | 长征二号F（cz2f） | 酒泉卫星发射中心 | 国发 | intl | 0 | TBD |

### 逐条建议字段值

- **SatNet LEO Group 29**（`long-march-12-satnet-leo-group-29`）
  - 服务商：China Aerospace Science and Technology Corporation → 建议 ty=`国发`
  - 建议 id：`m-m11-?`（需人工定序号）
  - 日期 s/e：`2026-11-09` / `2026-11-09`，时刻：`04:24`
  - 火箭 rkKey：`cz12`（长征十二号）
  - 载荷 pl：`SatNet LEO Group 29`
  - 卫星数 satCount：`0`（API 正则抓取，务必核实）
  - 运营方 opKey：`intl`，分类 cat：`other`
  - LL 状态 Success → 建议 st=`done`

- **4 satellites**（`ceres-2-4-satellites`）
  - 服务商：Galactic Energy → 建议 ty=`商发`
  - 建议 id：`m-m11-?`（需人工定序号）
  - 日期 s/e：`2026-11-07` / `2026-11-07`，时刻：`07:37`
  - 火箭 rkKey：`gsc2`（谷神星二号）
  - 载荷 pl：`4 satellites ×4`
  - 卫星数 satCount：`4`（API 正则抓取，务必核实）
  - 运营方 opKey：`intl`，分类 cat：`other`
  - LL 状态 Success → 建议 st=`done`

- **Yaogan 51-07 to 09**（`long-march-2c-yaogan-51-07-to-09`）
  - 服务商：China Aerospace Science and Technology Corporation → 建议 ty=`国发`
  - 建议 id：`m-m11-?`（需人工定序号）
  - 日期 s/e：`2026-11-05` / `2026-11-06`，时刻：`23:58`
  - 火箭 rkKey：`cz2c`（长征二号丙）
  - 载荷 pl：`Yaogan 51-07 to 09`
  - 卫星数 satCount：`0`（API 正则抓取，务必核实）
  - 运营方 opKey：`intl`，分类 cat：`other`
  - LL 状态 Success → 建议 st=`done`

- **SpaceSail Polar Group #17**（`kinetica-2-spacesail-polar-group-17`）
  - 服务商：CAS Space → 建议 ty=`商发`
  - 建议 id：`m-m11-?`（需人工定序号）
  - 日期 s/e：`2026-11-03` / `2026-11-03`，时刻：`08:15`
  - 火箭 rkKey：`lz2`（力箭二号）
  - 载荷 pl：`SpaceSail Polar Group #17`
  - 卫星数 satCount：`0`（API 正则抓取，务必核实）
  - 运营方 opKey：`intl`，分类 cat：`other`
  - LL 状态 Success → 建议 st=`done`

- **SatNet LEO Group 28**（`long-march-8a-satnet-leo-group-28`）
  - 服务商：China Aerospace Science and Technology Corporation → 建议 ty=`国发`
  - 建议 id：`m-m10-?`（需人工定序号）
  - 日期 s/e：`2026-10-25` / `2026-10-25`，时刻：`10:03`
  - 火箭 rkKey：`cz8a`（长征八号甲/改进型）
  - 载荷 pl：`SatNet LEO Group 28`
  - 卫星数 satCount：`0`（API 正则抓取，务必核实）
  - 运营方 opKey：`intl`，分类 cat：`other`
  - LL 状态 Success → 建议 st=`done`

- **Yaogan 53-07 to 09/56-19 to 21**（`long-march-4b-yaogan-53-07-to-0956-19-to-21`）
  - 服务商：China Aerospace Science and Technology Corporation → 建议 ty=`国发`
  - 建议 id：`m-m10-?`（需人工定序号）
  - 日期 s/e：`2026-10-24` / `2026-10-24`，时刻：`03:25`
  - 火箭 rkKey：`cz4b`（长征四号乙）
  - 载荷 pl：`Yaogan 53-07 to 09/56-19 to 21`
  - 卫星数 satCount：`0`（API 正则抓取，务必核实）
  - 运营方 opKey：`intl`，分类 cat：`other`
  - LL 状态 Success → 建议 st=`done`

- **Yaogan 50-03**（`long-march-6a-yaogan-50-03`）
  - 服务商：China Aerospace Science and Technology Corporation → 建议 ty=`国发`
  - 建议 id：`m-m10-?`（需人工定序号）
  - 日期 s/e：`2026-10-23` / `2026-10-23`，时刻：`18:15`
  - 火箭 rkKey：`cz6a`（长征六号改/甲）
  - 载荷 pl：`Yaogan 50-03`
  - 卫星数 satCount：`0`（API 正则抓取，务必核实）
  - 运营方 opKey：`intl`，分类 cat：`other`
  - LL 状态 Success → 建议 st=`done`

- **Xiguang-4 01**（`ceres-1s-xiguang-4-01`）
  - 服务商：Galactic Energy → 建议 ty=`商发`
  - 建议 id：`m-m10-?`（需人工定序号）
  - 日期 s/e：`2026-10-21` / `2026-10-21`，时刻：`11:39`
  - 火箭 rkKey：`未收录，需补 glossary`（Ceres-1S）
  - 载荷 pl：`Xiguang-4 01 ×25`
  - 卫星数 satCount：`25`（API 正则抓取，务必核实）
  - 运营方 opKey：`intl`，分类 cat：`other`
  - LL 状态 Success → 建议 st=`done`

- **10 satellites**（`zhuque-2e-block-2-10-satellites`）
  - 服务商：LandSpace → 建议 ty=`商发`
  - 建议 id：`m-m10-?`（需人工定序号）
  - 日期 s/e：`2026-10-14` / `2026-10-14`，时刻：`19:40`
  - 火箭 rkKey：`未收录，需补 glossary`（Zhuque-2E Block 2）
  - 载荷 pl：`10 satellites ×10`
  - 卫星数 satCount：`10`（API 正则抓取，务必核实）
  - 运营方 opKey：`intl`，分类 cat：`other`
  - LL 状态 Success → 建议 st=`done`

- **SatNet LEO Group 27**（`long-march-12-satnet-leo-group-27`）
  - 服务商：China Aerospace Science and Technology Corporation → 建议 ty=`国发`
  - 建议 id：`m-m10-?`（需人工定序号）
  - 日期 s/e：`2026-10-10` / `2026-10-10`，时刻：`03:27`
  - 火箭 rkKey：`cz12`（长征十二号）
  - 载荷 pl：`SatNet LEO Group 27`
  - 卫星数 satCount：`0`（API 正则抓取，务必核实）
  - 运营方 opKey：`intl`，分类 cat：`other`
  - LL 状态 Success → 建议 st=`done`

- **Yaogan 40 Group 04**（`long-march-6a-yaogan-40-group-04`）
  - 服务商：China Aerospace Science and Technology Corporation → 建议 ty=`国发`
  - 建议 id：`m-m9-?`（需人工定序号）
  - 日期 s/e：`2026-09-24` / `2026-09-24`，时刻：`16:46`
  - 火箭 rkKey：`cz6a`（长征六号改/甲）
  - 载荷 pl：`Yaogan 40 Group 04`
  - 卫星数 satCount：`0`（API 正则抓取，务必核实）
  - 运营方 opKey：`intl`，分类 cat：`other`
  - LL 状态 Success → 建议 st=`done`

- **SatNet LEO Group 26**（`long-march-8a-satnet-leo-group-26`）
  - 服务商：China Aerospace Science and Technology Corporation → 建议 ty=`国发`
  - 建议 id：`m-m9-?`（需人工定序号）
  - 日期 s/e：`2026-09-23` / `2026-09-23`，时刻：`21:32`
  - 火箭 rkKey：`cz8a`（长征八号甲/改进型）
  - 载荷 pl：`SatNet LEO Group 26`
  - 卫星数 satCount：`0`（API 正则抓取，务必核实）
  - 运营方 opKey：`intl`，分类 cat：`other`
  - LL 状态 Success → 建议 st=`done`

- **9 satellites**（`kinetica-1-9-satellites-2`）
  - 服务商：CAS Space → 建议 ty=`商发`
  - 建议 id：`m-m9-?`（需人工定序号）
  - 日期 s/e：`2026-09-20` / `2026-09-20`，时刻：`12:03`
  - 火箭 rkKey：`lz1`（力箭一号）
  - 载荷 pl：`9 satellites ×9`
  - 卫星数 satCount：`9`（API 正则抓取，务必核实）
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

- **SpaceSail Polar Group #16**（`gravity-1-spacesail-polar-group-16`）
  - 服务商：Orienspace Technology → 建议 ty=`商发`
  - 建议 id：`m-m9-?`（需人工定序号）
  - 日期 s/e：`2026-09-16` / `2026-09-16`，时刻：`06:00`
  - 火箭 rkKey：`yyl1`（引力一号）
  - 载荷 pl：`SpaceSail Polar Group #16`
  - 卫星数 satCount：`0`（API 正则抓取，务必核实）
  - 运营方 opKey：`intl`，分类 cat：`other`
  - LL 状态 Success → 建议 st=`done`

- **SpaceSail Polar Group #15**（`zhuque-2e-block-2-spacesail-polar-group-15`）
  - 服务商：LandSpace → 建议 ty=`商发`
  - 建议 id：`m-m9-?`（需人工定序号）
  - 日期 s/e：`2026-09-15` / `2026-09-15`，时刻：`14:26`
  - 火箭 rkKey：`未收录，需补 glossary`（Zhuque-2E Block 2）
  - 载荷 pl：`SpaceSail Polar Group #15`
  - 卫星数 satCount：`0`（API 正则抓取，务必核实）
  - 运营方 opKey：`intl`，分类 cat：`other`
  - LL 状态 Success → 建议 st=`done`

- **Yaogan 53-01 to 03/56-01 to 03**（`long-march-4b-yaogan-53-01-to-0356-01-to-03`）
  - 服务商：China Aerospace Science and Technology Corporation → 建议 ty=`国发`
  - 建议 id：`m-m9-?`（需人工定序号）
  - 日期 s/e：`2026-09-10` / `2026-09-10`，时刻：`17:00`
  - 火箭 rkKey：`cz4b`（长征四号乙）
  - 载荷 pl：`Yaogan 53-01 to 03/56-01 to 03`
  - 卫星数 satCount：`0`（API 正则抓取，务必核实）
  - 运营方 opKey：`intl`，分类 cat：`other`
  - LL 状态 Success → 建议 st=`done`

- **Demo Flight**（`pallas-1-demo-flight`）
  - 服务商：Galactic Energy → 建议 ty=`商发`
  - 建议 id：`m-m9-?`（需人工定序号）
  - 日期 s/e：`2026-09-01` / `2026-09-01`，时刻：`10:00`
  - 火箭 rkKey：`zs1`（智神星一号）
  - 载荷 pl：`Demo Flight`
  - 卫星数 satCount：`0`（API 正则抓取，务必核实）
  - 运营方 opKey：`intl`，分类 cat：`other`
  - LL 状态 Success → 建议 st=`done`

- **7 satellites**（`long-march-6c-7-satellites`）
  - 服务商：China Aerospace Science and Technology Corporation → 建议 ty=`国发`
  - 建议 id：`m-m8-?`（需人工定序号）
  - 日期 s/e：`2026-08-25` / `2026-08-25`，时刻：`11:21`
  - 火箭 rkKey：`cz6c`（长征六号丙）
  - 载荷 pl：`7 satellites ×7`
  - 卫星数 satCount：`7`（API 正则抓取，务必核实）
  - 运营方 opKey：`intl`，分类 cat：`other`
  - LL 状态 Success → 建议 st=`done`

- **Honghu-03**（`zhuque-3-honghu-03`）
  - 服务商：LandSpace → 建议 ty=`商发`
  - 建议 id：`m-m8-?`（需人工定序号）
  - 日期 s/e：`2026-08-19` / `2026-08-19`，时刻：`07:35`
  - 火箭 rkKey：`zq3`（朱雀三号）
  - 载荷 pl：`Honghu-03`
  - 卫星数 satCount：`0`（API 正则抓取，务必核实）
  - 运营方 opKey：`intl`，分类 cat：`other`
  - LL 状态 Success → 建议 st=`done`

- **Satellite for Earth Observation (SEO)**（`long-march-2c-satellite-for-earth-observation-seo`）
  - 服务商：China Aerospace Science and Technology Corporation → 建议 ty=`国发`
  - 建议 id：`m-m8-?`（需人工定序号）
  - 日期 s/e：`2026-08-17` / `2026-08-17`，时刻：`11:02`
  - 火箭 rkKey：`cz2c`（长征二号丙）
  - 载荷 pl：`Satellite for Earth Observation (SEO)`
  - 卫星数 satCount：`0`（API 正则抓取，务必核实）
  - 运营方 opKey：`intl`，分类 cat：`other`
  - LL 状态 Success → 建议 st=`done`

- **SatNet LEO Group 24**（`long-march-12-satnet-leo-group-24`）
  - 服务商：China Aerospace Science and Technology Corporation → 建议 ty=`国发`
  - 建议 id：`m-m8-?`（需人工定序号）
  - 日期 s/e：`2026-08-16` / `2026-08-16`，时刻：`12:10`
  - 火箭 rkKey：`cz12`（长征十二号）
  - 载荷 pl：`SatNet LEO Group 24`
  - 卫星数 satCount：`0`（API 正则抓取，务必核实）
  - 运营方 opKey：`intl`，分类 cat：`other`
  - LL 状态 Success → 建议 st=`done`

- **ChinaSat 4B**（`long-march-7a-chinasat-4b`）
  - 服务商：China Aerospace Science and Technology Corporation → 建议 ty=`国发`
  - 建议 id：`m-m8-?`（需人工定序号）
  - 日期 s/e：`2026-08-10` / `2026-08-10`，时刻：`20:02`
  - 火箭 rkKey：`cz7a`（长征七号甲）
  - 载荷 pl：`ChinaSat 4B`
  - 卫星数 satCount：`0`（API 正则抓取，务必核实）
  - 运营方 opKey：`intl`，分类 cat：`other`
  - LL 状态 Failure → 建议 st=`fail`

- **OSE HS-01 & 02**（`smart-dragon-3-ose-hs-01-02`）
  - 服务商：China Rocket Co. Ltd. → 建议 ty=`国发`
  - 建议 id：`m-m8-?`（需人工定序号）
  - 日期 s/e：`2026-08-05` / `2026-08-05`，时刻：`10:38`
  - 火箭 rkKey：`jl3`（捷龙三号）
  - 载荷 pl：`OSE HS-01 & 02`
  - 卫星数 satCount：`0`（API 正则抓取，务必核实）
  - 运营方 opKey：`intl`，分类 cat：`other`
  - LL 状态 Success → 建议 st=`done`

- **SatNet LEO Group 23**（`long-march-8a-satnet-leo-group-23`）
  - 服务商：China Aerospace Science and Technology Corporation → 建议 ty=`国发`
  - 建议 id：`m-m8-?`（需人工定序号）
  - 日期 s/e：`2026-08-04` / `2026-08-04`，时刻：`16:52`
  - 火箭 rkKey：`cz8a`（长征八号甲/改进型）
  - 载荷 pl：`SatNet LEO Group 23`
  - 卫星数 satCount：`0`（API 正则抓取，务必核实）
  - 运营方 opKey：`intl`，分类 cat：`other`
  - LL 状态 Success → 建议 st=`done`

- **TJSW-27A & B**（`long-march-6a-tjsw-27a-b`）
  - 服务商：China Aerospace Science and Technology Corporation → 建议 ty=`国发`
  - 建议 id：`m-m7-?`（需人工定序号）
  - 日期 s/e：`2026-07-30` / `2026-07-30`，时刻：`09:00`
  - 火箭 rkKey：`cz6a`（长征六号改/甲）
  - 载荷 pl：`TJSW-27A & B`
  - 卫星数 satCount：`0`（API 正则抓取，务必核实）
  - 运营方 opKey：`intl`，分类 cat：`other`
  - LL 状态 Success → 建议 st=`done`

- **Tianlian 3-01**（`long-march-7a-tianlian-3-01`）
  - 服务商：China Aerospace Science and Technology Corporation → 建议 ty=`国发`
  - 建议 id：`m-m7-?`（需人工定序号）
  - 日期 s/e：`2026-07-29` / `2026-07-29`，时刻：`19:50`
  - 火箭 rkKey：`cz7a`（长征七号甲）
  - 载荷 pl：`Tianlian 3-01`
  - 卫星数 satCount：`0`（API 正则抓取，务必核实）
  - 运营方 opKey：`intl`，分类 cat：`other`
  - LL 状态 Success → 建议 st=`done`

- **5 satellites**（`kinetica-1-5-satellites-3`）
  - 服务商：CAS Space → 建议 ty=`商发`
  - 建议 id：`m-m7-?`（需人工定序号）
  - 日期 s/e：`2026-07-24` / `2026-07-24`，时刻：`07:33`
  - 火箭 rkKey：`lz1`（力箭一号）
  - 载荷 pl：`5 satellites ×5`
  - 卫星数 satCount：`5`（API 正则抓取，务必核实）
  - 运营方 opKey：`intl`，分类 cat：`other`
  - LL 状态 Success → 建议 st=`done`

- **Tianlian 2-06**（`long-march-3be-tianlian-2-06`）
  - 服务商：China Aerospace Science and Technology Corporation → 建议 ty=`国发`
  - 建议 id：`m-m7-?`（需人工定序号）
  - 日期 s/e：`2026-07-23` / `2026-07-23`，时刻：`20:00`
  - 火箭 rkKey：`cz3b`（长征三号乙）
  - 载荷 pl：`Tianlian 2-06`
  - 卫星数 satCount：`0`（API 正则抓取，务必核实）
  - 运营方 opKey：`intl`，分类 cat：`other`
  - LL 状态 Success → 建议 st=`done`

- **9 satellites**（`gravity-1-9-satellites`）
  - 服务商：Orienspace Technology → 建议 ty=`商发`
  - 建议 id：`m-m7-?`（需人工定序号）
  - 日期 s/e：`2026-07-22` / `2026-07-22`，时刻：`10:54`
  - 火箭 rkKey：`yyl1`（引力一号）
  - 载荷 pl：`9 satellites ×9`
  - 卫星数 satCount：`9`（API 正则抓取，务必核实）
  - 运营方 opKey：`intl`，分类 cat：`other`
  - LL 状态 Success → 建议 st=`done`

- **Demo Flight**（`long-march-10b-demo-flight`）
  - 服务商：China Aerospace Science and Technology Corporation → 建议 ty=`国发`
  - 建议 id：`m-m7-?`（需人工定序号）
  - 日期 s/e：`2026-07-10` / `2026-07-10`，时刻：`12:15`
  - 火箭 rkKey：`未收录，需补 glossary`（Long March 10B）
  - 载荷 pl：`Demo Flight`
  - 卫星数 satCount：`0`（API 正则抓取，务必核实）
  - 运营方 opKey：`intl`，分类 cat：`other`
  - LL 状态 Success → 建议 st=`done`

- **SpaceSail Polar Group #14**（`long-march-8a-spacesail-polar-group-14`）
  - 服务商：China Aerospace Science and Technology Corporation → 建议 ty=`国发`
  - 建议 id：`m-m7-?`（需人工定序号）
  - 日期 s/e：`2026-07-05` / `2026-07-05`，时刻：`21:43`
  - 火箭 rkKey：`cz8a`（长征八号甲/改进型）
  - 载荷 pl：`SpaceSail Polar Group #14`
  - 卫星数 satCount：`0`（API 正则抓取，务必核实）
  - 运营方 opKey：`intl`，分类 cat：`other`
  - LL 状态 Success → 建议 st=`done`

- **SpaceSail Polar Group #13**（`long-march-6a-spacesail-polar-group-13`）
  - 服务商：China Aerospace Science and Technology Corporation → 建议 ty=`国发`
  - 建议 id：`m-m7-?`（需人工定序号）
  - 日期 s/e：`2026-07-04` / `2026-07-04`，时刻：`17:30`
  - 火箭 rkKey：`cz6a`（长征六号改/甲）
  - 载荷 pl：`SpaceSail Polar Group #13`
  - 卫星数 satCount：`0`（API 正则抓取，务必核实）
  - 运营方 opKey：`intl`，分类 cat：`other`
  - LL 状态 Success → 建议 st=`done`

- **Haiyang 2E**（`long-march-4b-haiyang-2e`）
  - 服务商：China Aerospace Science and Technology Corporation → 建议 ty=`国发`
  - 建议 id：`m-m7-?`（需人工定序号）
  - 日期 s/e：`2026-07-02` / `2026-07-02`，时刻：`07:46`
  - 火箭 rkKey：`cz4b`（长征四号乙）
  - 载荷 pl：`Haiyang 2E`
  - 卫星数 satCount：`0`（API 正则抓取，务必核实）
  - 运营方 opKey：`intl`，分类 cat：`other`
  - LL 状态 Success → 建议 st=`done`

- **TJSW-26A**（`long-march-7a-tjsw-26a`）
  - 服务商：China Aerospace Science and Technology Corporation → 建议 ty=`国发`
  - 建议 id：`m-m6-?`（需人工定序号）
  - 日期 s/e：`2026-06-23` / `2026-06-23`，时刻：`10:10`
  - 火箭 rkKey：`cz7a`（长征七号甲）
  - 载荷 pl：`TJSW-26A`
  - 卫星数 satCount：`0`（API 正则抓取，务必核实）
  - 运营方 opKey：`intl`，分类 cat：`other`
  - LL 状态 Success → 建议 st=`done`

- **CentiSpace-1 Group 05**（`kuaizhou-11-centispace-1-group-05`）
  - 服务商：ExPace → 建议 ty=`商发`
  - 建议 id：`m-m6-?`（需人工定序号）
  - 日期 s/e：`2026-06-17` / `2026-06-17`，时刻：`11:58`
  - 火箭 rkKey：`kz11`（快舟十一号）
  - 载荷 pl：`CentiSpace-1 Group 05 ×160`
  - 卫星数 satCount：`160`（API 正则抓取，务必核实）
  - 运营方 opKey：`intl`，分类 cat：`other`
  - LL 状态 Success → 建议 st=`done`

- **SatNet LEO Group 22**（`long-march-12-satnet-leo-group-22`）
  - 服务商：China Aerospace Science and Technology Corporation → 建议 ty=`国发`
  - 建议 id：`m-m6-?`（需人工定序号）
  - 日期 s/e：`2026-06-17` / `2026-06-17`，时刻：`10:44`
  - 火箭 rkKey：`cz12`（长征十二号）
  - 载荷 pl：`SatNet LEO Group 22`
  - 卫星数 satCount：`0`（API 正则抓取，务必核实）
  - 运营方 opKey：`intl`，分类 cat：`other`
  - LL 状态 Success → 建议 st=`done`

- **Shijian 31**（`long-march-3be-shijian-31`）
  - 服务商：China Aerospace Science and Technology Corporation → 建议 ty=`国发`
  - 建议 id：`m-m6-?`（需人工定序号）
  - 日期 s/e：`2026-06-16` / `2026-06-16`，时刻：`17:45`
  - 火箭 rkKey：`cz3b`（长征三号乙）
  - 载荷 pl：`Shijian 31`
  - 卫星数 satCount：`0`（API 正则抓取，务必核实）
  - 运营方 opKey：`intl`，分类 cat：`other`
  - LL 状态 Success → 建议 st=`done`

- **8 x Jilin-1**（`kinetica-1-8-x-jilin-1-2`）
  - 服务商：CAS Space → 建议 ty=`商发`
  - 建议 id：`m-m6-?`（需人工定序号）
  - 日期 s/e：`2026-06-15` / `2026-06-15`，时刻：`11:44`
  - 火箭 rkKey：`lz1`（力箭一号）
  - 载荷 pl：`8 x Jilin-1`
  - 卫星数 satCount：`0`（API 正则抓取，务必核实）
  - 运营方 opKey：`intl`，分类 cat：`other`
  - LL 状态 Success → 建议 st=`done`

- **TJSW-25**（`long-march-5-tjsw-25`）
  - 服务商：China Aerospace Science and Technology Corporation → 建议 ty=`国发`
  - 建议 id：`m-m6-?`（需人工定序号）
  - 日期 s/e：`2026-06-11` / `2026-06-11`，时刻：`15:30`
  - 火箭 rkKey：`cz5`（长征五号）
  - 载荷 pl：`TJSW-25`
  - 卫星数 satCount：`0`（API 正则抓取，务必核实）
  - 运营方 opKey：`intl`，分类 cat：`other`
  - LL 状态 Success → 建议 st=`done`

- **2 x SatNet DTC test satellites**（`zhuque-2e-block-2-2-x-satnet-dtc-test-satellites`）
  - 服务商：LandSpace → 建议 ty=`商发`
  - 建议 id：`m-m6-?`（需人工定序号）
  - 日期 s/e：`2026-06-09` / `2026-06-09`，时刻：`16:23`
  - 火箭 rkKey：`未收录，需补 glossary`（Zhuque-2E Block 2）
  - 载荷 pl：`2 x SatNet DTC test satellites`
  - 卫星数 satCount：`0`（API 正则抓取，务必核实）
  - 运营方 opKey：`intl`，分类 cat：`other`
  - LL 状态 Success → 建议 st=`done`

- **SpaceSail Polar Group #12**（`long-march-8-spacesail-polar-group-12`）
  - 服务商：China Aerospace Science and Technology Corporation → 建议 ty=`国发`
  - 建议 id：`m-m6-?`（需人工定序号）
  - 日期 s/e：`2026-06-05` / `2026-06-05`，时刻：`14:34`
  - 火箭 rkKey：`cz8`（长征八号）
  - 载荷 pl：`SpaceSail Polar Group #12`
  - 卫星数 satCount：`0`（API 正则抓取，务必核实）
  - 运营方 opKey：`intl`，分类 cat：`other`
  - LL 状态 Success → 建议 st=`done`

- **SpaceSail Polar Group #11**（`long-march-6a-spacesail-polar-group-11`）
  - 服务商：China Aerospace Science and Technology Corporation → 建议 ty=`国发`
  - 建议 id：`m-m6-?`（需人工定序号）
  - 日期 s/e：`2026-06-04` / `2026-06-04`，时刻：`19:39`
  - 火箭 rkKey：`cz6a`（长征六号改/甲）
  - 载荷 pl：`SpaceSail Polar Group #11`
  - 卫星数 satCount：`0`（API 正则抓取，务必核实）
  - 运营方 opKey：`intl`，分类 cat：`other`
  - LL 状态 Success → 建议 st=`done`

- **Demo Flight (SpaceSail Polar Group #10)**（`long-march-12b-demo-flight-spacesail-polar-group-1`）
  - 服务商：China Aerospace Science and Technology Corporation → 建议 ty=`国发`
  - 建议 id：`m-m6-?`（需人工定序号）
  - 日期 s/e：`2026-06-01` / `2026-06-01`，时刻：`16:40`
  - 火箭 rkKey：`cz12b`（长征十二号乙）
  - 载荷 pl：`Demo Flight (SpaceSail Polar Group #10)`
  - 卫星数 satCount：`0`（API 正则抓取，务必核实）
  - 运营方 opKey：`intl`，分类 cat：`other`
  - LL 状态 Success → 建议 st=`done`

- **4 x SatNet test satellites**（`long-march-2d-4-x-satnet-test-satellites-3`）
  - 服务商：China Aerospace Science and Technology Corporation → 建议 ty=`国发`
  - 建议 id：`m-m5-?`（需人工定序号）
  - 日期 s/e：`2026-05-31` / `2026-05-31`，时刻：`02:07`
  - 火箭 rkKey：`cz2d`（长征二号丁）
  - 载荷 pl：`4 x SatNet test satellites`
  - 卫星数 satCount：`0`（API 正则抓取，务必核实）
  - 运营方 opKey：`intl`，分类 cat：`other`
  - LL 状态 Success → 建议 st=`done`

- **TJSW-24**（`long-march-7a-tjsw-24`）
  - 服务商：China Aerospace Science and Technology Corporation → 建议 ty=`国发`
  - 建议 id：`m-m5-?`（需人工定序号）
  - 日期 s/e：`2026-05-27` / `2026-05-27`，时刻：`00:16`
  - 火箭 rkKey：`cz7a`（长征七号甲）
  - 载荷 pl：`TJSW-24`
  - 卫星数 satCount：`0`（API 正则抓取，务必核实）
  - 运营方 opKey：`intl`，分类 cat：`other`
  - LL 状态 Success → 建议 st=`done`

- **Shenzhou 23**（`long-march-2fg-shenzhou-23`）
  - 服务商：China Aerospace Science and Technology Corporation → 建议 ty=`国发`
  - 建议 id：`m-m5-?`（需人工定序号）
  - 日期 s/e：`2026-05-24` / `2026-05-24`，时刻：`23:08`
  - 火箭 rkKey：`cz2f`（长征二号F）
  - 载荷 pl：`Shenzhou 23`
  - 卫星数 satCount：`0`（API 正则抓取，务必核实）
  - 运营方 opKey：`intl`，分类 cat：`other`
  - LL 状态 Success → 建议 st=`done`

- **SpaceSail Polar Group #9**（`long-march-8-spacesail-polar-group-9`）
  - 服务商：China Aerospace Science and Technology Corporation → 建议 ty=`国发`
  - 建议 id：`m-m5-?`（需人工定序号）
  - 日期 s/e：`2026-05-17` / `2026-05-17`，时刻：`22:42`
  - 火箭 rkKey：`cz8`（长征八号）
  - 载荷 pl：`SpaceSail Polar Group #9`
  - 卫星数 satCount：`0`（API 正则抓取，务必核实）
  - 运营方 opKey：`intl`，分类 cat：`other`
  - LL 状态 Success → 建议 st=`done`

- **5 satellites**（`kinetica-1-5-satellites-2`）
  - 服务商：CAS Space → 建议 ty=`商发`
  - 建议 id：`m-m5-?`（需人工定序号）
  - 日期 s/e：`2026-05-15` / `2026-05-15`，时刻：`12:33`
  - 火箭 rkKey：`lz1`（力箭一号）
  - 载荷 pl：`5 satellites ×5`
  - 卫星数 satCount：`5`（API 正则抓取，务必核实）
  - 运营方 opKey：`intl`，分类 cat：`other`
  - LL 状态 Success → 建议 st=`done`

- **Mass Simulator**（`zhuque-2e-block-2-mass-simulator`）
  - 服务商：LandSpace → 建议 ty=`商发`
  - 建议 id：`m-m5-?`（需人工定序号）
  - 日期 s/e：`2026-05-14` / `2026-05-14`，时刻：`11:00`
  - 火箭 rkKey：`未收录，需补 glossary`（Zhuque-2E Block 2）
  - 载荷 pl：`Mass Simulator`
  - 卫星数 satCount：`0`（API 正则抓取，务必核实）
  - 运营方 opKey：`intl`，分类 cat：`other`
  - LL 状态 Success → 建议 st=`done`

- **SpaceSail Polar Group #8**（`long-march-6a-spacesail-polar-group-8`）
  - 服务商：China Aerospace Science and Technology Corporation → 建议 ty=`国发`
  - 建议 id：`m-m5-?`（需人工定序号）
  - 日期 s/e：`2026-05-12` / `2026-05-12`，时刻：`19:59`
  - 火箭 rkKey：`cz6a`（长征六号改/甲）
  - 载荷 pl：`SpaceSail Polar Group #8`
  - 卫星数 satCount：`0`（API 正则抓取，务必核实）
  - 运营方 opKey：`intl`，分类 cat：`other`
  - LL 状态 Success → 建议 st=`done`

- **Tianzhou-10**（`long-march-7-tianzhou-10`）
  - 服务商：China Aerospace Science and Technology Corporation → 建议 ty=`国发`
  - 建议 id：`m-m5-?`（需人工定序号）
  - 日期 s/e：`2026-05-11` / `2026-05-11`，时刻：`08:14`
  - 火箭 rkKey：`cz7`（长征七号）
  - 载荷 pl：`Tianzhou-10`
  - 卫星数 satCount：`0`（API 正则抓取，务必核实）
  - 运营方 opKey：`intl`，分类 cat：`other`
  - LL 状态 Success → 建议 st=`done`

- **PRSC-EO3**（`long-march-6-prsc-eo3`）
  - 服务商：China Aerospace Science and Technology Corporation → 建议 ty=`国发`
  - 建议 id：`m-m4-?`（需人工定序号）
  - 日期 s/e：`2026-04-25` / `2026-04-25`，时刻：`20:15`
  - 火箭 rkKey：`cz6`（长征六号）
  - 载荷 pl：`PRSC-EO3`
  - 卫星数 satCount：`0`（API 正则抓取，务必核实）
  - 运营方 opKey：`intl`，分类 cat：`other`
  - LL 状态 Success → 建议 st=`done`

- **4 x SatNet test satellites**（`long-march-2d-4-x-satnet-test-satellites-2`）
  - 服务商：China Aerospace Science and Technology Corporation → 建议 ty=`国发`
  - 建议 id：`m-m4-?`（需人工定序号）
  - 日期 s/e：`2026-04-24` / `2026-04-24`，时刻：`14:35`
  - 火箭 rkKey：`cz2d`（长征二号丁）
  - 载荷 pl：`4 x SatNet test satellites`
  - 卫星数 satCount：`0`（API 正则抓取，务必核实）
  - 运营方 opKey：`intl`，分类 cat：`other`
  - LL 状态 Success → 建议 st=`done`

- **Daqi-2 (AEMS)**（`long-march-4c-daqi-2-aems`）
  - 服务商：China Aerospace Science and Technology Corporation → 建议 ty=`国发`
  - 建议 id：`m-m4-?`（需人工定序号）
  - 日期 s/e：`2026-04-17` / `2026-04-17`，时刻：`12:10`
  - 火箭 rkKey：`cz4c`（长征四号丙）
  - 载荷 pl：`Daqi-2 (AEMS)`
  - 卫星数 satCount：`0`（API 正则抓取，务必核实）
  - 运营方 opKey：`intl`，分类 cat：`other`
  - LL 状态 Success → 建议 st=`done`

- **8 x Jilin-1**（`kinetica-1-8-x-jilin-1`）
  - 服务商：CAS Space → 建议 ty=`商发`
  - 建议 id：`m-m4-?`（需人工定序号）
  - 日期 s/e：`2026-04-14` / `2026-04-14`，时刻：`12:03`
  - 火箭 rkKey：`lz1`（力箭一号）
  - 载荷 pl：`8 x Jilin-1`
  - 卫星数 satCount：`0`（API 正则抓取，务必核实）
  - 运营方 opKey：`intl`，分类 cat：`other`
  - LL 状态 Success → 建议 st=`done`

- **SatNet test satellite**（`smart-dragon-3-satnet-test-satellite-2`）
  - 服务商：China Rocket Co. Ltd. → 建议 ty=`国发`
  - 建议 id：`m-m4-?`（需人工定序号）
  - 日期 s/e：`2026-04-11` / `2026-04-11`，时刻：`19:32`
  - 火箭 rkKey：`jl3`（捷龙三号）
  - 载荷 pl：`SatNet test satellite`
  - 卫星数 satCount：`0`（API 正则抓取，务必核实）
  - 运营方 opKey：`intl`，分类 cat：`other`
  - LL 状态 Success → 建议 st=`done`

- **SatNet LEO Group 21**（`long-march-6a-satnet-leo-group-21`）
  - 服务商：China Aerospace Science and Technology Corporation → 建议 ty=`国发`
  - 建议 id：`m-m4-?`（需人工定序号）
  - 日期 s/e：`2026-04-09` / `2026-04-09`，时刻：`03:38`
  - 火箭 rkKey：`cz6a`（长征六号改/甲）
  - 载荷 pl：`SatNet LEO Group 21`
  - 卫星数 satCount：`0`（API 正则抓取，务必核实）
  - 运营方 opKey：`intl`，分类 cat：`other`
  - LL 状态 Success → 建议 st=`done`

- **SpaceSail Polar Group #7**（`long-march-8-spacesail-polar-group-7`）
  - 服务商：China Aerospace Science and Technology Corporation → 建议 ty=`国发`
  - 建议 id：`m-m4-?`（需人工定序号）
  - 日期 s/e：`2026-04-07` / `2026-04-07`，时刻：`21:32`
  - 火箭 rkKey：`cz8`（长征八号）
  - 载荷 pl：`SpaceSail Polar Group #7`
  - 卫星数 satCount：`0`（API 正则抓取，务必核实）
  - 运营方 opKey：`intl`，分类 cat：`other`
  - LL 状态 Success → 建议 st=`done`

- **Demo Flight**（`tianlong-3-demo-flight`）
  - 服务商：Space Pioneer → 建议 ty=`商发`
  - 建议 id：`m-m4-?`（需人工定序号）
  - 日期 s/e：`2026-04-03` / `2026-04-03`，时刻：`12:17`
  - 火箭 rkKey：`未收录，需补 glossary`（Tianlong-3）
  - 载荷 pl：`Demo Flight`
  - 卫星数 satCount：`0`（API 正则抓取，务必核实）
  - 运营方 opKey：`intl`，分类 cat：`other`
  - LL 状态 Failure → 建议 st=`fail`

- **Demo Flight (Qingzhou Prototype Spacecraft)**（`kinetica-2-demo-flight-qingzhou-prototype-spacecra`）
  - 服务商：CAS Space → 建议 ty=`商发`
  - 建议 id：`m-m3-?`（需人工定序号）
  - 日期 s/e：`2026-03-30` / `2026-03-30`，时刻：`19:00`
  - 火箭 rkKey：`lz2`（力箭二号）
  - 载荷 pl：`Demo Flight (Qingzhou Prototype Spacecraft) ×3`
  - 卫星数 satCount：`3`（API 正则抓取，务必核实）
  - 运营方 opKey：`intl`，分类 cat：`other`
  - LL 状态 Success → 建议 st=`done`

- **Shiyan 33**（`long-march-2cyz-1s-shiyan-33`）
  - 服务商：China Aerospace Science and Technology Corporation → 建议 ty=`国发`
  - 建议 id：`m-m3-?`（需人工定序号）
  - 日期 s/e：`2026-03-27` / `2026-03-27`，时刻：`12:11`
  - 火箭 rkKey：`未收录，需补 glossary`（Long March 2C/YZ-1S）
  - 载荷 pl：`Shiyan 33`
  - 卫星数 satCount：`0`（API 正则抓取，务必核实）
  - 运营方 opKey：`intl`，分类 cat：`other`
  - LL 状态 Success → 建议 st=`done`

- **SuperView Neo 2-05 & 06**（`long-march-2d-superview-neo-2-05-06`）
  - 服务商：China Aerospace Science and Technology Corporation → 建议 ty=`国发`
  - 建议 id：`m-m3-?`（需人工定序号）
  - 日期 s/e：`2026-03-26` / `2026-03-26`，时刻：`06:51`
  - 火箭 rkKey：`cz2d`（长征二号丁）
  - 载荷 pl：`SuperView Neo 2-05 & 06`
  - 卫星数 satCount：`0`（API 正则抓取，务必核实）
  - 运营方 opKey：`intl`，分类 cat：`other`
  - LL 状态 Success → 建议 st=`done`

- **10 x CentiSpace-1**（`smart-dragon-3-10-x-centispace-1-2`）
  - 服务商：China Rocket Co. Ltd. → 建议 ty=`国发`
  - 建议 id：`m-m3-?`（需人工定序号）
  - 日期 s/e：`2026-03-22` / `2026-03-22`，时刻：`23:49`
  - 火箭 rkKey：`jl3`（捷龙三号）
  - 载荷 pl：`10 x CentiSpace-1 ×160`
  - 卫星数 satCount：`160`（API 正则抓取，务必核实）
  - 运营方 opKey：`intl`，分类 cat：`other`
  - LL 状态 Success → 建议 st=`done`

- **8 satellites**（`kuaizhou-11-8-satellites`）
  - 服务商：ExPace → 建议 ty=`商发`
  - 建议 id：`m-m3-?`（需人工定序号）
  - 日期 s/e：`2026-03-16` / `2026-03-16`，时刻：`12:12`
  - 火箭 rkKey：`kz11`（快舟十一号）
  - 载荷 pl：`8 satellites ×8`
  - 卫星数 satCount：`8`（API 正则抓取，务必核实）
  - 运营方 opKey：`intl`，分类 cat：`other`
  - LL 状态 Success → 建议 st=`done`

- **Yaogan 50-02**（`long-march-6a-yaogan-50-02`）
  - 服务商：China Aerospace Science and Technology Corporation → 建议 ty=`国发`
  - 建议 id：`m-m3-?`（需人工定序号）
  - 日期 s/e：`2026-03-15` / `2026-03-15`，时刻：`21:22`
  - 火箭 rkKey：`cz6a`（长征六号改/甲）
  - 载荷 pl：`Yaogan 50-02`
  - 卫星数 satCount：`0`（API 正则抓取，务必核实）
  - 运营方 opKey：`intl`，分类 cat：`other`
  - LL 状态 Success → 建议 st=`done`

- **Shiyan 30 03-04**（`long-march-2d-shiyan-30-03-04`）
  - 服务商：China Aerospace Science and Technology Corporation → 建议 ty=`国发`
  - 建议 id：`m-m3-?`（需人工定序号）
  - 日期 s/e：`2026-03-13` / `2026-03-13`，时刻：`06:33`
  - 火箭 rkKey：`cz2d`（长征二号丁）
  - 载荷 pl：`Shiyan 30 03-04`
  - 卫星数 satCount：`0`（API 正则抓取，务必核实）
  - 运营方 opKey：`intl`，分类 cat：`other`
  - LL 状态 Success → 建议 st=`done`

- **SatNet LEO Group 20**（`long-march-8a-satnet-leo-group-20`）
  - 服务商：China Aerospace Science and Technology Corporation → 建议 ty=`国发`
  - 建议 id：`m-m3-?`（需人工定序号）
  - 日期 s/e：`2026-03-13` / `2026-03-13`，时刻：`03:48`
  - 火箭 rkKey：`cz8a`（长征八号甲/改进型）
  - 载荷 pl：`SatNet LEO Group 20`
  - 卫星数 satCount：`0`（API 正则抓取，务必核实）
  - 运营方 opKey：`intl`，分类 cat：`other`
  - LL 状态 Success → 建议 st=`done`

- **PRSC-EO2 & 6 satellites**（`smart-dragon-3-prsc-eo2-6-satellites`）
  - 服务商：China Rocket Co. Ltd. → 建议 ty=`国发`
  - 建议 id：`m-m2-?`（需人工定序号）
  - 日期 s/e：`2026-02-12` / `2026-02-12`，时刻：`14:37`
  - 火箭 rkKey：`jl3`（捷龙三号）
  - 载荷 pl：`PRSC-EO2 & 6 satellites ×6`
  - 卫星数 satCount：`6`（API 正则抓取，务必核实）
  - 运营方 opKey：`intl`，分类 cat：`other`
  - LL 状态 Success → 建议 st=`done`

- **Chinese Reusable Space Vehicle**（`long-march-2fg-chinese-reusable-space-vehicle-4`）
  - 服务商：China Aerospace Science and Technology Corporation → 建议 ty=`国发`
  - 建议 id：`m-m2-?`（需人工定序号）
  - 日期 s/e：`2026-02-07` / `2026-02-07`，时刻：`11:58`
  - 火箭 rkKey：`cz2f`（长征二号F）
  - 载荷 pl：`Chinese Reusable Space Vehicle`
  - 卫星数 satCount：`0`（API 正则抓取，务必核实）
  - 运营方 opKey：`intl`，分类 cat：`other`
  - LL 状态 Success → 建议 st=`done`

- **AlSat 3B**（`long-march-2c-alsat-3b`）
  - 服务商：China Aerospace Science and Technology Corporation → 建议 ty=`国发`
  - 建议 id：`m-m1-?`（需人工定序号）
  - 日期 s/e：`2026-01-31` / `2026-01-31`，时刻：`12:01`
  - 火箭 rkKey：`cz2c`（长征二号丙）
  - 载荷 pl：`AlSat 3B`
  - 卫星数 satCount：`0`（API 正则抓取，务必核实）
  - 运营方 opKey：`intl`，分类 cat：`other`
  - LL 状态 Success → 建议 st=`done`

- **SatNet LEO Group 19**（`long-march-12-satnet-leo-group-19`）
  - 服务商：China Aerospace Science and Technology Corporation → 建议 ty=`国发`
  - 建议 id：`m-m1-?`（需人工定序号）
  - 日期 s/e：`2026-01-19` / `2026-01-19`，时刻：`15:48`
  - 火箭 rkKey：`cz12`（长征十二号）
  - 载荷 pl：`SatNet LEO Group 19`
  - 卫星数 satCount：`0`（API 正则抓取，务必核实）
  - 运营方 opKey：`intl`，分类 cat：`other`
  - LL 状态 Success → 建议 st=`done`

- **Demo Flight**（`ceres-2-demo-flight`）
  - 服务商：Galactic Energy → 建议 ty=`商发`
  - 建议 id：`m-m1-?`（需人工定序号）
  - 日期 s/e：`2026-01-17` / `2026-01-17`，时刻：`12:08`
  - 火箭 rkKey：`gsc2`（谷神星二号）
  - 载荷 pl：`Demo Flight`
  - 卫星数 satCount：`0`（API 正则抓取，务必核实）
  - 运营方 opKey：`intl`，分类 cat：`other`
  - LL 状态 Failure → 建议 st=`fail`

- **Shijian 32**（`long-march-3be-shijian-32`）
  - 服务商：China Aerospace Science and Technology Corporation → 建议 ty=`国发`
  - 建议 id：`m-m1-?`（需人工定序号）
  - 日期 s/e：`2026-01-17` / `2026-01-17`，时刻：`00:55`
  - 火箭 rkKey：`cz3b`（长征三号乙）
  - 载荷 pl：`Shijian 32`
  - 卫星数 satCount：`0`（API 正则抓取，务必核实）
  - 运营方 opKey：`intl`，分类 cat：`other`
  - LL 状态 Failure → 建议 st=`fail`

- **Tianqi 37-40**（`ceres-1s-tianqi-37-40`）
  - 服务商：Galactic Energy → 建议 ty=`商发`
  - 建议 id：`m-m1-?`（需人工定序号）
  - 日期 s/e：`2026-01-16` / `2026-01-16`，时刻：`04:10`
  - 火箭 rkKey：`未收录，需补 glossary`（Ceres-1S）
  - 载荷 pl：`Tianqi 37-40`
  - 卫星数 satCount：`0`（API 正则抓取，务必核实）
  - 运营方 opKey：`intl`，分类 cat：`other`
  - LL 状态 Success → 建议 st=`done`

- **AlSat 3A**（`long-march-2c-alsat-3a`）
  - 服务商：China Aerospace Science and Technology Corporation → 建议 ty=`国发`
  - 建议 id：`m-m1-?`（需人工定序号）
  - 日期 s/e：`2026-01-15` / `2026-01-15`，时刻：`12:01`
  - 火箭 rkKey：`cz2c`（长征二号丙）
  - 载荷 pl：`AlSat 3A`
  - 卫星数 satCount：`0`（API 正则抓取，务必核实）
  - 运营方 opKey：`intl`，分类 cat：`other`
  - LL 状态 Success → 建议 st=`done`

- **SatNet LEO Group 18**（`long-march-8a-satnet-leo-group-18`）
  - 服务商：China Aerospace Science and Technology Corporation → 建议 ty=`国发`
  - 建议 id：`m-m1-?`（需人工定序号）
  - 日期 s/e：`2026-01-13` / `2026-01-13`，时刻：`23:25`
  - 火箭 rkKey：`cz8a`（长征八号甲/改进型）
  - 载荷 pl：`SatNet LEO Group 18`
  - 卫星数 satCount：`0`（API 正则抓取，务必核实）
  - 运营方 opKey：`intl`，分类 cat：`other`
  - LL 状态 Success → 建议 st=`done`

- **Yaogan 50-01**（`long-march-6a-yaogan-50-01`）
  - 服务商：China Aerospace Science and Technology Corporation → 建议 ty=`国发`
  - 建议 id：`m-m1-?`（需人工定序号）
  - 日期 s/e：`2026-01-13` / `2026-01-13`，时刻：`22:16`
  - 火箭 rkKey：`cz6a`（长征六号改/甲）
  - 载荷 pl：`Yaogan 50-01`
  - 卫星数 satCount：`0`（API 正则抓取，务必核实）
  - 运营方 opKey：`intl`，分类 cat：`other`
  - LL 状态 Success → 建议 st=`done`

- **Shijian 29 A-B**（`long-march-7a-shijian-29-a-b`）
  - 服务商：China Aerospace Science and Technology Corporation → 建议 ty=`国发`
  - 建议 id：`m-m12-?`（需人工定序号）
  - 日期 s/e：`2025-12-31` / `2025-12-31`，时刻：`06:40`
  - 火箭 rkKey：`cz7a`（长征七号甲）
  - 载荷 pl：`Shijian 29 A-B ×2`
  - 卫星数 satCount：`2`（API 正则抓取，务必核实）
  - 运营方 opKey：`intl`，分类 cat：`other`
  - LL 状态 Success → 建议 st=`done`

- **Tianhui 7**（`long-march-4b-tianhui-7`）
  - 服务商：China Aerospace Science and Technology Corporation → 建议 ty=`国发`
  - 建议 id：`m-m12-?`（需人工定序号）
  - 日期 s/e：`2025-12-30` / `2025-12-30`，时刻：`12:12`
  - 火箭 rkKey：`cz4b`（长征四号乙）
  - 载荷 pl：`Tianhui 7`
  - 卫星数 satCount：`0`（API 正则抓取，务必核实）
  - 运营方 opKey：`intl`，分类 cat：`other`
  - LL 状态 Success → 建议 st=`done`

- **Fengyun-4C**（`long-march-3be-fengyun-4c`）
  - 服务商：China Aerospace Science and Technology Corporation → 建议 ty=`国发`
  - 建议 id：`m-m12-?`（需人工定序号）
  - 日期 s/e：`2025-12-27` / `2025-12-27`，时刻：`00:07`
  - 火箭 rkKey：`cz3b`（长征三号乙）
  - 载荷 pl：`Fengyun-4C`
  - 卫星数 satCount：`0`（API 正则抓取，务必核实）
  - 运营方 opKey：`intl`，分类 cat：`other`
  - LL 状态 Success → 建议 st=`done`

- **SatNet LEO Group 17**（`long-march-8a-satnet-leo-group-17`）
  - 服务商：China Aerospace Science and Technology Corporation → 建议 ty=`国发`
  - 建议 id：`m-m12-?`（需人工定序号）
  - 日期 s/e：`2025-12-26` / `2025-12-26`，时刻：`07:26`
  - 火箭 rkKey：`cz8a`（长征八号甲/改进型）
  - 载荷 pl：`SatNet LEO Group 17`
  - 卫星数 satCount：`0`（API 正则抓取，务必核实）
  - 运营方 opKey：`intl`，分类 cat：`other`
  - LL 状态 Success → 建议 st=`done`

- **Demo Flight**（`long-march-12a-demo-flight`）
  - 服务商：China Aerospace Science and Technology Corporation → 建议 ty=`国发`
  - 建议 id：`m-m12-?`（需人工定序号）
  - 日期 s/e：`2025-12-23` / `2025-12-23`，时刻：`10:00`
  - 火箭 rkKey：`cz12a`（长征十二号甲）
  - 载荷 pl：`Demo Flight`
  - 卫星数 satCount：`0`（API 正则抓取，务必核实）
  - 运营方 opKey：`intl`，分类 cat：`other`
  - LL 状态 Success → 建议 st=`done`

- **TJSW-23**（`long-march-5-tjsw-23`）
  - 服务商：China Aerospace Science and Technology Corporation → 建议 ty=`国发`
  - 建议 id：`m-m12-?`（需人工定序号）
  - 日期 s/e：`2025-12-20` / `2025-12-20`，时刻：`20:30`
  - 火箭 rkKey：`cz5`（长征五号）
  - 载荷 pl：`TJSW-23`
  - 卫星数 satCount：`0`（API 正则抓取，务必核实）
  - 运营方 opKey：`intl`，分类 cat：`other`
  - LL 状态 Success → 建议 st=`done`

- **Ziyuan-3-04**（`long-march-4b-ziyuan-3-04`）
  - 服务商：China Aerospace Science and Technology Corporation → 建议 ty=`国发`
  - 建议 id：`m-m12-?`（需人工定序号）
  - 日期 s/e：`2025-12-16` / `2025-12-16`，时刻：`11:17`
  - 火箭 rkKey：`cz4b`（长征四号乙）
  - 载荷 pl：`Ziyuan-3-04`
  - 卫星数 satCount：`0`（API 正则抓取，务必核实）
  - 运营方 opKey：`intl`，分类 cat：`other`
  - LL 状态 Success → 建议 st=`done`

- **DEAR-5**（`kuaizhou-11-dear-5`）
  - 服务商：ExPace → 建议 ty=`商发`
  - 建议 id：`m-m12-?`（需人工定序号）
  - 日期 s/e：`2025-12-13` / `2025-12-13`，时刻：`09:08`
  - 火箭 rkKey：`kz11`（快舟十一号）
  - 载荷 pl：`DEAR-5`
  - 卫星数 satCount：`0`（API 正则抓取，务必核实）
  - 运营方 opKey：`intl`，分类 cat：`other`
  - LL 状态 Success → 建议 st=`done`

- **SatNet LEO Group 16**（`long-march-12-satnet-leo-group-16`）
  - 服务商：China Aerospace Science and Technology Corporation → 建议 ty=`国发`
  - 建议 id：`m-m12-?`（需人工定序号）
  - 日期 s/e：`2025-12-12` / `2025-12-12`，时刻：`07:00`
  - 火箭 rkKey：`cz12`（长征十二号）
  - 载荷 pl：`SatNet LEO Group 16`
  - 卫星数 satCount：`0`（API 正则抓取，务必核实）
  - 运营方 opKey：`intl`，分类 cat：`other`
  - LL 状态 Success → 建议 st=`done`

- **9 satellites**（`kinetica-1-9-satellites`）
  - 服务商：CAS Space → 建议 ty=`商发`
  - 建议 id：`m-m12-?`（需人工定序号）
  - 日期 s/e：`2025-12-10` / `2025-12-10`，时刻：`12:03`
  - 火箭 rkKey：`lz1`（力箭一号）
  - 载荷 pl：`9 satellites ×9`
  - 卫星数 satCount：`9`（API 正则抓取，务必核实）
  - 运营方 opKey：`intl`，分类 cat：`other`
  - LL 状态 Success → 建议 st=`done`

- **TJSW-22**（`long-march-3be-tjsw-22`）
  - 服务商：China Aerospace Science and Technology Corporation → 建议 ty=`国发`
  - 建议 id：`m-m12-?`（需人工定序号）
  - 日期 s/e：`2025-12-09` / `2025-12-09`，时刻：`23:08`
  - 火箭 rkKey：`cz3b`（长征三号乙）
  - 载荷 pl：`TJSW-22`
  - 卫星数 satCount：`0`（API 正则抓取，务必核实）
  - 运营方 opKey：`intl`，分类 cat：`other`
  - LL 状态 Success → 建议 st=`done`

- **Yaogan 47**（`long-march-4b-yaogan-47`）
  - 服务商：China Aerospace Science and Technology Corporation → 建议 ty=`国发`
  - 建议 id：`m-m12-?`（需人工定序号）
  - 日期 s/e：`2025-12-09` / `2025-12-09`，时刻：`11:41`
  - 火箭 rkKey：`cz4b`（长征四号乙）
  - 载荷 pl：`Yaogan 47`
  - 卫星数 satCount：`0`（API 正则抓取，务必核实）
  - 运营方 opKey：`intl`，分类 cat：`other`
  - LL 状态 Success → 建议 st=`done`

- **SatNet LEO Group 15**（`long-march-6a-satnet-leo-group-15`）
  - 服务商：China Aerospace Science and Technology Corporation → 建议 ty=`国发`
  - 建议 id：`m-m12-?`（需人工定序号）
  - 日期 s/e：`2025-12-09` / `2025-12-09`，时刻：`06:11`
  - 火箭 rkKey：`cz6a`（长征六号改/甲）
  - 载荷 pl：`SatNet LEO Group 15`
  - 卫星数 satCount：`0`（API 正则抓取，务必核实）
  - 运营方 opKey：`intl`，分类 cat：`other`
  - LL 状态 Success → 建议 st=`done`

- **Unknown Payload**（`long-march-2d-unknown-payload`）
  - 服务商：China Aerospace Science and Technology Corporation → 建议 ty=`国发`
  - 建议 id：`m-m11-?`（需人工定序号）
  - 日期 s/e：`2026-11-11` / `2026-11-11`，时刻：`19:40`
  - 火箭 rkKey：`cz2d`（长征二号丁）
  - 载荷 pl：`Unknown Payload`
  - 卫星数 satCount：`0`（API 正则抓取，务必核实）
  - 运营方 opKey：`intl`，分类 cat：`other`
  - LL 状态 Go → 建议 st=`plan`

- **Unknown Payload**（`kuaizhou-11-unknown-payload`）
  - 服务商：ExPace → 建议 ty=`商发`
  - 建议 id：`m-m11-?`（需人工定序号）
  - 日期 s/e：`2026-11-13` / `2026-11-13`，时刻：`03:50`
  - 火箭 rkKey：`kz11`（快舟十一号）
  - 载荷 pl：`Unknown Payload`
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

- **SatNet LEO Group TBD?**（`long-march-12-satnet-leo-group-tbd`）
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
