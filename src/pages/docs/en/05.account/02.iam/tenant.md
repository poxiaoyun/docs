---
title: 'Tenant Management'
updated: '2026-10-21'
description: Where tenant details live, how to change them, how to manage members, and where quota and flavors actually are.
---

# Tenant Management

A tenant is **a company's isolated account space on the platform**. One company's people, computing power, data, and quota
all live in the same tenant, and different tenants cannot see each other. This page explains where tenant details are shown
and changed, how to manage members, and where the frequently misplaced "quota / flavors / workspaces" really live.

:::tip A tenant is a self-contained office building
Each tenant is a building; the rooms (workspaces), equipment (instances), and staff (members) all belong to it.
You can hold a different role in each building.
:::

## Before you start

- What you can see and change depends on your role in the **current tenant**: editing details and managing members requires **Administrator**.
- Enter a tenant first; the entry is not visible until you have selected one.

## Where this page lives

1. Click your avatar in the top-right corner to slide out the drawer.
2. Click the **Tenant** row that carries the current tenant name.
3. The page opens as a full page in **Tenant Management**, at an address like `/console/iam/tenants/{tenant}/overview`.

:::info It is not a personal settings tab
Tenant management is company-level configuration; personal settings only manage you. To change company space, use
**Switch Tenant** at the bottom of the drawer.
:::

## What you see once inside

The left navigation has a single group, **Tenant Management**, containing:

| Entry | Who sees it | Content |
| --- | --- | --- |
| **Overview** | Every member of the tenant | The overview page has two tabs: **Basic Info** and **Member** |
| **Member** | Tenant administrators only | The member list, with add, edit, and remove |

If you came in from the AI Platform, an extra **Tenant Clusters** group appears in the left navigation, showing this tenant's
resources on each cluster.

## Overview: Basic Info

The **Basic Info** tab is a details card with these rows:

| Row | Description |
| --- | --- |
| Avatar | Click to upload a replacement; everyone in the tenant sees it |
| **Tenant Name** | The company or team name on the platform |
| **Email** | The tenant's contact address, not your sign-in email |
| **Mobile Number** | The tenant's contact phone number |
| **Created At** | Read-only |

How to change them:

1. On the row you want to change, click **Edit** at the end (only an administrator sees this action).
2. A dialog titled **Edit {field}** opens with a single field. It cannot be empty, and the email and phone are format-checked.
3. Click **Save**; a check mark on the button confirms it was stored.

:::warning These changes affect the whole tenant
Tenant details are shared by every member — after saving, everyone sees the new value. Make sure you are editing
**company** information, not your own (your own is under **Personal settings → General**).
:::

![Tenant management overview: the Tenant Management group in the left navigation, the Basic Info and Member tabs, and the tenant details card](/assets/screenshots/account/tenant-01.png)

## Overview: Member tab

Clicking **Member** switches to the member list, which has four columns:

| Column | Content |
| --- | --- |
| **Username** | The member's account name, with avatar and display name |
| **Email** | The member's email address |
| **Role** | The member's role in this tenant, shown as **Administrator**, **Developer**, **Member**, and so on |
| **Joined At** | When they became a member |

The list supports search and pagination; only an administrator can select several rows and **Remove selected members**.

## Managing members (administrators only)

### Adding a member

1. In the left navigation click **Member**, then click **Add Member** in the top-right corner.
2. On the form page, in the card **Member Info**, fill in two fields:

   | Field | How to fill it |
   | --- | --- |
   | **User** | Search for an existing user by username; options read `username (display name or email)` |
   | **Role** | Pick a role from the dropdown, supplied by the platform role list |

3. Click **Confirm**.

:::info There are no invitations
The platform sends no invitation email and uses no invite codes. To add someone, have them register an account first,
then find them here and add them.
:::

### Changing a member's role

Click the edit action on that member's row to open the edit page. **User** cannot be changed; update **Role** and click **Confirm**.

### Removing members

| Action | How | Result |
| --- | --- | --- |
| Remove one | Click the delete action on the row and confirm | The member no longer belongs to this tenant |
| Remove several | Select the rows, click **Remove selected members**, confirm | The dialog is titled **Remove the selected members** |

:::warning You remove the membership, not the account
The confirmation states: **Remove the selected tenant memberships. User accounts will remain available.**
The removed person no longer sees this tenant in their dropdown; re-adding restores access.
:::

## Where quota, flavors, and workspaces are

**Not on this page.** They are cluster-scoped, one level deeper:

1. Click **Tenant Clusters** in the left navigation.
2. Click a cluster name in the list to open its details.
3. The tabs **Overview / Quota / Flavor / Workspace** live there.

See [Tenant Clusters](/rune/console/tenant-clusters).

:::info Why it is split in two levels
One tenant can hold resources on several clusters, and quota and flavor availability are counted per cluster.
Flattening everything into one row of tabs would obscure which cluster a number belongs to.
:::

## Common questions

| Symptom | Likely cause | What to do |
| --- | --- | --- |
| No **Member** entry in the left navigation | You are not an administrator in this tenant | Ask a tenant administrator, or have them grant you the role |
| No **Edit** action on the details rows | Same reason: only administrators can edit | Same as above |
| Cannot find "Quota" | Quota lives in the cluster details | **Tenant Clusters** → click a cluster name |
| Just added but the tenant is missing | The tenant list is cached | Sign out and sign in again |

## Related

- [Roles and Permissions](/account/auth/roles)
- [Select / Register Tenant](/account/auth/select-tenant)
- [Tenant Clusters](/rune/console/tenant-clusters)
