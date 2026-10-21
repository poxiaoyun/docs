# Rune Docs — 项目维护手册 (SKILL.md)

本文档面向需要维护和扩展 `docs` 项目的开发者，覆盖项目架构、开发规范、内容编写指南和常见操作说明。

---

## 1. 项目概述

`docs` 是 Rune 平台的官方文档站：React SPA + 构建期预渲染（SSG），把 Markdown 渲染成静态页面，发布在 docs.poxiaoshi.cn。

| 项目          | 说明                                                                             |
| ------------- | -------------------------------------------------------------------------------- |
| 框架          | React 19 + TypeScript 5.8 + Vite 6                                               |
| UI 库         | MUI v7 (Material UI)                                                             |
| Markdown 渲染 | react-markdown + gray-matter + rehype/remark 插件                                |
| 预渲染        | 构建后跑 `scripts/ssg.mjs`，把每个页面渲染成静态 HTML + sitemap（含 hreflang）   |
| 包管理        | Yarn 1.22                                                                        |
| Node 版本     | >= 20                                                                            |
| 语言          | 中文（默认，站点根 `/`）、英文（`/en`）——**语言是 URL 的一部分**，不只是界面文案 |

### 常用命令

```bash
yarn dev        # 开发服务器（vite，8080 端口，host: true 即监听 0.0.0.0）
yarn build      # tsc + vite build + 预渲染（scripts/ssg.mjs）
yarn ssg        # 只重跑预渲染（需先有 dist）
yarn start      # 本地预览构建产物（scripts/preview-docs.mjs）
yarn lint       # ESLint 检查
yarn lint:fix   # ESLint 自动修复
yarn fm:check   # Prettier 格式检查
yarn fm:fix     # Prettier 格式修复
yarn fix:all    # 同时修复 lint + format
yarn tsc        # TypeScript 类型检查
```

**构建时必须确认 base**：`VITE_BASE_URL` 决定产物里的资源前缀，默认值 `/docs`（容器 / Helm 部署），
GitHub Pages 走自定义域名、站点在根路径，必须是 `VITE_BASE_URL=/`（`.github/workflows/pages.yml` 已设置）。
两种 base 都要求 `yarn build` 的预渲染自检全绿——自检失败会让构建直接失败，不会把坏产物发出去。

---

## 2. 目录结构

```
docs/
├── src/
│   ├── app.tsx                    # 应用根组件（i18n / 全局设置 / 主题 三层 Provider）
│   ├── global-config.ts           # BASE_URL / baseUri() 等站点常量
│   ├── main.tsx                   # 入口（createBrowserRouter，basename = BASE_URL）
│   ├── components/                # 通用组件 (Markdown, LoadingScreen 等)
│   ├── layouts/
│   │   ├── docs/layout.tsx        # 文档布局 (侧边栏 + 内容)
│   │   └── dashboard/             # 底层布局组件
│   ├── locales/                   # 界面文案 i18n（cn / en）
│   ├── pages/
│   │   ├── home.tsx               # 首页（/ 与 /en 共用同一个组件）
│   │   └── docs/
│   │       ├── viewer.tsx         # ★ 核心：Markdown 页面渲染器（中英共用）
│   │       ├── toc.tsx            # ★ 核心：侧边栏总配置
│   │       ├── use-markdown-toc.ts # 右侧目录 (Table of Contents) Hook
│   │       ├── cn/               # 中文内容
│   │       │   ├── 10.rune/      # Rune 控制台
│   │       │   ├── 15.airouter/  # AIRouter 聚合网关
│   │       │   ├── 20.boss/      # BOSS 运营平台
│   │       │   ├── 30.moha/      # Moha 模型库
│   │       │   ├── 40.ecosystem/ # 生态集成
│   │       │   └── 50.reference/ # 参考文档 (API/权限/FAQ)
│   │       └── en/               # 英文内容（路径与 cn 一一对应）
│   ├── routes/
│   │   └── sections/
│   │       ├── index.tsx          # 站点路由：/ 、/en 、文档树、404
│   │       └── docs.tsx           # 文档树：/ 与 /en 两棵（都落到 DocsViewer）
│   ├── sections/                  # 首页与各产品首页卡片组件
│   │   └── home/
│   │       ├── home-copy.json     # ★ 首页文案真源（中英各一份，组件与 SSG 共读）
│   │       └── home-copy.ts       # useHomeCopy()：按 URL 语言取文案
│   ├── settings/                  # 站点级配置（标题/logo，读 public/global-config.json）
│   ├── theme/                     # MUI 主题配置
│   └── utils/
│       ├── doc-lang.ts            # ★ 语言 ↔ URL 前缀（withLangPath / withoutLangPath）
│       └── doc-head.ts            # ★ 运行时重写 canonical / hreflang / html lang
├── scripts/
│   ├── ssg.mjs                    # ★ 预渲染 + sitemap + 构建期自检（链接/标题/语言）
│   ├── preview-docs.mjs           # 本地预览产物（yarn start）
│   └── *.py / *.cjs               # 历史一次性迁移脚本，不参与构建
├── public/                        # favicon、字体、截图、global-config.json、robots.txt
├── deploy/rune-docs/              # Helm Chart（容器部署）
├── .github/workflows/pages.yml    # push 到 main 自动构建并发布 GitHub Pages
├── vite.config.ts
├── tsconfig.json
└── package.json
```

