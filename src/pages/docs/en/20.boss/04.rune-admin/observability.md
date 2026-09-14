---
title: Logs & Scheduler
updated: '2026-09-14'
description: 'Query logs inside a cluster to locate problems, and adjust the Volcano scheduling policy by dragging.'
tags:
- boss
- rune-admin
- observability
---

# Logs & Scheduler

These two pages are everyday tools for running a cluster:

- **Log Management**: query a cluster's logs by condition, with live tailing, to locate errors.
- **Scheduler Management**: adjust the cluster's job scheduling policy (Volcano) by dragging.

## Before you start

- You need a **system administrator** account.
- Logging depends on a log-collection component deployed in the cluster, and scheduling depends on a deployed scheduler. If a component is missing, deploy it from **System Apps** first.

## How to open them

1. Click **AI Platform** in the top navigation bar, then click **Cluster** under the **AI Platform** group in the left sidebar, then open the target cluster.
2. Under the **Operations Management** group in the left-hand menu:
   - Click **Log Management** to query logs.
   - Click **Scheduler Management** to change the policy.

## Query logs

The log page has two tabs at the top:

| Tab | Use |
| --- | --- |
| All Logs | Query logs across the whole cluster |
| Node Logs | Pick a machine first, then read the logs from that machine |

In the log query area you can:

1. Type a filter expression into the query box, for example `level=error`.
2. Tick labels under **Label Filter**: the input suggests the available label names and values.
3. Choose a **Time Range**, or search for keywords directly under **Search log content**.
4. Click **Start Live Logs** to open live tailing, then **Stop Live Logs** to end it; **Follow** keeps the view scrolled to the newest entry.
5. Use **Wrap** to fold long log lines and **Clear** to reset the conditions.

:::tip What to do when no logs appear

When the page has no data, first confirm that the log-collection component has been installed through **System Apps**, then check that the query time range is correct.

:::

![Log Management: pick all logs or node logs, set the time range and line count, then query, with live tail and download](/assets/screenshots/boss/cluster-logs-01.png)

The page works in two steps: narrow the scope, then fetch. Choose **All logs** or **Node logs**, set the range and line count, press **Query**; turn on **Live** for a tail. **Wrap**, **Download** and **Clear log** sit to the right. The screenshot reads "No logs found" because that query matched nothing in the window — switch to **All logs** or widen the range.

## Adjust the scheduling policy

Scheduler Management is aimed at administrators who are already comfortable with scheduling. Its left side holds the available configurations, and the middle holds two editing areas: **Action** (the action pipeline) and **Plugin** (plugins, grouped into "plugin layers"). To use it:

1. Find the configuration you want under **Custom Config** / **Recommend Config** on the left and click **Use** to load it.
2. Drag an **Action** or a **Plugin** from the left into the matching area on the right; you can also reorder items within the same layer by dragging.
3. Click **Preview** in the top-right corner to see the effect of your changes.
4. If the configuration was changed elsewhere meanwhile, click the refresh icon to fetch the latest version.
5. When it looks right, click **Save**; a "Save successful" message means it has been pushed.

:::warning The scheduling policy affects jobs across the whole cluster

The scheduling configuration directly changes how jobs in the cluster are queued and allocated. Validate it on a test cluster before changing a production one.

:::

:::info Editing is not supported on phones or small screens

On a narrow screen, Scheduler Management tells you that it is not suitable for use on a phone. Please use a computer.

:::

![Scheduler management: custom or recommended configuration, split into actions (enqueue / allocate / backfill / reclaim / preempt) and plugins](/assets/screenshots/boss/cluster-schedulers-01.png)

The scheduler page splits policy into **Actions** and **Plugins**, each entry documenting what it does (`enqueue` is expanded in the screenshot). **Preview** shows the resulting configuration before you commit with **Save**. Switching to **Recommended** first is a good way to see the defaults.

## Two reserved pages

A cluster also has **Monitoring & Alerts** and **Event Logs** entries. They are placeholder pages for now (they show "Coming soon!") and are not in the left-hand sub-menu, so you can ignore them for the moment.

## Confirming the result

- The log page returns records, or the live mode keeps printing new logs.
- The scheduler page shows a "Save successful" message after you click **Save**.

## Related

- [Nodes & Accelerators](/boss/rune-admin/nodes-gpu)
- [System Apps](/boss/rune-admin/systems)
- [Workloads](/boss/rune-admin/resources)
