---
title: 'Dynamic dashboard'
updated: '2026-09-14'
description: Build your own monitoring dashboard in a YAML box — edit the config on the left and watch the charts render on the right.
tags:
  - boss
  - settings
---

# Dynamic dashboard

The dynamic dashboard is a place to "assemble your own monitoring dashboard": on the left is a text box where you write a config describing which charts to show, and on the right the charts are rendered live from that config. It is handy when you want to look at a particular metric right now without waiting for the platform to ship a new dashboard.

By the end of this page you can: create a dashboard, add a chart, and set up its data source (query).

:::tip An analogy

Think of it as a dashboard you draw yourself: the left side is the drawing instructions and the right side is the finished board. Change one line and the right side follows a few seconds later.

:::

## Before you start

- You need a **System Administrator** account that can access the cluster.
- Prerequisite: the cluster's monitoring data is already connected (otherwise the charts stay empty).

## Getting there

This page is not in the left menu. Open the dynamic dashboard address of a cluster directly in the browser (on a cluster-related page you can replace the last segment of the address with `dynamic-dashboard`).

## Page layout

| Area | Content |
| --- | --- |
| YAML config card on top | A text box for the config, with a **Reset** button in its top right |
| Preview card below | The dashboard rendered live from what you wrote |

After the text box changes, the preview on the right refreshes about **1 second** later (so it does not redraw on every keystroke).

:::warning Only Reset, no save

This page has **no save button** and does not store the config on the server. **Reset** only restores the text box to the built-in default config.

So: **your changes are lost when you refresh the page.** If you want to keep using them, copy the config somewhere else yourself.

:::

![Dynamic dashboard: a YAML editor on the left, the cluster summary and node resource charts rendered from it on the right](/assets/screenshots/boss/cluster-dashboard-01.png)

This dashboard is configuration-driven: the YAML editor on the left defines data sources, charts and groups, and the right side renders them live. **Reset** discards your edits, `YAML Configuration` titles the editor, and the preview opens with the **Cluster summary** block — the blocks below it come from the groups you configure.

## Create a dashboard

"Creating" simply means changing the content of the text box to the config you want; the preview on the right follows:

1. Open the page; the text box already holds a default config and the right side shows the default dashboard.
2. Edit or clear the text box and write your own config.
3. Wait about 1 second and the preview redraws with the new config.
4. Once you are happy, copy the whole config out and back it up yourself.

## How to write the configuration

At the top level the config is roughly the dashboard title, the groups, and a set of "panels" (each chart is one panel).

| Item | Meaning |
| --- | --- |
| `title` | The dashboard title |
| `panels` | The panel array; one panel is one chart or one group header |
| `i18n` | Optional, maps English titles to localized text |

Items commonly used in each panel (one entry in `panels`):

| Item | Meaning |
| --- | --- |
| `title` | The title of this chart |
| `type` | Chart type, e.g. `stat` (single value), `timeseries` (line), `table`, `gauge`, `row` (group header row) |
| `gridPos` | Where it sits in the grid (`x` and `y` position, `w` and `h` size; 24 columns per row) |
| `targets` | Data queries; each item writes a query in `expr` |
| `fieldConfig.defaults` | How values are displayed, such as the `unit` and the color `thresholds` |

### How to set up the data source

Chart data comes from the cluster's monitoring API, so you do not configure "which database to connect to" — just write a query in `expr` inside the panel's `targets`, and adjust the chart type and unit in `fieldConfig`.

:::warning The query goes inside targets

The query expression must be written on `targets[].expr`, not at the top level of the panel. If it is in the wrong place the chart on the right shows no data.

:::

### How to write one chart plus one group

```yaml
panels:
  - title: "GPU Monitoring"      # group header row
    type: "row"
    gridPos: { h: 1, w: 24, x: 0, y: 0 }

  - title: "GPU Utilization"     # one line chart
    type: "timeseries"
    gridPos: { h: 8, w: 12, x: 0, y: 1 }
    fieldConfig:
      defaults:
        unit: "percent"
    targets:
      - expr: 'avg(DCGM_FI_DEV_GPU_UTIL) by (gpu, instance)'
        legendFormat: "{{instance}} - GPU{{gpu}}"
```

### How to write color thresholds

To change color when a value passes a certain point, use `fieldConfig.defaults.thresholds`; each threshold is a pair of "color + starting value":

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

## Confirming the result

- About 1 second after you change the config, a new panel or value appears in the preview on the right.
- If the right side does not change, the format of your config is most likely wrong; check the indentation and the field names.

## Common questions

| Symptom | Likely cause | What to do |
| --- | --- | --- |
| The preview on the right stops updating | The config format is wrong and parsing fails | Check the indentation and field names; click **Reset** to return to the default config and start again |
| A chart is empty | The query is in the wrong place, or the metric does not exist | Make sure the query is written under `targets[].expr` |
| The config is gone after a refresh | This page does not save the config | Copy the config out and save it elsewhere beforehand |

## Related

- [Cluster Status](/boss/rune-admin/cluster-overview)
- [Nodes & Accelerators](/boss/rune-admin/nodes-gpu)
