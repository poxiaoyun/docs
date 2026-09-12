---
title: 'Training & Fine-tuning'
updated: '2026-09-12'
description: 'Fine-tuning task list fields, creation flow, status enum, and result retrieval.'
tags:
  - rune
  - console
---

# Training & Fine-tuning
Fine-tuning services (`category=tune`) perform secondary training on pre-trained models. As with inference and dev environments, fine-tuning tasks are created through a template + JSON Schema form and share the unified instance model and lifecycle.

List path: `/rune/tenants/:tenant/clusters/:cluster/workspaces/:workspace/tunes`

## Fine-tuning Service List

List columns (`src/pages/rune/instances/list.tsx`, `category=tune`):

| Column | Description |
| --- | --- |
| Name | Instance name; click to open the detail page |
| Training Framework | The template column's i18n key for this category is `training_framework` (other categories use `template`) |
| Flavor | Resource summary resolved from `values.flavor` |
| Status | `status.phase` |
| Access | `ConnectionButtons`, providing quick Web / SSH access |
| Created By | Taken from the labels on the instance |
| Created At | Task creation time |

Row action menu: start/stop, save as template, edit, delete.

> ⚠️ Note: The fine-tuning list has **no "Model Name" column**. The "Model Name" row from the old documentation has been removed; the actual column is "Training Framework". The list also has no status filtering and no batch start/stop.

## Creating a Fine-tuning Task

1. Click the button in the upper-right corner of the list page (i18n key `common:create_tune_jobs`); it navigates to `/rune/products/tune`.
2. Select a fine-tuning template and version.
3. Fill in the basic information.

| Field | Required | Description |
| --- | --- | --- |
| `id` | ✅ | Instance ID; cannot be modified in edit mode |
| `name` | ✅ | Display name |
| `description` | — | Description |

4. Fill in the template parameters: rendered dynamically from the version's JSON Schema, with switchable form/JSON modes.

> ⚠️ Note: The deploy form has no fixed "select flavor" or "mount training-data/output storage volume" step. Whether hyperparameters such as `base_model` or `learning_rate` exist, and whether there are flavor or storage volume fields, is determined by the selected template's Schema.

## Instance Status

`status.phase` values are defined in `InstanceStatusPhaseEnum` (see [Create Workloads](/rune/guide/workloads) for the full table). Fine-tuning tasks commonly show `Running`, `Succeeded`, `Failed`, `Unhealthy`, `Degraded`, and so on.

## Access and Monitoring

- **Access**: The "Access" column in the list and the endpoint area on the detail page provide quick access buttons for opening the training tool's Web UI (such as a visual training interface).
- **Monitoring**: The "Monitoring" tab on the detail page shows instance metrics.
- **Logs**: The "Logs" tab shows training output logs.
- **Events**: The "Events" tab shows Kubernetes events.

## Retrieving Training Results

After training completes (status `Succeeded`):

1. Training outputs are saved in the output directory specified by the template parameters (usually inside a mounted storage volume).
2. Browse and download model files in the storage volume's file manager.
3. Training logs and checkpoints are also saved in the output directory.

## Permission Requirements

Fine-tuning services belong to the PAI workbench group; navigation requires the tenant role to be `ADMIN` or `DEVELOPER`.
