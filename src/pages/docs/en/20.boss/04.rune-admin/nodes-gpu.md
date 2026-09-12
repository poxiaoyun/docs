---
title: Nodes & Accelerators
updated: '2026-09-12'
description: Machine-centric dashboards for node health, GPU utilization, and resource hot spots inside a cluster.
tags:
- boss
- rune-admin
- node
- gpu
---

## Overview

The node page and the accelerator page give a "machine view" of cluster health, and are the main entry points for operators troubleshooting resource bottlenecks.

## Access Path

- Boss -> Cluster Management -> select a cluster -> Node Status
- Boss -> Cluster Management -> select a cluster -> Accelerator Info

> ⚠️ Note: Both pages are **monitoring dashboards aggregated by name** and do not provide a node inventory or node detail table. For node object information, use the Nodes tab on the cluster detail "Workloads" subpage.

## Node Dashboard

The node dashboard aggregates all monitoring dashboards whose **names contain `node`**, useful for watching:

- Node online status
- CPU and memory utilization
- Node pressure and anomaly alerts
- Node-level load distribution

## Accelerator Dashboard

The accelerator dashboard aggregates all monitoring dashboards whose **name or title (lowercased) contains `gpu` or `npu`**; if both NVIDIA GPU and NPU dashboards exist and the NPU dashboard originally comes after the NVIDIA GPU dashboard, the NPU dashboard is moved ahead of it. Useful for watching:

- Accelerator utilization
- VRAM occupancy
- Card-level load imbalance
- Hot spots and idle devices for a specific model

## Suggested Reading Order

1. Check the cluster overview first to confirm whether the signal is broad or localized.
2. If you suspect a node failure, open the node dashboard to identify the affected machines.
3. If you suspect insufficient compute or uneven card allocation, open the accelerator dashboard.
4. When you need to drill down to the object layer, combine it with the Kubernetes resource browser or the log page.
