---
title: 'API Key'
updated: '2026-10-21'
description: What an API key is for, where to generate it, why it is shown only once, and what to do if it leaks.
---

# API Key

An API key is an account-and-password pair meant for **programs**, made up of an Access Key (AK) and a Secret Key (SK).
When you want a script, an external tool, or your own application to call the platform API on your behalf, this pair proves
who you are instead of a person typing credentials. This page walks you through generating it on the **Access keys** page
and explains why it appears only once.

:::tip A comparison
An account and password is the key a person uses; an API key is the access card a machine uses. A machine cannot type a password, so it comes and goes with this card.
:::

## Before you start

- This is a setting for your own account, so you can use it as soon as you sign in; no extra tenant role is needed.
- Decide first which program will use the pair, because you fill it in over there after generating it.
- An account holds exactly one pair: generating a new key replaces the old one.

## Two terms to understand first

| Term | Plain meaning |
| --- | --- |
| Access Key | The "username" of the pair; it may appear in requests and stays visible in the list |
| Secret Key | The "password" of the pair; shown only at the moment of generation and never again |

## What the Access keys page holds

The **Access keys** page has two sections, and this page covers the first:

| Section | Description | Detailed steps |
| --- | --- | --- |
| **API Key** | Its description reads **Access services through the API.** | This page |
| **SSH Key** | Its description reads **Manage public keys used for SSH authentication.** | [SSH Key](/account/iam/ssh-key) |

## Generating a key

1. Click your avatar in the top-right corner → **Personal settings**.
2. Open the **Access keys** tab and find the **API Key** section.
3. Click the action on the right of the section. It reads **Generate** when no key exists and **Regenerate** when one does.
4. A confirmation opens with one of these texts:

   | Button | Confirmation text |
   | --- | --- |
   | **Generate** | Save the Secret Key as soon as it is generated — it is shown only once. |
   | **Regenerate** | Regenerating replaces the current key immediately; the old key stops working. |

5. Confirm by clicking **Generate** / **Regenerate** in the dialog.
6. A result dialog opens, titled **Generated successfully**, with two copyable fields: **Access Key** and **Secret Key**.

:::warning The Secret Key appears only this once
The dialog says **Please remember the following Access Key and Secret Key. The Secret Key will only appear this one time!**
Copy it right there into your password manager or the program's configuration before closing the window — afterwards
the page will never show it again.
:::

![Access keys page: the Generate/Regenerate action on the API Key section, and the success dialog with Access Key and Secret Key fields](/assets/screenshots/account/api-key-01.png)

## Confirming the result

After generating:

- A row appears in the list under the **API Key** section, showing the key name and the Access Key.
- The Secret Key exists only in that result dialog; the list never shows it.

## Lost or leaked keys

| Situation | What to do |
| --- | --- |
| You did not save the Secret Key | It cannot be viewed again; click **Regenerate** to get a new pair |
| You suspect someone else saw it | Click **Regenerate** immediately and update every program that used the old key |
| You want the key to stop working | There is no separate "delete key" button; **Regenerate** is how you invalidate the old one |

:::warning Update your programs after regenerating
Regenerating invalidates the old key at once. Point every script and application configuration at the new values,
or those programs will fail with invalid credentials.
:::

:::warning Never commit keys to Git
Once the Access Key and Secret Key are written into code and pushed to a repository, everyone who can read that repository
has your credentials. Keep them in environment variables or a local configuration file that is never committed.
:::

## Related

- [Personal settings](/account/iam)
- [SSH Key](/account/iam/ssh-key)
- [API overview](/reference/api-overview)
