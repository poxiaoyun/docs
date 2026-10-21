---
title: Applications
updated: '2026-10-21'
description: Manage applications that deploy with one click — browse the catalogue, change visibility, set recommendations, upload and maintain versions.
tags:
  - boss
  - rune-admin
---

# Applications

An **application** is a pre-built "installation list": everything a piece of software needs is packaged into a Chart, so users (or the platform itself) can deploy it with one click instead of building the environment from scratch.

After this page you will be able to find a tenant's application in the list, change its visibility, mark it as recommended, upload new versions, and deprecate a version.

:::tip Three terms compared

- **Application** ≈ a pre-built "installation list" users can deploy with one click.
- **Version** ≈ a revision of that list, for example 1.0 or 1.1.
- **Visibility** ≈ who can see the application: personal, tenant-only or public.

:::

## Before you start

- You need a **system administrator** account.
- Prepare the Chart package before uploading a version: a compressed **`.tgz`** file.
- An application belongs to a **tenant**, and every row in the list carries its tenant; the same application name under two tenants is two records.

## How to open it

Click **AI Platform** in the top navigation bar, then click **Applications** under the **AI Platform** group in the left sidebar.

## Reading the application list

| Column | Meaning |
| --- | --- |
| Name | Application name; click to open its **version list**. The application ID is shown below the name |
| Tenant | Which tenant owns the application |
| Latest public version | The newest public version; the Chart version is shown on the line below |
| Category | Application category, for example inference, fine-tuning, development, system, storage |
| Visibility | Personal / tenant / public |
| Recommendation score | Recommendation rating; system applications do not take part |
| Cover | Cover image, or a placeholder when there is none |
| Created at | — |

Filters at the top:

| Filter | Meaning |
| --- | --- |
| Search | Search by application name |
| Tenant | Show only applications of one tenant |
| Category | Filter by application category |
| Sort | **Recently updated** or **Recommendation order** |

Actions on each row:

| Action | Meaning |
| --- | --- |
| Recommend | Set the recommendation score and screenshot; **system applications do not have this action** |
| Change visibility | Switch between personal / tenant / public, then confirm |
| Edit | Open the edit page to change name, category, description, avatar and so on |
| Delete | Asks for confirmation; deletes this record under this tenant |

**Create application** at the top right creates a new one.

![Application list: name, tenant, latest public version, category, visibility, recommendation score, cover and creation time](/assets/screenshots/boss/rune-products-01.png)

The list spreads the same set of applications across **tenants**, so reading the **tenant** column first stops you editing the wrong object. An empty **latest public version** means the application has no public version yet, so users cannot see anything to deploy.

## Create an application

1. Click **Create application** at the top right.
2. Fill in the form:

   | Field | How to fill it | Meaning |
   | --- | --- | --- |
   | Tenant | Choose the owning tenant | Decides who owns the application |
   | Chart name | For example `my-inference` | Unique identifier of the package, **cannot be changed after creation** |
   | Name | For example "My inference engine" | The name shown in the UI |
   | Category | For example inference, development, system, storage | Decides which scenario filters it in |
   | Description | Optional | One sentence about what it does |

3. Click **OK** to save.

:::info Avatar and cover come later
The create form only takes the basics; upload the avatar, screenshots and cover from the **Edit** page after creation.
:::

## Upload and maintain versions

1. Click the application name in the list to open its **version list**.
2. Click **Upload**, pick the Chart file (`.tgz`) in the dialog and confirm.
3. Once uploaded, a new version appears with its **application version**, **Chart version** and **version creation time**.
4. A version supports these actions:

   | Action | Effect |
   | --- | --- |
   | Deprecate | Marks the version as no longer recommended and requires a **deprecation reason**; the application market and deploy page show the reason, but the version **can still be deployed** and existing instances are unaffected |
   | Undeprecate | Removes the deprecation warning and clears the reason; visibility and existing instances are unchanged |
   | Delete version | Permanently deletes the version record, **cannot be undone**; to use it again you must re-upload the same Chart version |

:::warning Deprecated is not withdrawn
Deprecation only means "not recommended" — users can still select and deploy it. To actually block it, delete the version or adjust the application's visibility.
:::

## Change visibility

1. Click **Change visibility** on a row.
2. Choose **Personal**, **Tenant** or **Public**.
3. It takes effect immediately after confirmation.

| Visibility | Who can see it |
| --- | --- |
| Personal | Only the creator, tenant administrators and authorised members |
| Tenant | All members of that tenant |
| Public | Every user who can access the platform |

## Set a recommendation

1. Click **Recommend** on a row.
2. Set the recommendation score and screenshot.
3. After saving, the **recommendation score** column shows the value, and switching the sort to **Recommendation order** uses it.

## Confirming the result

| What you want to confirm | Where to look |
| --- | --- |
| The application was created | A new record appears with the right tenant and category |
| The version was uploaded | Open the application's version list; the new version and Chart version are listed |
| Users can see it | Set visibility to **Public**, then check the application market on the user side |
| The recommendation took effect | The **recommendation score** column has a value and the order changes under recommendation sorting |

## Common questions

| What you see | Likely cause | What to do |
| --- | --- | --- |
| The upload is rejected | The file is not `.tgz` | Re-package as `.tgz` and upload again |
| Users cannot see the application | Visibility is personal or tenant-only | Change it to **Public** |
| Users cannot see a version | The version is unavailable, or there is no public version | Check the version state, re-upload or adjust |
| The Chart name cannot be changed | It is immutable after creation | Create a new application if you really need a different one |
| A system application has no "Recommend" | By design — system applications are not recommended | This is expected |

## Related

- [System Apps](/boss/rune-admin/systems)
- [Cluster Management](/boss/rune-admin/clusters)
- [Tenant Clusters](/boss/rune-admin/tenant-clusters)
