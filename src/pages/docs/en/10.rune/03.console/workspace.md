---
title: 'Workspace Management'
updated: '2026-09-12'
description: 'Workspace creation, members and roles, quotas, and the no-workspace/no-region interception logic.'
tags:
  - rune
  - console
---

# Workspace Management

A workspace is the smallest isolation unit that hosts instances in Rune: it is bound to a tenant and a cluster and corresponds to a dedicated Kubernetes Namespace. Inference, fine-tuning, dev environments, applications, and storage volumes for that space all run in this namespace.

## Entry Paths

| Page | Path |
| --- | --- |
| Workspace list | `/rune/tenants/:tenant/clusters/:cluster/workspaces` |
| Workspace overview / detail | `/rune/tenants/:tenant/clusters/:cluster/workspaces/:workspace` |
| Workspace quotas | `.../workspaces/:workspace/quotas` |
| Workspace members | `.../workspaces/:workspace/members` |

## Workspace List

The list shows the workspaces of the current tenant under the specified cluster. It is primarily based on workspace name/description, and each row can be opened for overview, edited, or deleted.

> ⚠️ Note: The status enum given in the old documentation (Active / Creating / Failed / Terminating) has no basis in the frontend constraints; the workspace `phase` value is returned by the backend and is not enum-limited by the frontend, so it is not yet confirmed here.

## Creating a Workspace

1. Click the create button on the list page.
2. Fill in the form.
3. Submit to create.

### Form Fields

| Field | Required | Description |
| --- | --- | --- |
| `id` | ✅ | Workspace unique identifier; cannot be modified after creation; the frontend auto-generates a default ID at creation time |
| `name` | ✅ | Display name |
| `cluster` | ✅ | Owning cluster; selectable at creation, disabled in edit mode |
| `description` | — | Description |

`id` and `name` are rendered by the same `IdField` component, and `cluster` is rendered by `ClusterField` (see `src/pages/rune/tenant/workspaces/components/form.tsx`).

> 💡 Tip: `id` participates in the Kubernetes Namespace name; prefer a short, meaningful lowercase identifier.

## Members and Roles

### Member List

The member list shows the members of the workspace and their roles, and supports editing and removal.

### Add / Edit Member

The member form contains only two fields:

| Field | Control | Required | Description |
| --- | --- | --- | --- |
| `user` | Autocomplete (from tenant members) | ✅ | Select from the tenant member list; disabled in edit mode |
| `role` | Autocomplete (single select) | ✅ | Workspace role, **single select** |

> ⚠️ Note: The old documentation said "assign one or more roles", but the actual form's `role` is a **single-select** string field (zod `role: z.string().min(1)`); it cannot be multi-select.

### Role Source

Role options are not a hard-coded frontend enum; they are fetched dynamically through `listWorkspaceRoles` for the roles available to the current workspace (`src/pages/rune/tenant/workspaces/members/components/form.tsx`), using the role `id` as the value and `name` as the label.

> ⚠️ Note: The role list varies with the tenant/workspace configuration, so this documentation does not enumerate a fixed role enum.

## Workspace Quotas

Workspace quotas are maintained on the quotas page under the workspace detail, and are used to further allocate tenant quota to a workspace. See [Quotas and Policies](/rune/console/quota).

## Context and Interception Logic

Workspace-related context is provided by `WorkspaceProvider`, and pages pass through `WorkspaceGuard` before rendering (`src/routes/sections/rune.tsx`):

| Scenario | Behavior |
| --- | --- |
| The current context has no workspace (`isEmpty` and not loading) | Renders an empty state: the title is `no_workspace`; tenant administrators additionally see a "Create Space" button that navigates to the workspace list, while non-administrators only see a hint |
| No cluster selected | Redirects to the `/rune/noregion` no-region notice page |

After switching workspaces, all functional modules on the left reload the resources of the corresponding space.

## Permission Requirements

Viewing the workspace list is open to all members; workspace-related context selection is a prerequisite for all instance operations. Management actions such as creating a workspace are performed by tenant administrators (the create button in the empty state is shown only to tenant administrators).

> ⚠️ Note: The exact role constraints for individual member actions (add/edit/remove) are not fine-grained per action in the frontend, so they are not yet confirmed here.
