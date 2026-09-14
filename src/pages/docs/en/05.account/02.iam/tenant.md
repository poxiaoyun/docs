---
title: 'Tenant Management'
updated: '2026-09-14'
description: What a tenant is, how to view and switch your tenants, and how members are managed and added.
---

# Tenant Management

A tenant is **a company's isolated account space on the platform**. One company's people, computing power, data, and quota all live in the same tenant, and different tenants cannot see each other. This page explains how to see which tenants you belong to, how to switch, what changes after switching, and how someone adds you to a tenant.

:::tip A tenant is like a separate office building
Each tenant is a building, and its rooms (workspaces), equipment (instances), and staff (members) all belong to that building. In different buildings you can be given different identities.
:::

## Before you start

- What you can see and change depends on your role in the **current tenant**.
- Tenant management is not a tab in the Personal Center; it has its own entry (see below).

## A few words to remember

| Term | Plain meaning |
| --- | --- |
| Tenant | A company's isolated account space on the platform |
| Member | A user who has been added to this tenant |
| Role | Your identity inside the tenant, which decides which features you can use |

## Which tenants I belong to, and how to switch

1. Click your avatar in the top-right corner; a menu slides out from the right.
2. The top of the menu shows your nickname, username, and email.
3. One item in the menu is **Tenant**, followed by the name of your **current tenant**.
4. To see or switch to another tenant, click **Switch Tenant** at the bottom of the menu.
5. You reach the **Select your tenant** page; choose the tenant you want in the **Tenant** dropdown.
6. Click **Enter Platform**.

The dropdown lists **all** the tenants you can enter. If a tenant carries a **Disable** label, it has been deactivated and cannot be selected. If you belong to only one tenant, the platform takes you straight in and does not show this page.

:::tip What if I have no tenant
On the **Select your tenant** page, click **Create Tenant** at the bottom and fill in a name, email, and mobile number to create a new tenant for yourself. Once it is created you are its administrator.
:::

## What is different after switching tenants

| What changes | Description |
| --- | --- |
| Menus | Only the features you have permission for in the new tenant are shown |
| Data | Instances, storage volumes, members, and quota all become the new tenant's; the old tenant's data is no longer visible |
| Role | The same person can have a different role in each tenant, and permissions change with it |

Switching back to the previous tenant brings back the original data and permissions.

## Opening tenant management

1. Click your avatar in the top-right corner.
2. Click **Tenant** in the menu (followed by the current tenant name).
3. Tenant management opens with a row of tabs at the top.

The **Overview** tab puts tenant information, compute resources, workspaces and members on one screen:

![Tenant management overview: tabs for Overview, Members, Quota, Flavor and Workspace; a left card showing the tenant avatar, name, email, mobile number and creation time (email and mobile are redacted), and panels on the right for compute resources, workspace statistics, recent workspaces and the member list](/assets/screenshots/account/tenant-01.png)

## What the tabs can do

| Tab | Role needed | What you can do |
| --- | --- | --- |
| Overview | Administrator / Developer | See tenant information, members, quota, workspaces, and recent events |
| Member | Administrator only | Add, modify, and delete members |
| Quota | Administrator / Developer | View the computing quota for each cluster |
| Flavor | Administrator / Developer | View the available computing flavors |
| Workspace | Administrator / Developer | View the workspaces under the tenant |

Exactly which tabs you see depends on the product you entered from and on your role. Tabs you lack permission for are not shown.

## Viewing and editing tenant information

The **Tenant Information** card on the left of the Overview tab shows the tenant avatar, tenant name, email, mobile number, and creation time.

1. Only an **Administrator** can edit. Click the pencil icon to the right of a field to start editing.
2. Type the new value in the field.

   | Setting | How to fill it in | What changes |
   | --- | --- | --- |
   | Tenant avatar | Click the avatar to upload and crop an image | Every member of the tenant sees the new avatar; it affects this tenant only |
   | Tenant Name | Type a new name; it cannot be empty | The name members see in the avatar menu and on the tenant selection page changes |
   | Email | The tenant's contact email, in a valid format | This changes the tenant's contact email, not your own sign-in email |
   | Mobile Number | The tenant's contact number; it cannot be empty | This changes the tenant's contact number |
   | Created At | Read-only | It cannot be changed |

3. Click **Confirm** to save, or **Cancel** to discard the change.

:::warning These changes affect the whole tenant
Tenant information is shared by all members, so everyone sees your change. Make sure you are editing the **company's** information and not your own personal details.
:::

The Overview tab also shows member statistics, the member list, quota, workspaces, and **Recent Events** (the latest operations in reverse time order). Exactly which of these blocks appear depends on your role and on the product you entered from.

## Managing members (Administrator only)

### Adding a member

1. Open the **Member** tab.
2. Click **Add Member** in the top-right corner.
3. In the **User** dropdown, search for and select the person to add; options show a username with a nickname or email.
4. In the **Role** dropdown, choose the role to give them.
5. Click **Confirm**.

### Changing a member's role

Click the edit entry on that member's row in the member table, set the new role, and click **Confirm**.

### Deleting a member

Tick the members to remove (multiple selections are allowed), click delete, and confirm in the dialog. The member table shows four columns by default: **Username**, **Email**, **Role**, and **Joined At**.

:::warning Deleting a member takes effect immediately
The person you remove no longer sees this tenant in the dropdown the next time they switch tenants. Before deleting, make sure they really no longer need access.
:::

Member management lives on the **Members** tab, where the table has four columns by default: Username, Email, Role and Joined At.

![Tenant management Members tab: a search box and Add Member button on top, and a table with Username, Email, Role and Joined At columns, with the email column redacted](/assets/screenshots/account/roles-01.png)

## How someone adds me to a tenant

There is no such thing as an "invite link". Joining a tenant means an administrator adds you:

1. Register your own platform account first.
2. Give your **username** (or the email you registered with) to the tenant administrator.
3. The administrator searches for you in **Tenant management → Member → Add Member**, picks a role, and clicks **Confirm**.
4. After you sign in again, the tenant appears in the dropdown on the **Select your tenant** page; select it and click **Enter Platform**.

:::tip The new tenant is not in the dropdown
Sign out and sign in again so the page fetches your tenant list afresh.
:::

## Related

- [Roles and Permissions](/account/auth/roles)
- [Select / Register Tenant](/account/auth/select-tenant)
- [Personal Center](/account/iam)
