---
title: 'Registration'
updated: '2026-09-14'
description: How to register a platform account with an email verification code, and what each field expects.
---

# Registration

Registration creates a platform account that belongs to you. You fill in a username, a password, an email address, and a mobile number, and confirm the email address with a verification code sent to your inbox. Once registration finishes, sign in with the new account.

:::tip Registration and sign-in are separate
Registration only creates the account; it does not sign you in automatically. After a successful registration the page returns to the sign-in page, and you sign in once with your new account.
:::

## Before you start

- An email address that can receive mail normally.
- A mobile number that can receive text messages (the mobile number is required).
- Note that the registration entry is not open on every platform. If the sign-in page has no "Don't have an account? Register now" link, this platform does not allow self-service registration, so ask an administrator to create an account for you.

The registration page puts everything you need to fill in on a single card:

![Registration page: one card with username, password, email, mobile number and verification code fields, then the terms checkbox and the Create Account button](/assets/screenshots/account/register-01.png)

The eye icon on the right of the password field toggles between plain text and dots so you can check for typos.

## How to register

1. On the sign-in page, click **Register now** at the bottom (the full text is "Don't have an account? Register now").
2. Fill in **Username**; this is the account name you will sign in with.
3. Fill in **Password**; the rules are below.
4. Fill in **Email**, which is where the verification code is sent.
5. Fill in **Mobile Number**, including the country code (for mainland China, for example, `+86`).
6. Click the send button next to the verification code field, open the email, and type the code into the **Verification Code** field.
7. Tick **I have read and agree to the Terms of Service and the Privacy Policy.**
8. Click **Create Account**. The button briefly shows "Registering...".

## How to fill in the password

- At least 8 characters.
- Only letters, digits, and symbols you can type directly on a keyboard; no Chinese characters, no spaces, and no accented letters.
- The page does not require "must contain upper and lower case letters and digits", but it is a good idea to make the password stronger.

:::tip You can reveal the password
The eye icon on the right of the password field toggles between plain text and dots, so you can check what you typed.
:::

## About the mobile number

The mobile number is required and must be a valid number. Include the country code when you type it. If the format is wrong, the page shows "Please enter a valid mobile number" below the field when you submit.

## The result of registration

- Success: the page returns to the sign-in page automatically. Sign in with the account you just registered.
- Failure: a red banner appears at the top of the page. Fix the problem it describes and submit again.

## After you register

A newly registered account belongs to no tenant by default. On your first sign-in you need to create or join a tenant before you can enter the platform; see [Select / Register Tenant](/account/auth/select-tenant).

## Related

- [Login](/account/auth/login)
- [Select / Register Tenant](/account/auth/select-tenant)
- [Roles and Permissions](/account/auth/roles)
