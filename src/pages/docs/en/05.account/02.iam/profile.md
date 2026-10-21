---
title: 'General'
updated: '2026-10-21'
description: What the five rows on the General tab mean, how to change the avatar and nickname, and how to rebind email or mobile number.
---

# General

**General** is the first tab of personal settings. It shows and changes your own identity details: avatar, nickname,
email, and mobile number. The username (the account you sign in with) is read-only here. Passwords, the second factor
and the interface look are on other tabs.

:::tip Nickname and username are different things
The username is your login name, unique in the system and unchangeable. The nickname is what colleagues see in member lists
and in the avatar drawer; you can change it whenever you like.
:::

## Before you start

- You can use it as soon as you sign in; no tenant role is needed.
- Before rebinding an email or mobile number, make sure you can open the **new** mailbox or receive messages on the **new**
  number — the verification code goes to the new address.

## The rows on this page

| Row | What you can do | Notes |
| --- | --- | --- |
| **Avatar** | Click to upload | Takes effect immediately; no separate save |
| **Username** | Read-only | The unique identifier in the system; there is no edit entry |
| **Nickname** | **Change** at the end of the row | Edited in a dialog and saved there |
| **Email** | **Change** at the end of the row (**Add** when nothing is bound) | Needs a code sent to the new mailbox; an unbound row shows **Not added** |
| **Mobile Number** | **Change** at the end of the row (**Add** when nothing is bound) | Needs an SMS code sent to the new number; an unbound row shows **Not added** |

## How to open it

1. Click your avatar in the top-right corner → **Personal settings**.
2. You start on **General**; after visiting another tab, click **General** to come back.

![General tab: avatar area on the left; username (read-only), nickname, email and mobile number rows on the right, each with a change action](/assets/screenshots/account/profile-01.png)

## Changing the avatar

1. Click the avatar area and pick a local image.
2. In the crop window, zoom and rotate until the framing looks right.
3. Confirm the upload.

Requirements: a common image format (JPEG, PNG, WebP, and the like), **no larger than 3 MB**.

:::info The avatar is saved on upload
No save button is involved — once the upload succeeds every place that shows your avatar uses the new image.
:::

## Changing the nickname

1. On the **Nickname** row, click **Change** at the end of the row.
2. In the **Change display name** dialog, type the new name into **Nickname**. It cannot be empty.
3. Click **Save**.

The dialog closes and the nickname on the page updates; no need to sign in again.

## Changing the email or mobile number

1. On the **Email** or **Mobile Number** row, click **Change** (or **Add** when nothing is bound yet).
2. The dialog has two fields:

   | Field | How to fill it |
   | --- | --- |
   | **Email** or **Mobile Number** | The new address or number, in the right format; a mobile number needs its country code |
   | **Verification Code** | Click **Send code** on the right and enter the code sent to the **new** address |

3. Click **Save**.

:::warning The code goes to the new address, not the old one
So it does not matter that the old mailbox or phone cannot receive it — you only need access to the new one.
:::

## After saving

- No "updated" toast appears. **The dialog closing and the value on the page changing** is the confirmation.
- If the details were saved but refreshing the current session failed, a banner appears at the top:
  **Changes were saved, but the current session could not be refreshed: …**, with a retry action.
  **Do not submit again** — click retry; the data is already stored.

## Why the username cannot be changed

**Username** has no input and no edit entry by design: it is the unique identifier your account, memberships, and records
are tied to. If it really must change, contact your platform administrator.

## Related

- [Personal settings](/account/iam)
- [Security](/account/iam/security)
- [Preferences](/account/iam/preferences)
