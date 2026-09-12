---
title: 'Storage'
updated: '2026-09-12'
description: 'Storage volume fields, creation, file manager, import tasks, and expansion rules.'
tags:
  - rune
  - console
---

# Storage
Storage volumes (StorageVolume) provide persistent storage for inference, fine-tuning, dev environment, and other instances. They map to S3-compatible object storage underneath and include a built-in file manager and multi-source data import tasks.

List path: `/rune/tenants/:tenant/clusters/:cluster/workspaces/:workspace/storagevolumes`

## Storage Volume List

List columns (`src/pages/rune/storagevolumes/list.tsx`):

| Column | Field | Description |
| --- | --- | --- |
| Name | `name` | A volume-type icon appears next to the name (see below); the description is shown underneath |
| Status | `status.phase` | Object status is shown when unbound |
| Storage Cluster | `storageClass` | The column's i18n key is `storage_cluster`, but the bound field is **`storageClass`** (not `storageCluster`) |
| Usage / Capacity | `size` | Shows usage and the expansion entry point |
| File Count | `fileCount` | Total number of files in the storage volume |
| Access Mode | `mountMode` | Determined by the read-only label; renders `read_write` or `read_only` |

> ⚠️ Note: The old documentation wrote the field as `storageCluster`; the actual field is `storageClass` (see `storagevolumes/components/form.tsx`).

Additional capabilities:

- Summary cards at the top (total count, usage, file count).
- A toolbar "show mounted only" toggle (`only_mounted`).
- Search by name, refresh, multi-select, and delete (delete requires a second confirmation).

> ⚠️ Note: The list has **no filtering by volume type (models / datasets)** and no separate "volume type" column — the volume type is just an icon next to the name.

## Creating a Storage Volume

Form fields (`storagevolumes/components/form.tsx`):

| Field | Type | Required | Rule / default | Description |
| --- | --- | --- | --- | --- |
| `name` | Text | ✅ | 1–63 chars, Kubernetes naming `^[a-z0-9]([-a-z0-9]*[a-z0-9])?$` | Storage volume name; disabled in edit mode |
| `storageClass` | Autocomplete | ✅ | Selected from the tenant's storage classes on this cluster | Target storage class; disabled in edit mode |
| `sizeValue` | Number | ✅ | ≥ 1 | Capacity value |
| `sizeUnit` | Select | ✅ | `Mi` / `Gi` / `Ti`, default `Gi` | Capacity unit |
| `readonly` | Radio | ✅ | `false` (read-write) / `true` (read-only), default `false` | Stored via label |
| `volumeType` | Radio | — | empty / `models` / `datasets` | Volume type label |
| `description` | Textarea | — | — | Description |

Labels written on submit:

| Label key | Value |
| --- | --- |
| `ai.xiaoshiai.cn/storagevolume-readonly` | `false` / `true` |
| `ai.xiaoshiai.cn/volume-type` | `models` / `datasets` (not written when empty) |

> 💡 Tip: The volume type is only a classification label and does not affect storage volume behavior.

## Expansion Rules

The expansion entry point is in the usage column. Capacity **can only be increased**: on submit the old and new capacities are compared, and if the new value is smaller than the current value an error `capacity_shrink_not_allowed` is raised, and the value must be ≥ 1.

## File Manager

Managed storage volumes support Web-based file management through an S3 proxy (browse, upload, download, delete, preview, search, breadcrumb navigation). The detail page also shows S3 account information and renders README.md.

> ⚠️ Note: Specific values such as the search debounce interval in the old documentation have not been confirmed against the code, so they are not yet confirmed here.

## Storage Volume Tasks

Tasks are used to import data from external sources and are located in the storage volume detail → Tasks tab.

### Job Kinds (kind)

| kind | Description | Key fields and defaults |
| --- | --- | --- |
| `Git` | Clone from a Git repository | `url` (required), `branch` (default `main`), `username`, `password` |
| `HuggingFace` | Download from HuggingFace | `type` (`model`/`dataset`, default `model`), `repo` (required), `branch` (default `main`), `token` |
| `ModelScope` | Download from ModelScope | `type`, `repo`, `branch` (default **`master`**), `token` |
| `PythonEnv` | Configure a Python environment | `reset`, `requires`, `version` (default `3.9`), `pip`, `condas` |
| `Moha` | Import from the internal Moha repository | `type`, `visibility`, `repo`, `branch` |

> ⚠️ Note: ModelScope's default branch is `master` (Git and HuggingFace default to `main`); the default Python version is `3.9`.

### Moha Visibility

The Moha task `visibility` has three values:

| Value | Description |
| --- | --- |
| `public` | Public (default) |
| `internal` | Internal |
| `private` | Private |

> ⚠️ Note: The old documentation listed only `public` / `private`; the actual set also includes `internal` (`storagevolumes/jobs/components/form.tsx`).

### Job Status

`StorageJobPhase` has 6 values (`src/types/storage-jobs.ts`):

| Status | Description |
| --- | --- |
| `Pending` | Waiting |
| `Running` | Running |
| `Succeeded` | Succeeded |
| `Failed` | Failed |
| `Deleting` | Deleting |
| `Unhealthy` | Unhealthy |

## Permission Requirements

Storage volumes belong to the PAI workbench group; navigation requires the tenant role to be `ADMIN` or `DEVELOPER`.
