---
title: 'Authentication'
updated: '2026-10-21'
description: What each sign-in page is for, in which order you use them, and which steps can be skipped.
tags:
- account
- auth
---

# Authentication

This group of pages does one thing: **confirm who you are and take you into the right company space**.
Whether you are registering for the first time or signing in every day, this is where you sign in, recover a password,
bind a second factor, and choose a tenant. After this page you will know which steps you can skip and when you have to stop and choose.

:::tip Signing in is really two small steps
First you prove who you are on the sign-in page, then you enter one company's space. If your account belongs to only
one tenant, the second step happens automatically and it looks like a single step. You only get asked when you belong to several.
:::

## Which pages you will use

| Page | When you use it |
| --- | --- |
| [Login](/account/auth/login) | Getting into the platform every day |
| [Registration](/account/auth/register) | Your first time, when you have no account yet |
| [Reset Password](/account/auth/reset-password) | You forgot your password |
| [Multi-Factor Authentication (MFA)](/account/auth/mfa) | You want to add another layer of protection |
| [Select / Register Tenant](/account/auth/select-tenant) | Choosing a company space, or creating a new one |
| [Roles and Permissions](/account/auth/roles) | Finding out what you can do, or checking someone else's role |

When you belong to several tenants, this is what the step after signing in looks like:

![Tenant selection page: a card greeting "Hi Admin, select your tenant", then the tenant dropdown, the Enter Platform button, the create-tenant entry and a sign-out link](/assets/screenshots/account/select-tenant-01.png)

Besides the **Tenant** dropdown and **Enter Platform**, there is a fallback: if you have no tenant at all,
click **Create Tenant** to open one for yourself.

## A few rules worth knowing

- **The platform decides which sign-in methods exist.** It may enable **Password**, **Email code**, and **SMS code** — one, two or all three.
  The switch at the top of the card only appears when more than one is available. See [Login](/account/auth/login) for each method.
- **You must tick the agreement first.** Until **I have read and agree to the Terms of Service and the Privacy Policy.** is ticked,
  the **Login** button is grey and does nothing.
- **There is no "Remember Me".** You type your credentials every time, and an expired session shows **Your session has expired. Please sign in again.**
- **The security check is a dialog, not a form field.** Only when the platform decides this sign-in needs verification does a
  **Security verification** window open after you submit; finish the puzzle or type the characters there.
- **With MFA enabled, the password alone is not enough.** Sign-in continues on a **Verify sign-in** step where you pick a verification method or use a recovery code.
- **You may or may not land on tenant selection.** You are asked only when you belong to several tenants and the platform has not remembered the last one.
- **Forgotten passwords cannot be reset by yourself.** The page only tells you to contact your platform administrator; see [Reset Password](/account/auth/reset-password).

## Related

- [Account & Access overview](/account)
- [Glossary](/guide/glossary)
