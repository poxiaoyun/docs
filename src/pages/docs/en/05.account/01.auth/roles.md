---
title: 'Roles and Permissions'
updated: '2026-09-14'
description: What administrators, developers, and members can each do, and where to check your own role.
---

# Roles and Permissions

Your role decides which buttons you can use inside the current tenant. The same menu may be editable for an administrator and read-only for a developer, and the difference comes from the role you were given. After reading this page you will know what the three roles can do and where to find your own role.

:::tip A comparison
A role is like your access level in a company: an administrator has a card for a whole floor, a developer can enter the server room but not touch personnel files, and a member can only swipe into the public areas. Which menus you see and which buttons you can press all follow from it.
:::

## What the three roles can do

| Role | What you can do | What you cannot do |
| --- | --- | --- |
| Administrator | Manage the tenant's workspaces, members, and quotas; take full action on instances, images, templates, and storage volumes | Only manage your own tenant; you cannot see other tenants |
| Developer | Full control of instances (create, start, stop, delete, and more); view workspaces, images, and templates | Cannot manage members or quotas; images and templates are read-only; cannot create or modify workspaces |
| Member | View workspaces, instances, and images | Cannot create or operate instances; cannot manage members, quotas, templates, or storage volumes |

:::info System administrator
There is one more special kind of administrator: an administrator who belongs to no tenant. The platform treats this account as a system administrator with all permissions. Usually only platform operations staff have such an account.
:::

## Where to see your own role

1. Click your avatar in the top-right corner. In the menu that opens, click **Tenant**; the entry is followed by the name of your current tenant.
2. Open tenant management and switch to the **Members** tab (only an administrator can see this tab).
3. Find your own username in the member table; the **Role** column is your role in this tenant.

If you are not an administrator and cannot see the **Members** tab, fall back to the member list on the **Overview** tab: the small text under each username is the role as well, it is just not laid out as a column. If neither place shows it, your current role is not allowed to see member information; in that case ask a tenant administrator to confirm your role.

The member table looks like this — the first column is **Username** and the third is **Role**:

![Tenant management Member tab: a search box and Add Member button on top, a table with Username, Email, Role and Joined At columns; the visible rows are Member, Developer and Administrator](/assets/screenshots/account/roles-01.png)

## Why a role change does not take effect immediately

The platform reads your roles once when you sign in and keeps using that data to control menus and buttons afterwards. If an administrator has just changed your role, refresh the page or sign in again before the menus catch up.

## A few rules to keep in mind

- A role applies "inside one tenant". You may be an administrator in company A and only a member in company B.
- If a menu is missing or a button does nothing, it is almost always a matter of insufficient permissions rather than a broken page.
- Changing your nickname or avatar never affects your role.

## Related

- [Tenant Management](/account/iam/tenant)
- [Permissions reference](/reference/permissions)
