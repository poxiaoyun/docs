---
title: Storage Cluster & Runtime
updated: '2026-09-14'
description: Manage a cluster's storage instances and platform runtime components so workloads have persistent storage.
tags:
- boss
- rune-admin
- storage
- system
---

# Storage Cluster & Runtime

The inference services, fine-tuning jobs and development environments that users create all need somewhere to store things: model files, datasets, intermediate results. The Storage Cluster page is where you manage that storage capability, and like System Apps it is an instance deployed from a template.

By the end of this page you can: view the storage instances already in a cluster, deploy a new storage cluster, and troubleshoot storage-related problems.

:::tip Two terms compared

- **Storage cluster** is the component in a cluster that is dedicated to storing files.
- **System app** is middleware that ships with the platform, such as monitoring, logging or a gateway.

:::

## Before you start

- You need a **System Administrator** account.
- Prerequisite: the cluster is connected to the platform, and the market must contain a storage-class System-domain template.

## Getting there

1. Click **AI Platform** in the top navigation bar, then click **Cluster** under the **AI Platform** group in the left sidebar, then open the target cluster.
2. In the left sidebar under **Operations Management**, click **Storage Cluster**.

## The storage cluster list

The list fields are the same as for System Apps:

| Column | Meaning |
| --- | --- |
| Name | The instance name; click to open the detail page |
| Version | The template version used for deployment |
| Status | The instance's current status |
| Created At | — |

Actions on each row: **Edit**, **Delete** (with a confirmation dialog).

![Storage cluster list: name, version, status and creation time, with Create storage cluster at the top right](/assets/screenshots/boss/cluster-storages-01.png)

Four columns, and **Status** is the one to watch: `测试juicefs` reads "Syncing status", meaning the cluster is fresh and its state has not been reported back yet — refresh in a moment. Once settled it shows a running state.

## Deploy a storage cluster

1. On the instance list, click **Create Storage Cluster** in the top right.
2. The page jumps to the **System Template Market** (storage category).
3. Choose a storage-class template and a version, then click **Deploy**.
4. On the deployment page, fill in the parameters the template asks for.
5. After you submit, return to the list and confirm the instance status moves step by step to running.

:::info Storage and system apps share one list

Storage clusters and system apps share the same instance list and differ only by category. So the ways to operate them, the columns and the detail page are all the same — only the entry point and the template category differ.

:::

## Platform runtime components

Besides storage, a cluster also runs platform runtime components such as monitoring, logging and gateways. These are managed on the **System Apps** page, and they too are deployed from the system template market; see [System Apps](/boss/rune-admin/systems) and [System Template Market](/boss/rune-admin/system-market).

## Typical use cases

- Initialize the baseline storage capability of a new cluster.
- Install a missing shared runtime component.
- Troubleshoot a platform-level storage instance that is running abnormally.

## Confirming the result

- The new instance appears in the list, and its **Status** eventually becomes running.
- On the user side, the matching storage capability becomes selectable when creating an instance.

## Common questions

| Symptom | Likely cause | What to do |
| --- | --- | --- |
| There is nothing to choose when creating a storage volume | The cluster has no usable storage component | Deploy a storage cluster on this page |
| The storage instance is abnormal | The parameters are wrong or the node lacks resources | Open the detail page, check the status and events, then retry |

## Related

- [System Apps](/boss/rune-admin/systems)
- [System Template Market](/boss/rune-admin/system-market)
- [App Template](/boss/rune-admin/templates)
