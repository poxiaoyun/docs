---
title: 'Dynamic dashboard'
updated: '2026-09-12'
description: 'Define cluster panels in YAML with live preview; data is queried from the cluster monitoring API.'
tags:
  - boss
  - settings
---

## Feature overview

The dynamic dashboard is a YAML-driven cluster monitoring panel editor: edit YAML on the left and the panels render live on the right. Panel data is queried from the cluster monitoring API in real time; the configuration itself is **not persisted and cannot be saved**.

This page corresponds to **Rune management → Cluster → Dynamic dashboard** in the Boss console.

## Access path

| Action | Console route |
|--------|--------------|
| Dynamic dashboard | `/rune/clusters/:cluster/dynamic-dashboard` |

> ⚠️ Note: the real route is `/rune/clusters/:cluster/dynamic-dashboard` (`ROOTS.BOSS` is an empty string, so there is no `/boss` prefix). The older `/boss/rune/clusters/...` path does not exist. The docs-site page URL is `/boss/rune-admin/dynamic-dashboard`.

> ⚠️ Note: the page breadcrumbs hard-code links to `/boss/clusters` and `/boss/clusters/:cluster`, which do not match the registered route — a legacy leftover in the source.

## Layout

The page stacks two blocks:

| Area | Notes |
|------|-------|
| YAML config card | Fixed 600px height; header holds the **Reset** button; YAML editor (Monaco) below |
| Preview card | Fills the remaining space (`flexBasis: 70%`), renders the `Dashboard` component |

Editor changes are **debounced by 1000 ms** before parsing and re-rendering.

> ⚠️ Note: the page has **only a Reset button — no save button and no write request**. Reset restores the built-in default YAML. The "click save → backend API" flow in older docs does not exist.

> ⚠️ Note: when YAML parsing fails, the error is only logged to the console; the preview stops updating with no UI notification.

## Configuration structure

Top-level fields (`DashboardConfiguration`):

| Field | Notes |
|-------|-------|
| `title` | Dashboard title |
| `description` | Description |
| `i18n` | Localized strings shaped as `{ locale: { source: translation } }` |
| `panels` | Panel array |
| `templating` / `time` / `timezone` / `refresh` | Reserved; unused by the default config |

Each panel (`DashboardPanel`):

| Field | Notes |
|-------|-------|
| `title` | Panel title |
| `type` | Panel type (free string, `DashboardPanelType \| string`) |
| `gridPos` | Grid position `{ h, w, x, y }` (24-column grid) |
| `fieldConfig.defaults` | Default field config: `unit`, `decimals`, `min`, `max`, `thresholds`, `color` |
| `targets[]` | Data queries: `{ expr, legendFormat?, refId?, instant?, range? }` |
| `options`, `panels`, `transformations`, … | Other pass-through fields |

> ⚠️ Note: the query expression goes on **`targets[].expr`**, not a top-level `query`. The older `query:` form is not parsed.

### Panel types used by the default config

| Type | Purpose |
|------|---------|
| `row` | Section header row (`gridPos.h: 1`, `w: 24`) |
| `stat` | Single aggregate value |
| `timeseries` | Time-series line |
| `table` | Multi-row table |
| `gauge` | Gauge/ring with thresholds |

> 💡 Tip: `type` is an open string in the types; which types actually render depends on the `Dashboard` component. Only the five used by the default config are documented.

## Default configuration

The default YAML is titled `Kubernetes Cluster Overview` and provides Simplified Chinese strings through `i18n.zh-CN`.

| Group | Panel | Type | Query (`targets[].expr`) |
|-------|-------|------|--------------------------|
| Cluster Summary | Total Nodes | stat | `count(kube_node_info)` |
| Cluster Summary | Total Pods | stat | `count(kube_pod_info)` |
| Cluster Summary | CPU Capacity | stat | `sum(kube_node_status_capacity{resource="cpu"})` |
| Cluster Summary | Memory Capacity | stat | `sum(kube_node_status_capacity{resource="memory"})` |
| Node Resources | Node CPU Usage | timeseries | `sum(rate(node_cpu_seconds_total{mode!="idle"}[5m])) by (instance)` |
| Node Resources | Node Memory Usage | timeseries | `node_memory_MemTotal_bytes - node_memory_MemAvailable_bytes` |
| Workload Metrics | Top 10 CPU Consuming Pods | table | `topk(10, sum(rate(container_cpu_usage_seconds_total{image!=""}[5m])) by (pod, namespace))` |
| Workload Metrics | Pod Restart Rate (Last 1h) | **timeseries** | `sum(increase(kube_pod_container_status_restarts_total[1h])) by (namespace, pod) > 0` |
| Workload Metrics | Node Disk Usage | gauge | `100 - (node_filesystem_avail_bytes{mountpoint="/"} / node_filesystem_size_bytes{mountpoint="/"} * 100)` |

> ⚠️ Note: "Pod Restart Rate (Last 1h)" is a **`timeseries`** panel, not a `stat`.

### Units and thresholds

- `fieldConfig.defaults.unit` examples: `short`, `cores`, `bytes`, `percent`
- Thresholds are nested inside `fieldConfig.defaults`:

```yaml
fieldConfig:
  defaults:
    unit: "percent"
    min: 0
    max: 100
    thresholds:
      mode: "absolute"
      steps:
        - color: "green"
          value: 0
        - color: "#EAB308"
          value: 70
        - color: "red"
          value: 90
```

> ⚠️ Note: thresholds are `fieldConfig.defaults.thresholds.{mode, steps[]}` with `{ color, value }` steps — not a top-level `thresholds: [{ value, color }]` array.

## Custom example

```yaml
panels:
  - title: "GPU Monitoring"
    type: "row"
    gridPos: { h: 1, w: 24, x: 0, y: 0 }

  - title: "GPU Utilization"
    type: "timeseries"
    gridPos: { h: 8, w: 12, x: 0, y: 1 }
    fieldConfig:
      defaults:
        unit: "percent"
    targets:
      - expr: 'avg(DCGM_FI_DEV_GPU_UTIL) by (gpu, instance)'
        legendFormat: "{{instance}} - GPU{{gpu}}"
```

## Data sources

Panel data is queried live from the cluster monitoring API:

- Panel queries: `queryClusterDynamicDashboard(cluster, config, params)`
- Query params: `getClusterDynamicDashboardParams(cluster, config, params)`

> ⚠️ Note: because the configuration is not persisted, reloading the page restores the default YAML and custom content is lost. Save your YAML elsewhere if you need it long term.

## Permissions

Requires an administrator role with access to the corresponding cluster under Rune management.
