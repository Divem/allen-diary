# 张小龙饭否日记

> 在线访问：<https://allen.yuanwen.xyz/>

一个用于阅读张小龙饭否内容的静态 Web 应用。项目将 `gzallen.md` 中 2010–2012 年间的 2,289 条饭否记录解析为结构化 JSON 数据，并提供每日一条、连续卡片阅读、全文搜索、标签筛选和分享卡片等移动端友好的阅读体验。

## 目录

- [功能特性](#功能特性)
- [技术栈](#技术栈)
- [项目结构](#项目结构)
- [本地开发](#本地开发)
- [常用命令](#常用命令)
- [数据说明](#数据说明)
- [部署](#部署)
- [参与贡献](#参与贡献)
- [许可证](#许可证)

## 功能特性

- 每日推荐：每天稳定展示一条饭否记录，并支持随机切换。
- 连续阅读：以卡片形式浏览前后内容，支持触摸滑动、鼠标拖动和键盘方向键。
- 全量时间线：按月份和标签定位 2,289 条记录。
- 全文搜索：按内容、标签、日期、时间和附加信息检索。
- 分享卡片：将单条内容生成适合分享的视觉卡片。
- PWA 支持：包含 Web App Manifest、应用图标和移动端浏览优化。
- 深浅色主题：跟随系统主题，也可在应用中切换。
- 静态导出：构建产物输出到 `dist/`，适合部署到 GitHub Pages。

## 技术栈

- Next.js 15 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- next-themes
- html2canvas

## 项目结构

```text
.
├── gzallen.md                 # 原始饭否内容
├── scripts/parse.js           # 数据解析与自动标签脚本
├── src/app                    # Next.js 页面路由
│   ├── page.tsx               # 每日一条
│   ├── all/page.tsx           # 全部记录与筛选
│   ├── search/page.tsx        # 搜索
│   └── swipe/page.tsx         # 卡片连续阅读
├── src/components             # 阅读、移动端外壳、主题、分享组件
├── src/data                   # 解析生成的 JSON 数据
└── public                     # 图标等静态资源
```

## 本地开发

环境要求：

- Node.js 20 或更新版本
- npm

安装依赖：

```bash
npm install
```

启动开发服务器：

```bash
npm run dev
```

默认访问地址是 `http://localhost:3000`。

## 常用命令

```bash
# 启动开发服务器
npm run dev

# 生产构建并静态导出到 dist/
npm run build

# 从 gzallen.md 重新生成 src/data/*.json
npm run parse

# TypeScript 类型检查
npx tsc --noEmit
```

说明：当前 `npm run lint` 使用的是已废弃的 `next lint`，可能进入交互式 ESLint 初始化流程，不建议在自动化流程中使用。

## 数据说明

数据源是仓库根目录的 `gzallen.md`。运行 `npm run parse` 后会重新生成：

- `src/data/diary.json`：完整记录列表
- `src/data/diary-grouped.json`：按月份分组的记录
- `src/data/stats.json`：总数、年份范围、月份和标签统计

解析脚本会根据关键词和模式为记录自动添加标签，例如产品哲学、用户洞察、互联网思考、微信相关、读书笔记等。

## 部署

项目配置了 Next.js 静态导出：

```js
output: 'export'
distDir: 'dist'
```

推送到 `main` 分支后，GitHub Actions 会构建项目并将 `dist/` 发布到 GitHub Pages。也可以手动运行 `npm run build` 后，把 `dist/` 部署到任意静态托管服务。

## 参与贡献

欢迎提交 issue 或 pull request。比较适合贡献的方向包括：

- 改进移动端阅读体验
- 优化搜索、筛选和标签逻辑
- 完善数据解析规则
- 修复 PWA、主题或静态部署问题
- 补充测试和自动化检查

如果修改解析规则，请运行 `npm run parse` 并提交随之更新的 `src/data/*.json`。

## 许可证

仓库目前未包含许可证文件。复用代码或数据前，请先向项目维护者确认授权方式。
