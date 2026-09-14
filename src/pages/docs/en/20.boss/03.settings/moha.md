---
title: Moha Hub Settings
updated: '2026-09-14'
description: 'Rebrand Moha Hub and set the base domain and HTTPS certificate used by Spaces.'
tags:
  - boss
  - settings
---

# Moha Hub Settings

Moha Hub Settings decide **how Moha Hub appears to users** (name, logo, description) and also manage which domain **Spaces** are served from and whether HTTPS is enabled.

The page has two cards: display information on top and space configuration below. They **save independently**, so changing one never affects the other.

This page lives in the **Platform Settings** area: click **Platform Settings** in the top navigation bar, then click **Moha Hub Settings** under the **System Settings** group in the left sidebar.

:::tip What the two cards control
The upper card only changes what Moha Hub is called and how it looks; users see this directly.
The lower card controls how the Spaces feature is reached — a wrong domain or certificate makes Spaces unreachable, so treat it as the more sensitive of the two.
:::

## Before you start

- Your account must be a **system administrator**.
- Prepare the logo image: **PNG or SVG**, no larger than **128 KB**.
- If you are going to change the space configuration, first prepare a **domain that is registered and pointed at this platform**; to enable HTTPS you also need the certificate and private key contents.

## Page structure

| Card | What it controls | How it is saved |
| --- | --- | --- |
| Title and Logo | The Moha Hub name, logo and description | Click **Confirm** inside the card |
| Space Configuration | The Space base domain, whether HTTPS is enabled, and the certificate | Click **Confirm** inside the card |

## Set the name and logo

1. Fill in the **Title and Logo** card:

   | Setting | What to fill in | What happens when you change it |
   | --- | --- | --- |
   | Logo | Upload a PNG or SVG, no larger than **128 KB** | Replaces the icon in the **Products** entry and on Moha Hub pages |
   | Product Title | At most **10 characters**; defaults to the built-in product name | Replaces the name shown in the entry and the navigation bar |
   | Product Description | At most **100 characters**, and it can wrap onto 4 lines | Replaces the product description text |

2. Choosing a logo file **triggers an immediate save**.

3. If you only changed the text, click **Confirm** at the bottom of the card.

![Moha Hub settings: title and logo, plus space configuration (base domain, TLS certificate and key)](/assets/screenshots/boss/settings-moha-01.png)

This page adds a **Space configuration** block over the platform page: the **Base domain** decides where user Spaces are served, and turning on **Enable TLS** reveals the certificate and private key fields. Each block has its own **Confirm** button — save the block you edited.

## Set the space configuration

1. Fill in the **Space Configuration** card:

   | Setting | What to fill in | What happens when you change it |
   | --- | --- | --- |
   | Base Domain | Required, for example `develop.example.com` | Spaces are served publicly on this domain; it cannot be left empty |
   | Enable TLS | Switch, **off** by default | When on, Spaces are accessed over HTTPS |
   | TLS Certificate | Required when TLS is enabled, PEM format | The certificate used for Space HTTPS |
   | TLS Private Key | Required when TLS is enabled, PEM format | The private key used for Space HTTPS |

2. Click **Confirm** at the bottom of the card to save.

Validation rules:

- **Base Domain** must not be empty once leading and trailing spaces are removed, otherwise the form cannot be saved.
- With **Enable TLS** on, both the certificate and the private key **must be filled in**; providing only one raises an error.
- The certificate and private key must be **provided together or both left empty**; filling in only one shows an error.

:::warning Check the certificate before enabling HTTPS
With TLS on, the platform reaches Spaces over HTTPS. Make sure the certificate and private key belong together and match the base domain, otherwise users will not be able to open their Spaces.
:::

## Confirming the result

- Both cards show "**Update successfully, please refresh the page**" after a successful save.
- Refresh the browser, then check the **Products** entry to see whether the Moha Hub name and logo have updated.
- Once the space configuration takes effect, open a Space using the base domain and confirm it loads; with TLS enabled the address should start with `https://`.

## Common questions

| What you see | Likely cause | What to do |
| --- | --- | --- |
| The space configuration will not save | The base domain was left empty | Enter the correct domain |
| A TLS-related error appears | Only the certificate or only the private key was filled in | Fill in both, or clear both |
| Spaces do not open after enabling HTTPS | The certificate and private key do not match, or the domain is wrong | Check the certificate against the domain and paste them again |

## Related

- [Platform Settings](/boss/settings/platform)
- [AI Platform Settings](/boss/settings/rune)
