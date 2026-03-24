# Rune Docs — 项目维护手册 (SKILL.md)

本文档面向需要维护和扩展 `docs` 项目的开发者，覆盖项目架构、开发规范、内容编写指南和常见操作说明。

---

## 1. 项目概述

`docs` 是 Rune 平台的官方文档站，基于 React SPA 构建，将 Markdown 文件动态渲染为文档页面。

| 项目 | 说明 |
|------|------|
| 框架 | React 19 + TypeScript 5.8 + Vite 6 |
| UI 库 | MUI v7 (Material UI) |
| Markdown 渲染 | react-markdown + gray-matter + rehype/remark 插件 |
| 包管理 | Yarn 1.22 |
| Node 版本 | >= 20 |
| 语言 | i18n：中文 (cn, 默认)、英文 (en) |

### 常用命令

```bash
yarn dev        # 启动开发服务器 (端口 8080)
yarn build      # 生产构建 (tsc + vite build)
yarn lint       # ESLint 检查
yarn lint:fix   # ESLint 自动修复
yarn fm:check   # Prettier 格式检查
yarn fm:fix     # Prettier 格式修复
yarn fix:all    # 同时修复 lint + format
yarn tsc        # TypeScript 类型检查
```

---

## 2. 目录结构

```
docs/
├── src/
│   ├── app.tsx                    # 应用根组件
│   ├── global-config.ts           # 全局配置
│   ├── main.tsx                   # 入口文件
│   ├── components/                # 通用组件 (Markdown, LoadingScreen 等)
│   ├── layouts/
│   │   ├── docs/layout.tsx        # 文档布局 (侧边栏 + 内容)
│   │   └── dashboard/             # 底层布局组件
│   ├── locales/                   # i18n 翻译文件
│   ├── pages/
│   │   ├── docs/
│   │   │   ├── viewer.tsx         # ★ 核心：Markdown 页面渲染器
│   │   │   ├── toc.tsx            # ★ 核心：侧边栏总配置
│   │   │   ├── use-markdown-toc.ts # 右侧目录 (Table of Contents) Hook
│   │   │   ├── cn/               # 中文文档内容
│   │   │   │   ├── 10.rune/      # Rune 控制台文档
│   │   │   │   ├── 20.boss/      # BOSS 运营平台文档
│   │   │   │   ├── 30.moha/      # Moha 模型库文档
│   │   │   │   ├── 40.ecosystem/ # 生态集成文档
│   │   │   │   └── 50.reference/ # 参考文档 (API/权限/FAQ)
│   │   │   └── en/               # 英文文档内容
│   │   └── home/                 # 首页
│   ├── routes/
│   │   └── sections/docs.tsx      # 文档路由配置 (/docs/*)
│   ├── sections/                  # 产品首页卡片组件
│   ├── settings/                  # 全局设置上下文
│   └── theme/                     # MUI 主题配置
├── public/                        # 静态资源 (字体、图标)
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
- URL `/docs/rune/getting-started/create` 匹配文件 `cn/10.rune/01.getting-started/02.create.md`
- 数字前缀（`01.`, `02.`, `10.`）仅用于文件排序，**URL 中不包含前缀**
- `index.md` 匹配目录路径（如 `cn/10.rune/index.md` → `/docs/rune`）

**语言回退**：优先加载用户语言文件夹（`cn/` 或 `en/`），未找到时回退到 `cn/`。

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

| 字段 | 必须 | 类型 | 说明 |
|------|:---:|------|------|
| `title` | ✅ | string | 页面标题，展示在浏览器 Tab 和页面顶部 |
| `updated` | 推荐 | string | ISO 日期格式，如 `2026-03-23` |
| `description` | 可选 | string | SEO 描述 |
| `author` | 可选 | string | 作者名 |
| `tags` | 可选 | string[] | 标签数组 |

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
        path: '/docs/rune/xxx',     // 与 URL 路径对应
        icon: 'ic-dashboard',        // 图标 key
        product: 'rune',             // 产品标识
        children: [                  // 子菜单（可选）
          { title: '子页面', path: '/docs/rune/xxx/yyy' },
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
  deepMatch?: boolean;                                         // 默认 true
  product?: 'rune' | 'boss' | 'moha' | 'ecosystem' | 'faq';  // 产品分组
  children?: DocsSidebarItem[];
};
```

**产品侧边栏过滤**：`layout.tsx` 中 `getProductFromPath()` 根据 URL 路径判断当前产品，侧边栏只显示对应产品的导航。不属于任何产品的路径（如 `reference`）会显示全部导航。

