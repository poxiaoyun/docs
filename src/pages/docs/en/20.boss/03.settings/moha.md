---
title: Moha Hub Settings
updated: '2026-10-21'
description: 'Rebrand Moha Hub and configure how spaces are reached: direct access or proxy, plus the domain or IP and TLS certificate.'
tags:
  - boss
  - settings
---

# Moha Hub Settings

Moha Hub Settings decides **how Moha Hub presents itself** (name, logo, description) and **how spaces are reached**: directly or through the apiserver proxy, with which domain or IP, and whether HTTPS is on.

Two cards: branding on top, space configuration below. Each **saves independently**, so editing one never touches the other.

The page lives in the **Platform Settings** area: click **Platform Settings** in the top bar, then **Moha Hub Settings** under the **Platform** group.

After reading this page you can replace the title, description and logo, pick the right access mode, and fill in the domain or IP and TLS material correctly.

:::tip Branding versus access
The top card only changes what Moha Hub looks like.
The bottom card decides how the Spaces feature is reached — get the access mode or certificate wrong and spaces stop opening, so treat it as the riskier half.
:::

## Before you start

- You need a **system administrator** account.
- Prepare a logo: **PNG or SVG**, no larger than **1 MB**.
- For space configuration, have a **domain pointed at this platform or a usable IP**; for HTTPS, also have the certificate and private key at hand.

## Page layout

| Card | What it controls | How to save |
| --- | --- | --- |
| Title and Logo | Moha Hub name, logo and description | **OK** inside the card |
| Space configuration | Access mode, domain / IP, TLS switch and credentials | **OK** inside the card |

## Set the name and logo

1. In the **Title and Logo** card fill in:

   | Setting | How to fill it | What changes |
   | --- | --- | --- |
   | Logo | PNG or SVG, up to **1 MB** | The icon in the Product & Services entry and on Moha Hub pages |
   | Product title | **Required**, cannot be blank, default `Moha Hub` | The name in entries and navigation |
   | Product description | **Required**, up to **100 characters**, four rows | The introduction text |

2. Choosing a logo file **uploads and saves the logo immediately**.

3. For text-only changes, click **OK** at the bottom of the card.

![Moha Hub Settings: the Title and Logo card and the space configuration card with access mode, domain / IP and TLS credentials](/assets/screenshots/boss/settings-moha-01.png)

This page adds a **Space configuration** section compared with Platform Settings: pick the access mode first, then decide the domain and certificate. Each card has its own **OK** button.

## Configure spaces

1. In the **Space configuration** card, start with **Space access mode**:

   | Option | Meaning |
   | --- | --- |
   | Domain / IP direct | Each space is exposed directly on its own subdomain or NodePort; the domain / IP and TLS fields below apply |
   | Through apiserver proxy | Access goes through the apiserver proxy; no per-space domain or certificate is needed |

   The help text reads: "Takes effect the next time a space starts or restarts. Proxy mode requires a space template that supports proxied access." In other words, the change is not immediate — existing spaces need a restart.

2. With **Domain / IP direct**, continue with:

   | Setting | How to fill it | Notes |
   | --- | --- | --- |
   | Domain / IP | Required, for example `spaces.example.com` or `192.168.1.10` | **No scheme and no port.** A domain uses space subdomains; an IP uses NodePort |
   | Enable TLS | Switch, off by default | When on, the platform reaches spaces over HTTPS |
   | TLS certificate | Required when TLS is on, PEM | Certificate used for space HTTPS |
   | TLS private key | Required when TLS is on, PEM | Matching private key |

3. Click **OK** at the bottom of the card.

Validation rules:

- **Domain / IP** cannot be empty after trimming whitespace.
- With **Enable TLS** on, both certificate and key are required; one without the other is rejected.
- Certificate and key are **either both filled or both empty**; the error text is "TLS certificate and private key must be provided together; both are required when TLS is enabled".

:::warning TLS only works with a domain
The help text states that TLS applies to domains only. With a bare IP, browser certificate validation fails, so leave HTTPS off for IP-based access.
:::

:::warning Verify the certificate before enabling HTTPS
With TLS on, the platform reaches spaces over HTTPS. A mismatched or wrong-domain certificate makes spaces unreachable for users.
:::

## Verify the result

- Both cards show "**Update succeeded, please refresh the page**" after saving.
- Refresh the browser and check the Product & Services entry for the new name and logo.
- Open a space using the **domain / IP**; with TLS on the URL should start with `https://`.
- After switching to proxy mode, restart one space and confirm the new path works.

## FAQ

| Symptom | Likely cause | What to do |
| --- | --- | --- |
| Space configuration will not save | Domain / IP is empty | Fill in a domain or IP without scheme or port |
| TLS errors on save | Only one of certificate and key is filled | Fill both, or clear both |
| Spaces do not open after enabling HTTPS | Certificate and key do not match, or do not cover the domain | Re-check and paste again |
| Access mode seems unchanged after switching | It applies on the next space start or restart | Restart the affected spaces |
| Certificate errors when using an IP with TLS | TLS only works with a domain | Turn TLS off for IP access |

## Related

- [Platform Settings](/boss/settings/platform)
- [AI Platform Settings](/boss/settings/rune)
