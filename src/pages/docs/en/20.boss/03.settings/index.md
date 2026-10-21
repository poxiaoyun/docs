---
title: Platform
updated: '2026-10-21'
description: 'Where every platform-wide setting lives: branding, sub-product settings, license, platform audit, and who each change affects.'
tags:
  - boss
  - settings
---

# Platform

This group is the **platform-wide control desk**: rename the platform, swap the logo, decide how each sub-product is presented, check the license, see who administers the platform, and find out who changed what.

All of these pages live in the **Platform Settings** area: click **Platform Settings** in the top bar; the **Platform** group in the left sidebar holds them. Changes here are usually visible **across the whole platform** — the login page, the top bar, and the entries ordinary users see — so think about the blast radius first.

After reading this page you can tell the seven pages apart, and you know which changes are cosmetic and which affect whether users can sign in at all.

:::tip These are not tenant settings
Everything on these pages is **platform-level** and affects every tenant and every user.
Members, quotas and workspaces inside a tenant are tenant-level and live under **Account Center** or inside a cluster.
:::

## Before you start

- You need a **system administrator** account. Ordinary users cannot see the **Platform** group and cannot open these pages even with a direct link.
- Know where the affected entry is displayed before you change it, so you can verify the result afterwards.

## What each page does

| Page | What it does | Who is affected |
| --- | --- | --- |
| [System Member](/boss/settings/members) | Add or remove platform administrators and assign their roles | The administrator roster only |
| [Platform Settings](/boss/settings/platform) | Platform title, subtitle, copyright holder, logo; top-bar document, theme and language entries | Login page, browser tab, every top bar |
| [AI Platform Settings](/boss/settings/rune) | AI Platform title, logo, description, Moha and KMS addresses | The AI Platform entry and pages |
| [Moha Hub Settings](/boss/settings/moha) | Moha Hub title, logo, description, plus space access mode and HTTPS certificate | The Moha Hub entry and everyone who opens a space |
| [Gateway Settings](/boss/settings/chatapp) | Title, logo and description of the "Model Experience" subsystem behind the gateway | That subsystem's entry under Product & Services |
| [License](/boss/settings/license) | License state, expiry, and license updates | Product entitlement and resource ceilings platform-wide |
| [Platform Audit](/boss/settings/platform-audit) | Who changed what, on which control plane | Read-only; changes nothing |

**Alert channels** is not in this group: it is a top-level entry in the top bar with no sidebar item. See [Alert Channels](/boss/settings/alert-channels).

## Four "branding" pages that look alike

**Platform Settings**, **AI Platform Settings**, **Moha Hub Settings** and **Gateway Settings** each contain a card called **Title and Logo**. They differ only in **which product they brand**:

- **Platform Settings** brands the whole platform (login page, browser tab, main title) and adds a second card, **Platform top bar configuration**.
- The other three brand **AI Platform**, **Moha Hub** and **Model Experience** respectively.

They are independent: changing one does not touch another.

## Things that are no longer here

Two settings used to live in Platform Settings and have moved:

| What you want to do | Where it is now |
| --- | --- |
| Toggle self-service sign-up | **Account Center → System Management → Authentication policy → Login and signup → Allow signup** |
| Configure email, SMS or third-party sign-in | **Account Center → System Management** |

## Verify the result

Each card has its own **OK** button, and a successful save shows "Update succeeded, please refresh the page". In other words: **the value is stored, but the page you are on still shows the old data** — refresh the browser to see the new look.

## Related

- [Platform Settings](/boss/settings/platform)
- [Authentication Policy](/boss/iam/authentication-policy)
- [Alert Channels](/boss/settings/alert-channels)
- [Platform Audit](/boss/settings/platform-audit)
