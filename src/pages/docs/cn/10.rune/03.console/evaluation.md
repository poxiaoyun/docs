---
title: 模型评测
updated: '2026-09-12'
description: 评测任务的列表、创建流程、状态枚举与评测基准说明。
tags:
  - rune
  - console
---

# 评测管理

评测管理（`category=evaluation`）用于部署模型评测服务。与其他类型一致，评测服务通过模板 + JSON Schema 表单创建，具体支持哪些评测基准与指标由所选模板提供。

列表路径：`/rune/tenants/:tenant/clusters/:cluster/workspaces/:workspace/evaluations`

## 评测任务列表

| 列 | 说明 |
| --- | --- |
| 名称 | 实例名称，点击进入详情 |
| 评测框架 | 模板列在该类型下的 i18n key 为 `evaluation_framework` |
| 规格 | 由 `values.flavor` 解析出的资源摘要 |
| 状态 | `status.phase` |
| 访问 | `ConnectionButtons`，提供 Web / SSH 等快捷访问 |
| 创建者 | 取自标签中的创建者 |
| 创建时间 | 任务创建时间 |

### 状态说明

`status.phase` 取值来自 `InstanceStatusPhaseEnum`（12 个取值，完整列表见[创建工作负载](/rune/guide/workloads)）。评测实例常见状态包括 `Reconciling`、`Pending`、`Running`、`Healthy`、`Succeeded`、`Failed`、`Unhealthy`、`Degraded` 等。

### 访问入口

评测服务的 Web UI 由模板内嵌提供。列表「访问」列与详情页端点区提供快捷访问按钮；不同模板的界面风格可能不同。

## 创建评测任务

1. 点击列表页右上角的「创建资源」按钮，跳转到 `/rune/products/evaluation`。
2. 选择评测模板与版本（也可从应用市场一键进入）。
3. 填写基本信息。

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| `id` | ✅ | 实例 ID，编辑态不可修改 |
| `name` | ✅ | 显示名称 |
| `description` | — | 描述 |

4. 填写模板参数：由版本 JSON Schema 动态渲染，图形模式与 JSON 模式可切换。

> 💡 提示: 部署表单没有固定的「模板版本 / 规格 / 存储卷」步骤。评测参数（模型路径、评测数据集、批次大小等）与是否需要 GPU，都由所选模板的 Schema 决定。

## 评测基准与指标

平台本身不内置评测基准清单，以下内容取决于模板；不同模板通常提供不同的数据集与指标：

| 类别 | 常见基准 / 指标 |
| --- | --- |
| 通用语言能力 | MMLU、C-Eval、HellaSwag、ARC |
| 专项能力 | HumanEval、GSM8K、TruthfulQA、BBH |
| 指标类型 | Accuracy / Top-K、BLEU / ROUGE / METEOR、Pass@K、Exact Match / F1、Toxicity / Bias |

> ⚠️ 注意: 上表为模板侧可能提供的基准与指标示例，非控制台内置列表；实际可用项以所选模板的 Schema 与文档为准。

## 实例详情

| 标签 | 内容 |
| --- | --- |
| 概览 | 基本信息卡片、Pod 列表 |
| 监控 | 实例监控面板 |
| 日志 | 实例日志 |
| 事件 | K8s 事件流 |

## 权限要求

评测服务属于可观测性分组，导航要求租户角色为 `ADMIN` 或 `DEVELOPER`。
