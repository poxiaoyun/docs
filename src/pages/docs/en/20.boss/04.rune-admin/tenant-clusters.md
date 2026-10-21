---
title: 'Tenant Clusters'
updated: '2026-10-21'
description: Start from a tenant, see which clusters it is enabled on, enable it on another cluster, open its settings, or retry a failed status read.
tags:
  - boss
  - rune-admin
---

# Tenant Clusters

**Tenant Clusters** is enablement management seen from the tenant: pick a tenant and see its status on every cluster, then enable it where needed.

After reading this page you can find which clusters a tenant uses, enable it on a cluster, open its quota configuration, and retry when the status cannot be read.

:::tip An analogy
Enablement is **issuing this company an access card for this building**: the building already exists (the cluster is connected), and once the card is issued the company's people may use the machines inside.
:::

## Key terms

| Term | Plain explanation |
| --- | --- |
| Enabled clusters | The clusters this tenant is already allowed to use |
| Enablement status | Not Opened / Opening / Enabled / Failed |
| Configure | Open "this tenant + this cluster" details to set quotas, flavor access and workspaces |
| Open in Cluster | Create the enablement for this tenant on that cluster |

## Before you start

- You need a **system administrator** account.
- The tenant must exist (see [Tenant Management](/boss/iam/tenants)) and the cluster must be connected and published (see [Cluster Management](/boss/rune-admin/clusters)).

## Getting there

Click **AI Platform** in the top bar, then **Tenant Clusters** in the sidebar.

## The tenant list

| Column | Meaning |
| --- | --- |
| Name | Tenant name; click to open its cluster list |
| Enabled clusters | Which clusters are enabled. It may show **Loading enabled clusters**, **No clusters enabled**, **View all N enabled clusters**, or **Load more clusters** |
| Created at | When the tenant was created |

![Tenant Clusters: one row per tenant, with the enabled clusters shown as chips and an expand action](/assets/screenshots/boss/rune-tenant-clusters-01.png)

## Tenant details: cluster by enablement status

Opening a tenant shows the title "Tenant / name / Select cluster" followed by the tenant's status on **every** cluster:

| Column | Meaning |
| --- | --- |
| Cluster | Cluster name and ID; click to open the cluster dashboard |
| Enablement status | Not Opened / Opening / Enabled / Failed, with the failure reason when applicable |

Row actions appear based on status, usually one per row:

| Action | When it appears | What it does |
| --- | --- | --- |
| Configure | The tenant is enabled and the status can be read | Opens the in-cluster tenant details (overview / quota / flavor access / workspace) |
| Open in Cluster | The cluster is **not yet enabled** for this tenant | Opens the enablement form for this tenant on that cluster |
| Retry | Reading the status failed | Re-reads the cluster list and enablement states |

## Enable a cluster for a tenant

1. Go to **AI Platform → Tenant Clusters** and open the tenant.
2. On a cluster showing **Not Opened**, click **Open in Cluster**.
3. Confirm the tenant and cluster, then submit.
4. The status moves to **Opening** and then **Enabled**; on failure it shows **Failed** with a reason in the status message.

Once enabled, click **Configure** on that row to set [quota](/boss/rune-admin/tenants), flavor access and workspaces.

:::warning Enablement is only the access card
An enabled tenant still has **no capacity**. Create a quota under **Configure → Quota** before users can consume compute.
:::

## Verify the result

| What you want to confirm | Where to look |
| --- | --- |
| How many clusters are enabled | The **Enabled clusters** column |
| Whether one cluster succeeded | The enablement status on the tenant details |
| Whether it is usable | Open **Configure → Quota** and confirm a quota exists |

## FAQ

| Symptom | Likely cause | What to do |
| --- | --- | --- |
| "No clusters enabled" | The tenant has not been enabled anywhere | Open the tenant and use **Open in Cluster** |
| No "Open in Cluster" action | The cluster is already enabled, or the status is still loading | Refresh; for enabled rows use **Configure** |
| Status stuck at "Opening" | The platform is still preparing resources | Wait and click **Retry**; if it persists, check the cluster |
| Enablement failed with insufficient resources | The pool has no free capacity | Expand the pool or lower quota limits |
| Only some clusters are listed | The list is paginated | Page through the list |

## Related

- [Tenant Resources](/boss/rune-admin/tenants)
- [Resource Pools](/boss/rune-admin/resource-pools)
- [Flavors](/boss/rune-admin/flavors)
- [Tenant Management](/boss/iam/tenants)
