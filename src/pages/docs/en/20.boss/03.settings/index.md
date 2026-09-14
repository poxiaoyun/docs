---
title: Platform
updated: '2026-09-12'
description: 'Change the platform name, logo, sub-product branding, AI assistant, license and administrator list.'
tags:
  - boss
  - settings
---

# Platform

This group of pages is the **master control panel for the whole platform**: what the platform is called, which logo it uses, how each sub-system appears in the interface, whether the AI assistant is switched on, whether the license has expired, and who the platform administrators are.

You will find them in the **System Settings** group in the left-hand menu. The changes you make here are usually **visible across the entire platform** — including the sign-in page, the top title bar and the product entries that ordinary users see — so think about who will be affected before you start.

:::tip These settings are not tenant settings
Every item here is **platform-wide**: one change affects all tenants and all users.
Members, quotas and workspaces inside a tenant are tenant-level settings — change those under **Account Center** on the tenant pages.
:::

## Before you start

- Your account must be a **system administrator**. Ordinary users do not see the **System Settings** group in the left-hand menu, and cannot open these pages even with a direct link.
- Before changing a sub-system, work out where its entry appears, so that you do not lose track of the button afterwards.

## What each settings page does

| Page | What it is for | Who is affected |
| --- | --- | --- |
| [System Member](/boss/settings/members) | Add or remove platform administrators and assign administrator roles | Only the platform administrator list, not ordinary users |
| [Platform Settings](/boss/settings/platform) | Change the platform title, subtitle and logo; control the top **Document** entry, the language switcher and self-registration | Sign-in page, browser tab, the top bar of every page |
| [AI Platform Settings](/boss/settings/rune) | Change the title, logo, description and internal service addresses of the AI Platform; set automatic pausing of idle development instances | The **Products** entry and the AI Platform pages; idle monitoring affects development instances users are working in |
| [Moha Hub Settings](/boss/settings/moha) | Change the title, logo and description of Moha Hub, plus the Space base domain and HTTPS certificate | The Moha Hub entry and everyone who opens a Space |
| [Gateway Settings](/boss/settings/chatapp) | Change the title, logo and description of AIRouter (shown as **Playground** by default) | The AIRouter product entry and its chat pages |
| [AI Assistant Settings](/boss/settings/ai-assistant) | Set the assistant avatar and name, configure the authentication key and control whether it is enabled | The floating AI assistant on the right edge of AI Platform pages |
| [License](/boss/settings/license) | Check the license status and expiry date, and update the license | The features available platform-wide and the resource limits |

## Four display settings that are easy to mix up

**Platform Settings**, **AI Platform Settings**, **Moha Hub Settings** and **Gateway Settings** each contain a card called **Title and Logo**. The only difference is **which product they control**:

- **Platform Settings** controls the entire platform (sign-in page, browser tab, overall title).
- The other three control the **AI Platform**, **Moha Hub** and **Gateway** (chat) product entries respectively.

They do not affect each other: changing one leaves the others untouched.

## Confirming the result

Each card normally has its own **Confirm** button, and a successful save shows "Update successfully, please refresh the page". In other words: **the setting has been stored, but the page you are looking at is still the old one — refresh the browser to see the new look**.
