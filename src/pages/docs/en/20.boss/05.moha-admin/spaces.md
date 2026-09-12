---
title: 'Spaces'
updated: '2026-09-12'
description: How a platform administrator views, unlists, recommends, edits and deletes Spaces across the whole Moha Hub.
---

# Spaces

A Space is an **online AI app** a user has built with code in Moha Hub — something like a small website you can open and visit directly, which can be published, stopped and republished. This page lists the Spaces created by every organization on the **whole platform**, including private Spaces set to Private.

:::tip What a Space is

Think of a Space as "an online mini-app someone else has built": a user writes code and submits it, and the platform runs it automatically and gives it an address. On the user side people can see the run status, download and like it; administrators do the governance here.

:::

## Before you start

- You need the **System Administrator** role.
- In the left sidebar click **Asset Management** → **Spaces**.

## A few terms first

| Term | Plain explanation |
| --- | --- |
| Space | An online AI app a user has built with code, with its own visit address |
| Organization | The team account this Space belongs to |
| Visibility | Who can see this Space |
| Running Status | Whether this Space is currently up |
| Domain / Scene | The business domain and use case the Space targets, used for classification |

Visibility has three values:

| Shown as | Who can see | Who can change it |
| --- | --- | --- |
| Public | Anyone, including visitors who are not signed in | Only members of the owning organization or repository administrators |
| Tenant Only | Only members of the owning organization | Members of the owning organization |
| Private | Only the creator | Only the creator |

## What is on the list

Above the list are 5 statistics cards. Except for "Total Spaces", the other cards **count only the Spaces on the current page**, and the numbers change when you turn the page.

| Card | Meaning |
| --- | --- |
| Total Spaces | The number of Spaces on the whole platform; the subtitle shows the total capacity of the current page's Spaces |
| Public Spaces | How many Spaces on the current page have visibility Public |
| Private Spaces | How many Spaces on the current page have visibility Private |
| Total Downloads | The combined download count of all Spaces on the current page |
| Hot Spaces | How many Spaces on the current page have any downloads |

Each row of the list shows:

| Column | Meaning |
| --- | --- |
| Alias / Name | The Space name; when there is an info icon next to it, hover to see the description |
| Organization | The organization the Space belongs to |
| Visibility | Public / Tenant Only / Private; Private also shows the creator after it |
| Used Capacity | The space the repository already occupies; shows `-` until the statistics finish |
| Running Status | Whether the Space is currently up; see the table below |
| Download Count | The cumulative downloads |
| Domain | The business domain the Space targets, collapsed when there are several |
| Scene | The Space's use cases, collapsed when there are several |
| Recommendation Index | The score set by an administrator; hover to see the recommendation reason |
| Updated At | The time of the most recent change |

The values Running Status can take (the same names users see on the Space detail page):

| Status | Meaning |
| --- | --- |
| Deploying | The platform is bringing the Space up |
| Running | The Space is up and can be visited |
| Syncing status | The latest state is being synchronized; wait a moment |
| Paused | The Space was stopped and no longer serves |
| Processing failed / Completed with failures | The deployment went wrong; open the user side to check the logs |
| Terminating | The Space is being deleted |
| Installed | The component has finished installing |
| Unknown | The status cannot be read at the moment |

## Find the Space you want to work on

1. Type the Space's name or alias into the search box; the search runs as you type.
2. When needed, filter with the **Organization**, **Visibility**, **Domain** and **Scene** drop-downs.
3. A filter you have chosen shows directly on its drop-down; choose **All** to clear it.

## Unlist a Space (change visibility)

1. On the target Space's row, click the **⋯** button on the far right (the actions menu).
2. Click **Update Visibility**.
3. In the **Visibility** drop-down choose the target value: **Public**, **Tenant Only** or **Private**.
4. Click **Confirm**.

Confirming the result: the visibility tag on that row changes immediately; once it is Tenant Only or Private, ordinary users can no longer see or search for the Space.

## Set a recommendation

1. On the target Space's row, click the **⋯** button on the far right.
2. Click **Recommendation**.
3. Fill in the **Recommendation Index**, an integer from 0 to 100.
4. Write the recommendation note in **Recommendation Reason**; rich-text editing is supported.
5. Click **Confirm**.

Confirming the result: the Recommendation Index column shows the score, and hovering over it pops up the recommendation reason.

## Edit Space information

1. Click the **⋯** button on the far right → **Edit**.
2. The page has three cards, **Space**, **Metadata** and **Visibility**, which can be collapsed and expanded:
   - **Name** cannot be changed; its input box is greyed out.
   - You can change the **Description** and metadata such as **License**, **Domain** and **Scene**.
   - You can switch Private / Tenant Only / Public under **Visibility**.
3. Click **Confirm** when done and you return automatically to the Spaces list.

## Delete a Space

1. Click the **⋯** button on the far right → **Delete**; you can also tick several rows first and use the batch delete above the list.
2. The confirmation dialog shows "Delete space xxx?".
3. Type the Space's name as prompted; only then does **Confirm** become clickable.
4. Click **Confirm**.

:::warning Deleted means gone

Deletion permanently removes this Space repository and every file and historical version inside it, and **it cannot be recovered**. Make sure you really no longer need it, or have backed it up elsewhere first.

:::

## Common questions

| Symptom | Likely cause | What to do |
| --- | --- | --- |
| You want to publish, stop or restart a Space but there are no such buttons here | This group of pages only governs content, not runtime control | Ask the Space's creator to do it on their own Space detail page on the user side |
| Used Capacity keeps showing `-` | The platform is still measuring this repository | Refresh the page and look again later |
| Running Status stays Deploying | The app is still building, or the build failed | Open the Space detail page on the user side and check the logs |

## Related

- [Models](/boss/moha-admin/models)
- [Images](/boss/moha-admin/images)
- [Audit Logs](/boss/moha-admin/audit)
