---
title: Resource Pool
updated: '2026-09-12'
description: 'Partition cluster nodes into resource pools: master-detail view, change pre-check, node partitioning, and default pool rules.'
---

## Overview

A resource pool groups cluster nodes into logical partitions for node-level resource isolation and scheduling control. Each node belongs to exactly one resource pool at a time; nodes that have not been explicitly partitioned belong to the system-reserved default pool `default`.

The management UI uses a **master-detail layout**: the left side is a card list of resource pools (with a search box for name or ID), and the right side shows the overview of the selected pool. Creating, editing, re-partitioning, and deleting are all done through **dialogs / dedicated forms**.

## Access Path

BOSS Console → Cluster Management → select a cluster → **Resource Pools**

Frontend route: `/rune/clusters/:cluster/resource-pools`

---

## List and Overview

The left list shows **compact cards** sorted by resource pool, each showing the name, ID, and a sync/health status summary. Above the list it shows `resource pool count / limit` and states that the limit is **10** (constant `MAX_RESOURCE_POOLS = 10`).

> ⚠️ Note: Once the number of resource pools reaches 10, the **Create Resource Pool** button is disabled and a limit-reached message is shown.

The right overview corresponds to the selected pool and contains:

| Area | Content |
| --- | --- |
| Header | Name, ID (copyable), description, default-pool marker, status tags |
| Capacity snapshot | Expected member count (`membership.expected`, with resolved count `resolved`), allocatable CPU, allocatable memory, accelerator group count |
| Accelerators | Switch between "Accelerator View / Host View" (`accelerator` / `host`) |
| Trends | Mini trend charts of CPU / memory utilization over the last hour |
| Actions | Adjust Partition, Edit Metadata, Delete (the default pool has no delete button) |

### View Switching

- **Accelerator View** (`accelerator`): groups by `physical` / `virtual` cards and shows each accelerator group's `capacity`, `allocatable`, and `nodeCount`.
- **Host View** (`host`): shows accelerator details per node (utilization, VRAM, power, temperature, and other observations).

### Status Tags

The pool header renders the following three status types via the status component (the default pool does not show sync or monitoring status):

| Dimension | Field | Values |
| --- | --- | --- |
| Sync | `sync.phase` | `pending` / `syncing` / `synced` / `failed` |
| Health | `health.phase` | `healthy` / `attention` / `degraded` / `notApplicable` / `unknown` |
| Monitoring | `monitoring.dataStatus` | `complete` / `notApplicable` / `partial` / `unavailable` / `unknown` |

Capacity and health data both carry a `dataStatus` marking data completeness (`complete` / `partial` / `unavailable` / `notApplicable` / `unknown`). Observations (`monitoring.cpu` / `monitoring.memory`) additionally have availability `availability` (`observed` / `notInstalled` / `noSeries` / `queryError`) and freshness `freshness` (`delayed` / `fresh` / `stale` / `unknown`).

---

## Default Resource Pool

The system reserves one default pool whose ID is fixed to `default` (`isDefault = true`):

- The default pool **cannot be deleted**; its overview has no delete button, and the delete dialog is not rendered for it at all.
- When creating a resource pool, the node picker only allows selecting nodes **currently in the `default` pool**; nodes already belonging to another pool are disabled with a hint to return them to the default pool first.
- After a resource pool is deleted, its nodes return to `default`.

---

## Change Pre-Check Mechanism

The three operations — create, delete, and move nodes — all go through a unified **"check change → tick acknowledgements → submit"** pre-check flow, to avoid mistaken operations when the snapshot and backend state are inconsistent.

### Action Types (`ChangeAction`)

| Value | Scenario |
| --- | --- |
| `CreatePool` | Create a resource pool |
| `DeletePool` | Delete a resource pool |
| `MoveNodes` | Node partitioning (move nodes to a target pool) |

### Pre-Check Request and Response

Key fields of the pre-check request `ResourcePoolChangeRequest`:

| Field | Description |
| --- | --- |
| `action` | One of the three actions above |
| `expectedRevision` | Optimistic-lock revision, taken from the current partition snapshot's `snapshot.partitionRevision` |
| `pool` | The `name` / `description` submitted for `CreatePool` |
| `poolID` | Target pool for `DeletePool` |
| `targetPoolID` | Target pool for `MoveNodes` |
| `nodes[]` | Nodes to move: `name` / `uid` / `expectedSourcePoolID` |
| `acknowledgedRiskCodes` | Risk codes the user has ticked |
| `confirm` | Set to `true` on deletion |

