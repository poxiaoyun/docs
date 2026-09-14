---
title: Overview
updated: '2026-09-14'
author: Rune Docs Team
description: Who BOSS is for, how it differs from the AI Platform, and what each sidebar group controls.
tags:
  - boss
  - overview
---

# Overview

BOSS (shown as **BOSS Platform** in the top-left corner) is the **platform-administrator-only** management console. It is where you manage every account, tenant, compute resource and switch across the whole platform. The everyday business interface that ordinary users work in is called the **AI Platform**. The two interfaces have different entrances and completely different menus, but they share the same data — a user you create in BOSS is the same person who later signs in to the AI Platform.

:::tip Telling the two apart in one sentence
BOSS decides **who may use the platform and how much they get** (accounts, tenants, quotas, clusters, platform switches); the AI Platform is where the work actually happens (creating inference services, running fine-tuning jobs, uploading models). What you configure in BOSS determines what is possible in the AI Platform.
:::

## BOSS versus the AI Platform

| Item | BOSS (the admin console on this page) | AI Platform |
| --- | --- | --- |
| Who uses it | Platform administrators and operations staff | Tenant admins, developers and members |
| What you mainly do | Create accounts and tenants, allocate compute, manage clusters, review content | Create inference services, run fine-tuning, manage models and datasets |
| How much data you see | Every tenant on the platform | Only the tenants you belong to |
| How to get in | Open the admin console with an administrator account | Sign in to the AI Platform with a normal account |

Both sides share the same accounts and tenants, so any change you make in BOSS immediately affects what users see in the AI Platform.

## The sidebar groups at a glance

After you sign in to BOSS, the left sidebar is divided into groups from top to bottom. The first 15 groups are always there; the last 4 appear only after you enter a specific tenant or cluster.

| Group | When it appears | What it controls | Menus inside |
| --- | --- | --- | --- |
| Overview | Always | Overall platform status | Home |
| Model Gateway | Always | Volume, latency and rankings of external model calls | Dashboard |
| Model Services | Always | Connecting and managing the models you expose | Channel Management, Model Configuration |
| User Management | Always | Gateway credentials and call history | Token Management, Call Logs |
| Security Services | Always | Content screening for model calls | Sensitive Word Management, Policy Management, Hit Records |
| Platform Settings | Always | Gateway runtime parameters and billing currency | Gateway Configuration, Currency Configuration |
| Asset Management | Always | Platform-wide models, datasets, images and Spaces | Models, Datasets, Images, Spaces |
| Data Sync | Always | Syncing models from external mirrors | Mirror |
| Security Audit | Always | Finding out who changed what and when | Audit Logs |
| System Settings | Always | Announcements and homepage banners shown to users | Announcements, Banners |
| Tenant | Always | Reserved group with no menu items yet | — |
| Cluster | Always | Reserved group with no menu items yet | — |
| AI Platform | Always | Compute clusters and tenant compute allocation | Cluster, Tenant Resource, App Template |
| Account Center | Always | User accounts and tenants | Account, Tenant |
| System Settings | Always | Platform-level configuration | System Member, Platform Settings, AI Platform Settings, Moha Hub Settings, Gateway Settings, AI Assistant Settings, License |
| Tenant Management | After entering a tenant | Members and compute quota of that tenant | Overview, Member, Quota, Workspace |
| Cluster Status | After entering a cluster | Health of that cluster | Cluster Status, Node Status, Accelerator Status |
| Resource Management | After entering a cluster | How compute is divided inside that cluster | Resource Pool, Flavor, Tenant Quotas |
| Operations Management | After entering a cluster | What runs inside the cluster and its logs | Workloads, Storage Cluster, System Apps, Scheduler Management, Log Management |

## What a platform administrator usually does first

1. **Create a tenant**: go to **Account Center → Tenant** and click **Add Tenant**. See [Tenant Management](/boss/iam/tenants).
2. **Create a user**: go to **Account Center → Account**, click **Add User**, and hand the generated password to the person. See [User Management](/boss/iam/users).
3. **Add the user to the tenant with a role**: go to **Account Center → Tenant**, click the tenant name, switch to the **Member** tab and click **Add Member**.
4. **Connect compute**: go to **AI Platform → Cluster** to connect a cluster, then configure its **Resource Pool** and **Flavor**. See [Rune Admin](/boss/rune-admin).
5. **Allocate compute to the tenant**: go to **AI Platform → Tenant Resource** and create a **Quota** for that tenant. See [Tenant Quotas](/boss/rune-admin/tenants).
6. **Configure the platform as needed**: use the **System Settings** group to set up platform settings, AI Platform settings, Moha Hub settings, gateway settings and more. See [Platform](/boss/settings).

:::info Order matters
Without a tenant, a user has nowhere to belong; without clusters and quotas, a tenant cannot be given compute. Follow steps 1 to 5 above so that later screens do not leave you with empty dropdowns.
:::

## Related

- [Home](/boss/dashboard)
- [Account Center](/boss/iam)
- [Model Gateway](/boss/gateway)
- [Moha Repository Management](/boss/moha-admin)
- [Rune Admin](/boss/rune-admin)
- [Platform](/boss/settings)