---

## 3. 核心机制

### 3.1 页面自动发现

`viewer.tsx` 使用 Vite 的 `import.meta.glob` 自动发现所有 Markdown 文件：

```typescript
const files = import.meta.glob('/src/pages/docs/**/*.md', { query: '?raw', import: 'default' });
```

**路径匹配规则**：

- URL `/rune/getting-started/create` 匹配文件 `cn/10.rune/01.getting-started/02.create.md`
- 数字前缀（`01.`, `02.`, `10.`）仅用于文件排序，**URL 中不包含前缀**
- `index.md` 匹配目录路径（如 `cn/10.rune/index.md` → `/rune`）
- 英文侧路径完全相同，只是前面多一层 `/en`：`/en/rune/getting-started/create`

**语言目录**：目录直接由 URL 决定（`/en` → `en/`，其余 → `cn/`），**不做跨语言回退**——
英文页没有对应文件时会显示「文档不存在」，而不是悄悄给一份中文。中英页面因此必须成对维护。

### 3.2 Frontmatter 格式

每个 Markdown 文件**必须**包含 YAML frontmatter，使用 `gray-matter` 解析：

```yaml
---
title: '页面标题'
updated: '2026-03-23'
description: '简短描述（可选）'
author: '作者名（可选）'
tags:
  - tag1
  - tag2
---
```

| 字段          | 必须 | 类型     | 说明                                  |
| ------------- | :--: | -------- | ------------------------------------- |
| `title`       |  ✅  | string   | 页面标题，展示在浏览器 Tab 和页面顶部 |
| `updated`     | 推荐 | string   | ISO 日期格式，如 `2026-03-23`         |
| `description` | 可选 | string   | SEO 描述                              |
| `author`      | 可选 | string   | 作者名                                |
| `tags`        | 可选 | string[] | 标签数组                              |

### 3.3 侧边栏导航 (toc)

导航配置分为两层：

1. **各产品 `toc.ts`**：如 `cn/10.rune/toc.ts`，定义该产品的导航树
2. **总 `toc.tsx`**：`pages/docs/toc.tsx`，汇总所有产品的导航配置

`toc.ts` 导出格式：

```typescript
import type { DocsSidebarSection } from '../../toc';

export const RUNE_SIDEBAR_SECTIONS: DocsSidebarSection[] = [
  {
    subheader: '产品名称',
    items: [
      {
        title: '菜单标题',
        path: '/rune/xxx', // 与 URL 路径对应
        icon: 'ic-dashboard', // 图标 key
        product: 'rune', // 产品标识
        children: [
          // 子菜单（可选）
          { title: '子页面', path: '/rune/xxx/yyy' },
        ],
      },
    ],
  },
];
```

