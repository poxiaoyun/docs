---
title: 'Multi-Factor Authentication (MFA)'
updated: '2026-09-14'
description: How to scan the QR code with your phone, type the code, and save the recovery code.
---

# Multi-Factor Authentication (MFA)

Multi-factor authentication adds another lock to your account: besides your password, you also enter a 6-digit number from your phone that changes every 30 seconds. Even if someone learns your password, they still cannot sign in without the code on your phone.

:::tip A comparison
Your password is like the key to your front door, and multi-factor authentication is like a fingerprint lock beside it. Both must match before the door opens; the key alone is not enough.
:::

## Before you start

- Install an authenticator app on your phone, for example Google Authenticator.
- Make sure you can sign in to the platform normally.

## Binding multi-factor authentication

1. Click your avatar in the top-right corner → **Settings** to open the Personal Center.
2. Click the **Multi-factor Authentication** tab at the top.
3. The page shows a QR code right away, with the hint "Scan the QR code with your authenticator app (e.g., Google Authenticator)". You do not need to click any button first.
4. Open the authenticator app on your phone, choose "Scan QR code", and scan the code on screen.
5. The app shows a 6-digit number that changes every 30 seconds.
6. Back on the platform page, type the current 6-digit number into the **Verification Code** field.
7. Click **Bind**.

:::info Already bound?
If the account is already bound, opening the page shows the "Enabled" state directly and no QR code appears.
:::

At this step the page shows the QR code directly; you do not click anything first:

![Multi-factor authentication page: a two-step progress bar reading "1 Enter verification code / 2 Enabled", the hint to scan the QR code with an authenticator app, the QR code itself, then the verification code field and the Bind button](/assets/screenshots/account/mfa-01.png)

The two-step progress bar at the top also shows the flow: scan the code in your app first, and only after the code is accepted does the state move to "Enabled".

## What you see after binding succeeds

After a successful bind the multi-factor authentication card switches to **Enabled**, and the page shows:

- "You have successfully enabled multi-factor authentication!"
- "Please save this recovery code. If your device cannot provide verification codes, you can log in using this recovery code."
- One **Recovery Code** line

:::warning Write the recovery code down now
The recovery code is the only backup way in if you lose your phone. The page shows only the first recovery code and has no copy or download button, so write it down with pen and paper or save it in your password manager before you close the page.
:::

## Binding again

If you switch to a new phone, you can bind again:

1. On the "Multi-factor Authentication" page, confirm that the state is **Enabled**.
2. Click **Reset**.
3. The page returns to the first step and shows the QR code again; scan it following the binding steps above.

:::warning There is no way to disable it here
This page has no "disable multi-factor authentication" button and you cannot turn the feature off here. The reset button only lets you scan and bind again; it does not remove the protection.
:::

## Related

- [Security Settings](/account/iam/security)
- [Login](/account/auth/login)
