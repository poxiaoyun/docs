---
title: 'Roles and Permissions'
updated: '2026-10-21'
description: What administrators, developers, and members can each do, where to check your own role, and why some entries are hidden.
---

# Roles and Permissions

Your role decides which buttons you can use inside the current tenant. The same menu may be editable for an administrator
and read-only for a developer, and the difference comes from the role you were given. After this page you will know what the
three roles can do, where to find your own role, and why some entries are simply not shown.

:::tip A comparison
A role is like your access level in a company: an administrator has a card for a whole floor, a developer can enter the server room
but not touch personnel files, and a member can only swipe into the public areas. Which menus you see and which buttons you can press all follow from it.
:::

## Before you start

- A role applies inside a tenant, so first confirm which tenant you are in.
- To see the member list and your own role you must be an **Administrator** of that tenant; you cannot look up other people's roles.

## What the three roles can do

| Capability | Administrator | Developer | Member |
| --- | :---: | :---: | :---: |
| View workspaces | ✅ | ✅ | ✅ |
| Create / edit / delete workspaces | ✅ | ❌ | ❌ |
| View instances (inference, training and fine-tuning, development environments, and more) | ✅ | ✅ | ✅ |
| Create / start / stop / delete instances | ✅ | ✅ | ❌ |
| View images | ✅ | ✅ | ✅ |
| Create / edit / delete images | ✅ | ❌ | ❌ |
| View presets and flavors | ✅ | ✅ | ❌ |
| Create / edit / delete presets and flavors | ✅ | ❌ | ❌ |
| Manage members | ✅ | ❌ | ❌ |
| Manage quotas | ✅ | ❌ | ❌ |
| Create / delete storage volumes | ✅ | ❌ | ❌ |

:::info System administrator
An **Administrator** who belongs to no tenant and has no workspace scope is treated as a system administrator.
That account has every permission and can enter the BOSS portal. Usually only platform operations staff hold one.
:::

## How roles and scopes combine

There are only three roles; what differs is the **scope** they are assigned to:

| Name you hear | What it really is | Main interface |
| --- | --- | --- |
| Platform administrator | An **Administrator** with no tenant scope | BOSS |
| Tenant administrator | An **Administrator** inside one tenant | AI Platform |
| Developer | A **Developer** inside one tenant | AI Platform |
| Member | A **Member** inside one tenant | AI Platform |

It follows that **one person can administer several tenants**: an administrator in company A may only be a member in company B.

## Where to see your own role

1. Click your avatar in the top-right corner, then click the **Tenant** row that carries the current tenant name to open tenant management.
2. In the left navigation click **Member** (only a tenant administrator sees this entry).
3. Find your own username in the table; the **Role** column is your role in this tenant.

The member table has four columns: **Username / Email / Role / Joined At**, and the role column reads **Administrator**, **Developer**, or **Member**.

![Tenant management Member tab: search and Add Member above, a table with Username, Email, Role and Joined At columns below](/assets/screenshots/account/roles-01.png)

:::warning If you cannot see "Member", you have no management rights
**Member** appears only in a tenant administrator's left navigation. If it is missing, you are not an administrator in this tenant,
and there is no other place to look your role up — ask a tenant administrator.
:::

## Why a role change does not take effect immediately

The page reads your roles once after sign-in and uses that data to control menus and buttons.
If an administrator has just changed your role, **refresh the page or sign in again** before the menus catch up.

## A few rules to keep in mind

- If a menu is missing or a button does nothing, it is almost always a matter of insufficient permissions rather than a broken page.
  The full capability matrix is in [Permissions reference](/reference/permissions).
- If you are assigned a role outside **Administrator / Developer / Member** (a platform-defined role, for example), the interface falls back to
  minimum privilege and hides nearly every menu and button. Ask an administrator to switch you to one of the three.
- Changing your nickname or avatar never affects your role.

## Related

- [Tenant Management](/account/iam/tenant)
- [Permissions reference](/reference/permissions)
- [Glossary](/guide/glossary)
