---
title: 'Platform Settings'
updated: '2026-09-14'
description: 'Change the platform title, logo, top-bar entries and sign-up switch, and know when to refresh.'
tags:
  - boss
  - settings
---

# Platform Settings

Platform Settings decide **what the sign-in page and the top bar of every page look like**: the platform title, the subtitle, which logo is used, whether the top bar shows the **Document** entry and the language switcher, and whether the sign-in page offers a registration entry.

These changes are visible platform-wide. Ordinary users see them the **moment they open the sign-in page**, so confirm that this is the information you want to show publicly.

This page lives in the **Platform Settings** area: click **Platform Settings** in the top navigation bar, then click **Platform Settings** under the **System Settings** group in the left sidebar.

## Before you start

- Your account must be a **system administrator**.
- Prepare the logo image: **PNG or SVG**, no larger than **3 MB**.

## Page structure

Top to bottom the page has three cards, and each card has **its own Confirm button** — edit a card, then click that card's button:

| Card | What it controls |
| --- | --- |
| Title and Logo | Platform title, subtitle and logo |
| Platform Header Configuration | The document entry and language switcher in the top bar |
| IAM Configuration | Whether users may self-register |

![Platform settings: title and logo, header bar configuration, and access management](/assets/screenshots/boss/settings-platform-01.png)

The page has three blocks: **Title and logo** (platform title, subtitle), **Header bar configuration** (show the docs entry, docs URL, enable the language switcher) and **Access management** (allow BOSS self-registration). Each block has its own **Confirm** — save the one you edited.

## Set the title and logo

1. Fill in the **Title and Logo** card:

   | Setting | What to fill in | What happens when you change it |
   | --- | --- | --- |
   | Platform Title | At most **10 characters**, for example `Acme Cloud` | Shown in the browser tab, the top bar title and the sign-in page heading |
   | Sub Title | At most **20 characters**, for example `Build without limits` | Shown on the sign-in page and under the sidebar title |
   | Logo | Upload a PNG or SVG, no larger than **3 MB** | Replaces the browser tab icon and the logo on the sign-in page and top bar |

2. Choosing a logo file **uploads the image immediately**, and a successful upload shows "Upload successfully". The image address now exists, but the configuration is not saved yet.

3. Click **Confirm** at the bottom of the card to store the title, subtitle and logo together.

:::tip Uploading a logo takes two steps
The upload only sends the image to the server; you **must click Confirm again** before the platform starts using the new logo.
When cropping the logo the original aspect ratio is preserved, so the image is never stretched.
:::

## Set the top bar entries

In the **Platform Header Configuration** card:

| Setting | What to fill in | What happens when you change it |
| --- | --- | --- |
| Enable document entry | Switch, **on** by default | When off, the **Document** button disappears from the top bar and users cannot find the documentation |
| Document URL | Text, for example `/docs` | The address opened by the **Document** button; if left empty it opens `/docs` |
| Enable Language Switch | Switch, **on** by default | When off, neither the top bar nor the sign-in page shows the language switcher |

- **Document URL** only appears while "Enable document entry" is on; turning the switch off hides it again.
- Click **Confirm** on this card when you are done.

## Set the registration switch

In the **IAM Configuration** card:

| Setting | What to fill in | What happens when you change it |
| --- | --- | --- |
| Enable BOSS Platform Registration | Switch, **off** by default | When on, the BOSS sign-in page shows a self-registration entry so anyone can create an account; when off, only administrators can create accounts |

:::warning Keep it off for private deployments
With this switch on, a registration entry appears on the sign-in page and outsiders can create their own accounts. For private enterprise deployments, keep it off and let administrators create accounts as needed.
:::

Click **Confirm** on this card when you are done.

## Confirming the result

- After a successful save the card shows "**Update successfully, please refresh the page**".
- **Refresh the browser** as prompted before the new title, logo, subtitle and entry switches appear.
- Open the sign-in page and check that the title, subtitle, logo and registration entry are what you configured.

## Common questions

| What you see | Likely cause | What to do |
| --- | --- | --- |
| Nothing changes after saving | The configuration is stored, but the current page still holds the old data | Refresh the browser |
| The logo will not upload | The image is not PNG/SVG, or it is larger than 3 MB | Use an image with the right format and size |
| Changing the title also changed other products | This is the platform-level title; sub-product titles are set separately | Change the sub-product on its own settings page |

## Related

- [AI Platform Settings](/boss/settings/rune)
- [Moha Hub Settings](/boss/settings/moha)
- [Gateway Settings](/boss/settings/chatapp)
