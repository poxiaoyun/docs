---
title: 'System Template Market'
updated: '2026-09-14'
description: Pick a system template from the market and deploy cluster middleware such as monitoring, logging or a gateway in one click.
---

# System Template Market

The system template market is the cluster-level "infrastructure app store". Everything listed here is a template in the **System** domain — platform middleware such as monitoring, logging, storage and gateways. Pick a template, choose a version, fill in the parameters, and it is deployed to the current cluster.

By the end of this page you can: deploy a system app or a storage cluster from the market.

:::tip Two terms compared

- **Template** is a ready-made "installation list".
- **System app** is middleware that ships with the platform, such as monitoring, logging or a gateway.

:::

## Before you start

- You need a **System Administrator** account.
- Prerequisite: the cluster is connected to the platform, and the market must contain the template you want. If it does not, create and publish one first in [App Template](/boss/rune-admin/templates).

## Getting there

The market has no menu entry of its own; you reach it through the create button on the **System Apps** or **Storage Cluster** page:

- To deploy system middleware: **Cluster** → select a cluster → **Operations Management** group → **System Apps** → click **Create System App**.
- To deploy storage: **Cluster** → select a cluster → **Operations Management** group → **Storage Cluster** → click **Create Storage Cluster**.

Once inside, the page title shows **System App Template** or **Storage Cluster Template** depending on the category.

![System app templates: one card per deployable component (e.g. vpa) with version and language tags, and a deploy button](/assets/screenshots/boss/cluster-market-system-01.png)

The system market is a wall of cards; each gives a component name, a one-line description, a language and a version, and the **Deploy** button on the right installs it into the cluster. The first card is `vpa` (Kubernetes Vertical Pod Autoscaler, 1.6.0).

## Deploy in one click

1. Find the target template card in the market and click **Deploy**.
2. Choose the **version** to deploy.
3. On the deployment page, fill in the parameters item by item using the form the template provides (the parameters are defined by the template itself, so they differ between templates).
4. Submit the deployment; the platform starts creating the matching instance.

Once deployment finishes, go back to the **System Apps** or **Storage Cluster** list to see the instance's running status.

:::info The market has no category filter

The market page only shows templates in the System domain, so it does not offer a category filter. Whether a template is a system type or a storage type is decided by the template's own category.

:::

![Storage cluster templates: cards for storage components such as storage-nfs and storagevolume with their versions](/assets/screenshots/boss/cluster-market-storage-01.png)

Storage templates and system app templates are two categories of the same market, switched by the last URL segment (`system` vs `storage`). Deploying a storage template lays down a storage backend (`storage-nfs`, `storagevolume`) for storage volumes to use.

## Differences from the user app market

| Comparison | System template market | User app market |
| --- | --- | --- |
| Who it is for | System administrators | Ordinary users |
| Which templates | System-domain templates | User-domain templates |
| Where it deploys | The whole cluster | One workspace |
| How to get in | System Apps / Storage Cluster → Create | **Marketplace** in the AI Platform |

## Confirming the result

- After you submit the deployment, a new instance appears in the **System Apps** or **Storage Cluster** list, and its **Status** moves step by step from deploying to running.
- Click the instance name to open the detail page and see its basic information and related resources.

## Common questions

| Symptom | Likely cause | What to do |
| --- | --- | --- |
| The template you want is not in the market | No matching System-domain template has been published | Create and publish one first in [App Template](/boss/rune-admin/templates) |
| The deployment never comes up | Parameters are wrong or resources are insufficient | Check the status and events on the instance detail page, fix them and retry |
| There is no **Deploy** button | The template has no deployable version | Publish a version for the template in [App Template](/boss/rune-admin/templates) |

## Related

- [System Apps](/boss/rune-admin/systems)
- [Storage & Runtime](/boss/rune-admin/storage-runtime)
- [App Template](/boss/rune-admin/templates)
