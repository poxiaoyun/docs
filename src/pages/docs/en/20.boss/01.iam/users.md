---
title: 'User Management'
updated: '2026-09-14'
description: Create a platform account, hand over the initial password, reset passwords, and where to change a role.
---

# User Management

A **user** is one person's account on the platform. Only with an account can a person sign in to the AI Platform and be added to a tenant. From here you create accounts, edit profiles, reset passwords and delete accounts.

:::tip One thing to remember
User management only covers **the account itself** (username, email, mobile number, password). Which tenant someone belongs to and what role they hold is set inside the **tenant** — see "Change a user's role" below.
:::

## Before you start

- You need an administrator account that can sign in to BOSS.
- You do **not** need to think of a password when creating a user; the system generates an initial one for you.

## How users and roles relate

| Term | Plain explanation |
| --- | --- |
| User | One platform account, one person |
| Tenant | The isolated space of one organization (company or team) |
| Member | What the user becomes after joining a tenant |
| Role | What that person may do **inside that tenant** |

The key point: **a role hangs off a "member", not off a "user"**. The same user can be an Administrator in tenant A and only a Member in tenant B. That is why you cannot find a place to "set a role for a user" — this is expected.

## What the user list shows

Go to **Account Center → Account**. The list has these columns:

| Column | Explanation |
| --- | --- |
| Username | Avatar, username (clickable to open the user details) and the grey text below it, which is the nickname |
| Email | The user's contact email |
| Mobile Number | The user's contact phone |
| Enable Multi-factor Authentication | Shows **Yes** or **No**, i.e. whether the person has turned on multi-factor authentication |
| Created At | When the account was created |

**Add User** in the top-right corner creates an account. There is a search box at the top for filtering users by keyword, and the list supports paging.

On the right of each row you can **edit** the profile, **reset password** or **delete** the account; selecting several rows lets you delete them in bulk.

![User management list: username, email, phone number, MFA enabled and creation time](/assets/screenshots/boss/user-list-01.png)

The user list has five columns. The **Username** cell holds two lines: the short name on top is what the user signs in with, the `Nick` line below is the display nickname. **MFA enabled** reading "No" means the user has not bound an authenticator yet. The email and phone columns are blurred.

## Create a user

1. Go to **Account Center → Account**.
2. Click **Add User** in the top-right corner.
3. Fill in the form described below.

   | Form field | How to fill it | Notes |
   | --- | --- | --- |
   | Username | For example `zhangsan` | Required. The unique identifier used to sign in; **it cannot be changed after creation** |
   | Nickname | For example `Zhang San` | Optional. A display name, any language |
   | Email | For example `zhangsan@example.com` | Required, and must be a valid email address |
   | Mobile Number | For example `13800000000` | Required, and must be a valid mobile number |

4. Click **Confirm**.

![The Add user form: username, nickname, email and phone number](/assets/screenshots/boss/user-create-01.png)

Creating a user takes four fields: **Username** (used to sign in, required), **Nickname**, **Email** (required) and **Phone number** (required). The initial password is generated afterwards — hand it over the way this section describes.

### Hand over the initial password

Once the user is created, a green message appears above the form containing:

- **Your username is** xxx
- **Your generated password is** xxx (with a copy button on the right)
- Please keep it safe!

:::warning The password is shown only once
This initial password **appears here and nowhere else**. It is gone as soon as you leave the page. Click the copy button straight away and pass it on through a safe channel (in person, or a separate encrypted channel), and remind the person to change it soon after their first sign-in.
:::

Creating users in bulk or importing them is **not supported** — one at a time. Bulk delete is supported.

## Reset a password

When someone forgets their password:

1. Go to **Account Center → Account**.
2. On the target user's row open the actions menu and click **Reset Password**.
3. Click **Confirm** in the dialog and the system generates a new password.
4. The new password appears in the dialog — click the copy button next to it and send it to the person.

:::warning Resetting invalidates the old password immediately
The old password stops working at once and the user must sign in with the new one. The new password is also **shown only this once**, so copy and store it right away. If the user is currently signed in, it is a good idea to ask them to sign in again.
:::

