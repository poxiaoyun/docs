---
title: 'User Management'
updated: '2026-10-21'
description: Create a platform account, hand over the initial password, reset passwords, and where to change a role.
---

# User Management

A **user** is one person's account on the platform. Only with an account can a person sign in to the AI Platform and be added to a tenant. From here you create accounts, edit profiles, reset passwords and delete accounts.

After reading this page you can create a user and deliver the initial password, check a profile on the user details page, reset a password, delete an account, and know where roles are assigned.

:::tip One thing to remember
User management only covers **the account itself** (username, email, mobile number, password). Which tenant someone belongs to and what role they hold is set inside the **tenant** — see "Change a user's role" below.
:::

## Before you start

- You need a **system administrator** account that can sign in to BOSS.
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

Go to **Account Center → User Management**. The list has these columns:

| Column | Explanation |
| --- | --- |
| Username | Avatar, username (clickable to open the user details) and the grey text below it, which is the nickname |
| Email | The user's contact email |
| Mobile Number | The user's contact phone |
| MFA Enabled | Shows **Yes** or **No**, i.e. whether the person has turned on multi-factor authentication |
| Created At | When the account was created |

**Add User** in the top-right corner creates an account. There is a search box for filtering by username, plus sorting on username and creation time, a refresh button and paging.

Row actions live under "More": **Reset Password**, **Edit** and **Delete**. Selecting several rows enables **Batch Delete Users**.

![User management list: username, email, phone number, MFA enabled and creation time](/assets/screenshots/boss/user-list-01.png)

The user list has five columns. The **Username** cell holds two lines: the short name on top is what the user signs in with, the line below is the display nickname. **MFA enabled** reading "No" means the user has not bound an authenticator yet. The email and phone columns are blurred.

## Create a user

1. Go to **Account Center → User Management**.
2. Click **Add User** in the top-right corner.
3. Fill in the form described below.

   | Form field | How to fill it | Notes |
   | --- | --- | --- |
   | Username | For example `zhangsan` | Required. The unique identifier used to sign in; **it cannot be changed after creation** |
   | Nickname | For example `Zhang San` | Optional. A display name, any language |
   | Email | For example `zhangsan@example.com` | **May be left empty**; if filled it must be a valid email address |
   | Mobile Number | For example `13800000000` | **May be left empty**; if filled it must be 6–16 digits |

4. Click **OK**.

![Add User form: username, nickname, email and mobile number](/assets/screenshots/boss/user-create-01.png)

The form has only four fields. **Username** is required; **Nickname**, **Email** and **Mobile Number** are optional — leaving them empty does not block creation, but anything you do fill in must be valid.

### Hand over the initial password

After the account is created a green notice appears above the form with:

- **Your username is** xxx
- **Your random password is** xxx (with a copy button)
- Keep it safe!

:::warning The password is shown once
This initial password **appears only here** and is gone once you leave the page. Copy it immediately, send it through a safe channel (in person, or an encrypted message), and remind the user to change it after the first sign-in.
:::

Bulk creation and import are **not** supported — one user at a time. Bulk deletion is supported.

## Four tabs on the user details page

Clicking a username opens the user details page with four tabs:

| Tab | What it contains |
| --- | --- |
| Basic Info | Avatar, subject ID, username, nickname / email / mobile number (each editable with **Change**), creation time |
| Security | Multi-factor authentication status (read-only), password (shown as hidden, action is **Reset Password**), **Delete Account** |
| Third-Party Login | The third-party identities this account has bound; empty when none |
| Tenants | Two columns: **Tenant** and **Role**. The tenant name links to that tenant's details |

The **subject ID** is the platform's internal identifier for the account. You rarely need it, but it helps when support asks for it.

### Edit details from the details page

1. On the **Basic Info** tab find the row to change (nickname / email / mobile number).
2. Click **Change** on that row.
3. Enter the new value and confirm.

### Reset the password or delete the account from details