**类型定义**：

```typescript
type DocsSidebarItem = {
  title: string;
  path: string;
  icon?: string;
  deepMatch?: boolean; // 默认 true
  product?: 'rune' | 'boss' | 'moha' | 'ecosystem' | 'faq'; // 产品分组
  children?: DocsSidebarItem[];
};
```

**产品侧边栏过滤**：`layout.tsx` 中 `getProductFromPath()` 根据 URL 路径判断当前产品，侧边栏只显示对应产品的导航。不属于任何产品的路径（如 `reference`）会显示全部导航。

### 3.4 Markdown 渲染插件

| 插件               | 作用                               |
| ------------------ | ---------------------------------- |
| `remark-gfm`       | GFM 支持（表格、任务列表、删除线） |
| `rehype-highlight` | 代码块语法高亮                     |
| `rehype-raw`       | 支持内嵌 HTML                      |
| `rehype-slug`      | 标题自动生成 id（用于锚点跳转）    |
| `remarkAlerts`     | 自定义提示框渲染                   |

### 3.5 提示框 (Alert) 语法

**必须使用 blockquote + emoji 格式**，不支持 `:::` 容器语法：

```markdown
> 💡 提示: 这是一个提示信息

> ⚠️ 注意: 这是一个警告信息

> ❌ 错误: 这是一个错误提示

> ✅ 成功: 这是一个成功提示
```

### 3.6 语言与 URL

语言是 **URL 的一部分**，不是界面上的一个开关：

| 内容   | 中文                   | 英文                      |
| ------ | ---------------------- | ------------------------- |
| 首页   | `/`                    | `/en`                     |
| 文档页 | `/rune/console/quota/` | `/en/rune/console/quota/` |

- 路由：`routes/sections/index.tsx` 挂两条路径，`/en` 那棵子树（`docs.tsx` 里的 `enDocsRoute`）里的
  `*` 天然是去掉前缀后的路径，`viewer.tsx` 因此中英共用同一套解析逻辑。
- 链接：首页与各卡片用 `useLangHref()` 生成目标语言链接，**不要手写 `/en/...`**。
- 切换语言：`locales/i18n-provider.tsx` 的初始语言取自 URL，切换时同时改 URL 与 i18n。
- head：`utils/doc-head.ts` 在每次挂载时重写 `canonical` / 三条 `hreflang` / `og:locale` / `<html lang>`，
  先删上一轮的节点再写，避免叠出两份互相矛盾的声明（React 19 下 Helmet 写不进 `link` / `meta`）。
- 成对生成中英地址必须先 `withoutLangPath()` 剥掉前缀再各拼一次——`withLangPath()` 只加不剥，
  直接拿英文地址拼中文会原样返回，hreflang 就会指向自己。

### 3.7 静态预渲染与构建期自检

`yarn build` = `tsc` → `vite build` → `node scripts/ssg.mjs`。SSG 负责：

1. 读出 `dist/` 里的页面清单（与 `src/pages/docs/**` 一一对应，中英各一套）；
2. 用同一套 Markdown 管线渲染成静态 HTML，写进 `dist/<route>/index.html`；
3. 生成 `sitemap.xml`：每条带 `lastmod` 与互指的 `xhtml:link`；首页 `/` 与 `/en` 成对声明；
4. **自检**（失败即构建失败）：页面集合与 sitemap 一致、每条都有 `lastmod`、每页 `html lang` 与
   `canonical` 自指、`hreflang` 条数正确、正文里每个站内链接与图片都指向真实产物。

首页不是 Markdown，它的静态正文由 SSG 按 `src/sections/home/home-copy.json` 生成——**改首页文案只改那个 JSON**，
不要另抄一份常量，否则静态 HTML 与实际页面会悄悄不一致。

---

## 4. 文件命名规范

### 4.1 数字前缀

文件和文件夹使用数字前缀控制排序：

