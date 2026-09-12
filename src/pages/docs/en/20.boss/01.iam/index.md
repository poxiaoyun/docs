---
title: Account Center
updated: '2026-09-12'
description: Users vs tenants, and the order to set them up.
tags:
  - boss
  - iam
---

# Account Center

**Account Center** is where BOSS answers "who may use the platform, and which organization do they belong to". It has only two menus: **Account** and **Tenant**. Every account and every organization on the platform is created here.

:::tip Users and tenants in one sentence
A **user** is one person; a **tenant** is one company. A person must first be created as a user, then be added to a tenant, before they can sign in and use the AI Platform.
:::

## The two subpages

| Subpage | What it covers | Details |
| --- | --- | --- |
| Account | Creating platform accounts, editing profiles, resetting passwords, deleting accounts | [User Management](/boss/iam/users) |
| Tenant | Creating tenants, enabling/disabling, configuring image push, managing tenant members | [Tenant Management](/boss/iam/tenants) |

## The words you need first

| Term | Plain explanation |
| --- | --- |
| User | One platform account for one person. A user can belong to several tenants |
| Tenant | A company's isolated account space on the platform, with its own members, quota and workspaces |
| Member | What a user becomes after joining a tenant; the record carries their role in that tenant |
| Role | What that person may do inside that tenant, such as Administrator, Developer or Member |

## The order to do things in

1. **Create the tenant first**: without a tenant, users have nowhere to belong and quota cannot be calculated. See [Tenant Management](/boss/iam/tenants).
2. **Create users next**: the system generates an initial password for you; copy it and hand it to the person. See [User Management](/boss/iam/users).
3. **Add users to the tenant**: on the tenant's **Member** tab click **Add Member**, pick the user and pick a role.
4. **Allocate compute to the tenant**: switch to **AI Platform → Tenant Resource** and create a quota for that tenant. See [Tenant Quotas](/boss/rune-admin/tenants).

:::info Don't confuse this with a user's own profile
Inside the AI Platform, users can change their own nickname, email and password and turn on multi-factor authentication — that is personal settings. Account Center here is the **administrator view**, used to set up people and organizations in bulk. If a user forgets their password, an administrator can reset it for them from BOSS.
:::

## FAQ

| Symptom | Explanation | What to do |
| --- | --- | --- |
| No enable/disable switch in the user list | Users genuinely do not have one | To stop an account, delete the user or remove them from their tenants |
| Want to delete a tenant | There is no delete entry in the UI | You can only **disable** a tenant, or remove its members and keep it disabled |
| Can a deleted account be restored | No | Before deleting, check which tenants the user belongs to on the tenant's **Member** tab |

## Related

- [User Management](/boss/iam/users)
- [Tenant Management](/boss/iam/tenants)
- [Tenant Quotas](/boss/rune-admin/tenants)
- [Home](/boss/dashboard)
