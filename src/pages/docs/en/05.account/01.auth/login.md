---
title: 'Login'
updated: '2026-09-14'
description: Walks you from the sign-in page into the platform, step by step, and explains the errors you may see.
---

# Login

Signing in means using the account and password you registered to get into the platform. This page walks you from opening the sign-in page to reaching the platform home, spelling out exactly what to click and what to type, and telling you what appears on screen when sign-in does not work.

:::tip Signing in takes two steps
First you prove who you are on the sign-in page, then you choose a company on the tenant selection page. If your account belongs to only one tenant, the second step happens automatically, so it sometimes feels like a single click.
:::

## Before you start

- Have a registered account ready. If you do not have one yet, see [Registration](/account/auth/register) first.
- Make sure you know the platform address and remember your password.

## How to sign in

Here is what the sign-in page looks like when it opens:

![Sign-in page: platform introduction on the left, sign-in form on the right](/assets/screenshots/account/login-01.png)

The left side introduces the platform. The right side holds, from top to bottom, the account field, the password field,
the agreement checkbox and the **Login** button. Note that **Login** stays grey and unclickable until you tick the agreement
— that is expected, not a broken page.

1. Open the platform sign-in address. On a wide screen the left side introduces the platform and the right side holds the sign-in form.
2. Type your account into the **Username/Email/Mobile Number** field.
3. Type your password into the **Password** field. Characters show as dots by default; click the eye icon on the right of the field to reveal them.
4. If a **Verification Code** field appears in the form, type the characters from the image next to it; if you cannot read them, click the image for a new one.
5. Tick **I have read and agree to the Terms of Service and the Privacy Policy.**
6. Click **Login**. The button briefly shows "Signing in...".

## About the verification code

The platform uses two kinds of verification code. Which one appears is decided by the platform, so just follow the style you see.

| Style | What you see | What to do |
| --- | --- | --- |
| Graphic code | A **Verification Code** field and an image inside the form | Type the characters from the image; click the image for a new one |
| Slider code | A "Security verification" window opens after you click **Login** | Drag the slider so the puzzle piece lines up with the gap; it submits automatically when you let go |

If you get the slider code, in the "Security verification" window:

1. Press the slider at the bottom and drag it to the right.
2. Line the puzzle piece up with the gap and release; the platform verifies automatically and continues signing in.
3. To stop, click the close icon in the top-right corner of the window.

:::tip What if you cannot read the code
Click the verification code image to load a new one. The old code becomes invalid immediately, so type the new one.
:::

## What happens after a successful sign-in

- You first reach the **Select your tenant** page; see [Select / Register Tenant](/account/auth/select-tenant).
- If your account belongs to only one tenant, the page enters it automatically and you do not have to choose.
- After that you can see the left-hand menu and the platform home.

## What to do when sign-in fails

A red banner appears at the top of the page with the reason. Common cases:

| What you see | Likely cause | What to do |
| --- | --- | --- |
| Invalid account or password | The account or password is wrong | Check the letter case and your input method, then type it again |
| Incorrect verification code. Please try again. | The graphic code is wrong or has expired | Click the code image for a new one and type it again |
| Please agree to the Terms of Service and Privacy Policy first | The agreement box is not ticked | Tick the box, then click **Login** |
| Too many failed sign-in attempts. Try again in ... | Too many wrong attempts, so the account is locked for a while | Wait until the stated time has passed, or contact an administrator |

:::info Third-party sign-in
If the platform has third-party sign-in enabled, a dashed separator labelled **Other sign-in methods** and the matching buttons appear below the form. Clicking one sends you to the provider to complete authentication.
:::

## Signing out

Click your avatar in the top-right corner to open the menu, then click **Logout**. The platform clears the sign-in state on this computer and returns you to the sign-in page.

## Related

- [Registration](/account/auth/register)
- [Reset Password](/account/auth/reset-password)
- [Select / Register Tenant](/account/auth/select-tenant)
