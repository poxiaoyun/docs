---
title: App Template
updated: '2026-09-14'
description: Maintain user and system app templates — create a template, upload its versions and publish them so users can deploy in one click.
---

# App Template

A template is a ready-made "installation list": it packs everything an application needs, so a user (or the platform itself) can deploy from that list in one click instead of configuring from scratch.

Templates are split into two **domains** by purpose:

- **User**: for users in the app market, e.g. inference, fine-tuning, development environments.
- **System**: for the platform to deploy middleware in the cluster, e.g. monitoring, logging, storage.

By the end of this page you can: create a template, upload its versions, publish it, and manage existing templates.

:::tip Three terms compared

- **Template** is a ready-made "installation list" a user can reuse in one click.
- **Version** is a different revision of the same list, e.g. 1.0 and 1.1.
- **Domain** says whether the list is for users or for the platform.

:::

## Before you start

- You need a **System Administrator** account.
- Prepare the template package you want to upload: a Chart archive in **`.tgz` format**.

## Getting there

Click **AI Platform** in the top navigation bar, then click **App Template** under the **AI Platform** group in the left sidebar.

## Reading the template list

| Column | Meaning |
| --- | --- |
| Name | Avatar + name; the ID is appended in brackets when it differs from the name, with the description underneath. Click the name to open the introduction page |
| App Version | The latest version's app version number, with the chart version shown below |
| Domain | User / System |
| Category | Template category, e.g. inference, fine-tuning, storage |
| Published | A green tick when published, a grey cross when not |
| Recommendation Index | The recommendation score |
| Recommendation Screenshot | Whether a recommendation screenshot is configured |
| Created At | — |

Filters and sorting at the top:

- **Domain**: switch between User / System.
- **Category**: options change with the selected domain (see the table below).
- **Search**: search by keyword.
- **Time Sort / Recommendation Sort**: switch the sort order.
- **Show Unpublished**: unpublished templates are hidden by default.
- **Refresh**: fetch the list again.

### Domain and category mapping

| Domain | Available categories |
| --- | --- |
| User | Inference, Fine-tuning, Development, Experiment, Evaluation, App |
| System | System, Storage |

When you switch the domain, the currently selected category is cleared automatically if it does not belong to the new domain.

Actions on each row: **Recommendation** (configure the score and screenshot), **Publish / Unpublish** (with a confirmation dialog), **Edit**, **Delete** (with a confirmation dialog, multi-select supported).

![App template list: filtered by domain (user / system) and category (inference / fine-tuning / development / experiment / evaluation / app / system / storage)](/assets/screenshots/boss/rune-products-01.png)

The page splits templates by **Domain** (user or system) and then narrows by **Category**. Sorting toggles between **By time** and **By recommendation**, and **Show unpublished** pulls drafts into the list. The cards in the screenshot include system components such as `vpa`.

## Create a template

1. In the top right of the list, click **Create App Template**.
2. Fill in the form:

| Form item | What to enter | Notes |
| --- | --- | --- |
| Chart Name | e.g. `my-inference` | The unique identifier of the template package; **cannot be changed after creation** |
| Name | e.g. "My Inference Engine" | The name shown in the UI; it follows the Chart Name automatically on creation and can be edited by hand |
| Domain | Defaults to User | Decides who the template is for |
| Category | Choose a domain first, then a category | Not selectable until a domain is chosen |
| Description | Optional | One sentence about what it is for |

3. Click **Confirm** to save.

:::info The avatar can only be uploaded during editing

There is no avatar upload entry when creating. After the template is created, open the **Edit** page to upload and crop the template avatar.

:::

## Upload versions and publish

Once the template exists you still need to upload concrete versions before users can deploy.

1. Click the template name to open the detail page, then switch to the **Version** tab.
2. Upload a Chart package (`.tgz` format).
3. In the version list, check the **Chart**, **Chart Version** and **Published** columns.
4. Publish the versions you need; an already published version can be unpublished or deleted.

:::warning Nobody can use it until it is published

Only a **published** version can be deployed by users or the platform. After uploading, remember to click **Publish**.

:::

## Recommend a template

Click **Recommendation** on a row in the list, then set the recommendation index and screenshot in the dialog. The settings take effect in Recommendation Sort.

## Confirming the result

- The new template appears in the list, with the expected **Domain** and **Category**.
- Open the detail page's **Version** tab and you can see the version you just uploaded and published.

## Common questions

| Symptom | Likely cause | What to do |
| --- | --- | --- |
| The upload is rejected | It is not a `.tgz` file | Repackage it as `.tgz` and upload again |
| Users cannot see the template | The template or the version is not published | Publish the template and the matching version |
| The Chart Name cannot be changed | It is immutable after creation | If you really need a different one, create a new template |

## Related

- [System Template Market](/boss/rune-admin/system-market)
- [System Apps](/boss/rune-admin/systems)
