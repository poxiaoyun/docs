---
title: Models
updated: '2026-09-14'
description: Unlist, recommend, edit or delete model repositories across the Moha Hub and take anything that should not be public off the user side.
---

# Models

The Models page lists the model repositories uploaded by users across the **whole platform**, including private models set to Private. Here you can see which models exist, how much space they take and how many times they have been downloaded, and also unlist non-compliant models or delete them outright.

:::tip How a model relates to the model library

A "model" is a packaged set of model files, usually containing many files and a version history. In the platform a model is a **repository**, like a folder in a cloud drive that you can keep committing new versions to.

:::

## Before you start

- You need the **System Administrator** role.
- In the left sidebar click **Asset Management** → **Models**.

## A few terms first

| Term | Plain explanation |
| --- | --- |
| Repository | A collection of model files with a version history |
| Organization | The team account this model belongs to |
| Visibility | Who can see this model |
| Recommendation Index | The score an administrator gives the model, shown on the user side |
| Encryption | An encryption mark the platform puts on this model |
| Mirroring | This model was synced from an external platform and the sync has not finished |

Visibility has three values, which decide who can see and who can push:

| Shown as | Who can see and download | Who can push new versions |
| --- | --- | --- |
| Public | Anyone, including visitors who are not signed in | Only the creator when the repository is personal; every member of the organization when it belongs to one |
| Tenant Only | Only members of the owning organization | Members of the owning organization |
| Private | Only the creator | Only the creator |

## What is on the list

Above the list are 5 statistics cards. Except for "Total Models", the other cards **count only the models on the current page**, and the numbers change when you turn the page.

| Card | Meaning |
| --- | --- |
| Total Models | The number of models on the whole platform; the subtitle shows the total capacity of the current page's models |
| Public Models | How many models on the current page have visibility Public |
| Encrypted Models | How many models on the current page carry the encryption mark |
| Total Downloads | The combined download count of all models on the current page |
| Hot Models | How many models on the current page have any downloads |

Each row of the list shows:

| Column | Meaning |
| --- | --- |
| Alias / Name | The model name; when there is an info icon next to it, hover to see the description |
| Organization | The organization the model belongs to |
| Visibility | Public / Tenant Only / Private; Private also shows the creator after it |
| Used Capacity | The space the repository already occupies; shows `-` until the statistics finish |
| Download Count | The cumulative downloads |
| Task | The technical tasks the model can do, collapsed when there are several |
| Tags | The model's custom tags |
| Recommendation Index | The score set by an administrator; hover to see the recommendation reason |
| Updated At | The time of the most recent change |

## Find the model you want to work on

1. Type the model's name or alias into the search box; the search runs as you type.
2. When needed, use the **Organization**, **Visibility** and **Task** drop-downs to filter.
3. Click **Advanced search** to the right of the search box; in the panel you can filter by **Industry / business domain**, **Use cases**, **Model precision**, **Hardware backends**, **Accelerators**, and **Created from / Created to**, then click **Apply filters**.
4. Filters that are already in effect are shown as small chips; click the cross on a chip to remove it alone, or go back to the **Advanced search** panel and click **Clear advanced filters** to remove them all.

## Unlist a model (change visibility)

The platform has no separate "approve / reject" button. For a non-compliant model or one that should not be public, an administrator takes it off the user side by changing its visibility.

1. On the target model's row, click the **⋯** button on the far right (the actions menu).
2. Click **Update Visibility**.
3. In the **Visibility** drop-down choose the target value: **Public**, **Tenant Only** or **Private**.
4. Click **Confirm**.

Confirming the result: the visibility tag on that row changes immediately; once it is Tenant Only or Private, ordinary users can no longer see or search for the model.

## Set a recommendation

1. On the target model's row, click the **⋯** button on the far right.
2. Click **Recommendation**.
3. Fill in the **Recommendation Index**, an integer from 0 to 100.
4. Write the recommendation note in **Recommendation Reason**; rich-text editing is supported.
5. Click **Confirm**.

Confirming the result: the Recommendation Index column shows the score, and hovering over it pops up the recommendation reason.

## Edit model information

1. Click the **⋯** button on the far right → **Edit**.
2. The page has three cards, **Model**, **Metadata** and **Visibility**, which can be collapsed and expanded:
   - **Name** cannot be changed; its input box is greyed out.
   - You can change the **Description** and the metadata (task, tags, and so on).
   - You can switch Private / Tenant Only / Public under **Visibility**.
3. Click **Confirm** when done and you return automatically to the Models list.

## Delete a model

1. Click the **⋯** button on the far right → **Delete**; you can also tick several rows first and use the batch delete above the list.
2. The confirmation dialog shows "Delete model xxx?".
3. Type the model's name as prompted; only then does **Confirm** become clickable.
4. Click **Confirm**.

:::warning Deleted means gone

Deletion permanently removes this model repository and every file and historical version inside it, and **it cannot be recovered**. Make sure you really no longer need it, or have backed it up elsewhere first.

:::

## Common questions

| Symptom | Likely cause | What to do |
| --- | --- | --- |
| Used Capacity keeps showing `-` | The platform is still measuring this repository | Refresh the page and look again later |
| There is a "Mirroring..." tag next to the name | This model came from an external platform and the sync has not finished | Check the sync status on [Mirror](/boss/moha-admin/mirrors) |
| There is a lock icon next to the name | This model carries the encryption mark | This is a normal state, not an error |

## Related

- [Datasets](/boss/moha-admin/datasets)
- [Mirror](/boss/moha-admin/mirrors)
- [Audit Logs](/boss/moha-admin/audit)
