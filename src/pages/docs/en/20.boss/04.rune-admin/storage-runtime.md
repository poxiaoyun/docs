---
title: Storage Cluster & Runtime
updated: '2026-09-12'
description: How storage instances, system instances, and the system template market are managed in a Boss cluster.
tags:
- boss
- rune-admin
- storage
- system
---

## Overview

From the single-cluster perspective, Boss manages not only business workloads but also the storage and system-level instances the platform needs to run.

## Related Pages

| Page | Frontend Route | Purpose |
| --- | --- | --- |
| Storage Clusters | `/rune/clusters/:cluster/storages` | Shows the cluster's storage-class instances as an instance list; add, view, and delete |
| System Apps | `/rune/clusters/:cluster/systems` | Shows system-level instances and their running status |
| System Template Market | `/rune/clusters/:cluster/system-market` | Pick a template from the market and deploy a new system / storage instance |

## Storage Clusters

Storage Clusters and System Apps **share the same instance list component**, distinguished by `category`: storage is `category = storage`.

List columns: `name`, `product.version`, `status.phase`, `creationTimestamp`; actions support edit and delete.

Common usage:

1. Open the cluster's "Storage Clusters" page to view existing storage instances.
2. Click Add to navigate to the system template market and pick a storage-class template.
3. Fill in the deployment parameters and submit, then return to the list to confirm the running status.

## System Apps and the System Market

System Apps target whole-cluster or platform-side infrastructure, and their deployment source is the System Template Market. For details, see [System Instance Management](./systems) and [System Template Market](./system-market).

## Good Use Cases

- Initialize the baseline capabilities of a new cluster.
- Install additional shared runtime components.
- Troubleshoot abnormal runs of platform-level storage instances.