### 3.4 Markdown 渲染插件

| 插件 | 作用 |
|------|------|
| `remark-gfm` | GFM 支持（表格、任务列表、删除线） |
| `rehype-highlight` | 代码块语法高亮 |
| `rehype-raw` | 支持内嵌 HTML |
| `rehype-slug` | 标题自动生成 id（用于锚点跳转） |
| `remarkAlerts` | 自定义提示框渲染 |

### 3.5 提示框 (Alert) 语法

**必须使用 blockquote + emoji 格式**，不支持 `:::` 容器语法：

```markdown
> 💡 提示: 这是一个提示信息

> ⚠️ 注意: 这是一个警告信息

> ❌ 错误: 这是一个错误提示

> ✅ 成功: 这是一个成功提示
```

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
3. 在对应的 `toc.ts` 添加导航条目
4. 如需英文版，在 `en/` 下创建同路径文件

### 5.2 添加新文档分区

1. 在 `cn/` 下创建编号文件夹（如 `60.new-section/`）
2. 创建 `toc.ts` 导出 `DocsSidebarSection[]`
3. 在 `pages/docs/toc.tsx` 导入并 spread 到 `DOCS_SIDEBAR_SECTIONS`
4. 如需侧边栏独立过滤，在 `layout.tsx` 的 `getProductFromPath` 添加映射

### 5.3 更新侧边栏导航

编辑对应 `toc.ts` 文件。`path` 必须与文件的 URL 路径对应（去掉数字前缀和 `.md` 后缀）。

### 5.4 添加新语言/翻译

1. 在 `src/pages/docs/` 下创建新语言文件夹（如 `ja/`）
2. 在 `viewer.tsx` 的 `langFolder` 逻辑中添加映射
3. 在 `locales/` 添加对应翻译文件

### 5.5 部署

```bash
# Docker 构建
docker build -t rune-docs .

# Vercel 部署 (已配置 vercel.json)
vercel --prod
```

Nginx 配置模板在 `nginx.conf.template` 中，所有路由回退到 `index.html`（SPA 模式）。

---

## 6. 主题与样式

- 主题配置：`src/theme/theme-config.ts`
- 默认模式：`light`
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
       docs              →  最终文档站 (React SPA，你维护的项目)
```

- `docs-ai` 是内容参考源，使用 VitePress 格式（`:::` 容器语法等），搬运内容到 `docs` 时**必须转换为本项目的格式**
- `XiaoShi-Rune-Console` 是产品前端代码，可从中了解实际功能和页面结构

---

## 8. 注意事项

| 项目 | 说明 |
|------|------|
| 不要使用 `:::` 语法 | 本项目的 Markdown 渲染不支持 VitePress 容器语法 |
| frontmatter 必须有 `title` | 否则页面标题显示为空 |
| `toc.ts` 中的 `path` 不含数字前缀 | 如 `/docs/boss/gateway/channels` 而非 `/docs/boss/02.gateway/channels` |
| 图片放在 `public/` 下 | 使用绝对路径引用，如 `/assets/screenshots/xxx.png` |
| 代码块指定语言标签 | 使用 ` ```typescript ` 而非 ` ``` ` 以启用语法高亮 |
| Mermaid 图表 | 使用 ` ```mermaid ` 代码块（需确认渲染器是否支持） |
| 路由是 catch-all | `/docs/*` 统一由 `DocsViewer` 处理，无需为每个页面配置路由 |
| 环境变量 | `VITE_ASSETS_DIR` 资源目录、`VITE_API_ENDPOINT` API 地址 |

---

## 9. 当前文档结构概览

| 分区 | 路径前缀 | 内容 | 产品标识 |
|------|---------|------|---------|
| Rune 控制台 | `/docs/rune/` | 开发环境、推理服务、微调、实验追踪等 | `rune` |
| BOSS 运营 | `/docs/boss/` | 集群管理、租户配额、网关、设置等 | `boss` |
| Moha 模型库 | `/docs/moha/` | 模型仓库、数据集、镜像、Spaces 等 | `moha` |
| 生态集成 | `/docs/ecosystem/` | Git LFS、Kubernetes、S3 等 | `ecosystem` |
| 参考文档 | `/docs/reference/` | API 概览、权限设计、FAQ | `faq` |
| 概览 | `/docs/introduction` | 平台总览 | 无 |
