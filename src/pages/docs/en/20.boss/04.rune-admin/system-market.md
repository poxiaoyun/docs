---
title: 'System Template Market'
updated: '2026-09-12'
description: 'Select a template from the system template market and deploy a system instance or storage cluster.'
---

## Overview

The System Template Market is a cluster-level **infrastructure app market** that shows product templates in the system domain (`domain = system`), letting administrators select one and deploy it to the current cluster with one click.

## Access Path

Entered from the **Add** button on the **System Apps** or **Storage Clusters** page:

- System Apps: `/rune/clusters/:cluster/systems` → Add
- Storage Clusters: `/rune/clusters/:cluster/storages` → Add

Frontend routes (with deployment category):

- `/rune/clusters/:cluster/system-market/system`
- `/rune/clusters/:cluster/system-market/storage`

---

## Template Browsing

The market reuses the product list component for rendering, with data from `listSystemProducts`. Cards show the template icon, name, description, and version information.

> ⚠️ Note: The market page **does not show a category filter** (`showCategoryFilter = false`). Under the system domain a template's `category` is `system` or `storage`, determined by the template's own category field.

---

## One-click Deployment

1. Select the target template card in the market.
2. Select a deployable version.
3. Enter the deployment view and fill in configuration parameters according to the template Schema.
4. Submit the deployment to create the corresponding system or storage instance.

The deployment entry corresponds to the frontend route `/rune/clusters/:cluster/:types?action=create&product=<template>&version=<version>`.

After deployment, return to the [System Instances](./systems) or Storage Clusters list to check the running status.

---

## Differences from the User App Market

| Comparison | System Template Market | User App Market |
| --- | --- | --- |
| Target Role | System administrator | User |
| Template Domain | `domain = system` | `domain = user` |
| Deployment Scope | Cluster level | Workspace level |
| Management Entry | BOSS → Cluster → System Apps / Storage Clusters | Console → App Market |

> 💡 Tip: Templates in the market are maintained and published in [Product Template Management](./templates). If a required template is missing, create and publish the corresponding product template first.
