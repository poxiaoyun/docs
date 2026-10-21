---
title: 'Tenant Management'
updated: '2026-10-21'
description: Create a tenant, fill the form correctly, add members, and maintain its profile, image push settings and enabled state.
---

# Tenant Management

A **tenant** is a company's isolated account space on the platform. One company gets one tenant; that company's members, compute quota and workspaces all live inside the tenant and do not interfere with any other company. From here you create tenants, maintain their details, enable or disable them, and add their members.

After reading this page you can create a tenant, use the success page to finish the follow-up steps, add members, edit the profile and image push settings, and enable or disable a tenant.

:::tip An analogy
Think of a tenant as **a separate office building**: members are the people inside, quota is the monthly utility allowance, and workspaces are the individual offices. The buildings do not disturb each other; as the platform administrator you put the building up, approve the allowance and hand out access cards.
:::

## Before you start

- You need a **system administrator** account that can sign in to BOSS.
- Confirm that the platform has **at least one cluster**; without one, the "Configure Clusters" step has nothing to offer.
- Quota and workspaces are **not on this page** — they live under a cluster's **Tenant Resources**, see [Tenant Resources and Quota](/boss/rune-admin/tenants).

## Key terms

| Term | Plain explanation |
| --- | --- |
| Tenant | A company's isolated account space; the unit that owns members and resources |
| Member | A user who joined the tenant, carrying a role |
| Role | What that person may do in the tenant (Administrator / Developer / Member) |
| Cluster enablement | The prerequisite relationship that lets a tenant use a given cluster |
| Quota | The maximum compute the tenant may use in a cluster |
| Workspace | A smaller collaboration unit inside the tenant, shared by colleagues |

## What the tenant list shows

Go to **Account Center → Tenant Management**. The list has these columns:

| Column | Explanation |
| --- | --- |
| Name | Tenant avatar, name (clickable to open) and the tenant ID in grey below |
| Email | The tenant's administrative contact address |
| Member Count | How many members the tenant currently has |
| Status | **Enabled** (green) or **Disabled** (red) |
| Created At | When the tenant was created |

Each row offers **Edit**, plus **Disable** / **Enable**.

![Tenant management list: name, email, member count, status and creation time](/assets/screenshots/boss/tenant-list-01.png)

The list is a single table with five fields. Email addresses are blurred here because screenshots ship with the docs; the live page shows the full address.

## Create a tenant

1. Go to **Account Center → Tenant Management**.
2. Click **Add Tenant** in the top-right corner.
3. Fill in the form.
4. Click **OK**.

| Form field | How to fill it | Notes |
| --- | --- | --- |
| Name | For example `Example Tech` | Required. The display name; Chinese is allowed |
| ID | Leave it to the system | Required. Generated from the name (Chinese is romanised); lowercase letters, digits and hyphens only, must start with a letter. Click the pencil icon to override |
| Email | For example `admin@example.com` | **May be left empty**; if filled it must be a valid address |
| Mobile Number | For example `13800000000` | **May be left empty**; if filled it must be 6–16 digits |
| Description | Optional | A short note |

:::warning The tenant ID cannot change
The ID is the tenant's unique identifier. You may set it during creation, but it is **locked afterwards** and cannot be edited. Decide before you create.
:::

![Add Tenant form: name, ID, email, mobile number and description](/assets/screenshots/boss/tenant-create-01.png)

The form has five fields: **Name**, **ID** (auto-generated when empty), **Email**, **Mobile Number** and **Description**. Email and mobile number may both be empty.

### What happens after creation

Clicking **OK** does not return to the form. It opens a success page titled "**Tenant xxx Created Successfully**" with the description "The tenant identity has been created. Next, choose clusters to enable it and configure quotas, flavor access, and workspaces." It offers three buttons:

| Button | Where it leads |
| --- | --- |
| Configure Clusters | The flow to enable clusters for the tenant and configure quotas and flavor access |
| Add Member | The page for adding members to this tenant |
| Back to List | The tenant list |

All three buttons **always appear**, regardless of whether any cluster exists.

:::info No avatar during creation
**Avatar** and **Image Push Configuration** only appear when editing a tenant. Create first, then edit if you need them.
:::

## Follow-up steps after creation

A fresh tenant is an empty shell. Three steps make it usable:

1. **Give it administrators and members**: open the tenant, switch to **Members**, click **Add Member**, pick a user and a role.
2. **Enable clusters**: go to **AI Platform → Tenant Clusters**, click **Open in Cluster** on this tenant's row. See [Tenant Clusters](/boss/rune-admin/tenant-clusters).
3. **Grant quota**: open the cluster → **Tenant Resources** → this tenant → **Quota**. See [Tenant Resources and Quota](/boss/rune-admin/tenants).

## Edit a tenant

1. Go to **Account Center → Tenant Management**.
2. Click **Edit** on the target row, or open the tenant and change rows on the **Basic Info** tab.

