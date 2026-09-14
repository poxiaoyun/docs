---
title: Workloads
updated: '2026-09-14'
description: 'Browse the objects running in a cluster by type, to confirm that something was created and is in the state you expect.'
tags:
- boss
- rune-admin
- kubernetes
---

# Workloads

Workloads (the Kubernetes resource browser) is the cluster's "object view": it lists what is running in the cluster by type, so you can confirm whether a particular object was created and where it lives.

The names here are fairly technical, so use this table for reference:

| Tab in the interface | Plain explanation |
| --- | --- |
| Node | One machine |
| Pod | A group of containers that run together; the smallest unit of execution |
| Deployment / StatefulSet / DaemonSet | Three ways of keeping a program running |
| Job / CronJob | A task that runs once / a task that runs on a schedule |
| Service / Ingress / IngressClass | Ways of exposing a program to callers |
| StorageClass / PersistentVolumeClaim | Ways of defining and using storage |
| ConfigMap / Secret | Where configuration and sensitive values are kept |

## Before you start

- You need a **system administrator** account.
- Prerequisite: the cluster is connected to the platform.

## How to open it

1. Click **AI Platform** in the top navigation bar, then click **Cluster** under the **AI Platform** group in the left sidebar, then open the target cluster.
2. In the left-hand **Operations Management** group, click **Workloads**.

The page opens on the **Pod** tab by default, and the top bar switches between 14 resource types.

![Workloads page: a vertical strip of resource tabs (pods, nodes, deployments, stateful sets, …) with filters and a list on the right](/assets/screenshots/boss/cluster-resources-01.png)

The Workloads page compresses a whole set of Kubernetes resources into one page, switched by the vertical tab strip on the left. **Pods** is selected in the screenshot and the URL follows as `/resources/core/v1/pods`. The tabs you will use most are **Pods**, **Nodes**, **Deployments** and **Services**.

## Supported tabs

Pod, Node, Deployment, StatefulSet, DaemonSet, Job, CronJob, Service, Ingress, IngressClass, StorageClass, ConfigMap, Secret, PersistentVolumeClaim.

## What you can do

| Capability | Meaning |
| --- | --- |
| Switch tabs | Move between resource types to view their object lists |
| View the list | Show columns such as name, namespace and status as defined for that type |
| View details | Click an object name to open its details, with basic information, status, events and YAML |
| Node actions | On the **Node** tab you can **Cordon** or **Uncordon** a machine, with a confirmation dialog |

:::tip When to use this page

- You want to confirm that an object was created successfully.
- You want to know which namespace a Service, Ingress or PersistentVolumeClaim lives in.
- You want to temporarily stop a machine from accepting work (for example before maintenance).

If what you care about is capacity, load or performance, **Cluster Status**, **Node Status** or **Accelerator Status** will answer you more directly.

:::

## Confirming the result

- The target object appears on the matching tab, in the state you expect.
- After you use **Cordon** on the **Node** tab, that machine is marked as no longer accepting new work; **Uncordon** restores it.

## Related

- [Nodes & Accelerators](/boss/rune-admin/nodes-gpu)
- [Logs & Scheduler](/boss/rune-admin/observability)
- [Storage & Runtime](/boss/rune-admin/storage-runtime)
