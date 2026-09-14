---
title: 'Tenant Management'
updated: '2026-09-14'
description: Create a tenant, fill the form correctly, then add its members and quota.
---

# Tenant Management

A **tenant** is a company's isolated account space on the platform. One company gets one tenant; that company's members, compute quota and workspaces all live inside the tenant and do not interfere with any other company. From here you create tenants, maintain their details, enable or disable them, and add their members.

:::tip An analogy
Think of a tenant as **a separate office building**: the members are the people inside, the quota is the monthly utility allowance for that building, and the workspaces are the individual offices. Buildings do not interfere with one another, and you as platform administrator are the one who erects the building, approves the utility allowance and hands out the door passes.
:::

## Before you start

- You need an administrator account that can sign in to BOSS.
- It is best to confirm the platform already has **at least one cluster**. Without a cluster you cannot allocate compute quota right after creating the tenant.

## The words you need first

| Term | Plain explanation |
| --- | --- |
| Tenant | A company's isolated account space, and the unit that owns members and resources |
| Member | A user who has joined a tenant, together with a role |
| Role | What that person may do inside the tenant (Administrator / Member / Developer and so on) |
| Quota | How much compute this tenant may use on a given cluster |
| Workspace | A further subdivision inside the tenant for colleagues to share |

## What the tenant list shows

Go to **Account Center → Tenant**. The list has these columns:

| Column | Explanation |
| --- | --- |
| Name | Tenant avatar and name (clickable). The small grey text under the name is the tenant ID |
| Email | The tenant's administrative contact email |
| Members | How many members the tenant currently has |
| Enabled | **Enable** (green) or **Disable** (red) |
| Created At | When the tenant was created |

On the right of each row you can **edit** the tenant, or **disable / enable** it.

![Tenant management list: name, email, member count, status and creation time](/assets/screenshots/boss/tenant-list-01.png)

The list is a single table with five columns. The email column is blurred here — the real page shows the full address, but screenshots ship with the docs, so any column carrying personal data is masked before capture.

## Create a tenant

1. Go to **Account Center → Tenant**.
2. Click **Add Tenant** in the top-right corner.
3. Fill in the form described below.
4. Click **Confirm**.

| Form field | How to fill it | Notes |
| --- | --- | --- |
| Name | For example `Acme Corp` | Required. The name shown in the interface; any language is fine |
| ID | Leave it alone | Required. Generated from **Name**. Only lowercase letters, numbers and hyphens are allowed, and it must start with a lowercase letter. The result appears under the Name box; to set your own, click the pencil icon on that row |
| Email | For example `admin@example.com` | Required, and must be a valid email address |
| Mobile Number | For example `13800000000` | Required, 6 to 16 digits |
| Description | May be left empty | Optional free-text note |

:::warning The tenant ID cannot be changed after creation
The ID is the tenant's unique identifier in the system. You may set it yourself while creating the tenant, but it is **locked once creation finishes** — you cannot change it later when editing the tenant. If you intend to choose it yourself, decide before you create the tenant.
:::

![The Add tenant form: name, ID, email, phone number and description](/assets/screenshots/boss/tenant-create-01.png)

The form is short: **Name**, **ID** (auto-generated from the name if you leave it blank), **Email**, **Phone number** and **Description**. Fill them in and press **Confirm**. The ID field is empty in the screenshot, which is how you know it is generated for you.

### What happens after creation

Clicking **Confirm** does not stay on the form; it takes you to a success page titled "Tenant xxx Created Successfully" with three buttons:

| Button | When it appears | Where it goes |
| --- | --- | --- |
| Set Quota Now | Only when the platform already has at least one cluster | Straight to the quota page for this tenant (using the first cluster) |
| Add Member | Always | The page for adding members to this tenant |
| Back to List | Always | Back to the tenant list |

:::info No avatar upload while creating
**Avatar** and **Image Push Configuration** appear only when **editing** a tenant. You do not need them at creation time; open the edit page afterwards if you want to set them.
:::

## What to do after creating a tenant

A new tenant is just an empty shell. To make it usable you need two more steps:

1. **Give it an administrator and members**: in the tenant list click the tenant name, switch to the **Member** tab and click **Add Member**, then pick a user and a role. See "Add members to a tenant" below.
2. **Give it compute quota**: go to **AI Platform → Tenant Resource** and create a quota for the tenant. Without quota, members of the tenant cannot create instances.

## Edit a tenant

1. Go to **Account Center → Tenant**.
2. On the target tenant's row click **Edit** (or click the tenant name and edit from there).

The edit page has two blocks.

### Basic information

