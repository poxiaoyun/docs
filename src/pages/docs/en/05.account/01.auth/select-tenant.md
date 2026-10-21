---
title: 'Select / Register Tenant'
updated: '2026-10-21'
description: How to choose a company space after signing in, and how to create a new tenant for yourself.
---

# Select / Register Tenant

A tenant is **a company's isolated account space on the platform**. One company's members, data, computing power, and quota
all live in the same tenant, and different tenants cannot see each other's things. After signing in you must pick a tenant
before you can start working.

:::tip A comparison
Picture the platform as an office building and a tenant as one company in it. You can belong to several companies
(own several tenants) at the same time; after signing in you first choose which one to enter today, then start working.
:::

## Before you start

- Sign in first. If you have no account, see [Registration](/account/auth/register).
- If the dropdown is empty, create a tenant yourself (below) or ask an administrator to add you to theirs.

## When you see this page

- After signing in, when you belong to several tenants and the platform has not remembered the last one.
- With a single tenant, or a still-valid remembered tenant, the platform enters directly and skips this page.
- To change company while inside the platform, click your avatar → **Switch Tenant** at the bottom of the drawer.

## Choosing an existing tenant

1. The page title is **Hi {your display name}, select your tenant** (without a display name it reads **Select your tenant**), followed by
   **Please select your tenant or create a new one**.
2. Click the **Tenant** dropdown; the list shows every tenant you can enter.
3. Select the tenant you want.
4. Click **Enter Platform**. The button briefly shows **Entering...**.
5. You land on that tenant's home.

:::tip A single tenant enters automatically
If your account belongs to only one tenant, this page is skipped and you may barely notice it.
:::

![Tenant selection page: a card with the greeting and "Please select your tenant or create a new one", then the tenant dropdown and Enter Platform button, then the create-tenant entry and sign-out link](/assets/screenshots/account/select-tenant-01.png)

## About disabled tenants

Some tenants in the dropdown carry a red **Disable** label. They cannot be entered right now:

- they are sorted to the bottom of the list;
- they cannot be selected, so they cannot be entered.

If a tenant you need is disabled, contact your platform administrator.

## Creating a new tenant

If you have no tenant yet, or want a company space of your own:

1. On the tenant selection page, click **Create Tenant** in the **No tenant? Create Tenant** line.
2. The page is titled **Create Tenant** with the description **Create a tenant for yourself**.
3. Fill in the three fields below; all three are required.
4. Click **Create Tenant**. The button briefly shows **Creating account...**.
5. When it succeeds the card shows **Tenant created** and an **Enter Platform** link; click it to actually go in.

| Field | How to fill it in |
| --- | --- |
| **Name** | The tenant's name, for example your company or team name |
| **Email** | A contact email address; must be a valid address |
| **Mobile Number** | A contact mobile number; must be a valid number |

:::warning Creation does not enter the tenant
The page only offers an **Enter Platform** link; it does not redirect by itself. Until you click it you stay on the create page.
:::

If you change your mind, click **Select Tenant** at the bottom of the page to go back.

:::info You administer the tenant you create
Whoever creates a tenant becomes its **Administrator** and can then manage members and quotas inside it.
:::

## Signing out

At the bottom of the tenant selection page, click **Sign out** to sign out of the current account and return to the sign-in page.

## Related

- [Login](/account/auth/login)
- [Tenant Management](/account/iam/tenant)
- [Roles and Permissions](/account/auth/roles)
