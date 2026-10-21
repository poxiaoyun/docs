---
title: 'Reset Password'
updated: '2026-10-21'
description: What this page actually says when you forget your password, and the three ways to get back in.
---

# Reset Password

When you forget your password you reach this page from **Forgot password?** on the sign-in page. One thing first:
**this page does not reset passwords by itself.** It shows a single notice and a link back. This page explains exactly what is
on screen and what your three real options are.

:::warning There is no form here
It is not a "type your email, receive a reset link" flow. There is no email field, no send button, and no email is ever sent.
For what to do instead, read the next section.
:::

## Getting here from the sign-in page

1. Open the sign-in page.
2. Click **Forgot password?** below the password field.
3. The page shows only three things:

| Element | Content |
| --- | --- |
| Title | **Forgot password?** |
| Notice | **Self-service password recovery is not available. Contact your platform administrator to reset your password, or return to sign in using an enabled code or third-party method.** |
| Link | **Back to login** |

![Reset password page: title, one-line notice that self-service recovery is unavailable, and the back-to-login link](/assets/screenshots/account/reset-password-01.png)

:::info Why the page still exists
The link is kept so that, if you click it by mistake, you are told plainly that self-service reset is not offered
instead of guessing among forms.
:::

## What to do instead

Pick whichever fits what you have access to:

1. **Ask your platform administrator to reset it.** Tell them your username and that you need a new password. This always works.
2. **Sign in with a code.** If the platform enabled **Email code** or **SMS code** sign-in, go back to the sign-in page, switch to that method,
   and get in without a password. Then set a new one under **Personal settings → Security**.
3. **Sign in with a third-party account.** If you linked one earlier, go back and click that provider's button.

:::tip Recommended order
Try options 2 and 3 first — nobody has to wait. Contact the administrator only when neither is available.
:::

## Change it yourself once you are in

Once you can sign in, changing the password needs no administrator: click your avatar → **Personal settings** → **Security**,
then click **Change password** on the **Password** row (accounts with no password yet show **Set password**).
You fill in the old password, the new one, and the confirmation. See [Security](/account/iam/security) for the details.

## Related

- [Login](/account/auth/login)
- [Security](/account/iam/security)
- [Multi-Factor Authentication (MFA)](/account/auth/mfa)
