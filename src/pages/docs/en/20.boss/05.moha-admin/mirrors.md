---
title: Mirror
updated: '2026-09-12'
description: Sync ready-made models and datasets from HuggingFace and ModelScope into the platform by managing mirror tasks.
---

# Mirror

The Mirror page is used to **sync** ready-made models and datasets from external platforms (**HuggingFace** and **ModelScope**) into this platform. Once the sync finishes, users can download that content directly here, without fighting network restrictions or depending on an external network. Here you create sync tasks, trigger syncs and check the results.

:::tip What a mirror source is

A mirror source is "where the content comes from". One mirror task = one external repository + one target organization on this platform. Think of it as opening an "auto-updating clone" of an external repository on this platform.

:::

## Before you start

- You need the **System Administrator** role.
- In the left sidebar click **Data Sync** → **Mirror**.

## Mirror is not the same as image registry

| | Mirror (this page) | [Images](/boss/moha-admin/images) |
| --- | --- | --- |
| What it manages | Syncing models and datasets from external platforms | Storing container images |
| Content | Model files and data files | Container images (used as a system disk) |

## The two content types are managed separately

The top of the page has two tabs, **Model** and **Dataset**, listing model mirror tasks and dataset mirror tasks respectively. Switching a tab switches to the matching list.

## What is on the list

| Column | Meaning |
| --- | --- |
| Name | The name on this platform after syncing |
| Mirror Source | Which platform the content comes from: ModelScope (ModelScope Community) or HuggingFace |
| Organization | The organization it syncs into |
| Status | Syncing / Synced / Sync Failed / Paused |
| Last Sync Time | When the last sync finished |

## Add a mirror task

1. First switch to the **Model** or **Dataset** tab.
2. Click **Add Model Mirror Tasks** (or **Add Dataset Mirror Tasks**) in the top right.
3. In the **Task Configuration** card fill in:

   | Form item | What to enter | Notes |
   | --- | --- | --- |
   | Organization | Choose which organization to sync into | The synced content hangs under this organization; cannot be changed after creation |
   | Mirror Source | Choose ModelScope (ModelScope Community) or HuggingFace | Cannot be changed after creation |
   | Name | The external repository path, e.g. `Qwen/Qwen2.5-7B` | Cannot be changed after creation; after syncing, the name on the platform is the last segment of the path |
   | Token | Shown only when the repository needs authorization | Required for restricted repositories (such as Gated Models); not needed for public ones |
   | Sync all references | Off by default | When turned on, sync every remote branch, tag and commit as the on-screen hint explains |

4. After you fill in **Mirror Source** and **Name**, the platform automatically probes whether the repository exists:
   - During probing, **Verifying** is shown to the right of the name input.
   - When the repository does not exist, **Confirm** cannot be clicked.
   - When the repository exists but needs authorization, the **Token** input appears and must be filled in.
5. Click **Confirm**.

Confirming the result: back in the list, the task's status first becomes **Syncing**, and after the sync finishes it becomes **Synced**, with **Last Sync Time** updated too. While it is syncing, the matching entry in [Models](/boss/moha-admin/models) or [Datasets](/boss/moha-admin/datasets) shows a **Mirroring...** tag next to its name, and that tag disappears once the sync finishes.

:::info

A public repository needs no credentials at all; a restricted repository must be given a Token, otherwise probing fails and the form cannot be submitted.

:::

## Manual sync and stop

1. On the target task's row, click the **⋯** button on the far right (the actions menu).
2. When the status is not Syncing, the menu shows **Sync**; click it and confirm to run a sync immediately.
3. When the status is Syncing, the menu shows **Stop**; click it and confirm to abort this sync.

The platform also syncs automatically once a day, so you do not have to click anything.

## Edit a mirror task

1. Click the **⋯** button on the far right → **Edit**.
2. Only **Token** and **Sync all references** can be changed; **Organization**, **Mirror Source** and **Name** cannot be changed after creation.
3. Click **Confirm** when done. If you want to change the source or the repository, delete the task and create a new one.

## Delete a mirror task

1. Click the **⋯** button on the far right → **Delete**; you can also tick several rows first and use the batch delete above the list.
2. Type the task name as prompted; only then does **Confirm** become clickable.
3. Click **Confirm**.

:::warning Deleting a mirror task does not delete the synced content

Deleting only stops the task from syncing any further. The model or dataset repositories already synced stay in their original organization, and simply stop updating. If you want to clean up the content as well, delete the matching repository in [Models](/boss/moha-admin/models) or [Datasets](/boss/moha-admin/datasets).

:::

## Common questions

| Symptom | Likely cause | What to do |
| --- | --- | --- |
| On submit it says "Repository does not exist" | The repository path is wrong | Check the `org/repo` spelling and enter it again |
| The sync keeps failing after submission | The Token has expired, or the external platform has a network problem | Click **Edit** to update the Token, then click **Sync** to retry |
| There is a "Mirroring..." tag in Models / Datasets that never goes away | The sync has not finished, or it failed | Come back to this page and check the task's status and last sync time |
| The status is Paused | The system is not currently running this sync | Click **Sync** to trigger one manually |

## Related

- [Models](/boss/moha-admin/models)
- [Datasets](/boss/moha-admin/datasets)
- [Images](/boss/moha-admin/images)