The edit page has two blocks.

### Basic info

| Form field | Editable | Notes |
| --- | --- | --- |
| Avatar | Yes | Only on the edit page. Up to 3 MB; you can zoom, rotate and crop before upload |
| Name | Yes | Chinese is fine |
| ID | **No** | Locked; the pencil icon disappears |
| Email | Yes | May be cleared; if filled it must be a valid address |
| Mobile Number | Yes | May be cleared; if filled it must be 6–16 digits |
| Description | Yes | Multi-line text |

### Image push configuration

Also only on the edit page. It decides what happens when a member of this tenant pushes an image:

| Form field | How to fill it | Notes |
| --- | --- | --- |
| Allow pushing images that were not created in the UI | On by default | When on, members can `docker push` directly and the platform creates the image record; when off, the image must exist in the UI first |
| Default visibility for automatically created images | **Private** by default | Only effective while the switch above is on. **Private** (pusher, tenant administrators and authorised members), **Tenant** (all members of the tenant), **Public** (anyone who can reach Moha Hub) |

Click **OK** to save.

## Enable / disable a tenant

1. Go to **Account Center → Tenant Management**.
2. Open the row menu and click **Disable** (for an enabled tenant) or **Enable** (for a disabled one).
3. Confirm in the dialog.

The status column flips between **Enabled** and **Disabled** immediately.

:::warning Think before disabling
Disabling affects every member of the tenant and does **not** restore itself — you must click **Enable** again. Make sure the tenant really can be offline, and tell the people affected.
:::

:::info There is no "delete tenant"
The tenant list has no delete entry. Disabling is how you take a tenant offline. To fully retire one, remove its members first, then keep it disabled.
:::

## Tenant details: Basic Info and Members

Opening a tenant shows exactly two tabs: **Basic Info** and **Members**.

### Basic Info

A single profile card showing **Avatar**, **ID**, **Tenant Name**, **Email**, **Mobile Number** and **Created At**. **ID** is the read-only tenant identifier (the same value that appears in the URL); tenant name, email and mobile number each have an **Edit** action on the right for in-place editing.

![Tenant details, Basic Info tab: avatar, ID, tenant name, email, mobile number and created at, with an Edit action on the name/email/mobile rows](/assets/screenshots/boss/iam-tenant-detail-01.png)

:::info No quota or workspaces here
Quota, flavor access and workspaces are all cluster-scoped. Go to **AI Platform → Cluster Management**, open the cluster, then enter **Tenant Resources** and open this tenant.
:::

### Members

The member list has four columns: **Username**, **Email**, **Role** and **Joined At**. Each row can be **edited** (role only) or **deleted**; selecting several rows enables bulk deletion, and every deletion asks for confirmation.

![Tenant member list: username, email, role and joined at](/assets/screenshots/boss/tenant-members-01.png)

All three roles appear in the screenshot: **Administrator**, **Developer** and **Member**.

### Add a member

1. Go to **Account Center → Tenant Management** and open the tenant.
2. Switch to the **Members** tab.
3. Click **Add Member** in the top-right corner.
4. Fill in:

   | Form field | How to fill it | Notes |
   | --- | --- | --- |
   | User | Type a username and pick from the results | Required. Only existing users can be picked; not editable when editing a member |
   | Role | Pick from the dropdown | Required. Options come from the backend; typically **Administrator**, **Developer**, **Member** |

5. Click **OK** to return to the member list.

:::tip Keep at least two administrators
People take leave and leave the company. Two administrators per tenant means the tenant is never locked out.
:::

## Verify the result

| What you want to confirm | Where to look |
| --- | --- |
| The tenant exists | **Account Center → Tenant Management** shows it with status **Enabled** |
| Members are right | Tenant → **Members** tab |
| Clusters are enabled | **AI Platform → Tenant Clusters**, the tenant's "Enabled clusters" cell |
| Quota is granted | Cluster → **Tenant Resources** → the tenant → **Quota** |

## FAQ

| Symptom | Likely cause | What to do |
| --- | --- | --- |
| The ID row reports an invalid format | The name has no usable Latin letters or digits | Click the pencil and set an ID that starts with a letter |
| Want to change the tenant ID | Not supported | The ID is immutable after creation |
| The user cannot be found when adding a member | The user does not exist yet | Create the user in **User Management** first |
| Cannot find quota or workspaces | They are cluster-scoped | Cluster Management → cluster → **Tenant Resources** |
| "Configure Clusters" has nothing to pick | No cluster is online yet | Connect and bring a cluster online first |

## Related

- [Account Center](/boss/iam)
- [User Management](/boss/iam/users)
- [Tenant Clusters](/boss/rune-admin/tenant-clusters)
- [Tenant Resources and Quota](/boss/rune-admin/tenants)
- [Cluster Management](/boss/rune-admin/clusters)
