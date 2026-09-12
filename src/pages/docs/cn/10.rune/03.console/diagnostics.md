---
title: AI 诊断助手
updated: '2026-09-12'
description: Rune 控制台的悬浮式 AI 诊断助手：开关、模型选择、@ 引用实例与 SSE 流式诊断过程。
tags:
  - rune
  - console
  - diagnostics
---

# AI 诊断助手

AI 诊断助手（`RuneAIDiagnosticsAssistant`）是 Rune 控制台提供的悬浮式智能助手，用于在实例排障场景下结合当前工作空间的资源上下文进行诊断。

## 入口与显示条件

助手不是独立页面，而是挂载在工作空间布局上的悬浮组件（`src/routes/sections/rune.tsx` 中的 `RuneAIDiagnosticsAssistant`），在页面右侧显示一个可拖拽的竖标签，点击后以抽屉（Drawer）形式展开。

显示需要同时满足：

| 条件 | 说明 |
| --- | --- |
| 功能开关开启 | 全局设置 `aiDiagnostics.enabled` 为真 |
| 已确定租户 / 集群 / 工作空间 | 三者都能解析出有效 ID |
| 当前工作空间非空 | `workspaceContext.isEmpty` 为假 |

任一条件不满足时助手不渲染。

### 开关与外观

| 配置项 | 说明 | 默认值 |
| --- | --- | --- |
| `aiDiagnostics.enabled` | 是否启用助手 | — |
| `aiDiagnostics.name` | 助手显示名称 | `晓石 AI助手` |
| `aiDiagnostics.avatar` | 助手头像 | 空 |

配置同时可来自本地全局设置与远端全局设置（远端优先覆盖）。

## 面板能力

### 模型下拉

面板底部提供模型选择下拉，候选项来自 `GET /api/cloud/diagnostics/models`，加载完成后默认选中第一个模型。

### @ 引用实例

在当前实例类型对应的页面（`/inferences`、`/apps`、`/tunes`、`/ims`、`/experiments`、`/evaluations`）下，助手会按路径推断出 `category`，并拉取该类型的实例列表（`GET .../diagnostics/resources`）。输入框中可用 `@` 唤起候选列表：

1. 输入 `@` 后继续输入关键字可过滤实例。
2. 选中后以 `@实例名 ` 的形式插入输入框，并把该实例加入本次请求的资源引用列表。
3. 资源引用会随请求一起发送（`resourceRefs`），发送后清空。

### 流式诊断过程

发送问题后，助手通过 SSE 接收流式响应：

- 请求：`POST /api/cloud/tenants/:tenant/clusters/:cluster/workspaces/:workspace/diagnostics/chat`，payload 包含 `ask`、`model`、`stream: true`、`resourceRefs` 与对话历史。
- 流式渲染：回答与推理内容按帧逐步展示，支持中途停止生成。
- 阶段提示：流式事件中会展示诊断阶段，当前包含：

| 阶段 | 含义（i18n 文案） |
| --- | --- |
| `fetch_skill` | 读取诊断技能 |
| `collect_data` | 收集 Rune 诊断数据 |
| `update_plan` | 更新诊断阶段 |

### 其他交互

| 交互 | 说明 |
| --- | --- |
| 清空对话 | 面板头部的清空按钮 |
| 关闭 | 面板头部的关闭按钮 |
| 快捷提示 | 空态提供若干提示卡片与建议问题，点击即发送 |
| 拖拽 | 右侧竖标签可上下拖动，位置会被限制在可视范围内 |

## 相关页面

- [运行记录](/rune/console/logging)
- [在线推理](/rune/console/inference)

## 权限要求

助手随工作空间布局加载，其可见性由 `aiDiagnostics.enabled` 与工作空间上下文共同决定；单个诊断动作的角色约束前端未做细粒度判断，文档暂未确认。
