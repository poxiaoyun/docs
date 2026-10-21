---
title: Storage Cluster
updated: '2026-10-21'
description: Manage a cluster's storage instances — see deployed storage clusters, deploy a new one from the application catalogue, and handle storage faults.
tags:
  - boss
  - rune-admin
  - storage
---

# Storage Cluster

Inference services, fine-tuning jobs and development environments all need to **store things**: model files, datasets, intermediate results. The storage cluster is the component in the cluster that handles this, and like system apps it is deployed from an application by version.

After this page you will be able to inspect existing storage instances, deploy a new storage cluster, and troubleshoot storage-related faults.

:::tip Two terms compared

- **Storage cluster** ≈ the component in the cluster dedicated to storing files.
- **Volume / StorageClass** ≈ an actual piece of storage and its type definition, viewed under **Workloads**.

:::

## Before you start

- You need a **system administrator** account.
- Prerequisite: the cluster is connected to the platform, and the application catalogue contains a "storage" application with an available version.

## How to open it

1. Click **AI Platform** in the top navigation bar, then click **Cluster Management** under the **AI Platform** group in the left sidebar.
2. Click into the target cluster.
3. Under the **Operations Management** group in the left-hand menu, click **Storage Cluster**.

## Storage cluster list

The list fields are the same as for system apps:

| Column | Meaning |
| --- | --- |
| Name | Instance name; click to open the detail page |
| Version | The application version chosen at deploy time |
| Status | Current stage of the instance |
| Created at | — |

Row actions: **Edit**, **Delete** (with confirmation); bulk delete is supported.

![Storage cluster list: name, version, status, creation time, with create-storage-cluster at the top right](/assets/screenshots/boss/cluster-storages-01.png)

**Status** is the key field: right after creation it may show syncing — wait a moment and refresh; once stable it reaches the running state.

## Deploy a storage cluster

1. On the instance list, click **Create storage cluster** at the top right.
2. Pick a storage application in the application catalogue.
3. Pick a version that has **passed validation**.
4. Fill in the deployment parameters the application asks for.
5. Click **Create** to submit, then go back to the list and watch the status reach the running state.

:::info Storage and system apps share one list
Both use the same instance list and detail page, only filtered by category — so the columns, actions and detail page are identical. The difference is just the entry point and the category selected.
:::

## Typical situations

- Initialise the baseline storage for a new cluster.
- Add a storage component that is missing.
- Investigate a platform-level storage instance that is misbehaving.

## Confirming the result

- The new instance appears in the list and its **status** eventually reaches the running state.
- Users can select the corresponding StorageClass and volume when creating workloads.

## Common questions

| What you see | Likely cause | What to do |
| --- | --- | --- |
| No option available when creating a volume | The cluster has no usable storage component | Deploy a storage cluster on this page |
| No storage application in the catalogue | No matching application or version yet | Create one and upload a version under [Applications](/boss/rune-admin/applications) |
| The storage instance is unhealthy | Wrong parameters, or insufficient node resources | Open the detail page, read the status and events, then retry |
| The list keeps showing syncing | Just deployed and the status has not synced yet | Wait a moment and refresh |

## Related

- [System Apps](/boss/rune-admin/systems)
- [Applications](/boss/rune-admin/applications)
- [Workloads](/boss/rune-admin/resources)
