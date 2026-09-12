---
title: 指标
updated: '2026-09-12'
description: 实验跟踪服务的列表、创建、实验端点 API 与微调集成。
tags:
  - rune
  - console
---

# 指标

指标（`category=experiment`）用于部署实验跟踪服务（如 MLflow、Aim 等）并查看其 Web UI。部署方式与其他类型一致：模板 + JSON Schema 表单。

列表路径：`/rune/tenants/:tenant/clusters/:cluster/workspaces/:workspace/experiments`

## 实验服务列表

| 列 | 说明 |
| --- | --- |
| 名称 | 实例名称，点击进入详情 |
| 指标服务 | 模板列在该类型下的 i18n key 为 `metrics_service` |
| 规格 | 由 `values.flavor` 解析出的资源摘要 |
| 状态 | `status.phase` |
| 访问 | `ConnectionButtons`，提供 Web / SSH 等快捷访问 |
| 创建者 | 取自标签中的创建者 |
| 创建时间 | 实例创建时间 |

行操作菜单：启动/停止、编辑、删除。

## 创建实验跟踪服务

1. 点击列表页右上角的「创建资源」按钮，跳转到 `/rune/products/experiment`。
2. 选择实验模板与版本（也可从应用市场一键进入）。
3. 填写基本信息（`id` / `name` / `description`）。
4. 填写模板参数（由 Schema 动态渲染，图形/JSON 模式可切换），提交创建。

## 实验端点与微调集成

平台提供专用接口获取可用于微调任务的实验跟踪端点：

```typescript
// src/services/instance.ts
export const listExperimentEndpoints = (
  tenant: string,
  cluster: string,
  workspace: string
): Request<{ items: ExperimentEndpointItem[] }> => ({
  method: 'GET',
  url: `/api/cloud/tenants/${tenant}/clusters/${cluster}/workspaces/${workspace}/instances:experiment-endpoints`,
});
```

- **方法 / 路径**：`GET .../instances:experiment-endpoints`
- **返回**：实验跟踪实例的端点列表（`{ items: [...] }`）
- **用途**：在创建微调任务时作为实验跟踪地址的候选值来源

> 💡 提示: 在微调部署表单中，「实验跟踪地址」是模板 Schema 定义的扩展控件；选择后训练过程即可将指标上报到对应跟踪服务。具体字段名以模板 Schema 为准。

## 实例状态

`status.phase` 取值见 `InstanceStatusPhaseEnum`（[创建工作负载](/rune/guide/workloads)有完整表）。

## 实例详情

| 标签 | 内容 |
| --- | --- |
| 概览 | 基本信息卡片、Pod 列表 |
| 监控 | 实例监控面板 |
| 日志 | 实例日志 |
| 事件 | K8s 事件流 |

## 权限要求

实验服务属于可观测性分组，导航要求租户角色为 `ADMIN` 或 `DEVELOPER`。
