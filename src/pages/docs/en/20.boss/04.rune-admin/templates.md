---
title: App Template
updated: '2026-09-12'
description: 'Product template list columns, create/edit form, domain-category mapping, and template version management.'
---

## Overview

A product template defines the deployment configuration of an application and is backed by a Helm Chart. Templates are distinguished by **domain**: the `user` domain targets the user-facing app market, while the `system` domain targets the cluster's system template market.

## Access Path

BOSS Console → App Templates

Frontend route: `/rune/products`

---

## Template List

### Columns

| Column | Field Path | Description |
| --- | --- | --- |
| Name | `name` | Avatar + name (with ID) + description; click to open the introduction page |
| App Version | `versions[0]` | Shows the latest version's `appVersion`, with `chart version` shown below |
| Domain | `domain` | `user` / `system` |
| Category | `category` | Category identifier |
| Published | `published` | Status icon |
| Recommendation Score | `annotations["app.xiaoshiai.cn/recommendation-score"]` | Numeric score |
| Recommendation Screenshot | `annotations["app.xiaoshiai.cn/recommendation-screenshot"]` | Whether a recommendation screenshot is configured |
| Created At | `creationTimestamp` | — |

> ⚠️ Note: "App Version", "Recommendation Score", and "Recommendation Screenshot" are list-only columns; there are no corresponding inputs in the create form.

### Filtering and Sorting

- **Domain**: `user` / `system` switch.
- **Category**: options change with the selected domain (see the table below).
- **Keyword search**.
- **Time sorting** (`creationTimestamp-`) and **recommendation sorting** (`recommendation-`).
- **Show Unpublished** toggle.

### Domain and Category Mapping

Category options are determined by the domain (`DOMAIN_CATEGORIES`):

| Domain | Available Categories |
| --- | --- |
| `user` | `inference`, `tune`, `im`, `experiment`, `evaluation`, `app` |
| `system` | `system`, `storage` |

When the domain is switched, the current category is cleared if it does not belong to the new domain.

### Actions

| Action | Description |
| --- | --- |
| Recommend | Opens the recommendation dialog to configure the score and screenshot |
| Publish / Unpublish | Toggles `published`, with a confirmation dialog |
| Edit | Opens the edit page |
| Delete | Deletes with a confirmation dialog |

---

## Create / Edit Template

Frontend routes:

- Create: `/rune/products?action=create`
- Edit: `/rune/products/:product?action=edit`

### Form Fields

| Field | Field Name | Required | Description |
| --- | --- | --- | --- |
| ID | `id` | ✅ | Unique Chart identifier; disabled in edit mode; in create mode the **name is auto-filled from the ID** (while the name has not been edited manually) |
| Name | `name` | ✅ | Display name |
| Domain | `domain` | ✅ | Defaults to `user` |
| Category | `category` | ✅ | Disabled until a domain is selected; options determined by the domain |
| Description | `description` | — | Textarea |

### Icon (Avatar)

- The upload entry is shown **only in edit mode**.
- After upload it calls the template avatar API and supports cropping.

> ⚠️ Note: The frontend has **no README editor**; the create / edit form contains no README field. The template's introduction content is shown on the detail page's "Introduction" tab.

---

## Template Detail and Versions

The detail page has two tabs, **Introduction** and **Versions** (frontend `/rune/products/:product/introduction`, `/rune/products/:product/version`).

### Version List

| Column | Field | Description |
| --- | --- | --- |
| Chart | `chart` | Chart name |
| Package Version | `chartVersion` / `version` | Chart version number |
| Published | `published` | Status icon |

Versions support uploading a Chart, publish / unpublish, and deletion.

> 💡 Tip: The uploaded Chart package must be a `.tgz` archive.

---

## Permission Requirements

Requires the **System Administrator** role. You can create, edit, publish/unpublish, recommend, and delete product templates.
