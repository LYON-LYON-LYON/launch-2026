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
