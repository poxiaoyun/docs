---
title: '主题设置'
updated: '2026-09-12'
description: 用户中心主题偏好项与自动保存机制。
---

## 功能简介

主题设置页用于维护当前账号的界面外观偏好。每次修改都会**自动保存到服务器**，无需点击保存按钮。

- 路由：`/iam/account/theme`
- 视图：`src/pages/iam/account/theme.tsx`

## 进入路径

右上角头像 → 个人设置 → 顶部 Tab「主题」

## 可配置项

页面实际渲染的配置项共 6 组：

| 配置项 | 标识 | 取值 |
|--------|------|------|
| 颜色模式 | `mode` | 亮色 / 暗色（跟随系统时显示 `System` 标记） |
| 对比度 | `contrast` | `default` / `hight` |
| 紧凑模式 | `compactLayout` | 开 / 关 |
| 主题色 | `primaryColor` | `default`、`preset1` – `preset5`，共 6 个色板 |
| 字体 | `fontFamily` | 4 个选项（见下） |
| 字体大小 | `fontSize` | 滑块，范围 12–20，步长 1 |

> ⚠️ 注意: 代码的 `visibility` 中还计算了 `navLayout`、`navColor`、`direction`，但**渲染部分没有使用它们**（`theme.tsx:69-79`）。因此本页**没有**「导航布局」「导航栏颜色」「文字方向」三节。

### 字体族

`fontFamily` 的 4 个选项（`theme.tsx:190-195`）：

1. `themeConfig.fontFamily.primary`（默认主字体）
2. `Inter Variable`
3. `DM Sans Variable`
4. `Nunito Sans Variable`

界面上会去掉 `Variable` 后缀显示。

### 默认值

默认值来自 `src/settings/user/settings-config.ts:10-21`：

| 配置项 | 默认值 |
|--------|--------|
| `contrast` | `default` |
| `compactLayout` | `false` |
| `primaryColor` | `preset1` |
| `fontSize` | `16` |
| `fontFamily` | `themeConfig.fontFamily.primary` |
| `mode` | `themeConfig.defaultMode` |

> ⚠️ 注意: `mode` 的默认值最终取决于 `themeConfig.defaultMode`，本文档未展开其具体取值。

## 自动保存

| 项目 | 说明 |
|------|------|
| 读取 | `GET` 当前用户设置（`getCurrentUserSettings`） |
| 保存 | 每次修改后自动调用 `setCurrentUserSettings` 提交当前设置 |

> ⚠️ 注意: 保存请求的具体接口路径见 `src/services/setting.ts`；本文档未逐字段展开服务端返回结构。

## 注意事项

- 修改即保存，无「保存」按钮
- 页面不包含导航布局 / 导航栏颜色 / 文字方向设置
- 字体大小通过滑块调节，范围 12–20px
