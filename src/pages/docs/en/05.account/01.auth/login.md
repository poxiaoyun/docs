---
title: 'Login'
updated: '2026-10-21'
description: How each of the three sign-in methods works, when the security check appears, and what the errors mean.
---

# Login

Signing in is how you get into the platform. A platform may enable all three methods — password, email code, SMS code —
or only one of them. This page explains what to fill in for each, when the **Security verification** window appears,
and how to read the messages when sign-in does not work.

:::tip Two steps, but it often feels like one
First you prove who you are, then you enter one company's space. When your account belongs to a single tenant,
or the platform remembers the last tenant, the second step happens automatically — so one click usually does it.
:::

## Before you start

- Have a registered account. If you do not have one yet, see [Registration](/account/auth/register) first.
- Know the platform address, and remember your password (not needed if you sign in with a code).
- For email codes you need access to the mailbox bound to the account; for SMS codes, the bound mobile number.

## What the sign-in page looks like

On a wide screen the left side holds the brand introduction and four capability cards
(Unified training and inference / AI data governance / MaaS services / Team collaboration); the right side holds the sign-in card.
The card starts with the title **Welcome to {platform title}**, followed by the method switch, the credential form,
the agreement checkbox, and the **Login** button.

![Sign-in page: platform introduction and capability cards on the left; the sign-in card on the right with the method switch, account and password fields, agreement checkbox and Login button](/assets/screenshots/account/login-01.png)

## Choosing a sign-in method

The top of the card may show a switch (**Password** / **Email code** / **SMS code**). It appears only when the platform has enabled
**more than one** method; with a single method there is no switch and you go straight to that form.

| Method | What you fill in | When it helps |
| --- | --- | --- |
| **Password** | **Username/Email/Mobile Number** + **Password** | The everyday option |
| **Email code** | **Email** + **Verification Code** | You forgot the password but can read mail |
| **SMS code** | **Mobile Number** + **Verification Code** | You forgot the password but have your phone |

## Signing in with a password

1. Make sure **Password** is selected at the top.
2. Type your account into **Username/Email/Mobile Number** — any of the three works.
3. Type your password into **Password**. Characters show as dots; click the eye icon on the right to reveal them.
4. Tick **I have read and agree to the Terms of Service and the Privacy Policy.** Without it the button stays disabled.
5. Click **Login**. The button briefly shows **Signing in...**.

## Signing in with a code

1. Switch to **Email code** or **SMS code** at the top.
2. Type the address or number bound to your account into **Email** or **Mobile Number**.
3. Click **Send code** on the right of the **Verification Code** field. After sending, the button turns into a 60-second countdown.
4. Copy the code from your inbox or messages into **Verification Code**.
5. Tick the agreement and click **Login**.

:::info Codes are single use
A code works once and expires. If you change the email or mobile number above, the code you already received becomes invalid — send a new one.
:::

## Signing in with a third-party account

If the platform has third-party sign-in configured, a dashed line labelled **Third-party sign-in** appears below the credential form,
with one button per provider (the button shows the display name the platform gave that provider, sometimes with a logo).

1. Click the provider you want to use.
2. The browser goes to that provider's sign-in or consent page; sign in and approve.
3. You are returned to the platform and the flow continues.

:::warning An unfinished authorization returns you to the sign-in page
If you close the provider page or decline, you come back with a message that authorization was not completed — just click the button again.
:::

## The "Security verification" window

The security check is not a field in the form; it is a dialog titled **Security verification**. It appears **only when the platform
decides this submission needs it** — so seeing it is normal, not an error.

| What the dialog shows | What to do |
| --- | --- |
| Graphic code | Type the characters from the image into **Verification Code**; it submits automatically once filled. Click the image for a new one if unreadable |
| Slider | Drag the slider to the right until the puzzle piece fits the gap, then release; it submits automatically |

:::tip When does it trigger
Typically after several wrong passwords on the same account, or when signing in from an unfamiliar network. Once you pass it, normal sign-ins do not ask again.
:::

## What happens after a successful sign-in

- If your account has MFA enabled, a **Verify sign-in** step comes first: choose a **Verification method** (Authenticator / Email / SMS), fill in the code,
  or click **Use a recovery code** below to enter a recovery code instead. See [Multi-Factor Authentication (MFA)](/account/auth/mfa).
- If you belong to several tenants and the platform has not remembered the last one, you stop at **Select your tenant**; see [Select / Register Tenant](/account/auth/select-tenant).
- With a single tenant you land on that tenant's home directly.
- If the session expires while you are idle, the page shows **Your session has expired. Please sign in again.** — sign in again.

## What to do when sign-in fails

Messages appear below the form or at the top of the page. Common cases:

| What you see | Likely cause | What to do |
| --- | --- | --- |
| Invalid account or password | Wrong account or password (watch case, spaces, input method) | Type it again; for a forgotten password see [Reset Password](/account/auth/reset-password) |
| Incorrect verification code. Please try again. | Wrong or expired code | Click **Send code** again, or click the image for a new one |
| Too many failed sign-in attempts. Try again in ... | Too many failures, so the account is temporarily locked | Wait until the stated time, or contact your platform administrator |
| Please agree to the Terms of Service and Privacy Policy first | The agreement is not ticked | Tick it, then click **Login** |
| No sign-in methods are available. Contact your platform administrator. | No sign-in method has been enabled for you | Ask your platform administrator to enable the account or a method |
| Authorization was not completed | You left the provider page midway | Click the third-party button again |

## Signing out

Click your avatar in the top-right corner and click **Logout** at the bottom of the drawer. The local session is cleared and you return to the sign-in page.

:::info The tenant selection page has its own exit
Before you enter the platform (while on the tenant selection page), the bottom link is **Sign out**, which does the same thing.
:::

## Related

- [Registration](/account/auth/register)
- [Reset Password](/account/auth/reset-password)
- [Multi-Factor Authentication (MFA)](/account/auth/mfa)
- [Select / Register Tenant](/account/auth/select-tenant)
