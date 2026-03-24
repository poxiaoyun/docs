---
title: 'Tenant Info'
updated: '2026-03-23'
---

## Overview

The Tenant Info page shows your membership details within the current tenant — your role, join date, and the tenant's basic information.

## Navigation

**IAM → Tenant**

## Tenant Information

![Tenant Info](/assets/screenshots/console/iam-tenant.png)

### My Membership

| Field | Description |
|-------|-------------|
| Tenant Name | The display name of the current tenant |
| Tenant ID | Unique identifier for the tenant |
| My Role | Your role within this tenant (Admin / Developer / Member) |
| Joined At | Date you joined this tenant |
| Status | Active / Suspended |

### Tenant Details

| Field | Description |
|-------|-------------|
| Created At | When the tenant was created |
| Owner | The Tenant Admin who created or owns the tenant |
| Region Access | Which clusters / regions this tenant has access to |
| Contact Email | Tenant administrator contact |

## Switching Tenants

To switch to a different tenant:

1. Click the tenant name in the top navigation bar.
2. Select the desired tenant from the dropdown.
3. All context (workspace, region) will reset to the new tenant's context.

Or navigate to the [Tenant Selection](../../auth/select-tenant) page to see all your tenants.

## Leaving a Tenant

To leave a tenant (only available if you are not the sole admin):

1. Click **Leave Tenant** at the bottom of the page.
2. Confirm the action.

> If you are the only Tenant Admin, you must assign another admin before leaving.

## Permissions

| Action | Required Role |
|--------|--------------|
| View tenant info | All tenant members |
| Edit tenant details | Tenant Admin |
| Leave tenant | Any member (except sole admin) |
