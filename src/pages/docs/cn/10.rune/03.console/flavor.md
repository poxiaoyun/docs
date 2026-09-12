---
title: 规格
updated: '2026-09-12'
description: 租户可见的算力规格列表与筛选方式。
tags:
  - rune
  - console
---

# 规格

规格（Flavor）定义一组可直接选择的资源组合（CPU、内存、加速卡等）。创建实例时选择的「规格」即来自这里。

路径：`/rune/tenants/:tenant/flavors`

## 当前能力

规格页**依赖当前选中的区域/集群**：未选择 region 时不会发起查询。

| 能力 | 说明 |
| --- | --- |
| 按区域查看 | 结合当前 region/cluster 查询 |
| 规格筛选 | `FlavorFilterBar`，按类型 / 厂商 / 型号逐级筛选 |
| 资源展示 | `FlavorResources` 以标签形式展示资源组合 |

### 列表字段

字段来自 `src/pages/rune/tenant/flavors/list.tsx`：

| 列 | 字段 | 说明 |
| --- | --- | --- |
| 名称 | `name` | 规格名称，下方展示 `description` |
| 类型 | `type` | 资源类型（如 GPU / CPU / VGPU / NPU 等） |
| 型号 | `model` | 加速器型号（含 `vendor`） |
| 规格 | `resources` | 由 `FlavorResources` 渲染的资源组合标签 |

页面禁用搜索与工具栏，仅保留筛选条。

### 筛选维度

`FlavorFilterBar` 支持三级联动筛选：

1. **类型**：候选类型受 `flavorAllowedTypes` 限定，当前为 `GPU`、`Accelerator`、`VGPU`、`FPGA`、`ASIC`、`NPU`、`DPU`、`TPU`、`CPU`、`MEMORY`。
2. **厂商**：按已选类型过滤
3. **型号**：按已选类型与厂商过滤

`QuotaFilterBar` 与 `FlavorFilterBar` 共用同一套筛选组件（`SelectorFilterBar`），只是配额页不限定类型白名单。

## 规格与配额的关系

| 概念 | 回答的问题 |
| --- | --- |
| 配额 | 你最多能用多少资源 |
| 规格 | 你每次部署时可以选什么组合 |

规格可用需同时满足：当前集群存在该规格，且当前租户/工作空间在对应资源上还有配额。

> ⚠️ 注意: 旧版本文档中的「售罄 `status.soldOut`」「三级规格查询」等机制在前端列表页面没有对应的展示逻辑，文档暂未确认。

## 权限要求

规格页对所有成员开放，仅可查看，不能创建或修改规格。
