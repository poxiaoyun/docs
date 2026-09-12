---
title: 'IAM API Key (AK/SK)'
updated: '2026-09-12'
description: What an API key is for, how to generate one, why it is shown only once, and what to do if it leaks.
---

# IAM API Key (AK/SK)

An API key is a pair of account credentials meant for **programs**, made up of an AccessKey (AK for short) and a SecretKey (SK for short). When you want a script, an external tool, or your own application to call the platform API on your behalf, this pair proves who you are instead of a person typing an account and password. This page walks you through generating it and explains why it appears only once.

:::tip A comparison
An account and password is the key a person uses; an API key is the access card a machine uses. A machine cannot type a password, so it comes and goes with this card.
:::

## Before you start

- This is a setting for your own account, so you can use it as soon as you sign in; no extra tenant role is needed.
- Decide first which program will use the pair, because you will need to fill it in over there after generating it.

## Two words to understand first

| Term | Plain meaning |
| --- | --- |
| AccessKey | The "username" of the pair; it may appear in requests and stays visible in the page list |
| SecretKey | The "password" of the pair; it appears only at the moment you generate it and is never shown again |

## Generating a key

1. Click your avatar in the top-right corner → **Settings**.
2. Click the **API Key** tab at the top.
3. When there is no key yet the middle of the page is empty; when a key exists, the key name and the AccessKey are listed here.
4. Click the **Generate** button at the bottom of the page. If a key already exists, this button reads **Regenerate**.
5. A green "Generated successfully" alert appears at the top, listing this run's **AccessKey** and **SecretKey**, each with a copy button.

:::warning The SecretKey is shown only this once
The success alert says plainly: "Please remember the following Access Key and Secret Key. The Secret Key will only appear this one time!" Once you close the alert, that SecretKey is gone from the page for good, so copy it right away and save it in your password manager.
:::

## Confirming the result

Two things happen at the same time after a successful generation:

- A green **Generated successfully** alert appears at the top and shows the AccessKey and SecretKey.
- The AccessKey in the list below updates to the value from this run.

Back on the **API Key** tab, the list shows only the key name and the AccessKey; the SecretKey appeared only in that success alert.

## If the key is lost or leaked

| Situation | What to do |
| --- | --- |
| You forgot to save the SecretKey | The page cannot show it again, so click **Regenerate** for a new pair |
| You suspect someone has seen the key | Click **Regenerate** immediately and update every program that uses the old key |
| You want to void the key completely | The page has no delete button; use **Regenerate** to replace it with a new pair |

:::warning Update your programs after regenerating
Regenerating gives you a brand-new AccessKey and SecretKey. Change every script and application configuration that used the old key to the new values, or those programs may fail because they no longer hold valid credentials.
:::

:::warning Never commit a key to Git
Once an AccessKey and SecretKey are written into code and committed to a Git repository, anyone who can see the repository effectively holds your credentials. The right approach is to keep keys in environment variables or a local configuration file, and to make sure those files are never committed.
:::

## Related

- [Security Settings](/account/iam/security)
- [SSH Key Management](/account/iam/ssh-key)
- [API overview](/reference/api-overview)
