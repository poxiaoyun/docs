---
title: 'Apps'
updated: '2026-09-12'
description: 'List, create, detail-page PVC list, and lifecycle operations for application instances.'
tags:
  - rune
  - console
---

# Apps
App services (`category=app`) are used to deploy general-purpose applications. They share the unified Instance model with other categories and additionally provide a **PVC list** on the detail page.

List path: `/rune/tenants/:tenant/clusters/:cluster/workspaces/:workspace/apps`

## Application List

List columns (`category=app`):

| Column | Description |
| --- | --- |
| Name | Instance name; click to open the detail page |
| Application | The template column, whose i18n key for this category is `applications` |
| Flavor | Resource summary resolved from `values.flavor` |
| Status | `status.phase` |
| Created By | Taken from the labels on the instance |
| Created At | Instance creation time |

Row action menu: start/stop, edit, delete (delete requires a second confirmation).

> ⚠️ Note: The application list has **no status filtering**, and its configured batch action list is empty, so there is also **no batch start/stop**. Related descriptions in the old documentation have been removed.

## Deploying an Application

1. Click the **Create Resource** button in the upper-right corner of the list page; it navigates to `/rune/products/app`.
2. Select an application template and version, or enter from the template detail page in App Market `/rune/app-market` via **Deploy**.
3. Fill in the basic information (`id` / `name` / `description`).
4. Fill in the template parameters: rendered dynamically from the version's JSON Schema, with switchable form/JSON modes.

> 💡 Tip: There are no fixed "Template Version / Flavor / Storage Volume" fields at the console level. Whether persistent storage is required and which flavor to use depend on the selected template's Schema; the App Market list also shows a `Moha` tag for templates flagged with Moha.

## Application Detail

The detail page shares the unified skeleton with other categories. The Overview tab contains:

1. **Basic information card** (`ServiceInfoCard`)
2. **Pod list** (`InstancePodList`)
3. **PVC list** (`InstancePVCList`)

The remaining tabs are Monitoring, Logs, and Events.

### PVC List

The PVC list appears only on the application detail page (`src/pages/rune/apps/detail.tsx`) and shows the persistent volume claims associated with the application. The fields are determined by what `InstancePVCList` actually renders.

> ⚠️ Note: The PVC field list given in the old documentation (capacity, storage class, access mode, etc.) has not been confirmed item by item against the code, so it is not yet confirmed here.

## Lifecycle Operations

| Operation | Description |
| --- | --- |
| Start / Stop | Toggled through `values.global.paused` |
| Scale | `ScaleAction` in the detail page action menu |
| Edit | Modify the name, description, and template parameters |
| Delete | Delete the instance after a second confirmation |

## Permission Requirements

App services belong to the PAI workbench group; navigation requires the tenant role to be `ADMIN` or `DEVELOPER`.
