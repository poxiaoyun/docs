---
title: 'Security Settings'
updated: '2026-09-14'
description: How to change your password, email, mobile number, and multi-factor authentication, item by item.
---

# Security Settings

"Security Settings" is not a single tab. It is the four account-security items in the Personal Center: **Password**, **Email**, **Mobile Number**, and **Multi-factor Authentication**. This page covers where each one lives, what verification it needs, and what happens afterwards.

:::tip Doors and a spare key
Your password is the key you open the door with; your email and mobile number are the contact details on file, used to recover the account if you forget the password; multi-factor authentication is a second lock on the door that only recognises your phone.
:::

## Before you start

- You can use these as soon as you sign in; everything you change belongs to your own account.
- Before changing your email or mobile number, make sure you can sign in to the **new email** or reach the **new mobile number**, because the verification code is sent to the new address.
- Before turning on multi-factor authentication, install an authenticator app on your phone.

## Where each of the four settings lives

| Setting | Tab | What it is for |
| --- | --- | --- |
| Password | Password | The password you type when signing in |
| Email | Email | Used to sign in, recover the account, and receive verification codes |
| Mobile Number | Mobile Number | Used to sign in and to receive SMS verification codes |
| Multi-factor Authentication | Multi-factor Authentication | A dynamic code in addition to your password when signing in |

## Changing your password

1. Click your avatar in the top-right corner → **Settings**.
2. Click the **Password** tab.
3. Fill in the three fields:

   | Setting | How to fill it in | What changes |
   | --- | --- | --- |
   | Old Password | The password you use now | A wrong value blocks submission |
   | New Password | At least 8 characters, printable ASCII only | It cannot be the same as the old password |
   | Confirm Password | Type the new password again | It must match the new password exactly |

4. Click **Save**.

Rules for the new password: at least 8 characters, only letters, digits, and common symbols, with no Chinese characters, spaces, or accented letters.

:::warning Changing your password does not sign you out
After changing it you stay signed in and an **Updated successfully** message appears at the top of the page. Remember the new password right away; if you forget it, the only way back is the password recovery flow.
:::

The Password page has just three fields:

![Password page: one card with Old Password, New Password and Confirm Password fields, then a Save button](/assets/screenshots/account/security-01.png)

## Changing your email

1. Click the **Email** tab.
2. Type the new email address into the **Email** field.
3. Click **Send code**, fetch the code from the new inbox, and type it into the **Verification Code** field.

   | Setting | How to fill it in | What changes |
   | --- | --- | --- |
   | Email | The new address to rebind, in a valid format | The verification code is sent to this new address |
   | Verification Code | The code received in the new inbox | The rebind succeeds only after it is verified |

4. Click **Save**; the page shows **Updated successfully**.

After you send an email code the button turns into a countdown such as `60s`, and you can click it again only when the countdown ends.

The Email page requires a code first before the change is applied:

![Email page: one card with the email field, the verification code field and a Send Code button, then a Save button](/assets/screenshots/account/security-02.png)

## Changing your mobile number

1. Click the **Mobile Number** tab.
2. Type the new number into the **Mobile Number** field (6–16 digits).
3. Click **Send code**, receive the SMS code, and type it in.

   | Setting | How to fill it in | What changes |
   | --- | --- | --- |
   | Mobile Number | The new number to rebind, 6–16 digits | The SMS code is sent to this new number |
   | Verification Code | The SMS code you received | The rebind succeeds only after it is verified |

4. Click **Save**; the page shows **Updated successfully**.

:::info You may need to pass a graphic code too
If the platform considers the operation risky, a graphic verification code window opens when you click **Send code**. Type the characters from the image and click **Next** to continue sending.
:::

The Mobile Number page has the same layout as the email page; only the code is delivered by SMS:

![Mobile number page: one card with the mobile number field, the verification code field and a Send Code button, then a Save button](/assets/screenshots/account/security-03.png)

## Turning on multi-factor authentication

Once multi-factor authentication (also called a second factor) is on, you enter a 6-digit number from your phone app, changing in real time, in addition to your password when signing in.

1. Click the **Multi-factor Authentication** tab. The page generates a QR code automatically.
2. Open the authenticator app on your phone (the page uses Google Authenticator as its example; similar apps work too).
3. Scan the QR code on the page with the app.

   | Setting | How to fill it in | What changes |
   | --- | --- | --- |
   | QR code | Scan it with the authenticator app | Binds this phone to your account |
   | Verification Code | The 6-digit number the app shows now | Binding succeeds only when it is correct |
   | Recovery Code | Shown only once after a successful bind | Used to sign in if you lose your phone; copy it down on the spot |

4. Type the 6-digit number currently shown in the app into the **Verification Code** field.
5. Click **Bind**.
6. On success the page shows **You have successfully enabled multi-factor authentication!** along with one **Recovery Code**.

:::warning Save the recovery code on the spot
The recovery code is shown only once, when binding succeeds, and the page gives you just one. If you lose your phone or switch to a new one without having written the code down, you will be locked out of signing in and will have to ask a platform administrator for help.
:::

After a successful bind, opening this tab again shows the enabled state directly, plus a **Reset** button. The page has no "turn off multi-factor authentication" switch; **Reset** only takes you back to the first step to bind once more.

When MFA is not yet bound, the page shows the QR code and a code field right away:

![Multi-factor authentication page: a two-step progress bar, the QR code with a scan hint, then the verification code field and the Bind button](/assets/screenshots/account/mfa-01.png)

## Common questions

| What you see | Likely cause | What to do |
| --- | --- | --- |
| No verification code arrives | The new email or mobile number is wrong, or mail and SMS are delayed | Check the new address, wait for the countdown to end, and try again |
| **New and old passwords cannot be the same** | The new password equals the old one | Use a new password you have not used before |
| **Passwords do not match** | The two new passwords you typed differ | Type the same new password twice |
| It says the password is not compliant | Fewer than 8 characters, or it contains Chinese characters or spaces | Use a mix of letters, digits, and symbols, at least 8 characters long |

## Related

- [Multi-Factor Authentication (MFA)](/account/auth/mfa)
- [Roles and Permissions](/account/auth/roles)
- [User Profile](/account/iam/profile)
