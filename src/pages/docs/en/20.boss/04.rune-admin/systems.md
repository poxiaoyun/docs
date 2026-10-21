---
title: System Apps
updated: '2026-10-21'
description: Manage the middleware instances deployed in a cluster (monitoring, logging, gateway and so on) and deploy new ones from the application catalogue by version.
tags:
  - boss
  - rune-admin
---

# System Apps

System apps are the **infrastructure-level components** deployed in a cluster, such as monitoring, logging and gateways. They serve the whole cluster and are deployed in one click from an application in the "system" domain, by version.

After this page you will be able to inspect deployed system apps, deploy a component from the application catalogue, and edit or delete existing instances.

:::tip Two terms compared

- **System app** ≈ middleware that ships with the platform (monitoring, logging, gateway and so on).
- **Application** ≈ a pre-built "installation list"; system apps are installed from applications in the system domain, maintained under **AI Platform → Applications**.

:::

## Before you start

- You need a **system administrator** account.
- Prerequisite: the cluster is connected to the platform. To deploy a new component the catalogue needs a "system" domain application with at least one usable version.

## How to open it

1. Click **AI Platform** in the top navigation bar, then click **Cluster Management** under the **AI Platform** group in the left sidebar.
2. Click into the target cluster.
3. Under the **Operations Management** group in the left-hand menu, click **System Apps**.

## Reading the instance list

| Column | Meaning |
| --- | --- |
| Name | Instance name; click to open the detail page |
| Version | The application version chosen at deploy time |
| Status | Current stage of the instance |
| Created at | — |

Row actions: **Edit**, **Delete** (with confirmation). Tick several rows to delete in bulk; there is a refresh control at the top right.

![System apps list: name, version, status, creation time, with create-system-app at the top right](/assets/screenshots/boss/cluster-systems-01.png)

## Deploy a new system app

1. On the instance list, click **Create system app** at the top right.
2. The page opens the **application catalogue**: cards list the system applications deployable in this cluster, with search and paging.
3. Pick an application to open its configuration page.
4. In the application info card at the top, choose a version with the **version selector**. The drop-down lists only versions that have **passed validation**; if the application or version is unavailable the page says so directly.
5. Fill in the deployment form below as the application requires. The instance name has a default value you can change.
6. Click **Create** to submit; the page returns to the instance list.

:::info The component you want is not in the catalogue
The catalogue only shows published versions of applications in the "system" domain. If it is missing, no matching application or version exists yet — go to **AI Platform → Applications**, create the application, upload a version and adjust its visibility.
:::

## Managing existing instances

| Action | Meaning |
| --- | --- |
| Details | Click the instance name to see basic information and related resources |
| Edit | Change the configurable parts of this instance |
| Delete | Confirm to delete and release the related resources; bulk delete is supported |

:::warning Deleting middleware affects the whole cluster
Deleting a system app can take away the cluster's monitoring, logging or gateway capability. Confirm nothing depends on it before deleting.
:::

## How it differs from a user's application instance

| Aspect | System app | User's application instance |
| --- | --- | --- |
| Where it comes from | An application in the "system" domain of the catalogue | The user's own or a public application |
| Scope | The whole cluster | One workspace |
| Where it is managed | Cluster → System Apps | The business pages of the AI platform |

## Confirming the result

- The new instance appears in the list and its **status** eventually reaches the running state.
- Opening it shows basic information and related resources with no errors.
- The monitoring and log pages start showing data, meaning the component is ready.

## Common questions

| What you see | Likely cause | What to do |
| --- | --- | --- |
| The application catalogue is empty | No system domain application, or no published version | Create the application and upload a version under **Applications** first |
| The version drop-down is empty | The application has no version that passed validation | Re-upload or fix the version |
| The status never reaches running | Wrong deployment parameters, or insufficient cluster resources | Open the detail page, read the events, fix and retry |
| The log or monitoring pages have no data | The matching component is not installed or was deleted | Check on this page whether the component is running |
| Deploying reports the application is unavailable | The category or domain does not match | Confirm the chosen application is in the "system" domain with the right category |

## Related

- [Storage Cluster](/boss/rune-admin/storage-cluster)
- [Applications](/boss/rune-admin/applications)
- [Log Management](/boss/rune-admin/logs)
- [Alerts](/boss/rune-admin/alerts)