```
01.getting-started/     # 排第 1 位
02.console-guide/       # 排第 2 位
10.rune/                # 留间隔便于后续插入
20.boss/
30.moha/
40.ecosystem/
50.reference/
```

> 前缀在 URL 和导航中会被自动剥离。

### 4.2 命名风格

- 文件名：**kebab-case**（如 `api-overview.md`）
- 文件夹名：**kebab-case**（如 `getting-started`）
- 目录入口文件：`index.md`

---

## 5. 常见操作

### 5.1 添加新文档页面

1. 在对应产品的语言文件夹下创建 `.md` 文件：
   ```
   src/pages/docs/cn/{section}/{nn.filename}.md
   ```
2. 添加 frontmatter：
   ```yaml
   ---
   title: '页面标题'
   updated: '2026-06-01'
   ---
   ```
3. 在对应的 `toc.ts`（`cn/` 与 `en/` 各一份）添加导航条目，两边条目数要对齐
4. 在 `en/` 下创建**同路径**的英文文件——英文页没有回退，缺了就是「文档不存在」
5. 本地跑一次 `VITE_BASE_URL=/ yarn build`，构建期自检会校验链接、标题与语言对齐

### 5.2 添加新文档分区

1. 在 `cn/` 下创建编号文件夹（如 `60.new-section/`）
2. 创建 `toc.ts` 导出 `DocsSidebarSection[]`
3. 在 `pages/docs/toc.tsx` 导入并 spread 到 `DOCS_SIDEBAR_SECTIONS`
4. 如需侧边栏独立过滤，在 `layout.tsx` 的 `getProductFromPath` 添加映射

### 5.3 更新侧边栏导航

编辑对应 `toc.ts` 文件。`path` 必须与文件的 URL 路径对应（去掉数字前缀和 `.md` 后缀）。

### 5.4 添加新语言

1. 在 `src/pages/docs/` 下创建新语言文件夹（如 `ja/`）
2. 在 `utils/doc-lang.ts` 的 `DocLang` 与 `withLangPath` / `withoutLangPath` 里加前缀规则
3. 在 `routes/sections/index.tsx` 挂上该语言的路由树，`scripts/ssg.mjs` 的 `LANGS` 里加一项
4. 在 `locales/` 添加界面文案，`sitemap` 与 `hreflang` 会自动跟着 `LANGS` 走

### 5.5 部署

**生产（默认）**：push 到 `main` 触发 `.github/workflows/pages.yml`，构建后发布到 GitHub Pages（自定义域名 docs.poxiaoshi.cn）。
流程里已固定 `VITE_BASE_URL=/`，产物含 `404.html` 做 SPA 兜底。

**容器 / Helm**：`Dockerfile` + `nginx.conf.template`（`try_files` 回退到 `index.html`），
Helm Chart 在 `deploy/rune-docs/`，此时 base 为 `/docs`（`VITE_BASE_URL` 不设即默认值）。

两种 base 产物有区别（资源前缀、是否生成 `404.html`），改动构建逻辑后两边都要跑一遍：

```bash
VITE_BASE_URL=/ yarn build        # Pages（站点在域名根路径）
VITE_BASE_URL=/docs yarn build    # 容器 / Helm（站点挂 /docs 子路径）
```

`SSG_OUT` 可以把预渲染输出指到别的目录（例如 `SSG_OUT=dist-container node scripts/ssg.mjs`），
常用于在不动 `dist/` 的前提下复跑自检。

---

## 6. 主题与样式

- 主题配置：`src/theme/theme-config.ts`（调色板在 `src/theme/core/palette.ts`）
- 默认模式：`dark`（纯黑高对比，首次访问生效；老读者以本地存储的偏好为准，key 为 `theme-mode`）
- 主色调：绿色系 (`#00A76F`)
- 字体：`Public Sans Variable` (主要)、`Barlow` (次要)
- 圆角：`8px`
- CSS 变量前缀：无（空字符串）

