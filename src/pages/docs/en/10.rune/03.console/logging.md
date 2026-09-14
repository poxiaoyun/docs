---
title: 'Logs'
updated: '2026-09-14'
description: 'Read instance and workspace logs: filter by time and content, follow live, and recover when the stream drops.'
---

# Logs

Logs record every line an instance prints while it runs, which makes them the most direct place to investigate a problem. When an inference service errors out, a fine-tuning job will not start, or a dev environment refuses to come up, logs are the first thing to open.

The Rune console gives you two entry points: **instance logs** for a single instance, and **workspace logs** for every instance in a workspace. From the instance detail you can drill further down into the logs of **a specific Pod or container**.

:::tip How to read logs
Think of logs as a chat history: when something breaks, look at the last few lines (the most recent) first, then work backwards to find the first error.
:::

## Before you start
- Role: your tenant role must be **Administrator** or **Developer**.
- Context: select a **cluster** and a **workspace** at the top of the page first.
- The instance must already be running and must have produced logs.

## Open the logs page
| What you want to see | How to get there |
| --- | --- |
| One instance | Open the instance detail and click the **Logging** tab |
| A whole workspace | Left menu **Observability** → **Logs** |
| One Pod or container | Open the instance detail **Overview**, then click the log icon on that row in the container list |

:::info The Pod log window
Clicking the log icon in the **Overview** container list opens a window titled something like "pod-name Log", used to inspect one container inside one Pod precisely.
:::

## Filter logs by time and content
The top of the Logs page is a toolbar. From left to right:

![Logs page: the toolbar holds the query box, time range, limit, sort, query and live toggle, with the log output area underneath](/assets/screenshots/rune/logging-01.png)

Below the toolbar is the output area, which streams matching entries in time order. In this screenshot it reads "No logs found" because the workspace had no running workloads at the time — no workloads means no logs, so switch the time range or workspace and try again.

| Control | What it does |
| --- | --- |
| Query box | Type what to match; simple regex is supported, for example `error\|exception`; press Enter or click **Query** to run |
| Time Range | Pick the last 1 minute / 5 minutes / 15 minutes / 1 hour / 6 hours / 1 day / 7 days, or set a custom start and end time |
| Limit | How many entries to return at most: 50 / 100 / 200 / 500 / 1000 (default 100) |
| Sort | Switch between "Newest first" and "Newest last" |
| Query | Run the query again with the current conditions |
| Live | Turn live logs on or off (see the next section) |

### Filter by label
The leftmost icon inside the query box is **Add filter**. Open it to narrow logs by label:

1. Click the filter icon to open the label list, or search for a label in the box.
2. Select a label, then tick its values (you can select several).
3. The selected conditions appear as small tags in the query box, formatted like `pod="xxx"`, and each can be removed with its own small cross.
4. Click the clear icon on the right of the query box to wipe all filter conditions at once.

Common labels:

| Label | Description |
| --- | --- |
| namespace | Which workspace the log comes from |
| pod | Which Pod the log comes from |
| container | Which container the log comes from |

## Watch logs live
1. Click **Live** on the right of the toolbar to enter the live log view.
2. New logs keep appending, and the view **automatically scrolls to the bottom** by default.
3. When you scroll up to read older content, the view **freezes** the current range instead of following along; a downward-arrow button with a number then appears in the bottom-right corner — the number counts the new entries that arrived meanwhile, and clicking it jumps back to the newest.
4. The bottom status bar shows **Last received: X ago**, plus how many entries are currently shown and how many are buffered.
5. To stop, click **Exit Live** at the bottom. You can also **Clear** the current content or **Download** the logs.
6. To stay responsive, the live view displays at most the latest 1000 entries at a time.

:::warning The live stream does not reconnect automatically

Live logs are pushed over a long-lived connection. If the network hiccups or the connection is dropped, the page **does not reconnect on its own** — you must click **Live** again manually. The two entry points also behave differently:

- On the **workspace-level and instance-level** Logs pages, nothing explicit is shown when the connection drops; new logs simply stop arriving.
- In the **Pod log dialog inside the instance Overview**, a message with the disconnect reason is shown (nothing is shown on a normal close).

So if logs stop updating for a long time, exit the live view and turn it back on.

:::

## Other controls in the Pod log dialog
The log window opened from the container list in the instance Overview has an extra row of controls at the top:

| Control | What it does |
| --- | --- |
| Container | When a Pod has several containers, switch which container to view in the dropdown |
| Follow / Stop | Turn following the newest logs on or off |
| Previous | View the logs of the previous, already terminated container — useful for "it just crashed and restarted" cases |
| Close | Close the dialog |

## Download logs
Log content can be exported in `TXT`, `JSON`, or `CSV` format: click **Download** and pick the format.

## Common issues
| Symptom | Possible cause | What to do |
| --- | --- | --- |
| No logs found | The time range is wrong, or the instance has not produced logs yet | Widen the time range and look again after the instance starts |
| Logs load slowly | The query scope is too large | Shorten the time range, or add label filters |
| Live view shows nothing new | The connection has dropped | Exit Live, then click **Live** again |
| A label is missing | The matching Pod has not produced logs yet | Let the instance run, then refresh the page and try again |
| Logs show garbled characters | The program does not output UTF-8 | Check the log encoding setting of your program |
| Very old logs cannot be found | Historical logs have a retention period | Export logs with **Download** in advance if you need to keep them |

:::tip How long are historical logs kept
The log system has a storage retention limit, and historical logs older than the retention period are cleaned up; the exact period depends on the platform configuration. For logs you need to keep long term, export them with **Download** in advance.
:::

## Related
- [AI diagnostics](/rune/console/diagnostics)
- [Inference](/rune/console/inference)
