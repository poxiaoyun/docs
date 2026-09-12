---
title: 训练与微调
updated: '2026-09-12'
description: 微调任务的列表字段、创建流程、状态枚举与结果获取。
tags:
  - rune
  - console
---

# 训练与微调

训练与微调（`category=tune`）用于对预训练模型做二次训练。与推理、开发环境一致，微调任务通过模板 + JSON Schema 表单创建，并共享统一实例模型与生命周期。

列表路径：`/rune/tenants/:tenant/clusters/:cluster/workspaces/:workspace/tunes`

## 实例列表

列表列（`src/pages/rune/instances/list.tsx`，`category=tune`）：

| 列 | 说明 |
| --- | --- |
| 名称 | 实例名称，点击进入详情 |
| 训练框架 | 模板列在该类型下的 i18n key 为 `training_framework`（其他类型为 `template`） |
| 规格 | 由 `values.flavor` 解析出的资源摘要 |
| 状态 | `status.phase` |
| 访问 | `ConnectionButtons`，提供 Web / SSH 等快捷访问 |
| 创建者 | 取自标签中的创建者 |
| 创建时间 | 任务创建时间 |

行操作菜单：启动/停止、保存为模板、编辑、删除。

> ⚠️ 注意: 微调列表**没有「模型名称」列**。旧版本文档列出的「模型名称」已删除，实际展示的是「训练框架」。列表也没有状态过滤与批量启停。

## 创建微调任务

1. 点击列表页右上角按钮（i18n key `common:create_tune_jobs`），跳转到 `/rune/products/tune`。
2. 选择微调模板与版本。
3. 填写基本信息。

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| `id` | ✅ | 实例 ID，编辑态不可修改 |
| `name` | ✅ | 显示名称 |
| `description` | — | 描述 |

4. 填写模板参数：由版本 JSON Schema 动态渲染，图形模式与 JSON 模式可切换。

> ⚠️ 注意: 部署表单没有固定的「选择规格」「挂载训练数据/输出存储卷」步骤。是否存在 `base_model`、`learning_rate` 等超参，以及是否有规格、存储卷字段，都由所选模板的 Schema 决定。

## 实例状态

`status.phase` 取值见 `InstanceStatusPhaseEnum`（[创建负载](/rune/guide/workloads)中有完整表），微调任务常见的是 `Running`、`Succeeded`、`Failed`、`Unhealthy`、`Degraded` 等。

## 访问与监控

- **访问**：列表「访问」列与详情页端点区提供快捷访问按钮，用于打开训练工具的 Web UI（如可视化训练界面）。
- **监控**：详情页「监控」标签展示实例指标。
- **日志**：详情页「日志」标签查看训练输出日志。
- **事件**：详情页「事件」标签查看 K8s 事件。

## 训练结果获取

训练完成后（状态 `Succeeded`）：

1. 训练产出保存在模板参数指定的输出目录中（通常在挂载的存储卷内）。
2. 在存储卷的文件管理器中浏览和下载模型文件。
3. 训练日志与检查点也保存在输出目录中。

## 权限要求

微调服务属于 PAI 工作台分组，导航要求租户角色为 `ADMIN` 或 `DEVELOPER`。
