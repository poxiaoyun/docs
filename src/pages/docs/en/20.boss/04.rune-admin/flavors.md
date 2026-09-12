---
title: Flavor
updated: '2026-09-12'
description: 'Flavor list columns, resource configuration form, enable/disable, and deletion notes for cluster flavors.'
---

## Overview

A flavor defines the **compute resource combination** available when deploying an instance. Administrators create and manage flavors at the cluster level; flavors are then referenced by quotas and finally presented to users as options.

> 💡 Tip: This page is the **administrator view**, where you can create / edit / enable / disable / delete flavors. Tenants can only view and select authorized flavors.

## Access Path

BOSS Console → Cluster Management → select a cluster → **Flavors**

Frontend route: `/rune/clusters/:cluster/flavors`

---

## Flavor List

### Columns

| Column | Field Path | Display | Description |
| --- | --- | --- | --- |
| Name | `name` | Text + description | Flavor name, with description underneath |
| Type | `type` | Resource type tag | Rendered by `QuotaResourceType` |
| Model | `model` | Model tag | Rendered by `QuotaResourceModel`, combined with `vendor` |
| Spec | `config` | Tag group | `FlavorResources` renders tags per resource item |
| Resource Pool | `resourcePool` | Link text | The backend returns a pool ID; the frontend resolves and shows `name (ID)`; shows `-` when empty |
| Status | `enabled` | Tag | Enabled (`enabled = true`) / disabled |

### Filtering

| Filter | Source | Values |
| --- | --- | --- |
| Status | Table filter bar | Enabled (`available`) / disabled (`unavailable`) |
| Type | Flavor filter bar | Dynamically de-duplicated from the models returned by the API |
| Vendor | Flavor filter bar | Changes dynamically with the selected type |
| Model | Flavor filter bar | Changes dynamically with the selected type / vendor |

> 💡 Tip: The flavor filter bar also has a built-in whitelist of allowed types (`GPU`, `Accelerator`, `VGPU`, `FPGA`, `ASIC`, `NPU`, `DPU`, `TPU`, `CPU`, `MEMORY`), but the types actually shown still come from backend data — not a fixed set of six.

### Actions

| Action | Description |
| --- | --- |
| Enable / Disable | Toggles `enabled`, with a confirmation dialog |
| Edit | Opens the edit page |
| Delete | Deletes with a confirmation dialog; multi-select is supported |

---

## Create / Edit Flavor

Frontend routes:

- Create: `/rune/clusters/:cluster/flavors?action=create`
- Edit: `/rune/clusters/:cluster/flavors/:flavor?action=edit`

### Form Fields

| Field | Field Name | Required | Description |
| --- | --- | --- | --- |
| Name | `name` | — | Auto-generated and previewed by the system from the resource configuration and selected resource pool; not entered manually |
| Resource Configuration | `config[]` | ✅ | At least one item; see the table below |
| Resource Pool | `resourcePool` | — | **Optional**; determines the range of nodes the flavor can be scheduled to |
| Description | `description` | — | Textarea |

### Resource Configuration Item Fields (`config[]`)

| Field | Description |
| --- | --- |
| `resourceName` | Kubernetes resource name, e.g. `cpu`, `memory`, `nvidia.com/gpu` |
| `name` | Display name |
| `type` | Resource type, e.g. `cpu`, `gpu`, `vgpu`, `storage` |
| `limit` | Limit value (Quantity), required |
| `request` | Request value (Quantity), optional |
| `model` / `vendor` | Model / vendor |
| `ratio` | Conversion ratio (Quantity) |
| `candidates` | Candidate values (e.g. vNPU templates) |
| `default` / `min` / `max` | Default value / minimum / maximum allocation unit (Quantity) |
| `nodeSelector` | Node selector label key-value pairs |

Form validation: `limit` must satisfy `min ≤ limit ≤ max`; `nodeSelector` keys and values must be filled in pairs.

### Source of Selectable Resource Items

The selectable resource items come from the API `listClusterFlavorResources` and are loaded dynamically as the selected resource pool changes, so the **resource types are not a fixed enumeration**.

> 💡 Tip: On creation, if a resource pool is selected and the resource items are loaded, the system pre-fills defaults for CPU / memory: `cpu.limit = 2`, `memory.limit = 4Gi`.

---

## Enable / Disable

| Action | Effect |
| --- | --- |
| Enable | Visible to users with quota; can be selected |
| Disable | Hidden from selection lists; running instances using this flavor are unaffected |

---

## About "Sold Out"

> ⚠️ Note: The frontend flavor list only shows an `enabled` tag and has **no "sold out" UI**. If a backend contract contains a field such as `status.soldOut`, the frontend does not currently render or use it, and this document does not confirm its behavior.

---

## About "Multi-level Scope"

> ⚠️ Note: The frontend has **no** cluster → tenant → workspace flavor visibility configuration UI. Flavor availability at the tenant / workspace level is determined by quota allocation, not configured on the flavor page.

---

## Delete Flavor

Click **Delete** (with a confirmation dialog). Deletion does not affect running instances, but no new instances can be created from that flavor.

> ⚠️ Note: Before deleting, confirm that no tenant quota or workspace quota references the flavor.

---

## Permission Requirements

Requires the **System Administrator** role. You can view, create, edit, enable/disable, and delete cluster flavors.