## Edit a user profile

1. Go to **Account Center → Account**.
2. On the target user's row click **Edit**.
3. Change what you need:

   | Form field | Editable | Notes |
   | --- | --- | --- |
   | Username | **No** | The field is greyed out with a lock icon |
   | Nickname | Yes | — |
   | Email | Yes | Must be a valid email address |
   | Mobile Number | Yes | Must be a valid mobile number |

4. Click **Confirm** to save.

![Tenant members list: username, email, role and join time](/assets/screenshots/boss/tenant-members-01.png)

The role actually lives on the **tenant members** tab, not in the user list. The column in the screenshot is the **Role** field this section is about, and the three roles — **Administrator**, **Developer** and **Member** — all appear in it.

## Change a user's role

Roles are changed inside a tenant, and there are two ways to get there.

**Way one: start from the tenant**
1. Go to **Account Center → Tenant**.
2. Click the target tenant's name.
3. Switch to the **Member** tab and find the user.
4. Click **Edit** on that row, change the **Role** and click **Confirm**.

**Way two: start from the user**
1. Go to **Account Center → Account** and click the username to open **User Details**.
2. Find the tenant in the **Tenants and Roles** card.
3. Click the eye icon at the far right of that row — it opens the member edit page for this person **inside that tenant**; change the role and save.

If the card says "This user has not joined any tenants", the person is not in any tenant yet — use way one to add them as a member.

## What each role can do

The role names you will see and how they differ:

| Role | What it can do |
| --- | --- |
| Administrator | Can see and use the **Workbench** and **Observability** sidebar groups in the AI Platform, including Inference, Traning&Fine tuning, Runebox, Apps, Templates, Storage, Metrics, Logs and Evaluations |
| Developer | Same as Administrator: both sidebar groups are visible and usable |
| Member | **Cannot see** those two groups and can only use the remaining pages (such as Model Hub and Dataset Hub) |

:::info Other role names exist
When you pick a role for a member, the dropdown options are returned by the platform backend. You may see names other than Administrator, Member and Developer — whatever appears in the **Member** page is the authoritative list.
:::

## Stop an account

User accounts have **no** enable/disable switch, and the list has no Status column. To cut off someone's access you have exactly two options:

| Approach | Effect | When to use it |
| --- | --- | --- |
| Delete the user | The account is gone for good and **cannot be restored** | Someone has left, or will definitely not use the platform again |
| Remove them from the tenant | The account still exists but no longer belongs to that tenant and cannot reach its resources | You only want to cut off access in one tenant |

## Delete a user

1. Go to **Account Center → Account**.
2. Click **Delete** on the target user's row, or select several users and click **Batch Delete Users** in the toolbar.
3. Confirm in the dialog and the account is deleted.

:::warning Deleting cannot be undone
Once deleted, the account cannot be recovered. Before deleting, open the user's **User Details** page to see which tenants they belong to and judge whether any running workload depends on them.
:::

## Confirm it worked

| What you want to check | Where to look |
| --- | --- |
| The user exists | The user appears in the user list |
| The password was captured | The green message block on the page after creation (with its copy button) |
| The role was changed correctly | Enter the tenant → **Member** tab and read that person's Role column |
| Which tenants the person is in | The **Tenants and Roles** card on the user details page |

## FAQ

| Symptom | Likely cause | What to do |
| --- | --- | --- |
| I was not asked for a password when creating a user | By design | The password is generated by the system and shown once after creation |
| Cannot find where to change a role | Roles belong to a "member", not to a "user" | Follow the two paths in "Change a user's role" |
| A just-created user cannot be found when adding a member | The search keyword may be wrong | Retry with part of the username or email |
| Want to turn on multi-factor authentication for someone | BOSS only displays it, it does not change it for you | Ask the user to enable it themselves in the AI Platform's personal security settings |

## Related

- [Account Center](/boss/iam)
- [Tenant Management](/boss/iam/tenants)
- [Home](/boss/dashboard)
