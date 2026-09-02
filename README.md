# 2026年中国航天发射年度总览网站

覆盖全球（重点中国）的 2026 年航天发射日历与统计网站。

**在线访问**：GitHub Pages 部署后地址为 `https://<用户名>.github.io/<仓库名>/`

## 本地打开

双击 `2026年中国航天发射年度总览.html`（跳转存根）或 `index.html` 即可，纯静态、无需构建、无外部依赖。

> 浏览器要求：Chrome / Edge 111+（页面使用了 `color-mix` 等 CSS 特性）

## 仓库结构

```
index.html                                主页面（Pages 入口，规范名）
2026年中国航天发射年度总览.html             3 行跳转存根（保留本地双击旧入口）
data.js                                   数据层（EVENTS/ROCKETS/OPERATORS/VENDORS/MILESTONES…）
docs/                                     文档（PRD、设计方案、数据字典、运维手册）
scripts/                                  维护脚本（仅 Node 本地/CI 运行，不被浏览器加载）
  validate-data.js                        数据校验硬门禁（改动 data.js 后必跑）
.github/workflows/                        CI 流水线（数据自动同步，见 v8 设计方案 T3）
```

## 数据维护流程

1. 修改 `data.js`（新增事件 / 更新状态 / 回填计划）
2. 运行校验（需 Node 18+，零依赖）：

   ```
   node scripts/validate-data.js
   ```

3. 校验 **ALL PASS** 才允许提交；报告落盘 `validate-report.txt`（已 gitignore）
4. push 到 main → Pages 自动重新发布

## 字段规范

见 `docs/数据字典.md`。核心口径：

- `satCount` 仅计**实际成功入轨**的卫星数（失败/推迟为 0）
- `ty` 三轨：国发 / 商发 / 国外
- `st` 四态：done / fail / delay / plan
- done/fail 事件必须有 `src`（来源）∈ SOURCES

## 相关文档

- `PRD-2026年航天发射年度总览网站.md` — 产品需求
- `设计方案-v8数据更新与公网部署.md` — v8 演进设计（T1-T5 任务分解）
