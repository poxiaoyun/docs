---
title: 'Workspace Management'
updated: '2026-09-12'
description: 'Understand the region-to-workspace relationship, learn how to switch and create workspaces, and how to add colleagues with roles.'
tags:
  - rune
  - console
---

# Workspace Management

A workspace is the "room" that holds instances in Rune: every inference service, fine-tuning job, development environment, application, and storage volume you create belongs to a workspace. A workspace is shared with colleagues, and resources in different workspaces are isolated from each other. This page explains the relationship between **Region** and **Workspace**, how to switch, how to create one, and how to add colleagues.

## Core concept: how Region and Workspace relate

| Term | Plain explanation |
| --- | --- |
| Tenant | One company's own account space; members and quota live at this level |
| Region (cluster) | A data center building with many machines inside |
| Workspace | One office inside that building, shared by colleagues |
| Namespace | The office's door number inside the system, generated automatically when the workspace is created |

The relationship is one sentence: **one building has many offices, and your instances all live in an office**. So you first pick the building (**Region**), then the room (**Workspace**), before you can start working.

:::tip Why the workspace layer exists
If everyone worked on the same pool of resources, something A deletes could affect B. A workspace puts people into different offices: inside one workspace you can see and collaborate with each other, across workspaces you stay out of each other's way, and quota can also be allocated per workspace.
:::

## Before you start

- Switching and viewing workspaces: any member can do this.
- Creating a workspace: only an **Administrator** (tenant administrator) can see the create button. The tenant must already have resource quota configured in this region, otherwise the page says "No resource quota is configured for this tenant in this cluster, so the workspace cannot be created."
- Adding members to a workspace: you need access to the workspace's **Member** tab.

## How to switch region and workspace

Both selectors are in the top-left of the page, and the data of every menu follows them.

1. Click **Region** in the top-left and pick a "building" from the list.
2. Click **Workspace** next to it and pick an "office" from the list.

| Action | What happens |
| --- | --- |
| Switching region | Rune automatically selects the first workspace under that region, and the previous workspace selection is cleared |
| Switching workspace | Every instance list in the left sidebar and the Home data refresh to the new workspace's resources |
| Opening an instance detail or storage volume detail | Both selectors become unclickable to prevent accidental switching; go back to a list page to switch |

:::warning Make sure you are not editing before switching
If you switch workspace while filling in a deploy form or editing an instance, the page navigates away and unsubmitted content is lost. Submit or cancel first, then switch.
:::

If a region has no workspaces at all, the page shows an empty state where an administrator can click **Create Workspace** to go and create one.

## Create a workspace

1. Click the avatar in the top-right and click **Tenant** in the menu to open tenant settings.
2. Click the **Workspace** tab at the top.
3. Click **Add Workspace**.
4. Fill in the form:

   | Field | What to fill | Notes |
   | --- | --- | --- |
   | Name | For example `algorithm team space` | Required and for display; Chinese or English both work |
   | ID | Generated automatically from the name by default | A system identifier that cannot be changed after creation; click the pencil icon below the name to edit it manually |
   | Region | Choose which building this "office" belongs to | Required; cannot be changed after creation |
   | Description | For example "for the algorithm team's daily experiments" | Optional |

5. Click **Confirm**.

:::warning Follow the ID rules
The ID must start with a lowercase letter, may contain only lowercase letters, numbers, and the hyphen `-`, and is at most 32 characters. A mistake shows a format error; it takes part in the system's internal naming and **cannot be changed after creation** — the only fix is to recreate the workspace.
:::

## Confirming the result

Back on the **Workspace** list, you can see the workspace you just created, with the **Status** column moving from creating to ready; the list also shows its **Namespace** and **Created At**. Afterwards you can switch to it with the **Workspace** selector in the top-left.

## Add members to a workspace

1. Use the top-left selector to switch to the target **Workspace**.
2. Click the avatar in the top-right, open **Tenant**, then click the **Workspace** tab to reach that workspace's detail page.
3. On the **Member** tab, click **Create Member**.
4. Fill in the form:

   | Field | What to fill | Notes |
   | --- | --- | --- |
   | User | Pick a person from the tenant members | Required; only members already in the current tenant are listed |
   | Role | Pick a role | Required, and **only one** can be chosen; the dropdown shows the roles available in the current workspace, displayed as role names |

5. Click **Confirm**.

The member list shows **Username, Email, Role, Joined At**; to change a role or remove a member, use the action menu at the end of the row.

## Quota

The **Quota** tab on the workspace detail page lets you allocate tenant quota further to a specific workspace and control how much compute it can use. See [Quota](/rune/console/quota) for how to allocate it.

## FAQ

| Symptom | Likely cause | What to do |
| --- | --- | --- |
| The page says "No available workspace" | There is no workspace in the current region yet, or none was assigned to you | An administrator clicks **Create Workspace**; regular members ask an administrator to assign one |
| The create button is gone | You are not a tenant administrator | Ask an administrator to create or assign a workspace |
| It says no resource quota is configured, so it cannot be created | This tenant has no quota in this region yet | Configure quota under [Quota](/rune/console/quota) first |
| The top-left selector does not respond | You are on an instance detail or storage volume detail page | Go back to a list page before switching |

## Related

- [Home](/rune/console/dashboard)
- [Quota](/rune/console/quota)
- [Flavor](/rune/console/flavor)
- [Storage](/rune/console/storage)
