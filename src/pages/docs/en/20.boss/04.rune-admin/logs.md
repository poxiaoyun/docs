---
title: Log Management
updated: '2026-10-21'
description: Query logs in a cluster by condition, follow them live and download them to pin down errors and anomalies.
tags:
  - boss
  - rune-admin
  - logs
---

# Log Management

Log Management is the first stop when troubleshooting a cluster: why a system component will not start, why a Pod keeps restarting, whether something is wrong on a node — query it all here by condition.

After this page you will be able to choose between all logs and a single node's logs, narrow the range with regular expressions and label filters, turn on live following, and download the result.

:::tip Narrow the scope before you query
Log volume is huge. The fastest order is: choose **All logs** or **Node logs** → set the **time range** → filter by query expression or labels → then read the result.
:::

## Before you start

- You need a **system administrator** account.
- Logging depends on the log collection component being deployed in the cluster; without it the page returns nothing, so install it from **System Apps** first.
- The cluster is connected to the platform, see [Cluster Management](/boss/rune-admin/clusters).

## How to open it

1. Click **AI Platform** in the top navigation bar, then click **Cluster Management** under the **AI Platform** group in the left sidebar.
2. Click into the target cluster.
3. Under the **Operations Management** group in the left-hand menu, click **Log Management**.

## Page structure

Two tabs at the top decide which kind of log you query:

| Tab | Purpose |
| --- | --- |
| All logs | Query logs across the whole cluster |
| Node logs | Pick a **node** first (all nodes by default), then read logs from that machine |

The query area lets you set:

| Setting | Meaning |
| --- | --- |
| Log query | Enter a simple regular expression such as `error\|exception`; press Ctrl+Enter to run |
| Time range | The time window to query |
| Count | How many rows to return, and whether newest comes first or last |
| Label filter | Filter exactly by label name and value; add several, clear them all |
| Search log content | Search within the returned results by keyword |

Actions in the result area:

| Action | Meaning |
| --- | --- |
| Start live logs / Stop live logs | Turn live streaming on or off |
| Follow | Keep the view scrolled to the newest entry |
| Wrap | Wrap long log lines |
| Download | Download the current result |
| Clear logs | Empty the current result |
| View context | Open the lines before and after one entry |

![Log management page: choose All logs or Node logs at the top, set the time range and count, then query; live mode and download are supported](/assets/screenshots/boss/cluster-logs-01.png)

The page works as "scope first, results second": pick a tab, set the time range and count, click **Query**; turn on **live logs** if you want to watch it scroll. The screenshot shows "No logs found", meaning nothing matched in that window — switch to **All logs** or widen the range.

## Query logs once

1. Choose **All logs** (or **Node logs** and pick a node).
2. Set the **time range** and **count**.
3. Enter a keyword or regular expression in **Log query**, for example `error|exception`.
4. Click **Query** (or press Ctrl+Enter).
5. For continuous observation click **Start live logs**, then **Stop live logs** when done.

## Confirming the result

- Log entries appear in the result area with "N logs in total" at the top.
- In live mode new entries keep arriving, with a "last received … ago" indicator.

## Common questions

| What you see | Likely cause | What to do |
| --- | --- | --- |
| The page says "No logs found" | Nothing matched in the window, or the query is too strict | Widen the time range, clear the label filters and query again |
| The page stays empty | The cluster has no log collection component | Deploy the logging component from **System Apps** |
| No node to pick under Node logs | The node list failed to load, or there are no usable nodes | Refresh and retry, or first confirm the cluster nodes are healthy |
| Live logs do not refresh | Live mode was stopped, or the collector disconnected | Click **Start live logs** again; if that fails, check the collector |
| The downloaded file is incomplete | Only the currently loaded result was downloaded | Widen the count, query again, then download |

## Related

- [Scheduler Management](/boss/rune-admin/schedulers)
- [Scheduling](/boss/rune-admin/scheduling)
- [System Apps](/boss/rune-admin/systems)
- [Workloads](/boss/rune-admin/resources)
