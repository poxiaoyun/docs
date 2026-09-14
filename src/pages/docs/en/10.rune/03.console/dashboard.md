---
title: 'Home'
updated: '2026-09-14'
description: 'What to look at first after signing in: use Home to judge whether the current workspace has compute, storage, or instance problems.'
tags:
  - rune
  - console
  - dashboard
---

# Home

Home is the page that opens by default after you sign in to the Rune console. It gives you the whole picture within the **current region + current workspace** at a glance: how many instances there are, how much quota is left, how much storage is used, and whether anything needs attention. You do not have to walk through every menu — this page alone tells you whether there is anything to deal with today.

:::tip Treat Home as your car's dashboard
It does not drive the car; it tells you the fuel level (quota), the water temperature (resource utilization), and the warning lights (things to look at). When you see an anomaly, click through to handle it.
:::

## Before you start

- You are signed in and a tenant is selected.
- **Region** and **Workspace** are selected in the top-left. When no workspace is selected, the page shows a single line: Select a region and workspace to view overview data.
- There is no permission restriction; every member can view Home.

## What the blocks are, top to bottom

When Home opens, use the screenshot below to get your bearings:

![Home: the attention banner and six overview cards sit on top, resource quota and average utilization in the middle, data storage and volume usage below](/assets/screenshots/rune/dashboard-01.png)

The data in this screenshot comes from a demo workspace: the attention banner reads "No items need attention", meaning nothing was pending at the time. If you see a yellow banner instead, click **View details** on its right to work through the items.

| Block | What you can see |
| --- | --- |
| Header | The title "Workspace Overview" and the **Refresh** button on the right |
| Attention banner | Appears only when there is something to handle; click it to deal with the item directly |
| Overview cards | Total workloads, Running / healthy, Processing, Abnormal, Quota warnings, Storage usage |
| Resource Quota | Resource quota usage plus the average resource utilization over the last 24 hours |
| Data Storage | Total capacity, used, available, number of volumes, and overall storage usage |
| Workload Status | Instance status distribution by type |
| Needs Attention | A list of issues; click **View** to jump straight to the instance or quota page |

:::tip If the data looks wrong, refresh first
The **Refresh** button in the top-right pulls every piece of data on the page again. While loading, the button spins and is temporarily unclickable, which is normal.
:::

## How to read these numbers

### Overview cards

The top row is the "one-line conclusion"; when something looks off, look here first:

| Card | Meaning |
| --- | --- |
| Total workloads | How many instances are in the current workspace |
| Running / healthy | Instances that are working normally |
| Processing | Instances being created, started, or adjusted |
| Abnormal | Instances that need you to step in |
| Quota warnings | Number of quota items that have reached the warning threshold |
| Storage usage | Overall storage usage |

### Resource Quota

Shows the compute quota (CPU, memory, accelerators) and the average resource utilization over the last 24 hours. If one item is close to its ceiling, creating a new instance may fail for lack of quota, so adjust it under [Quota](/rune/console/quota) first.

### Data Storage

Shows total storage capacity, used, available, and the number of volumes, with a "Storage Volume Usage" table below listing each volume's name, storage cluster, usage, mount status (Mounted / Unmounted), and status (Normal / High usage).

### Workload Status

Counts instance status by type: inference services, fine-tuning jobs, development environments, applications, evaluation jobs, and experiments. Each item's status falls into one of five buckets:

| Status | Meaning |
| --- | --- |
| Running | The instance is working normally |
| Scheduling | Waiting for resources or still being created |
| Completed | A job-type instance (such as fine-tuning) has finished |
| Paused | Stopped manually |
| Abnormal | Failed or in an abnormal state; needs handling |

### Needs Attention

This block is a table with the columns **Name, Object type, Problem, Updated, Action**. Common problems include **Run failed**, **Abnormal status**, **High usage**, and **High usage**. Clicking **View** on the far right jumps straight to the corresponding instance detail, storage volume, or quota page. When the list is empty it shows "Nothing needs attention".

## Confirming the result

- Seeing numbers in all six overview cards means the current workspace's data has loaded normally.
- If a yellow message appears below the header — "Some overview data is temporarily unavailable. Other sections remain usable." — an individual data source is temporarily unavailable; other blocks still work, so refresh or check again later.

## FAQ

| Symptom | Likely cause | What to do |
| --- | --- | --- |
| Only the line "Select a region and workspace to view overview data" | No workspace selected yet | Use the top-left selector to pick a workspace |
| All numbers are 0 | The current workspace really has no instances | Create instances from the corresponding menu, or switch to another workspace |
| "Some overview data is temporarily unavailable" at the top | An individual data source is briefly failing | Click **Refresh** in the top-right and retry |
| Accelerator / utilization shows no data | That metric is temporarily unavailable | Check again later, or use **Monitoring** on the instance detail page |

## Related

- [Workspace](/rune/console/workspace)
- [Quota](/rune/console/quota)
- [Logs](/rune/console/logging)
- [Inference](/rune/console/inference)