Fields of the pre-check response `ResourcePoolChangeCheck`:

| Field | Description |
| --- | --- |
| `ready` | Whether submission is allowed; `false` means there are blockers |
| `noChanges` | The change has no actual effect |
| `normalizedRequest` | The normalized request (e.g. back-filled target pool ID) |
| `nodes[]` | Each node's `sourcePoolID` / `targetPoolID` / `changed` |
| `blockers[]` | List of blocking reasons |
| `requiredAcknowledgementCodes[]` | Risk codes that must each be ticked |
| `references.flavors` / `references.quotas` | Flavor and quota references that depend on this pool |

> 💡 Tip: The submit button is enabled only when `ready = true`, `noChanges = false`, and all `requiredAcknowledgementCodes` have been ticked.

---

## Create Resource Pool

Frontend route: `/rune/clusters/:cluster/resource-pools?action=create`

### Steps

1. On the resource pool page, click **Create Resource Pool**.
2. Fill in the name and description (see form fields below).
3. In the "Initial Nodes" picker, select the nodes to include (optional; only default-pool nodes can be selected).
4. Click **Check and Create**; a confirmation dialog shows the pre-check result.
5. After ticking all risk acknowledgements, click **Create Resource Pool**.

### Form Fields

| Field | Field Name | Required | Constraint |
| --- | --- | --- | --- |
| Name | `name` | ✅ | 1–128 characters after trimming |
| Description | `description` | — | ≤ 500 characters after trimming |

> ⚠️ Note: When there are already 10 resource pools, the create page shows only a "limit reached" message and does not render the form.

### Initial Node Selection

- Only nodes with **`selectable = true` and `poolID === 'default'`** are listed.
- Supports searching by node name and selecting all on the current page; page size options are **20 / 50 / 100**.
- Non-default-pool nodes are disabled even if they appear in the list, with a hint to return them to the default pool first.

### Confirmation Dialog

The dialog shows:

- The pre-check conclusion (needs acknowledgement / passed / blocked / no changes / submission result uncertain).
- The initial node list (index, node name, accelerator).
- The `requiredAcknowledgementCodes` that must be ticked one by one.
- The blocking reasons `blockers` (localized).

On successful submission, it returns to the resource pool list and triggers a refresh.

---

## Edit Resource Pool

Click **Edit Metadata** in the top-right of the overview to open the edit page; only `name` and `description` can be modified:

- `name` is 1–128 characters, `description` is ≤ 500 characters.
- The helper text on the edit page shows the current pool ID.

> 💡 Tip: Adding or removing nodes is not done on the edit page, but through the **Adjust Partition** dialog via `MoveNodes`.

---

## Adjust Node Partition

Click **Adjust Partition** in the top-right of the overview to open the dialog:

1. On the left, tick the nodes to move (supports search, select-all on the current page, page size 20 / 50 / 100).
2. On the right, select a **single** target resource pool.
3. Click **Check Change** to run the `MoveNodes` pre-check; the panel shows the "to update / to skip" node counts and any blocking reasons.
4. After ticking all risk acknowledgements, click **Submit Partition Change**.

> ⚠️ Note: Ticking nodes, switching the target pool, paging, or changing the search invalidates the previous pre-check result and requires checking again.

---

## Delete Resource Pool

1. In the overview, click **Return Nodes and Delete** (the default pool has no such entry).
2. After the dialog opens, the system automatically runs a pre-check with `DeletePool` + `confirm: true`.
3. If flavor / quota references exist, the deletion is blocked; the dialog lists each reference (name, type, tenant / workspace) with a "Go to manage" link.
4. When there are no blockers, enter the **resource pool ID** for second confirmation, tick the risk items, and click delete.

After a successful deletion, the nodes return to `default`, the list refreshes, and `default` is selected by default.

---

## Refresh and Initialization

- Under normal conditions the overview auto-refreshes every **30 seconds**.
- If the cluster returns `initialization.phase = initializing`, it polls every **2 seconds** instead; when `phase = failed`, polling pauses and the initialization-failure state is shown.
- While initialization is incomplete, the create entry is disabled.

---

## Permission Requirements

| Operation | Required Role |
| --- | --- |
| View resource pools | System Administrator |
| Create / edit / adjust partition / delete | System Administrator |
