---
title: System Apps
updated: '2026-09-12'
description: Manage the infrastructure components deployed in a cluster, such as monitoring, logging or a gateway, and view, edit or delete them.
---

# System Apps

System apps are **infrastructure-level components** deployed in a cluster, such as monitoring, logging, storage and gateways. They serve the whole cluster and are deployed in one click from templates in the system template market.

By the end of this page you can: view the system apps already deployed, deploy a new one, and edit or delete them.

:::tip Two terms compared

- **System app** is middleware that ships with the platform, such as monitoring, logging or a gateway.
- **Template** is a ready-made "installation list", and a system app is installed from one.

:::

## Before you start

- You need a **System Administrator** account.
- Prerequisite: the cluster is connected to the platform, and to deploy a new component the market must contain a matching System-domain template.

## Getting there

1. In the left sidebar click **AI Platform** → **Cluster**, then open the target cluster.
2. In the left sidebar under **Operations Management**, click **System Apps**.

## Reading the instance list

| Column | Meaning |
| --- | --- |
| Name | The instance name; click to open the detail page |
| Version | The template version used for deployment |
| Status | The instance's current status |
| Created At | — |

Actions on each row: **Edit**, **Delete** (with a confirmation dialog); multi-select batch deletion is supported.

## Deploy a new system app

1. On the instance list, click **Create System App** in the top right.
2. The page jumps to the **System Template Market**.
3. Choose a template and a version, then click **Deploy**.
4. On the deployment page, fill in the parameters the template asks for.
5. After you submit, you return to the list; the new instance appears first and its status moves step by step to running.

See [System Template Market](/boss/rune-admin/system-market) for details.

## Manage existing instances

- **View details**: click the instance name to open the detail page and see its basic information and related resources.
- **Edit**: change the configurable parts of this instance.
- **Delete**: click **Delete** and confirm; the related resources are released after deletion.

:::warning Deleting middleware affects the whole cluster

Deleting a system app can make the cluster's monitoring, logging or gateway capability unavailable. Make sure no workload depends on it before you delete.

:::

## Differences from user app instances

| Comparison | System app | User app instance |
| --- | --- | --- |
| Where it comes from | The system template market | The user app market |
| Scope | The whole cluster | One workspace |
| Where you manage it | Cluster → System Apps | **Apps** in the AI Platform |

## Confirming the result

- The new instance appears in the list, and its **Status** eventually becomes running.
- Open it and you can see the basic information and related resources, with no errors.

## Common questions

| Symptom | Likely cause | What to do |
| --- | --- | --- |
| The status never becomes running | The deployment parameters are wrong or the cluster lacks resources | Open the detail page, check the events, fix them and retry |
| The logs / monitoring page has no data | The component is not installed or has been deleted | Confirm on this page whether the component is running |

## Related

- [System Template Market](/boss/rune-admin/system-market)
- [Storage & Runtime](/boss/rune-admin/storage-runtime)
- [Logs & Scheduler](/boss/rune-admin/observability)