Open the **Security** tab and click **Reset Password**, or click **Delete Account** on the same tab. See "Reset a password" and "Delete a user" below for the risks.

## Reset a password

When a user forgets the password:

1. Go to **Account Center → User Management**.
2. Open "More" on the target row and click **Reset Password**.
3. Confirm in the dialog; the system generates a new password.
4. The new password appears in the dialog — copy it and send it to the user.

:::warning Resetting invalidates the old password immediately
The old password stops working at once. The new one is also **shown only once**, so copy it right away. If the user is currently signed in, ask them to sign in again.
:::

:::info Self-service password recovery is not available
The login page's "Forgot password" only tells the user to contact the platform administrator. So a forgotten password has to be reset here. The **Forgot password** delivery purpose in email/SMS services is a reserved setting and does not enable self-service recovery.
:::

## Edit a user profile

1. Go to **Account Center → User Management**.
2. Click **Edit** on the target row.
3. Change what you need:

   | Form field | Editable | Notes |
   | --- | --- | --- |
   | Username | **No** | The input is greyed out with a lock icon |
   | Nickname | Yes | — |
   | Email | Yes | Can be cleared; if filled it must be a valid address |
   | Mobile Number | Yes | Can be cleared; if filled it must be 6–16 digits |

4. Click **OK**.

## Change a user's role

Roles belong to tenant members, so changing one always starts from the tenant:

1. Go to **Account Center → Tenant Management**.
2. Click the tenant name.
3. Switch to the **Members** tab and find the user.
4. Click **Edit** on that row, change **Role**, then click **OK**.

If the **Tenants** tab on the user details page is empty, the person has not joined any tenant yet. Add them as a member from the tenant.

## What each role can do

| Role | What it can do |
| --- | --- |
| Administrator | Sees the **Workbench** and **Observability** groups in the AI Platform, including inference services, training and fine-tuning, development services, application instances, my presets, file storage, metrics, logs and model evaluation |
| Developer | Same as Administrator for those two groups |
| Member | **Cannot** see those two groups; can use everything else (model marketplace, data assets) |

:::info Other role names may appear
The role dropdown is populated by the backend. Whatever you see on the **Members** page is authoritative.
:::

## Disabling an account

User accounts have **no** enable/disable switch and the list has no status column. To cut off access you have two options:

| Approach | Effect | When to use |
| --- | --- | --- |
| Delete the user | The account is gone permanently | Someone has left; the account will never be used again |
| Remove from the tenant | The account remains but no longer belongs to that tenant | You only want to cut access to that tenant's resources |

## Delete a user

1. Go to **Account Center → User Management**.
2. Click **Delete** on the target row, or select several rows and click **Batch Delete Users**.
3. **Type the username** in the confirmation dialog to confirm.

:::warning Deletion cannot be undone
Check the user's **Tenants** tab first so you know which tenants lose a member and whether anything is still running.
:::

## Verify the result

| What you want to confirm | Where to look |
| --- | --- |
| The user exists | The user list shows the account |
| The password was delivered | The green notice with a copy button right after creation |
| The role is right | Tenant → **Members** tab, the Role column |
| Which tenants the user belongs to | User details → **Tenants** tab |

## FAQ

| Symptom | Likely cause | What to do |
| --- | --- | --- |
| No password field when creating a user | By design | The system generates one and shows it once |
| Can email and mobile be empty? | Yes, both are optional | Leave them empty; format is only checked when filled |
| Cannot find where to set a role | Roles belong to members, not users | Tenant → **Members** → **Edit** |
| The new user cannot be found when adding a member | Search keyword mismatch | Search by username |
| Want to enable MFA for someone | BOSS only displays MFA state | Ask the user to enable it, or set the authenticator requirement to **Required** in Authentication policy |

## Related

- [Account Center](/boss/iam)
- [Tenant Management](/boss/iam/tenants)
- [Authentication Policy](/boss/iam/authentication-policy)
- [Home](/boss/dashboard)
