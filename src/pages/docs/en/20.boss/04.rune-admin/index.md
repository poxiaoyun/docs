---
title: 'Rune intelligent computing management'
updated: '2026-09-14'
description: 'Connect clusters, divide resource pools, define flavors and hand quotas to tenants — the admin home for the compute base.'
tags:
  - boss
  - rune-admin
---

# Rune intelligent computing management

This is where platform administrators maintain the **compute base**. Every machine, every accelerator card and every resource flavor that users can pick inside the AI Platform is first connected and allocated here; only then can instances be created.

If you have just taken over this platform, read the chapters in this order: **connect a cluster → divide resource pools → define flavors → assign tenant quotas → publish app templates**.

:::tip Remember these words first

- **Cluster** ≈ an entire data-centre building, with many machines inside.
- **Node** ≈ one server in that building.
- **Accelerator (GPU / NPU)** ≈ the "engine" inside a server that does the AI maths.
- **Resource pool** ≈ dividing the machines in the building into functional zones for different departments.
- **Flavor** ≈ a size chart for a package, stating "how many CPU cores / how much memory / how many cards".
- **Template** ≈ a pre-filled installation list that users can deploy in one click.
- **System app** ≈ the middleware that ships with the platform (monitoring, logging, gateway and so on).

:::

## Before you start

- You need a **system administrator** account; ordinary members cannot see the **AI Platform** group in the left-hand menu.
- Run the whole flow once on a test cluster before touching a production cluster.

## What each page helps you with

| Page | What it helps you with |
| --- | --- |
| [Cluster](/boss/rune-admin/clusters) | Connect a new data-centre building to the platform |
| [Cluster Status](/boss/rune-admin/cluster-overview) | See whether one cluster's CPU, memory, nodes and services are healthy |
| [Nodes & Accelerators](/boss/rune-admin/nodes-gpu) | See the state of every machine and every card |
| [Resource Pools](/boss/rune-admin/resource-pools) | Divide the machines into functional zones |
| [Flavors](/boss/rune-admin/flavors) | Define packages such as "how many cores and cards" |
| [Tenant Quotas](/boss/rune-admin/tenants) | Hand resources to tenants and workspaces |
| [App Templates](/boss/rune-admin/templates) | Maintain the installation lists users can deploy in one click |
| [System Template Market](/boss/rune-admin/system-market) | Deploy platform middleware from a template in one click |
| [System Apps](/boss/rune-admin/systems) | Manage the middleware instances already deployed |
| [Storage & Runtime](/boss/rune-admin/storage-runtime) | Manage storage and runtime instances |
| [Workloads](/boss/rune-admin/resources) | Look directly at the objects running in the cluster |
| [Dynamic Dashboard](/boss/rune-admin/dynamic-dashboard) | Assemble your own monitoring dashboard |
| [Logs & Scheduler](/boss/rune-admin/observability) | Query logs and adjust scheduling policy |

## How to tell you are in the right place

- The left-hand menu shows the **AI Platform** group, with **Cluster**, **Tenant Resource** and **App Template** under it.
- After opening a cluster from **Cluster**, the left-hand menu gains three sub-groups: **Cluster Status**, **Resource Management** and **Operations Management**.
