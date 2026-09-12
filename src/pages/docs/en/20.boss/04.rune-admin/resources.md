---
title: Workloads
updated: '2026-09-12'
description: Tab pages and use cases of the cluster-level Kubernetes resource browser in Boss.
tags:
- boss
- rune-admin
- kubernetes
---

## Overview

Boss provides a unified Kubernetes resource browser entry on the cluster detail page (the "Workloads" sidebar item), letting administrators view core objects in the cluster directly.

## Access Path

Boss -> Cluster Management -> select a cluster -> Workloads

Frontend route: `/rune/clusters/:cluster/resources`

## Supported Resource Tabs

The frontend currently has the following built-in resource type tabs:

- Pods
- Nodes
- Deployments
- StatefulSets
- DaemonSets
- Jobs
- CronJobs
- Services
- Ingresses
- IngressClasses
- StorageClasses
- ConfigMaps
- Secrets
- PersistentVolumeClaims

## Page Capabilities

| Capability | Description |
| --- | --- |
| Tab switching | Switch between resource types to quickly browse object lists |
| List display | Shows fields such as status, name, and namespace per the resource definition |
| Resource actions | Some resources support viewing details or performing additional actions |
| Node extended actions | Under the Nodes tab, further node operations can be combined |

## Good Use Cases

- Confirm whether a Kubernetes object was created successfully.
- Check related resources such as Services, Ingresses, and PVCs in a namespace.
- Cross-check with the cluster logs, events, and monitoring pages.

> 💡 Tip: The resource browser is suited to an "object view" investigation; if you care about capacity, load, or performance, start with the overview, node, or GPU dashboards instead.
