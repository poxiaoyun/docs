---
title: Cluster Status
updated: '2026-09-12'
description: The overview dashboard on the cluster detail page, and how to reach the various governance pages from it.
tags:
- boss
- rune-admin
- cluster
---

## Overview

Cluster Overview (the "Cluster Info" sidebar item) is the main view after an administrator enters a single Rune cluster, used to inspect baseline resource panels and monitoring dashboards.

## Access Path

Boss -> Cluster Management -> select a cluster -> Cluster Info

Frontend route: `/rune/clusters/:cluster/overview`

## Page Structure

The overview page renders the cluster dashboard configuration delivered by the backend and keeps only the **basic dashboards whose names contain `basic`**; it does not include an accelerator dashboard (that lives on the "Accelerator Info" subpage).

| Area | Description |
| --- | --- |
| Cluster baseline monitoring | Baseline metrics such as CPU, memory, nodes, and core services |
| Dynamic variable filters | Switch the view using variables provided by the monitoring template |
| Drill-down entries | Enter the node, GPU, storage, log, and resource pages from the overview |

## Typical Uses

- Confirm whether the cluster is healthy overall.
- After spotting an anomaly, continue into the node or log pages to locate the problem.
- Observe the current cluster load before scaling, upgrading, or adjusting scheduling.