文档内容区域样式由 `viewer.tsx` 内的 `<Box>` 控制，白底灰边。Markdown 组件（`<Markdown />`）封装了 `react-markdown` 及全部插件。

---

## 7. 项目间关系

```
XiaoShi-Rune-Console    →  产品前端 (实际功能实现)
         ↓
      docs-ai            →  AI 生成文档 (VitePress 格式，内容源)
         ↓
       docs              →  最终文档站 (React + SSG 预渲染，你维护的项目)
```

- `docs-ai` 是内容参考源，使用 VitePress 格式（`:::` 容器语法等），搬运内容到 `docs` 时**必须转换为本项目的格式**
- `XiaoShi-Rune-Console` 是产品前端代码，可从中了解实际功能和页面结构

---

## 8. 注意事项

| 项目                                        | 说明                                                                                      |
| ------------------------------------------- | ----------------------------------------------------------------------------------------- |
| 不要使用 `:::` 语法                         | 本项目的 Markdown 渲染不支持 VitePress 容器语法                                           |
| frontmatter 必须有 `title`                  | 否则页面标题显示为空                                                                      |
| frontmatter 的 `description` 含冒号要加引号 | 如 `description: "A: B"`，否则 YAML 解析失败，页面会变成「文档不存在」                    |
| `toc.ts` 中的 `path` 不含数字前缀           | 如 `/boss/gateway/channels` 而非 `/boss/02.gateway/channels`                              |
| `toc.ts` 中的 `path` 不带语言前缀           | 英文侧由 `useLangHref()` 补 `/en`，不要写死                                               |
| 图片放在 `public/` 下                       | 使用绝对路径引用，如 `/assets/screenshots/xxx.png`，且文件必须真实存在（SSG 自检会拦）    |
| 代码块指定语言标签                          | 使用 ` ```typescript ` 而非 ` ``` ` 以启用语法高亮                                        |
| Mermaid 图表                                | 支持 ` ```mermaid ` 代码块，由 `components/markdown/mermaid-block.tsx` 渲染               |
| 路由是 catch-all                            | `/` 与 `/en` 两棵子树都落到 `DocsViewer`，无需为每个页面配置路由                          |
| 首页文案                                    | 只改 `src/sections/home/home-copy.json`（组件与 SSG 共读），不要在别处另抄                |
| 站点级配置                                  | 只认 `public/global-config.json`（标题 / logo）；文档站没有 IAM，不要加 `/api/iam/*` 请求 |
| 环境变量                                    | `VITE_BASE_URL` 资源与路由前缀（默认 `/docs`）、`VITE_ASSETS_DIR` 资源目录                |
| markdown 源目录                             | `src/pages/docs/{cn,en}/**`；根目录的 `content/`、`archive/` 不参与构建，是历史资料       |

---

## 9. 当前文档结构概览

| 分区          | 路径前缀        | 内容                                       | 产品标识    |
| ------------- | --------------- | ------------------------------------------ | ----------- |
| 概览          | `/introduction` | 平台总览                                   | 无          |
| 入门指南      | `/guide/`       | 概念、架构、快速开始、名词表               | 无          |
| 账号          | `/account/`     | 基本信息、安全、密钥、偏好、关联账号       | 无          |
| Rune 控制台   | `/rune/`        | 开发环境、推理服务、微调、实验追踪、配额等 | `rune`      |
| AIRouter 网关 | `/airouter/`    | 聚合网关、路由策略、密钥与用量             | `airouter`  |
| BOSS 运营     | `/boss/`        | 集群管理、租户配额、网关、设置、数字孪生等 | `boss`      |
| Moha 模型库   | `/moha/`        | 模型仓库、数据集、镜像、Spaces 等          | `moha`      |
| 生态集成      | `/ecosystem/`   | Git LFS、Kubernetes、S3 等                 | `ecosystem` |
| 参考文档      | `/reference/`   | API 概览、权限设计、FAQ                    | `faq`       |

英文侧路径一一对应，统一加 `/en` 前缀（如 `/en/rune/console/quota/`）。
