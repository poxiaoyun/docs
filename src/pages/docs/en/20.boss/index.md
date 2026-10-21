---
title: Overview
updated: '2026-10-21'
author: Rune Docs Team
description: What BOSS is for, what the eight top-level entries do, when the left sidebar switches groups, and which steps a platform administrator should take first.
tags:
  - boss
  - overview
---

# Overview

BOSS (shown as **BOSS Platform** in the top-left corner) is the **platform-administrator-only** management console. It manages accounts, tenants, compute resources and platform-wide switches. The business-facing consoles are the **AI Platform** and **Moha Hub** — separate entries, separate menus, but the same data: the user you create here is the person who later signs in to the AI Platform.

After reading this page you will know where each of the eight top-level entries leads, why the left sidebar sometimes shrinks to two or three items, where the three cluster sub-menus come from, and what to do first when you take over a platform.

:::tip How the two sides split the work
BOSS answers "who may use the platform, and how much" (accounts, tenants, quotas, clusters, platform switches). The AI Platform and Moha Hub answer "how exactly" (create an inference service, run fine-tuning, upload models). What you configure in BOSS decides what is possible in the AI Platform.
:::

## BOSS versus the AI Platform

| Item | BOSS (this console) | AI Platform / Moha Hub |
| --- | --- | --- |
| Who uses it | Platform administrators and operations staff | Tenant admins, developers and members |
| What you mainly do | Create accounts and tenants, allocate compute, manage clusters, review content | Create inference services, run fine-tuning, manage models and datasets |
| How much data you see | Every tenant on the platform | Only the tenants you belong to |
| How to get in | Open the admin console with an administrator account | Sign in to the AI Platform with a normal account |

Both sides share the same accounts and tenants, so any change you make in BOSS immediately affects what users see.

## The eight top-level entries

The top bar is the product-level navigation: clicking one entry replaces the whole left sidebar.

| Top entry | What you land on | Left sidebar shows |
| --- | --- | --- |
| Home | Platform overview cards: resource totals, gateway traffic, items needing attention | Overview |
| AI Platform | Cluster Management, Tenant Clusters, Application | AI Platform |
| Moha Hub | Models, Datasets, Images, Spaces, Mirror, Audit Logs, Announcements, Banners | Asset Management / Data Sync / Security Audit / System Settings |
| Model Gateway | Data dashboard, channels, model metadata, tokens, call logs, moderation, gateway config, currency | Model Gateway / Model Service / User Management / Security Service / Platform Settings |
| Account Center | Users, tenants, plus Authentication policy, Third-party authentication, Email providers and SMS providers under System Management | Account Center / System Management |
| Platform Settings | System members, per-product settings, license, platform audit | Platform |
| **Alert channels** | Where alerts are delivered: Feishu, email, and the built-in in-app inbox | Platform (this page has **no** sidebar entry) |
| **Digital Twin** | An introduction page with an entry button | Platform (this page has **no** sidebar entry) |

**Alert channels** and **Digital Twin** are top-level entries only; you will not find them in the left sidebar.

## Sidebar groups

The left sidebar only shows the groups of the current area. If a menu seems to be missing, you are most likely in another area rather than missing a permission.

| Group | Shown when | Items |
| --- | --- | --- |
| Overview | You are on Home | Home |
| AI Platform | AI Platform area, application pages | Cluster Management, Tenant Clusters, Application |
| Account Center | Account Center area | User Management, Tenant Management |
| System Management | Account Center area | Authentication policy, Third-party authentication, Email providers, SMS providers |
| Asset Management | Moha Hub area | Models, Datasets, Images, Spaces |
| Data Sync | Moha Hub area | Mirror |
| Security Audit | Moha Hub area | Audit Logs |
| System Settings | Moha Hub area | Announcements, Banners |
| Platform | Platform Settings area, platform audit | System Member, Platform Settings, AI Platform Settings, Moha Hub Settings, Gateway Settings, License, Platform Audit |
| Cluster Status | Inside a cluster | Cluster Status, Node Status, Accelerator Status |
| Resource Management | Inside a cluster | Resource Pool, Flavor, Tenant Resources |
| Operations Management | Inside a cluster | Workloads, Storage Cluster, System Apps, Scheduling, Scheduler Management, Log Management, Alerts |

The two empty groups **Tenant** and **Cluster** have no items at all and never appear.

## Three levels inside a cluster

Opening any cluster from **Cluster Management** replaces the sidebar with three cluster-specific groups:

| Group | Items | What it is for |
| --- | --- | --- |
| Cluster Status | Cluster Status, Node Status, Accelerator Status | Three dashboards: whole cluster, per node, per accelerator |
| Resource Management | Resource Pool, Flavor, Tenant Resources | How nodes are grouped, which flavors exist, how quota is granted |
| Operations Management | Workloads, Storage Cluster, System Apps, Scheduling, Scheduler Management, Log Management, Alerts | What runs in the cluster, how it is scheduled, how to investigate problems |

The three dashboards share one renderer and differ only by the last segment of the address. **Resource Pool / Flavor / Tenant Resources** is where compute is divided. **Alerts** is a real rule page, not a placeholder.

## First steps for a platform administrator

1. **Create a tenant**: **Account Center → Tenant Management**, then **Add Tenant**. See [Tenant Management](/boss/iam/tenants).
2. **Create a user**: **Account Center → User Management**, then **Add User**, and hand the generated password to the person. See [User Management](/boss/iam/users).
3. **Add the user to the tenant with a role**: open the tenant, switch to the **Members** tab, click **Add Member**.
4. **Connect compute**: **AI Platform → Cluster Management**, then configure **resource pools** and **flavors** inside the cluster. See [AI Platform Administration](/boss/rune-admin).
5. **Enable clusters for the tenant and grant quota**: use **AI Platform → Tenant Clusters** to enable clusters, then create quotas under the cluster's **Tenant Resources**. See [Tenant Clusters](/boss/rune-admin/tenant-clusters) and [Tenant Resources and Quota](/boss/rune-admin/tenants).
6. **Configure sign-in and notifications**: set up authentication policy, email and SMS providers under **Account Center → System Management**, and delivery channels in **Alert channels**. See [Authentication Policy](/boss/iam/authentication-policy) and [Alert Channels](/boss/settings/alert-channels).
7. **Tune the platform**: use the **Platform** group for platform, AI Platform, Moha Hub and gateway settings. See [Platform](/boss/settings).

:::info Order matters
Without a tenant a user has no home; without a cluster, an enablement and a quota, a tenant gets no compute. Follow steps 1 to 5 in order so later steps never end with an empty dropdown.
:::

## FAQ

| Symptom | Likely cause | What to do |
| --- | --- | --- |
| The sidebar only has two or three items | The top bar is on another area | Click the target area in the top bar; the sidebar switches as a whole |
| Cannot find "Alert channels" or "Digital Twin" | They are top-bar entries without sidebar items | Click them in the top bar |
| Cannot find "Authentication policy" | It lives under **System Management** inside **Account Center** | Click **Account Center** in the top bar, then look at the sidebar |
| Cannot find "Tenant Resources" | It only exists inside a cluster | Open a cluster from **Cluster Management** first |

## Related

- [Home](/boss/dashboard)
- [Account Center](/boss/iam)
- [Authentication Policy](/boss/iam/authentication-policy)
- [Model Gateway](/boss/gateway)
- [Moha Repository Management](/boss/moha-admin)
- [AI Platform Administration](/boss/rune-admin)
- [Platform](/boss/settings)
- [Alert Channels](/boss/settings/alert-channels)
- [Digital Twin](/boss/digital-twin)
