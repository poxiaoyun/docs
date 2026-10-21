---
title: 'Third-party sign-in'
updated: '2026-10-21'
description: Link an existing third-party account to your platform account so you can sign in with it, and what unlinking costs you.
---

# Third-party sign-in

Third-party sign-in links an account you already have elsewhere (WeCom, an OIDC identity provider, and so on — it depends
on what the platform has configured) to your platform account. Once linked, the sign-in page offers a button you can click
directly instead of typing an account and password.

:::tip A comparison
Your password is a key you had cut yourself; a third-party account is registering the office badge so it opens this door too.
If the badge is lost the key still works, and if the key is forgotten the badge still gets you in.
:::

## Before you start

- You are already signed in. Linking happens after sign-in, because it links to **the account you are using**.
- You can sign in to the third-party account you want to link.
- The platform has at least one third-party sign-in method; with none, the group shows only an empty state.

## Where to find it

1. Click your avatar in the top-right corner → **Personal settings**.
2. Open the **Security** tab and scroll to the **Third-party sign-in** group.
3. Its description reads **Manage the third-party accounts you can sign in with.**

## Which rows you see

| Where a row comes from | Explanation |
| --- | --- |
| Providers currently configured | One row per provider; the icon and name come from the platform settings |
| Providers you linked that are no longer offered | Still listed, so you can unlink them |

Each row shows a status chip on the right: **Linked** or **Not linked**. A linked row also shows the third-party account
identifier next to the chip, so you can confirm which account is bound.

![The Third-party sign-in group on the Security tab: one row per provider with a Linked/Not linked chip and a Bind or Unlink action](/assets/screenshots/account/linked-accounts-01.png)

## Linking

1. On the provider's row, click **Bind**.
2. The browser goes to that provider's sign-in or consent page.
3. Sign in with the third-party account you want to link and approve.
4. You return to this page automatically and the row shows **Linked**.

:::warning An unfinished authorization links nothing
If you close the provider page or decline, no link is created. A notice at the top explains the failure; click **Bind** again.
:::

## Unlinking

1. On a linked row, click **Unlink**.
2. A confirmation opens, titled **Unlink {provider}**, stating the impact:
   **You will no longer be able to sign in with this account.**
3. Confirm and the link is removed; the row returns to **Not linked** and a notice reads **Third-party account unlinked**.

:::warning Make sure you have another way in
If this account was your only sign-in method, you may be locked out after unlinking. Confirm you know the password,
or that **Email code** / **SMS code** sign-in is enabled; if neither is true, check with your platform administrator first.
:::

## Empty state

When the platform has configured no third-party method, the group shows **No third-party sign-in methods are available**.
Ask your platform administrator to enable one.

## Common questions

| Symptom | Likely cause | What to do |
| --- | --- | --- |
| No third-party buttons on the sign-in page | The platform has not configured one, or your deployment has it off | Contact your platform administrator |
| Still only a password field after linking | Provider buttons appear only when the platform enables that method | Reload the sign-in page; if it is still missing, ask your administrator |
| Linking fails with an invalid callback | The consent page was open too long, or the link was reused | Click **Bind** again and finish in one go |

## Related

- [Security](/account/iam/security)
- [Login](/account/auth/login)
- [Reset Password](/account/auth/reset-password)
