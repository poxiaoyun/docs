---
title: 'Gateway Settings'
updated: '2026-09-14'
description: 'Change the name, logo and description users see for the chat sub-system.'
tags:
  - boss
  - settings
---

# Gateway Settings

Gateway Settings decide **how AIrouter — the platform's chat sub-system — appears to users**: its name, its logo and its description. These values appear wherever users see the chat and model playground product.

This page is under **System Settings → Gateway Settings** in the left-hand menu.

:::tip Gateway Settings is the signboard of the chat product
The menu entry is called **Gateway Settings**, but what it maintains is the **chat sub-system** — called **AIrouter** in this documentation, and titled **Playground** by default in the product. That is the sub-system users open to chat, compare models and read call analytics.
If you change the product title to something else, that is the name users will see.
:::

## Before you start

- Your account must be a **system administrator**.
- Prepare the logo image: **PNG or SVG**, no larger than **128 KB**.

## Set the name and logo

1. Fill in the **Title and Logo** card:

   | Setting | What to fill in | What happens when you change it |
   | --- | --- | --- |
   | Logo | Upload a PNG or SVG, no larger than **128 KB** | Replaces the icon in the **Products** entry, on chat pages and on the splash screen |
   | Product Title | At most **10 characters**; defaults to the built-in product name | Replaces the entry name, plus the browser tab and navigation title of chat pages |
   | Product Description | At most **100 characters**, and it can wrap onto 4 lines | Replaces the product description text |

2. Choosing a logo file **triggers an immediate save**.

3. If you only changed the text, click **Confirm** at the bottom of the card.

## Confirming the result

- After a successful save the page shows "**Update successfully, please refresh the page**".
- Refresh the browser, then check the **Products** entry to see whether the name and logo have updated.
- Open any chat or model playground page and confirm the browser tab title also uses the new name.

## How this page differs from AI Platform and Moha Hub settings

All three pages have exactly the same structure — a **Title and Logo** card — and differ only in **which product they brand**. They are independent of each other:

| Page | Product it brands |
| --- | --- |
| [AI Platform Settings](/boss/settings/rune) | The AI Platform |
| [Moha Hub Settings](/boss/settings/moha) | Moha Hub |
| Gateway Settings | AIrouter (the chat sub-system) |

## Common questions

| What you see | Likely cause | What to do |
| --- | --- | --- |
| The logo will not upload | It is not PNG/SVG, or it is larger than 128 KB | Use an image that meets the requirements |
| Changing one place changed another product too | You may have edited the wrong page | Change each product on its own settings page |

## Related

- [AIrouter](/airouter)
- [Platform Settings](/boss/settings/platform)
- [AI Platform Settings](/boss/settings/rune)
- [Moha Hub Settings](/boss/settings/moha)