| Form field | Editable | Notes |
| --- | --- | --- |
| Avatar | Yes | Only on the edit page. JPEG, JPG, PNG and WEBP are supported, up to 3 MB each; you can scale, rotate and crop before uploading |
| Name | Yes | Any language |
| ID | **No** | Locked while editing; the pencil icon is gone |
| Email | Yes | Must be a valid email address |
| Mobile Number | Yes | 6 to 16 digits |
| Description | Yes | Multi-line text |

### Image Push Configuration

Also only on the edit page. It decides what happens when this tenant's members push images to the image registry:

| Form field | How to fill it | Notes |
| --- | --- | --- |
| Allow pushing images that were not created in the UI | On by default | When on, members can `docker push` directly and the system creates the image record for them. When off, the image must be created in the UI first |
| Default visibility for automatically created images | **Personal** by default | Only takes effect when the switch above is on. Options are **Personal** (only the pushing user, tenant administrators and authorized members), **Tenant** (members of the current tenant) and **Public** (anyone who can access Moha can view and pull it) |

Click **Confirm** to save your changes.

## Enable or disable a tenant

1. Go to **Account Center → Tenant**.
2. On the target tenant's row open the actions menu and click **Disable** (for an enabled tenant) or **Enable** (for a disabled tenant).
3. Confirm in the dialog that appears.

The Status column switches between **Enable** and **Disable** immediately.

:::warning Think before disabling
Disabling affects every member of that tenant, and it **does not recover on its own** — to make the tenant usable again you must click **Enable** manually. Before doing it, make sure the tenant really does not need to be in use, and tell the people affected.
:::

:::info There is no "delete tenant" in the UI
The tenant list has no delete entry. To stop a tenant from being used, **disable** it; if you truly need to empty it out, remove its members first and leave it disabled.
:::

## Add members to a tenant

1. Go to **Account Center → Tenant** and click the target tenant's name.
2. Switch to the **Member** tab on the left.
3. Click **Add Member** in the top-right corner.
4. Fill in the member information:

   | Form field | How to fill it | Notes |
   | --- | --- | --- |
   | User | Type a username in the box, search and select | Required. You can only pick users that already exist. When editing an existing member this field cannot be changed |
   | Role | Choose one from the dropdown | Required. The options are provided by the platform backend; the common ones are **Administrator**, **Member** and **Developer** |

5. Click **Confirm** and the page returns to the member list.

The member list has four columns: **Username**, **Email**, **Role** and **Joined At**. Each row can be **edited** (to change the role) or **deleted**, and selecting several rows lets you delete them in bulk. Every deletion asks for confirmation first.

:::tip Keep at least two administrators
People take leave and people leave. Give every tenant at least 2 administrators so that there is always someone who can take over when one is unavailable.
:::

![Tenant overview: avatar and basic information on the left, member statistics and list on the right](/assets/screenshots/boss/tenant-overview-01.png)

The overview is split in two: on the left the tenant avatar plus **name / email / phone / creation time**, each with a pencil button to edit in place; on the right three role counters (administrator / member / developer) above the **Members** list, with **See more** jumping to the members tab. Email and phone are blurred in the screenshot.

## Tenant overview page

After clicking a tenant name you land on the **Overview** tab by default:

- The left column is **Tenant Information**: avatar, tenant name, email, mobile number and creation time. Avatar, name, email and mobile number can each be edited in place with the small pencil icon on the right; click **Confirm** when done.
- The right column shows **member counts by role** (how many Administrators, Members and Developers) on top, and the tenant's **member list** (username, email, role) below. Clicking **View More** jumps to the full member management page.

## Confirm it worked

| What you want to check | Where to look |
| --- | --- |
| The tenant exists | **Account Center → Tenant** lists it with status **Enable** |
| Members were added correctly | Enter the tenant → **Member** tab, and you can see the person and their role |
| Quota was granted | **AI Platform → Tenant Resource** shows the tenant's quota |

## FAQ

| Symptom | Likely cause | What to do |
| --- | --- | --- |
| No "Set Quota Now" on the success page | The platform has no clusters yet | Connect a cluster under **AI Platform → Cluster**, then create quota for the tenant manually |
| The ID row reports a format error | The name contains no usable Latin letters or digits | Click the pencil icon and specify an ID that starts with a letter |
| Want to change the tenant ID | Not supported | The ID is immutable after creation |
| Cannot find a person when adding a member | That user has not been created yet | Go to **Account Center → Account** and create the user first |

## Related

- [Account Center](/boss/iam)
- [User Management](/boss/iam/users)
- [Tenant Quotas](/boss/rune-admin/tenants)
- [Cluster](/boss/rune-admin/clusters)
