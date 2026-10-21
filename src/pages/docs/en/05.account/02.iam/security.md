---
title: 'Security'
updated: '2026-10-21'
description: The two groups on the Security tab — Password and authentication, and Third-party sign-in — and what each one needs.
---

# Security

**Security** is the second tab of personal settings, and it holds exactly two groups: **Password and authentication**
and **Third-party sign-in**. Passwords, multi-factor authentication, and linking or unlinking third-party accounts all live
here, and every change applies to your next sign-in.

:::tip Doors and spare keys
The password is the key to the door; multi-factor authentication is a second lock that only accepts your phone;
a third-party account is a spare key that still opens the door if the first one is lost.
:::

## Before you start

- You can use it as soon as you sign in; everything here is your own account.
- Remember the new password before you change it; install an authenticator app before you enable MFA.
- To link a third-party account, you must be able to sign in to that account.

## What is on this page

| Group | What it contains |
| --- | --- |
| **Password and authentication** | A **Password** row and a **Multi-factor Authentication** row, each with a status and an action at the end |
| **Third-party sign-in** | One row per provider the platform has configured, with **Linked / Not linked** and a **Bind / Unlink** action |

:::info Email and mobile number are not here
Rebinding them happens in the row dialogs on the **General** tab; see [General](/account/iam/profile).
:::

![Account security page: the Password and authentication group (password, multi-factor authentication) and the Third-party sign-in group](/assets/screenshots/account/security-01.png)

## Changing the password

1. Click your avatar in the top-right corner → **Personal settings** → **Security**.
2. On the **Password** row, click the action at the end. With a password set it reads **Change password**; on an account
   that never had one it reads **Set password**. The description on the row states the current situation:
   **Verify your current password to set a new one.** or **No password set yet — set one to sign in with a password.**
3. Fill in the dialog:

   | Field | When it appears | How to fill it |
   | --- | --- | --- |
   | **Old Password** | Only when a password is already set | The password you use now; a wrong value blocks submission |
   | **New Password** | Always | Follow the rules listed under the field; the platform configures them |
   | **Confirm Password** | Always | Type the new password again; it must match exactly |

4. Click **Save**.

:::warning Two common validation messages
**New and old passwords cannot be the same** — pick one you have not used.
**Passwords do not match** — the two entries differ, type them both again.
:::

:::info Password rules are not fixed
The hints under **New Password** come from the platform configuration and may include "at least N characters",
"include uppercase, lowercase and digits", and "include a special character" — go by what you see.
Changing the password does not sign you out.
:::

## Multi-factor authentication

The **Multi-factor Authentication** row carries a status chip, **Not enabled** or **Enabled**. Its description is
**Set up an authenticator to require an app-generated verification code when signing in.**

- When it is off, the action reads **Set up authenticator**.
- When it is on, the action reads **Change authenticator**.

Both open the same scan dialog. The steps, how to save the recovery codes, and how to pass the second step at sign-in
are all in [Multi-Factor Authentication (MFA)](/account/auth/mfa).

:::warning There is no switch to turn it off
The page can only set up or change the authenticator; MFA cannot be disabled here.
:::

## Third-party sign-in

This group lists the third-party sign-in methods the platform has configured, one row per provider, with **Linked** or **Not linked** on the right.

| Status | Action | What happens |
| --- | --- | --- |
| **Not linked** | **Bind** | Opens that provider's consent page; after approving you return here and the row shows **Linked** |
| **Linked** | **Unlink** | Opens a confirmation titled **Unlink {provider}**; confirming removes the link |

:::warning Unlinking changes how you can sign in
The confirmation states **You will no longer be able to sign in with this account.** If that is the only way you sign in,
make sure you know your password or that code sign-in is enabled before you confirm.
:::

When no third-party method is configured, the group shows **No third-party sign-in methods are available**.
Full details are in [Third-party sign-in](/account/iam/linked-accounts).

## Common questions

| Symptom | Likely cause | What to do |
| --- | --- | --- |
| "New and old passwords cannot be the same" on submit | The new password equals the old one | Choose one you have not used |
| "Passwords do not match" | The two entries differ | Type the same new password twice |
| The new password keeps being rejected | It does not satisfy the rules listed under the field | Satisfy each hint (length, upper/lower case and digits, special character) |
| No code when rebinding email or phone | The code goes to the **new** address | Check that the new address is correct; see [General](/account/iam/profile) |

## Related

- [Multi-Factor Authentication (MFA)](/account/auth/mfa)
- [Third-party sign-in](/account/iam/linked-accounts)
- [General](/account/iam/profile)
