---
title: 'Inference Services'
updated: '2026-09-12'
description: 'Inference service list fields, deployment, status enum, gateway registration, and instance detail.'
tags:
 - rune
 - console
---

# Inference Services

Inference services (`category=inference`) deploy a model as an online service. Deployment follows the shared model: pick a template, fill base fields, fill JSON Schema parameters. After deployment the instance can be registered with the gateway.

List path: `/rune/tenants/:tenant/clusters/:cluster/workspaces/:workspace/inferences`

## List

| Column | Description |
| --- | --- |
| Name | Instance name, click to open detail |
| Template | Source product template name and version |
| Flavor | Resource summary parsed from `values.flavor` |
| Model | From `status.summary.model` |
| Replicas | From `status.summary.replicas` |
| Status | `status.phase` |
| Creator | From labels |
| Created At | Instance creation time |

Row actions: Start/Stop, Publish/Gateway configuration, Unregister, Save as template, Edit, Delete.

> ⚠️ Note: The list does **not** support status filtering and has **no batch start/stop** (the toolbar batch action list is empty and `filterFields` is empty).

## Create

1. Click **Create Resource** (i18n key `create_resource`) — this navigates to `/rune/products/inference`.
2. Select a template and version (or start from a template in the App Market).
3. Fill base fields:

| Field | Required | Description |
| --- | --- | --- |
| `id` | ✅ | Instance ID, not editable in edit mode |
| `name` | ✅ | Display name |
| `description` | — | Description |

4. Fill template parameters rendered from the version JSON Schema (graphical mode ↔ JSON mode).

> 💡 Tip: There is no fixed "choose flavor → mount storage → fill parameters" flow. Whether flavor, storage, or replica fields exist depends on the template Schema.

## Status

`status.phase` comes from `InstanceStatusPhaseEnum` (`src/types/instance.ts`), 12 values: `Reconciling`, `Installed`, `Pending`, `Running`, `Healthy`, `Unhealthy`, `Degraded`, `Paused`, `Succeeded`, `PartialFailed`, `Failed`, `Terminating`.

## Lifecycle

| Action | Description |
| --- | --- |
| Edit | Edit name, description, and template parameters |
| Start / Stop | Toggle `values.global.paused`; not a state-machine transition |
| Scale | `ScaleAction` in the detail action menu |
| Delete | Deletes the instance and related resources; confirmation required |

## Gateway Registration

- Requires instance status `Healthy` or `Installed`; otherwise the menu item is disabled.
- The form renders `endpoint` (required URL, auto-completable from instance endpoints), `accessLevel`, `engine`, and `adapters`.
- `models` and `key` exist in the backend contract but have **no input control** in the current form.
- The front end defines **no gateway status enum**; only a `paused` boolean exists.

> ⚠️ Note: The gateway status enum belongs to the backend contract and is not constrained by the front end; not yet confirmed.

See [Inference Hosting](/rune/guide/inference) for details.

## Detail

Tabs: Overview / Monitoring / Logging / Events. The action menu additionally provides "Save as template", "Gateway configuration", and "Decrypt model".

### Model Decryption

Inference instances support decrypting an encrypted model (`DecryptModelAction`); the dialog requires a decryption password. Individual Pods in the Pod list can also be decrypted.

## Permissions

Inference belongs to the PAI Workbench group; the navigation requires tenant role `ADMIN` or `DEVELOPER`.
