---
title: 开发服务
updated: '2026-09-12'
description: 开发服务（开发环境）的列表、创建、SSH/JupyterLab 访问与凭据解析顺序。
tags:
  - rune
  - console
---

# 开发服务

开发服务（开发环境，Interactive Machine Learning，`category=im`）用于在平台上启动交互式开发环境。平台支持通过 **VSCode SSH 远程连接** 和 **Web 访问** 两种方式使用，并可与推理、微调等实例共享同一套部署与生命周期机制。

> ⚠️ 注意: 控制台菜单名为「开发服务」，类别标识是 `im`，不是 `devenv`。列表路由为 `.../ims`，产品列表类别为 `/rune/products/im`。

列表路径：`/rune/tenants/:tenant/clusters/:cluster/workspaces/:workspace/ims`

## 开发服务列表

| 列 | 说明 |
| --- | --- |
| 名称 | 实例名称，点击进入详情 |
| 模板 | 该列的 i18n key 为 `dev_environment` |
| 规格 | 由 `values.flavor` 解析出的资源摘要 |
| 状态 | `status.phase` |
| 创建时间 | 实例创建时间 |
| 创建者 | 取自标签中的创建者 |
| 连接 | 快捷连接按钮（`ConnectionButtons`） |

列表支持按名称搜索与刷新。行操作菜单包含编辑、启动/停止、删除；扩缩容在实例详情页的操作菜单中（`ScaleAction`）。

> ⚠️ 注意: 当前列表没有状态过滤，也没有批量启停。旧版本文档中的相关描述已删除。

## 创建开发环境

1. 点击列表页右上角的「创建资源」按钮，跳转到 `/rune/products/im`。
2. 选择模板与版本（也可从应用市场 `/rune/app-market` 的模板详情页点「部署」进入）。
3. 填写基本信息。

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| `id` | ✅ | 实例 ID，编辑态不可修改 |
| `name` | ✅ | 显示名称 |
| `description` | — | 描述 |

4. 填写模板参数：由版本 JSON Schema 动态渲染，图形模式与 JSON 模式可切换。

> 💡 提示: 是否存在存储卷、规格等字段由所选模板的 Schema 决定，控制台没有固定的「挂载存储卷」步骤。

## 使用开发环境

实例就绪后，列表「连接」列与详情端点区会提供快捷连接按钮。连接方式取决于实例暴露的端点协议：

| 协议 | 按钮 |
| --- | --- |
| SSH | VSCode 连接（分体式按钮：主按钮打开 VSCode，下拉复制 SSH 命令） |
| HTTP/Web | Web 访问链接 |
| RDP | 远程桌面连接 |

实例处于 `Paused` 状态时，连接按钮会被禁用。

### SSH 用户名解析顺序

连接组件优先使用端点 URL 中自带的用户名；当 URL 中没有用户名时，按以下顺序从实例 `values` 中兜底解析（`src/pages/rune/instances/components/instance-credentials.ts`）：

1. `auth.username` / `auth.user`（密码取 `auth.password` / `auth.pass`）
2. `pipe.from[0].username` / `pipe.from[0].user`
3. `kubeSsh.credentials[0].username` / `kubeSsh.credentials[0].user`
4. `auth.users[0].username` / `auth.users[0].user`

四项都取不到时返回空对象，即不带用户名。

> ⚠️ 注意: 旧版本文档只写了 `instance.values.pipe.from[0].username` 一种来源，实际解析顺序以上表为准。

### VSCode SSH 连接

分体式按钮（Split Button）包含两种操作：

| 操作 | 说明 |
| --- | --- |
| 连接 | 生成并打开 `vscode://` URI，在本地 VSCode 中发起远程连接 |
| 复制命令 | 复制形如 `code --new-window --remote ssh-remote+user@host:port` 的命令行 |

当实例暴露多个 SSH 端点时，下拉列表会为每个端点分别列出「使用 VSCode」和「复制 SSH 命令」项。

### Web 访问

Web 访问按钮在新标签页打开实例的 Web 端点（例如 JupyterLab）。当存在多个可用端点时，连接组件会按端点类型优先级选择。

## 实例详情

| 标签 | 内容 |
| --- | --- |
| 概览 | 基本信息卡片、Pod 列表 |
| 监控 | 实例监控面板 |
| 日志 | 实例日志 |
| 事件 | K8s 事件流 |

## 权限要求

开发环境属于 PAI 工作台分组，导航要求租户角色为 `ADMIN` 或 `DEVELOPER`。
