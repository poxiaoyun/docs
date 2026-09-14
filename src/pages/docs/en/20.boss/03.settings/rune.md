---
title: AI Platform Settings
updated: '2026-09-14'
description: 'Rebrand the AI Platform, set its internal service addresses, and enable idle auto-pause.'
tags:
  - boss
  - settings
---

# AI Platform Settings

AI Platform Settings decide **how the AI Platform (Rune) appears to users**: its name, its logo, its description, and the two internal service addresses — Moha and KMS — that the platform needs to reach.

Further down the page there is a separate card, **Development Instance Idle Monitor**, which can automatically pause development instances that nobody has used for a long time and free up compute.

This page is under **System Settings → AI Platform Settings** in the left-hand menu.

:::tip This page changes the signboard, not the switch
The title, logo and description here only make the entry **look** like your own product.
They do **not** make the AI Platform menus appear or disappear; whether a user can enter the AI Platform depends on whether their tenant has been assigned the product.
The only functional switch on this page that directly affects users is the idle monitor below.
:::

## Before you start

- Your account must be a **system administrator**.
- Prepare the logo image: **PNG or SVG**, no larger than **128 KB**.
- If you plan to use idle monitoring, first decide which development instances may accept being paused when nobody is using them.

## Page structure

Top to bottom the page has two cards, each saved on its own:

| Card | What it controls |
| --- | --- |
| Title and Logo | The AI Platform name, logo, description and internal service addresses |
| Development Instance Idle Monitor | Whether idle development instances are paused automatically, and after how long |

## Set the name and logo

1. Fill in the **Title and Logo** card:

   | Setting | What to fill in | What happens when you change it |
   | --- | --- | --- |
   | Logo | Upload a PNG or SVG, no larger than **128 KB** | Replaces the icon in the **Products** entry and on AI Platform pages |
   | Product Title | At most **10 characters**; defaults to the built-in product name | Replaces the name shown in the entry and the navigation bar |
   | Product Description | At most **100 characters**, and it can wrap onto 4 lines | Replaces the product description text |
   | Moha Address | For example `https://moha.example.com` | The address the platform uses internally to reach Moha |
   | KMS Address | For example `https://kms.example.com` | The address the platform uses internally to reach KMS |

2. Choosing a logo file **triggers an immediate save** that writes the logo, title, description and both addresses together.

3. If you only changed the text, click **Confirm** at the bottom of the card to save.

:::warning Wrong addresses break features
The Moha Address and KMS Address are used by the platform to call those two services internally; a wrong value makes the related features unavailable.
If you are not sure of the correct addresses, ask the deployment or operations team first instead of guessing.
:::

## Set the development instance idle monitor

In the **Development Instance Idle Monitor** card the platform watches the GPU or vGPU usage of development instances: **as soon as usage stays at 0% for a continuous period, the instance is paused automatically** so that it stops occupying compute.

| Setting | What to fill in | What happens when you change it |
| --- | --- | --- |
| Enable auto-pause for idle development instances | Switch, **off** by default | When on, development instances that reach the idle duration are paused automatically; when off, they are never paused automatically |
| Idle Duration (minutes) | A whole number between **1 and 10080**, default `30` | The instance is paused once usage has been 0% for this long; anything above 10080 (7 days) is rejected |

- While the switch is **off**, the **Idle Duration** input is greyed out and cannot be edited.
- Click **Confirm** on this card to save.

:::warning Auto-pause interrupts instances users are working in
Once triggered, the development instance is paused and any jobs running inside it may be interrupted. Agree a sensible idle duration with your users before turning this on; with the switch off nothing is paused automatically.
:::

## Confirming the result

- Both cards show "**Update successfully, please refresh the page**" after a successful save.
- Refresh the browser, then check the **Products** entry or an AI Platform page to see whether the name and logo have updated.
- To check the idle monitor, watch whether a development instance idle for longer than the configured duration becomes paused.

## Common questions

| What you see | Likely cause | What to do |
| --- | --- | --- |
| The logo will not upload | It is not PNG/SVG, or it is larger than 128 KB | The limit here is smaller than the 3 MB of Platform Settings — use a smaller image |
| **Idle Duration** cannot be edited | The switch above it is off | Turn on "Enable auto-pause for idle development instances" first |
| An instance was paused and I want it back | The idle auto-pause triggered | Start the development instance again |

## Related

- [Platform Settings](/boss/settings/platform)
- [Moha Hub Settings](/boss/settings/moha)
