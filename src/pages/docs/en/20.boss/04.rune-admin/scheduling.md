---
title: Scheduling
updated: '2026-10-21'
description: See each queue's quota and usage, which scheduling stage every workload is stuck in, and drill into a workload's pods and events.
tags:
  - boss
  - rune-admin
  - scheduling
---

# Scheduling

Scheduling answers "why has my job not started yet": does the queue still have quota, is the workload waiting or already queued, are Gang members still missing. It is a page for **seeing results** — to change policy, go to **Scheduler Management**.

After this page you will be able to read the queue overview, tell which stage a workload is stuck in, and drill into a workload to see pod scheduling results and events.

:::tip An analogy
A queue is like a serving window in a canteen, and the quota is how much food that window is provisioned with. **Deserved / Guaranteed / Cap** decide how much the window may take; when jobs queue up in front of it, Scheduling tells you how far along they are and why they have not been served.
:::

## Concepts

| Term | Plain explanation |
| --- | --- |
| Queue | A shared scheduling quota for a set of workloads; may itself have a parent queue |
| Scheduling stage | Where a workload is now: Pending / Queued / Running / Completed / Failed / Unknown |
| Allocated resources | How much this queue is currently using |
| Resource cap | The most this queue may use |
| Deserved resources | The share it "should" get, computed from its weight |
| Guaranteed resources | The amount this queue can always get |
| Reclaim allowed | Whether idle quota may be reclaimed by other queues |
| Gang progress | For a group of jobs that must start together: how many are up, and the minimum needed |
| Scheduling evidence | Stage, reason, message and time, explaining "why it stopped here" |

## Before you start

- You need a **system administrator** account.
- The scheduler component (Volcano) is installed in the cluster. Without it the page says "scheduling data is temporarily unavailable" and explains that it may be missing or the platform cannot reach the scheduling resources.
- The cluster is connected to the platform, see [Cluster Management](/boss/rune-admin/clusters).

## How to open it

1. Click **AI Platform** in the top navigation bar, then click **Cluster Management** under the **AI Platform** group in the left sidebar.
2. Click into the target cluster.
3. Under the **Operations Management** group in the left-hand menu, click **Scheduling**.

## Page structure

| Area | Content |
| --- | --- |
| Status row at the top | Scheduler type badge, **observed at**, **Refresh** |
| Summary | Total number of workloads, distributed by stage |
| Queue overview | Per queue: allocated resources, cap, deserved resources, guaranteed resources, weight and priority, whether reclaim is allowed |
| Scheduling workloads | Workload, scheduling stage, queue, Gang progress, reason and last transition time |

![Scheduling view: observed-at time and refresh at the top, queue overview in the middle, scheduling workload table below](/assets/screenshots/boss/rune-scheduling-01.png)

A queue's **priority / weight** decides the order in which it receives quota; when **reclaim allowed** is on, idle quota can be borrowed temporarily by other queues. The **scheduling stage** column is the first thing to read when troubleshooting.

## Find out where a job is stuck

1. Start with the **queue overview**: has this queue's **allocated resources** reached its **resource cap**?
2. Then look at **scheduling workloads**: find the workload and check its **scheduling stage**.
3. When the stage is **Pending** or **Queued**, read the **reason** and **message** on the right.
4. Expand **Gang progress**: if "running N / minimum M" has N below M, members are still missing and the job will keep waiting.
5. For finer detail, click the workload and open **Pod scheduling results**, **related events** and the **scheduling timeline**.

The **scheduling timeline** on the detail page is assembled from the current object state and Kubernetes events; once events expire the history may be incomplete.

## How it differs from Scheduler Management

| Page | Role | When to use it |
| --- | --- | --- |
| Scheduling (this page) | See results | Jobs do not start, queue times are long, quota runs out |
| [Scheduler Management](/boss/rune-admin/schedulers) | Change policy | You need to reorder stages or toggle plugins |

## Confirming the result

- The queue overview has data and the workload table lists entries, so the platform can read the scheduling resources.
- Once a job starts, its **scheduling stage** moves from Pending/Queued to **Running**.
- The detail page shows a pod's **Scheduled** state and the **node** it landed on.

## Common questions

| What you see | Likely cause | What to do |
| --- | --- | --- |
| The page says "scheduling data is temporarily unavailable" | Volcano is not installed in the cluster, or the platform cannot reach the scheduling resources | Deploy the scheduler from **System Apps**, then retry |
| The queue list is empty | No queue has been created, or the queues hold no workloads | First confirm the workloads were submitted on the business side |
| A job stays pending | Queue quota used up, Gang members missing, or the flavor is too large | Check the queue cap, Gang progress and resource requests in that order |
| The timeline is incomplete | The related events have expired | Normal; combine with **Log Management** |
| Data looks stale | The page is a snapshot | Click **Refresh** |

## Related

- [Scheduler Management](/boss/rune-admin/schedulers)
- [Workloads](/boss/rune-admin/resources)
- [Log Management](/boss/rune-admin/logs)
