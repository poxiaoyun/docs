---
title: 'Organizations'
updated: '2026-03-23'
---

## Overview

Organizations allow teams to collaborate on Moha repositories under a shared namespace. An organization can own models, datasets, images, and Spaces, with access controlled at the member level.

## Navigation

**Console → Moha → Organizations**

## Organization List

![Organizations](/assets/screenshots/console/moha-org-list.png)

Lists all organizations you belong to or own.

## Creating an Organization

1. Click **New Organization**.
2. Enter the organization username (this becomes the namespace, e.g., `my-team`).
3. Add a display name and description.
4. Click **Create**.

### Configuration Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| Username | Text | ✅ | Unique namespace (used in repository names: `org/model`) |
| Display Name | Text | ✅ | Human-readable name |
| Description | Textarea | — | Organization purpose |
| Avatar | Image | — | Organization profile picture |
| Website | URL | — | Organization website |

## Managing Members

1. Open your organization and navigate to **Members**.
2. Click **Invite Member** and enter the user's email or username.
3. Assign a role:
   - **Owner**: Full admin access to the organization
   - **Member**: Can view and contribute to organization repositories
4. Click **Invite**.

### Member Roles

| Role | Create Repos | Push Code | Manage Members | Delete Org |
|------|-------------|-----------|---------------|-----------|
| Owner | ✅ | ✅ | ✅ | ✅ |
| Member | ✅ | ✅ | ❌ | ❌ |

## Organization Repositories

All models, datasets, images, and Spaces owned by the organization are listed under its namespace. Repository access follows the organization's member list and repository visibility settings.

## Permissions

| Action | Required Role |
|--------|--------------|
| View any organization | Public: anyone; Private: members only |
| Create organization | Any logged-in user |
| Invite / remove members | Organization Owner |
| Delete organization | Organization Owner |
