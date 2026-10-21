---
title: 'Registration'
updated: '2026-10-21'
description: Which fields the registration page shows, how to fill them, what the password rules are, and what happens afterwards.
---

# Registration

Registration creates a platform account that belongs to you. What the page asks for depends on which sign-up channels
the platform has opened: it may want an email address, a mobile number, or both, and it may also require a password.
This page follows the order of the page itself, so you can finish a registration on your own and know what to do next.

:::tip Registration and sign-in are separate
Registration only creates the account. When it succeeds the page shows **Registration successful** in place,
and you click **Go to login** next to it to sign in once.
:::

## Before you start

- Check that self-service registration is open: the sign-in page must show **Don't have an account? Sign up** at the bottom.
- Have the email address or mobile number ready, and be able to receive a code on it.
- If a password is required, think of one that meets the rules listed under the field.

:::warning No "Sign up" link means registration is closed
In that case ask your platform administrator to create the account for you; no entry on the page will open one.
:::

## Which fields the page shows

The page is a single card. **Not every field appears** — it depends on the channels the platform opened.

| Field | When it appears | How to fill it |
| --- | --- | --- |
| **Username** | Always | The account name you will sign in with; required |
| **Password** | When password registration is enabled | Follow the rules shown under the field; see below |
| **Confirm Password** | Together with **Password** | Type the password again; it must match exactly |
| **Email** or **Mobile Number** | Depending on the channels opened | Pick one with the switch at the top; the code goes to whichever you fill in |
| **Verification Code** | When that channel requires verification | Click **Send code** on the right and type the code you receive |
| **Agreement checkbox** | Always | Must be ticked, otherwise **Create Account** stays disabled |

:::info A single contact channel means no switch
If the platform opened only email or only mobile, the switch at the top of the card does not appear and you see just that one field.
:::

![Sign-up page: the registration-method switch (email / mobile number) on top, then username, the selected contact field, verification code and the agreement checkbox, with Create account at the bottom](/assets/screenshots/account/sign-up-01.png)

## How to register

1. On the sign-in page, click **Sign up** at the bottom.
2. If there is a sign-up method switch, choose **Email** or **Mobile Number**.
3. Fill in **Username**.
4. If password fields appear, fill in **Password** and **Confirm Password**.
5. Fill in **Email** or **Mobile Number**. A mobile number needs the country code, for example `+86` for mainland China.
6. Click **Send code** on the right of the **Verification Code** field, then copy the code from your inbox or messages.
7. Tick **I have read and agree to the Terms of Service and the Privacy Policy.**
8. Click **Create Account**. The button briefly shows **Registering...**.

## Password rules

Password rules are configured by the platform — **go by the hints under the password field**. These are the common ones,
and the page shows whichever are actually enabled:

- At least N characters (N is set by the platform).
- Include uppercase and lowercase letters and digits.
- Include a special character.

:::tip The two passwords must match
If they differ, **Confirm Password** shows **Passwords do not match** and you cannot submit until they are identical.
:::

## About the contact channel

- Fill in the channel the platform opened; it is both your contact and where the code is sent.
- A mobile number must be valid. A wrong format is reported under the field on submit; include the country code.
- After you change the email or mobile number, any code already sent becomes invalid — send a new one.

## The "Security verification" dialog

After you click **Create Account**, if the platform decides this submission needs verification a **Security verification**
window opens. Type the graphic code or drag the slider as prompted; once it passes, registration completes —
you do not have to re-enter the form.

## The result of registration

| Result | What you see | Next step |
| --- | --- | --- |
| Success | The card turns into a green **Registration successful** notice with a **Go to login** link | Click **Go to login** and sign in with the new account |
| Failure | A red notice above the form explains why | Fix it and submit again; your input is kept |
| No channel available | **No registration methods are available. Contact your platform administrator.** | Ask your administrator to enable one |

:::warning Success does not sign you in
The page stays where it is: it does not redirect and does not log you in. Click **Go to login** and sign in once.
:::

## After you register

A new account belongs to no tenant by default. On your first sign-in you need to create or join a tenant before you can use
the platform; see [Select / Register Tenant](/account/auth/select-tenant).

## Related

- [Login](/account/auth/login)
- [Select / Register Tenant](/account/auth/select-tenant)
- [Roles and Permissions](/account/auth/roles)
