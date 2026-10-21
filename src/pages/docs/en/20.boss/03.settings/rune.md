---
title: AI Platform Settings
updated: '2026-10-21'
description: 'Rebrand the AI Platform and set the internal Moha and KMS service addresses.'
tags:
  - boss
  - settings
---

# AI Platform Settings

AI Platform Settings decides **how the AI Platform presents itself**: its name, logo and description, plus the two internal service addresses the platform uses to reach Moha and KMS.

The page lives in the **Platform Settings** area: click **Platform Settings** in the top bar, then **AI Platform Settings** under the **Platform** group.

After reading this page you can replace the title, description and logo, fill in the two internal addresses correctly, and know what breaks when they are wrong.

:::tip Branding, not a switch
The title, logo and description only change how the entry **looks**. They do **not** add or remove menus in the AI Platform. Whether a user can enter it depends on their tenant having an enabled cluster and a quota.
:::

## Before you start

- You need a **system administrator** account.
- Prepare a logo: **PNG or SVG**, no larger than **1 MB**.
- Have the **Moha address** and **KMS address** ready. If you are unsure, confirm with the deployment team rather than guessing.

## Page layout

The page has a single card, **Title and Logo**, which groups the branding with the two internal addresses:

| Block | What it controls |
| --- | --- |
| Logo and product title | How the AI Platform appears in entries and navigation |
| Product description | The short introduction text |
| Moha address / KMS address | Where the platform reaches those two services |

## Set the name and logo

1. In the **Title and Logo** card fill in:

   | Setting | How to fill it | What changes |
   | --- | --- | --- |
   | Logo | PNG or SVG, up to **1 MB** | The icon in the Product & Services entry and on AI Platform pages |
   | Product title | **Required**, cannot be blank, default `AI Platform` | The name in entries and navigation |
   | Product description | **Required**, up to **100 characters**, four rows | The introduction text |
   | Moha address | For example `https://moha.example.com` | Where the platform calls Moha |
   | KMS address | For example `https://kms.example.com` | Where the platform calls KMS |

2. Choosing a logo file **uploads and saves the logo immediately**, together with the current title, description and addresses.

3. If you only changed text, click **OK** at the bottom of the card.

:::warning Wrong addresses break features
The Moha and KMS addresses are what the platform's own services call. Use full URLs reachable from the platform backend; a typo silently disables the features that depend on them.
:::

![AI Platform Settings: logo, product title, description, Moha address and KMS address](/assets/screenshots/boss/settings-rune-01.png)

## Verify the result

- A successful save shows "**Update succeeded, please refresh the page**".
- Refresh the browser and check the Product & Services entry and AI Platform pages for the new name, description and logo.
- Features that rely on Moha or KMS — for example Moha Hub links and key services — should still work, which confirms the addresses.

## FAQ

| Symptom | Likely cause | What to do |
| --- | --- | --- |
| Logo upload fails | Not PNG/SVG, or larger than 1 MB | Use a file that matches both requirements |
| The description is rejected | It is required and cannot be blank | Write one sentence |
| The platform-wide title changed too | It did not — this page only brands this sub-product | If the overall title changed, you edited [Platform Settings](/boss/settings/platform) |
| Some features report connection failures | Wrong Moha or KMS address | Confirm with operations and save again |

## Related

- [Platform Settings](/boss/settings/platform)
- [Moha Hub Settings](/boss/settings/moha)
- [Gateway Settings](/boss/settings/chatapp)
