---
title: System Member
updated: '2026-09-12'
description: 'Add platform administrators, assign their roles and remove them — including what happens if you remove yourself.'
tags:
  - boss
  - settings
---

# System Member

System members are the **platform administrators**: they can sign in to the BOSS operations portal and manage all tenants, clusters, resource pools and global settings. Think of it as **the list holding the highest platform privileges**.

This page lets you view the list, add administrators, adjust their roles and remove people from the list. It is under **System Settings → System Member** in the left-hand menu.

:::tip This is not the same as tenant members
System members are **platform-level** and cover the whole platform.
Members inside a tenant are **tenant-level** and cover only that one tenant. The two are independent: after a user is removed from system members, their roles in each tenant are unaffected.
:::

## Before you start

- Your own account must be a **system administrator** to open this page.
- Anyone you want to add **must already have an account on the platform**. If they do not, create the user first under **Account Center → User Management**.

## Member list

Each row shows:

| Column | Meaning |
| --- | --- |
| Username | The member's name, with their avatar in front |
| Email | The email address the member registered with |
| Role | The member's system role, shown as a translated role name (for example "Administrator") |
| Joined At | When they became a system member |

On the right of each row there are **Edit** and **Delete** actions.

## Add a system member

1. Click **Add Member** in the top-right corner.
2. Fill in the form:

   | Setting | What to fill in | Notes |
   | --- | --- | --- |
   | User | Type a username to search, then pick from the drop-down results | Only **already registered** users can be selected; the person cannot be changed here afterwards |
   | Role | Pick a system role from the drop-down | Decides this person's permission scope on the platform |

3. Click **Confirm** to finish adding; the page returns to the member list.
4. To give up instead, click **Cancel**.

## Change a member's role

1. Find the member in the list and click **Edit**.
2. The user cannot be changed (the field is not editable); choose the new role from the **Role** drop-down.
3. Click **Confirm** to save.

## Remove a member

1. Find the member in the list and click **Delete**.
2. Confirm the deletion in the dialog that appears.

After removal the user **immediately loses access to the BOSS operations portal**. Note however:

- Their ordinary account **is unaffected** and they can still sign in to the platform and use business features.
- Their roles and permissions in each tenant **are unaffected**.

:::warning Do not delete yourself or the last administrator
Removing yourself **immediately takes away your own platform management privileges**, and if you are the last administrator on the list, **nobody will be able to get into platform management to make any further changes**.
Before removing anyone, confirm that another usable administrator remains; if you really must reduce the number of administrators, add a new one first.
:::

## Confirming the result

- Added: the user appears in the member list with **Role** and **Joined At** filled in.
- Role changed: the member's **Role** column shows the new role.
- Removed: the user is no longer in the list; if they sign in to BOSS again they will be refused.

## Common questions

| What you see | Likely cause | What to do |
| --- | --- | --- |
| The person you want to add cannot be found | That user has not registered on the platform | Create the user first under **Account Center → User Management** |
| The Role drop-down is empty | The system role list has not loaded | Refresh the page and try again |
| You deleted the wrong person | They have already lost BOSS access | Add them back as a system member and assign their original role |

## Related

- [License](/boss/settings/license)
- [Platform Settings](/boss/settings/platform)
