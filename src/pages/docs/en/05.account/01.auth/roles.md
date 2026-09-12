---
title: 'Roles and Permissions'
updated: '2026-09-12'
description: Role strings, front-end permission-string derivation, and can / hasRole checks.
---

## Overview

Access control is role-based (RBAC). After login the front-end fetches the current user's roles and derives a set of permission strings locally to control menus and action buttons. Actual security is still enforced by the backend API.

## Role Data

Roles are fetched via `GET /api/iam/current/roles`, typed as `CurrentRole` = `UserRole[]`:

| Field | Description |
|-------|-------------|
| `name` | User name |
| `tenant` | Tenant the role belongs to (optional) |
| `workspace` | Workspace the role belongs to (optional) |
| `cluster` | Cluster identifier (optional) |
| `roles` | Array of role strings |
| `description` | Description (optional) |

The role-string enum present in code (`src/types/tenant.ts:18-22`):

| Role string | Meaning |
|-------------|---------|
| `admin` | Administrator |
| `developer` | Developer |
| `member` | Member |

## Permission String Derivation

> ⚠️ Note: There is **no** `/permissions` endpoint in the code. The front-end **simulates** permission strings locally via `generatePermissionsFromRoles` (`src/auth/authz/context.tsx:32-85`; the comment states it is a stand-in "until the backend exposes /permissions"). The real backend contract is unconfirmed.

Derivation rules:

| Condition | Generated permission strings |
|-----------|------------------------------|
| `admin` with no `tenant` and no `workspace` | `*:*` |
| `admin` with `tenant`, no `workspace` | `workspace:*`, `member:*`, `quota:*`, `instance:*`, `image:*`, `template:*`, `volume:*` |
| `developer` with `tenant` | `workspace:list`, `workspace:get`, `instance:*`, `image:list`, `image:get`, `template:list`, `template:get` |
| `member` with `tenant` | `workspace:list`, `workspace:get`, `instance:list`, `instance:get`, `image:list`, `image:get` |

The result is de-duplicated. Implications:

- An `admin` with no tenant/workspace scope is treated as a system admin (all permissions)
- A tenant `admin` has workspace/member/quota/instance/image/template/volume permissions within the tenant
- A `developer` has full instance permissions and mostly read access elsewhere
- A `member` is read-only

## Permission Checks

The permission context exposes (`src/auth/authz/types.ts`):

| Method | Description |
|--------|-------------|
| `can(action, resource, service?)` | Check a single permission |
| `canAll(checks)` | All must pass (AND) |
| `canAny(checks)` | Any must pass (OR) |
| `hasRole(role, scope?)` | Check a role, `scope` can be `{ tenant, workspace }` |
| `refresh()` | Re-fetch roles |

`can` matching logic (`context.tsx:153-167`):

1. If the list contains `*:*` → pass
2. If it contains `${resource}:*` → pass
3. Otherwise require an exact `${resource}:${action}` or a service-prefixed `${service}:${resource}:${action}`

`PermissionCheck` is `{ action, resource, service? }`.

`hasRole` logic (`context.tsx:182-200`): if an `admin` with no tenant/workspace scope exists, every role query returns true; otherwise the role string must match and, when `scope.tenant` / `scope.workspace` is given, the scope must match too.

> ⚠️ Note: `can` does not support an `a/b` multi-action form, nor service-prefixed wildcards such as `service:*`. Such examples are not listed here.

## Front-end Usage

- `usePermission()`: programmatic checks, returning `{ can, canAll, canAny, hasRole, refresh, loading }`
- `Authorized` component and `permission-guard.tsx`: wrap permission-controlled UI
- After a role change, refresh or re-login is required to re-fetch roles

> ⚠️ Note: The precise permission required by each menu item/button, how the backend validates permissions, and who assigns roles are not fully captured in code and remain unconfirmed.
