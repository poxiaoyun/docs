---
title: 'Workspace'
updated: '2026-10-21'
description: 'Understand the region-to-workspace relationship, how to switch and create workspaces, and how to allocate quota to one.'
tags:
  - rune
  - console
---

# Workspace

A workspace is the "room" that holds instances in Rune: the inference services, fine-tuning jobs, development environments, applications, and storage volumes you create all belong to a workspace. A workspace is shared by colleagues in the same workspace, and resources in different workspaces are isolated. This page explains how **Region** and **Workspace** relate, how to switch, how to create one, and how to allocate quota to it.

## Core concepts: how region and workspace relate

| Term | Plain explanation |
| --- | --- |
| Tenant | One company's isolated account space; members and quota live at this level |
| Region (cluster) | A data center building with many machines inside |
| Workspace | One office inside that building, shared by colleagues |
| Namespace | The office's street number inside the system, generated when the workspace is created |

The relationship is one sentence: **one building holds many offices, and your instances live in the offices**. So pick the building (region) first, then the room (workspace), before you start working.

:::tip Why this extra "workspace" layer
If everyone worked on the same pool of resources, something A deletes could affect B. Workspaces split people into separate offices: inside one workspace everything is visible and collaborative, across workspaces nothing interferes, and quota can be allocated per workspace.
:::

## Before you start

- Switching and viewing workspaces: every member can.
- Creating a workspace: only an **Administrator** (tenant administrator) sees the create button. The tenant must already have a quota configured in this cluster, otherwise the page reports "this tenant has no resource quota in this cluster, so a workspace cannot be created".
- Allocating quota to a workspace: tenant administrator.

## How to switch region and workspace

Both selectors sit in the top-left of the page, and every menu's data follows them.

1. Click **Region** in the top-left and pick a "building" from the list.
2. Click **Workspace** next to it and pick an "office".

| Action | What happens |
| --- | --- |
| Switch region | Rune automatically selects the first workspace under that region; the previous workspace selection is cleared |
| Switch workspace | Every instance list and the home page refresh to the new workspace's resources |
| Open an instance or storage volume detail | Both selectors become unclickable to prevent accidental switching; go back to a list page to switch |

:::warning Confirm you are not editing before switching
Switching workspace while filling in a deploy form or editing an instance navigates away and the unsubmitted content is lost. Submit or cancel first.
:::

If a region has no workspaces at all, the workspace selector at the top is empty and the page reports **no workspace available**. A tenant administrator has to create one, as described below.

## Create a workspace

Workspaces are created by a tenant administrator inside **Tenant Clusters**.

1. Click the avatar in the top-right and click **Tenant <your tenant name>**.
2. Click **Tenant Clusters** and click the **cluster name** you want to work in.
3. Click the **Workspace** tab at the top.
4. Click **Create Workspace** in the top right.
5. Fill in the form:

   | Field | What to enter | Notes |
   | --- | --- | --- |
   | Name | For example `algo-team` | Required, for display; Chinese or English both work |
   | ID | Generated from the name by default | System identifier; cannot be changed after creation. Click the pencil icon below the name to edit it |
   | Description | For example "daily experiments for the algo team" | Optional |

6. Click **Confirm**.

![Create workspace form: name, ID and description only, no cluster selector](/assets/screenshots/rune/workspace-02.png)

:::info There is no cluster field in the form
A workspace is created in **the cluster you are currently in**, so you do not pick a cluster again. To create one in another cluster, switch to that cluster first and then click **Create Workspace**.
:::

:::warning Respect the ID rules
The ID must start with a lowercase letter, may only contain lowercase letters, digits and hyphens `-`, and is at most 63 characters. An invalid value is rejected immediately; the ID is part of internal naming and **cannot be changed** after creation.
:::

## Reading the workspace list

Back on the **Workspace** tab, each row is one workspace:

| Column | Description |
| --- | --- |
| Name | The workspace name; the description is in small text below |
| Namespace | Its technical identifier in the cluster, generated at creation |
| Status | **Ready** means it is usable; other states mean it is still being created or is abnormal |
| Created At | When it was created |

The row action holds **Quota**, which opens that workspace's quota page. **Create / Edit / Delete** are available to tenant administrators only; other roles do not see them.

## Confirm it worked

Back on the **Workspace** tab you can see the new workspace, its **Status** changing from creating to **Ready**. It then appears in the console's **Workspace** selector at the top left.

## Allocate quota to a workspace

A workspace detail page has only **Overview** and **Quota** tabs — there is **no Members tab**; membership is managed per tenant, not per workspace. For the allocation steps see [Quota](/rune/console/quota).

:::info Where to give a colleague access
Who can see a workspace follows from tenant membership. To add people or change roles, go to **Tenant Management → Members**; see [Tenant Management](/account/iam/tenant).
:::

## FAQ

| Symptom | Likely cause | What to do |
| --- | --- | --- |
| The page reports "no workspace available" | The current region has no workspace, or none was assigned to you | Ask the tenant administrator to create one under **Tenant Clusters → Workspace** |
| The create button is missing | You are not a tenant administrator | Ask an administrator to create or assign a workspace |
| It reports no resource quota, so a workspace cannot be created | The tenant has no quota in this region yet | Configure quota first under [Quota](/rune/console/quota) |
| The top-left selectors are not clickable | You are on an instance or storage volume detail page | Go back to a list page and switch |
| There is no Members tab in the workspace | A workspace detail has only Overview and Quota | Manage members under **Tenant Management → Members** |

## Related

- [Tenant Clusters](/rune/console/tenant-clusters)
- [Home](/rune/console/dashboard)
- [Quota](/rune/console/quota)
- [Flavor](/rune/console/flavor)
- [Storage](/rune/console/storage)
