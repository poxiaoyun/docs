---
title: 'Multi-Factor Authentication (MFA)'
updated: '2026-10-21'
description: Where to bind an authenticator, how to save the recovery codes, and how to pass the second step at sign-in.
---

# Multi-Factor Authentication (MFA)

Multi-factor authentication adds another lock to your account: besides your password you enter a one-time code.
Even if someone learns your password, they cannot get in without the code in your hand. This page walks you through
binding an authenticator from the **Security** tab, saving the recovery codes, and handling the extra step at sign-in.

:::tip A comparison
Your password is like the key to your front door, and multi-factor authentication is like a fingerprint lock beside it.
Both must match before the door opens; the key alone is not enough.
:::

## Before you start

- Install an authenticator app on your phone, for example Google Authenticator.
- Make sure you can sign in normally, because binding happens after you are signed in.
- Have somewhere to store recovery codes: a password manager, or pen and paper.

## Where to set it up

MFA has no tab of its own; it is a row inside the security page:

1. Click your avatar in the top-right corner → **Personal settings**.
2. Open the **Security** tab and find the **Password and authentication** group.
3. Find the **Multi-factor Authentication** row. On the right is a status chip: **Not enabled** or **Enabled**.
4. Click the action at the end of the row: **Set up authenticator** when it is off, **Change authenticator** when it is on.

The description on that row reads **Set up an authenticator to require an app-generated verification code when signing in.**

## Set up the authenticator

The dialog that opens contains, from top to bottom:

1. The hint **Scan the QR code with your authenticator app (e.g., Google Authenticator)**.
2. A QR code.
3. A read-only **Setup key** field with a copy button — use it when scanning fails. Its helper text is
   **Enter this key in your authenticator app if you cannot scan the code.**
4. A **Verification Code** field.

Then:

1. Open the authenticator app and choose "Scan QR code"; point the camera at the screen.
2. If scanning fails, choose "Enter a setup key" in the app and paste the **Setup key**; any account name you recognise will do.
3. The app starts showing a 6-digit number that changes every 30 seconds.
4. Type that number into **Verification Code**.
5. Click **Bind**.

![Set up authenticator dialog: scan hint, QR code, copyable setup key, verification code field and Bind button](/assets/screenshots/account/mfa-01.png)

## Save the recovery codes (do not skip this)

After a successful bind the same window switches to the recovery codes:

- The success notice **You have successfully enabled multi-factor authentication!**
- The explanation **Please save this recovery code. If your device cannot provide verification codes, you can log in using this recovery code.**
- **Recovery Code 1**, **Recovery Code 2**, and so on — **several codes are issued at once**, each a read-only field with its own copy button
- The button **I saved my recovery codes; continue** at the bottom

:::warning You must click "I saved my recovery codes; continue"
The window does not close and the enrollment is not finished until you do. Copy every code into your password manager,
or write them down, then click it.
:::

:::warning The codes are visible only at this moment
Once the window closes they are gone for good. Recovery codes are the only way to get in by yourself if you lose your phone;
if they are lost too, you have to ask your platform administrator.
:::

## Passing the second step at sign-in

Once enabled, every sign-in adds a step after your credentials, titled **Verify sign-in**:

| Element | Description |
| --- | --- |
| **Verification method** dropdown | **Authenticator**, **Email**, or **SMS** — which ones you can pick depends on what the platform enabled for you |
| **Verification Code** | The current code. For authenticator, the 6 digits from the app; for email or SMS, the code you received |
| **Login** | Submits this step |
| Text button **Use a recovery code** | Switches to recovery-code mode and relabels the field **Recovery code**; click **Use a verification code** in the same place to switch back |

:::tip You can switch methods on the fly
If your phone is not at hand but you can read mail, set **Verification method** to **Email** — you do not have to change any settings first.
:::

## Asked to set it up during sign-in

If the platform policy requires MFA and you have not enrolled yet, sign-in shows **Set up an authenticator to finish signing in**
with the enrollment form right there. Follow the steps above, save the recovery codes, and the sign-in completes.

:::info Only the authenticator can be enrolled on the spot
If the method you are asked to enroll is not the authenticator, the page says **This method requires enrollment. Contact your platform administrator.**
:::

## New phone / new authenticator

1. Open **Personal settings → Security**; the **Multi-factor Authentication** row now shows **Enabled**.
2. Click **Change authenticator** to open the scan dialog again.
3. Scan with the new phone, enter the code, bind, and save the new recovery codes.

:::warning There is no "disable" button
The page can only set up or change the authenticator; MFA cannot be switched off here, and there is no **Reset** button.
Old recovery codes stop working after a change — always keep the latest set.
:::

## Lost the phone and the recovery codes

If neither works, ask your platform administrator to reset the authenticator binding, then sign in and bind again.

## Related

- [Security](/account/iam/security)
- [Login](/account/auth/login)
- [Reset Password](/account/auth/reset-password)
