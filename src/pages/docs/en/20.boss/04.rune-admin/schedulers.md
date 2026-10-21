---
title: Scheduler Management
updated: '2026-10-21'
description: Adjust a cluster's job scheduling policy visually — load a recommended configuration, arrange stages and plugins, preview, then save.
tags:
  - boss
  - rune-admin
  - scheduler
---

# Scheduler Management

Scheduler Management changes **a cluster's job scheduling policy**: whether jobs queue or preempt first, in what order they are allocated, and which plugins take part in the decision. It is aimed at administrators who already know scheduling, and one change affects queueing and allocation across the whole cluster.

After this page you will be able to load a recommended configuration, reorder stages and plugins, preview the change, save and roll it out, and know how to roll back a bad edit.

:::tip How it differs from "Scheduling"

- **Scheduling** is about **seeing results**: which queues exist now and where jobs are stuck.
- **Scheduler Management** is about **changing policy**: how jobs queue and are allocated from now on.

:::

## Before you start

- You need a **system administrator** account.
- The scheduler component is deployed in the cluster (you can deploy it from **System Apps**); without it this page cannot save.
- Validate a policy on a test cluster before changing production.

## How to open it

1. Click **AI Platform** in the top navigation bar, then click **Cluster Management** under the **AI Platform** group in the left sidebar.
2. Click into the target cluster.
3. Under the **Operations Management** group in the left-hand menu, click **Scheduler Management**.

## Page structure

| Area | Content |
| --- | --- |
| Configuration library on the left | **Custom configurations** and **Recommended configurations**; click **Use** to load one |
| **Stages** area in the middle | Ordering of the main scheduling flow, for example enqueue, allocate, backfill, reclaim, preempt |
| **Plugins** area in the middle | Plugins grouped by "plugin tier"; drag to reorder |
| Top right | **Preview**, **Refresh**, **Save** |

![Scheduler management page: custom or recommended configurations on the left, stages and plugins in two sections on the right](/assets/screenshots/boss/cluster-schedulers-01.png)

Each item expands on its own to show what it does. **Preview** at the top right shows the full configuration after your change — check it before clicking **Save**. Before editing, switch to **Recommended configurations** to compare with the defaults.

## Adjust the scheduling policy

1. Find the configuration you want under **Custom configurations / Recommended configurations** on the left and click **Use** to load it.
2. Drag a **stage** or **plugin** from the left into the matching area on the right; you can also drag within a tier to change the order.
3. Click **Preview** at the top right to see the effect of your edit.
4. If someone else changed the configuration meanwhile, click **Refresh** to pull the latest.
5. When it looks right, click **Save** — a **Saved successfully** message means it has been rolled out.

:::warning Scheduling policy affects the whole cluster
Stage order and plugin switches directly change how jobs queue and are allocated. A bad edit can lengthen queues or even leave jobs unallocated, so always validate on a test cluster first.
:::

:::info Editing is not supported on small screens
On narrow screens the page warns that it is not suitable for phone use — please use a computer.
:::

## Confirming the result

- A **Saved successfully** message appears after **Save**.
- Check **Scheduling** to see whether queues and job stages changed as expected.
- If the policy does not take effect after saving, click **Refresh** first to see whether another change overwrote it.

## Common questions

| What you see | Likely cause | What to do |
| --- | --- | --- |
| The save button is unavailable | The scheduler component is not deployed, or nothing actually changed | Deploy the scheduler from **System Apps**; make a real change before saving |
| Jobs queue even longer after saving | The new policy does not suit the current load | Load **Recommended configurations** to restore, then adjust gradually |
| The page asks for a larger screen | Narrow-screen restriction | Open it in a desktop browser |
| Changes disappear after refresh | Someone else edited the same configuration | Load and save again, or coordinate editing times with colleagues |

## Related

- [Scheduling](/boss/rune-admin/scheduling)
- [Log Management](/boss/rune-admin/logs)
- [System Apps](/boss/rune-admin/systems)
