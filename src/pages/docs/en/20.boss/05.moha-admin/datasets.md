---
title: Datasets
updated: '2026-09-14'
description: Unlist, recommend, edit or delete dataset repositories across the Moha Hub and take anything that should not be public off the user side.
---

# Datasets

The Datasets page lists the dataset repositories uploaded by users across the **whole platform**, including private datasets set to Private. Here you can see which datasets exist, how much space they take and how many times they have been downloaded, and also unlist or delete non-compliant datasets.

:::tip How datasets differ from models

The two work almost the same way: both are versioned repositories. The difference is in the content — a model holds trained model files, while a dataset holds data files used for training or evaluation. An administrator manages them in exactly the same way.

:::

## Before you start

- You need the **System Administrator** role.
- Click **Moha Hub** in the top navigation bar, then click **Datasets** under the **Asset Management** group in the left sidebar.

## A few terms first

| Term | Plain explanation |
| --- | --- |
| Repository | A collection of data files with a version history |
| Organization | The team account this dataset belongs to |
| Visibility | Who can see this dataset |
| Recommendation Index | The score an administrator gives the dataset, shown on the user side |
| Mirroring | This dataset was synced from an external platform and the sync has not finished |

Visibility has three values:

| Shown as | Who can see and download | Who can push new versions |
| --- | --- | --- |
| Public | Anyone, including visitors who are not signed in | Only the creator when the repository is personal; every member of the organization when it belongs to one |
| Tenant Only | Only members of the owning organization | Members of the owning organization |
| Private | Only the creator | Only the creator |

## What is on the list

Above the list are 5 statistics cards. Except for "Total Datasets", the other cards **count only the datasets on the current page**, and the numbers change when you turn the page.

| Card | Meaning |
| --- | --- |
| Total Datasets | The number of datasets on the whole platform; the subtitle shows the total capacity of the current page's datasets |
| Public Datasets | How many datasets on the current page have visibility Public |
| Encrypted Datasets | How many datasets on the current page carry the encryption mark |
| Total Downloads | The combined download count of all datasets on the current page |
| Hot Datasets | How many datasets on the current page have any downloads |

Each row of the list shows:

| Column | Meaning |
| --- | --- |
| Alias / Name | The dataset name; when there is an info icon next to it, hover to see the description |
| Organization | The organization the dataset belongs to |
| Visibility | Public / Tenant Only / Private; Private also shows the creator after it |
| Used Capacity | The space the repository already occupies; shows `-` until the statistics finish |
| Download Count | The cumulative downloads |
| Task | The technical tasks the dataset suits, collapsed when there are several |
| Tags | The dataset's custom tags |
| Recommendation Index | The score set by an administrator; hover to see the recommendation reason |
| Updated At | The time of the most recent change |

![Dataset management: five stat cards on top, advanced search plus organisation / visibility / category filters, then the list](/assets/screenshots/boss/moha-datasets-01.png)

The datasets, models, images and spaces pages share one layout: five stat cards (total, capacity, public, encrypted, downloads), a filter bar and the list. The **current page only** note on the cards matters — those numbers are not a global total and change as you page through.

## Find the dataset you want to work on

1. Type the dataset's name or alias into the search box; the search runs as you type.
2. When needed, use the **Organization**, **Visibility** and **Task** drop-downs to filter.
3. Click **Advanced search** to the right of the search box; in the panel you can filter by **Industry / business domain**, **Project stage**, **Languages**, **Text types**, **Acquisition methods**, **Custom tags** and **Data quality level**, then click **Apply filters**.
4. Filters that are already in effect are shown as small chips; click the cross on a chip to remove it alone, or go back to the **Advanced search** panel and click **Clear advanced filters** to remove them all.

## Unlist a dataset (change visibility)

The platform has no separate "approve / reject" button. For a non-compliant dataset or one that should not be public, an administrator takes it off the user side by changing its visibility.

1. On the target dataset's row, click the **⋯** button on the far right (the actions menu).
2. Click **Update Visibility**.
3. In the **Visibility** drop-down choose the target value: **Public**, **Tenant Only** or **Private**.
4. Click **Confirm**.

Confirming the result: the visibility tag on that row changes immediately; once it is Tenant Only or Private, ordinary users can no longer see or search for the dataset.

## Set a recommendation

1. On the target dataset's row, click the **⋯** button on the far right.
2. Click **Recommendation**.
3. Fill in the **Recommendation Index**, an integer from 0 to 100.
4. Write the recommendation note in **Recommendation Reason**; rich-text editing is supported.
5. Click **Confirm**.

Confirming the result: the Recommendation Index column shows the score, and hovering over it pops up the recommendation reason.

## Edit dataset information

1. Click the **⋯** button on the far right → **Edit**.
2. The page has three cards, **Dataset**, **Metadata** and **Visibility**, which can be collapsed and expanded:
   - **Name** cannot be changed; its input box is greyed out.
   - You can change the **Description** and the metadata (license, task, tags, and so on).
   - You can switch Private / Tenant Only / Public under **Visibility**.
3. Click **Confirm** when done and you return automatically to the Datasets list.

## Delete a dataset

1. Click the **⋯** button on the far right → **Delete**; you can also tick several rows first and use the batch delete above the list.
2. The confirmation dialog shows "Delete dataset xxx?".
3. Type the dataset's name as prompted; only then does **Confirm** become clickable.
4. Click **Confirm**.

:::warning Deleted means gone

Deletion permanently removes this dataset repository and every file and historical version inside it, and **it cannot be recovered**. Make sure you really no longer need it, or have backed it up elsewhere first.

:::

## Common questions

| Symptom | Likely cause | What to do |
| --- | --- | --- |
| Used Capacity keeps showing `-` | The platform is still measuring this repository | Refresh the page and look again later |
| There is a "Mirroring..." tag next to the name | This dataset came from an external platform and the sync has not finished | Check the sync status on [Mirror](/boss/moha-admin/mirrors) |
| There is no License column in the list | The license is metadata, so it lives on the edit page | Click **⋯** → **Edit** to view and change it |

## Related

- [Models](/boss/moha-admin/models)
- [Mirror](/boss/moha-admin/mirrors)
- [Audit Logs](/boss/moha-admin/audit)
