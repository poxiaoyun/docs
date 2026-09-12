---
title: 'Flavor'
updated: '2026-09-12'
description: 'The compute flavors visible to a tenant and how to filter them.'
tags:
  - rune
  - console
---

# Flavor
A flavor defines a set of directly selectable resource combinations (CPU, memory, accelerator cards, etc.). The "flavor" chosen when creating an instance comes from here.

Path: `/rune/tenants/:tenant/flavors`

## Current Capabilities

The flavor page **depends on the currently selected region/cluster**: no query is issued when no region is selected.

| Capability | Description |
| --- | --- |
| View by region | Queried with the current region/cluster |
| Flavor filtering | `FlavorFilterBar`, filtering step by step by type / vendor / model |
| Resource display | `FlavorResources` displays the resource combination as tags |

### List Fields

Fields come from `src/pages/rune/tenant/flavors/list.tsx`:

| Column | Field | Description |
| --- | --- | --- |
| Name | `name` | Flavor name; `description` is shown underneath |
| Type | `type` | Resource type (e.g. GPU / CPU / VGPU / NPU, etc.) |
| Model | `model` | Accelerator model (including `vendor`) |
| Flavor | `resources` | Resource combination tags rendered by `FlavorResources` |

The page disables search and the toolbar and keeps only the filter bar.

### Filter Dimensions

`FlavorFilterBar` supports three-level linked filtering:

1. **Type**: candidate types are limited by `flavorAllowedTypes`, currently `GPU`, `Accelerator`, `VGPU`, `FPGA`, `ASIC`, `NPU`, `DPU`, `TPU`, `CPU`, `MEMORY`.
2. **Vendor**: filtered by the selected type
3. **Model**: filtered by the selected type and vendor

`QuotaFilterBar` and `FlavorFilterBar` share the same filter component (`SelectorFilterBar`); the quota page simply does not restrict a type allowlist.

## Relationship Between Flavors and Quotas

| Concept | Question it answers |
| --- | --- |
| Quota | How much resource you may use at most |
| Flavor | What combination you may choose per deployment |

A flavor is usable only when the current cluster has that flavor and the current tenant/workspace still has quota on the corresponding resource.

> ⚠️ Note: Mechanisms from the old documentation such as "sold out (`status.soldOut`)" and "three-level flavor query" have no corresponding display logic on the frontend list page, so they are not yet confirmed here.

## Permission Requirements

The flavor page is open to all members, view-only; flavors cannot be created or modified.
