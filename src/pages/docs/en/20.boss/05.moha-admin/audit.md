---
title: Audit Logs
updated: '2026-09-12'
description: See who did what and when in Moha Hub — filter the records, inspect a detail view, and export them to a file.
---

# Audit Logs

The audit log records **every key operation** on Moha Hub content: who, when, on which model or dataset, what action, and whether it succeeded. When you need to investigate "who deleted this model" or "who made it public", this is where you look.

:::tip It is not the same as Call Logs

The audit log records **management actions on content** (create, update, delete, push, pull, and so on). The AI gateway has a separate Call Logs page that records API calls; the two are unrelated.

:::

## Before you start

- You need the **System Administrator** role.
- In the left sidebar click **Security Audit** → **Audit Logs**.

## Filter the records

There is a row of filters at the top of the page, showing **the last month up to today** by default:

| Filter | How to use it |
| --- | --- |
| Start Date | Click the date box to pick the start date; defaults to one month before the current date |
| End Date | Click the date box to pick the end date; defaults to today |
| Organization | Pick one organization, or **All Organizations** |
| Action | Pick one action, or **All Actions** |
| Resource Type | Pick one resource type, or **All Resources** |

- If you set the start date after the end date, the end date is pushed later automatically, and vice versa, so an empty range never occurs.
- Once the filters are set the list re-queries with the new conditions; you can also click **Query** to refresh manually, or **Reset** to restore the defaults.
- Every time you change a filter, the list returns to page 1.

:::info

There is **no** search box for users here. To track down a particular person, narrow the range with **Organization** first, then look in the User column.

:::

### Action types

| Shown as | Meaning |
| --- | --- |
| Create | A new piece of content was created |
| Update | Content or an attribute was changed |
| Delete | Content was deleted |
| Push | A new version was committed to a repository |
| Pull | Content was downloaded from a repository |
| Online | Content was published online |
| Restart | Something was restarted or republished |

### Resource types

The drop-down lets you pick Model, Dataset, Image, Space, Organization, Favorite, Comments, Commit, Snapshots, Image Scans, Announcements, Banners, Mirror Sites, Members, Users, Runtime Instances, Logs, Downloads, Encryption, Rating, README and more; when unsure, leave it at **All Resources**.

## What is on the list

| Column | Meaning |
| --- | --- |
| Time | Accurate to the millisecond, e.g. `2026-09-12 14:03:27.481` |
| User | The user who started the operation; shows `-` when it cannot be read |
| Organization | The organization the operation happened in |
| Action | Create / Update / Delete / Push and so on, distinguished by colored tags |
| Resource Type / Name | The resource type on the first line, the concrete resource name on the second |
| Method | The HTTP method the request used, e.g. POST, PUT, DELETE |
| Status | 2xx means success (green), 4xx means a problem with the request (yellow), 5xx means a service error (red) |
| Duration | How many milliseconds the operation took |
| Actions | Click the eye icon to see the details of this operation |

- **20** per page by default, sorted by time **newest first**, paged with the paginator at the bottom.
- There is no search box on this page; to find records use the filters above.

## View a record's details

1. On the target record's row, click the **eye icon** in the last column.
2. The dialog shows several blocks:
   - **Basic Info**: time, user, action, resource type, resource name, organization, duration.
   - **Request Info**: request method, request path, source IP, request content.
   - **Response Info**: HTTP status, response content.
   - **Parent Resources**: the parent resources this operation is related to.
3. Click **Close** when done.

## Export the records

1. Click **Export** in the top right of the page.
2. The platform exports **all records under the current filters** (not just the current page) to a JSON file named like `moha-audit-20260912-140327.json`.
3. When the export finishes it reports "Downloaded N audit logs"; if there are no records under the current filters it reports that there are no logs to download.

:::info

With many records the export takes a moment; the page does not freeze, just wait for the message.

:::

## How long records are kept

Records are kept for **90 days** by default, and anything past the retention window is cleaned up automatically by the platform. The number of days is configured when the platform is deployed: if it is set to 0, records are kept forever.

## Common questions

| Symptom | Likely cause | What to do |
| --- | --- | --- |
| You cannot find an organization's past operations | The date range is too narrow, or the wrong organization is selected | Widen the start / end dates, or click **Reset** and search again |
| You want to filter by user but there is no input box | The page does not support filtering by user | Narrow the range with **Organization** first, then look in the User column |
| The status is 4xx / 5xx | This operation did not succeed | Click the eye icon and read the response content in the details to confirm why it failed |

## Related

- [Models](/boss/moha-admin/models)
- [Datasets](/boss/moha-admin/datasets)
- [Mirror](/boss/moha-admin/mirrors)
