---
title: 'License'
updated: '2026-09-14'
description: 'Check the license status and expiry date, and paste a new license to renew it.'
tags:
  - boss
  - settings
  - license
---

# License

A license is the **product entitlement credential** for the platform: it decides **which features this platform may use** and **how much of each resource it may use** (for example the number of clusters, nodes and accelerators).

You can think of it as an **authorisation certificate with an expiry date** — it states the licensed products and their quantity limits, and once it expires or a limit is exceeded the corresponding features are restricted.

This page shows the current entitlement status and expiry date, and lets you paste a new certificate to renew. It is under **System Settings → License** in the left-hand menu (the page heading is **License Management**).

## Before you start

- Your account must be a **system administrator**.
- Before renewing, get the **new license string** from whoever issued the license; if the cluster changed, they will also need the **cluster fingerprint**.

## Page structure

| Section | What it is for |
| --- | --- |
| Cluster Fingerprint | Shows and copies the unique identifier of this cluster, which you give to the issuer so the license matches |
| License Status | Whether the entitlement is healthy, when it expires, which company it was issued to, and so on |
| Product Quota Status | Usage and limits per feature; click a feature name to see its resource details |

## Where to see the expiry date

The **License Status** card shows the following:

| Item | Meaning |
| --- | --- |
| Status | Shown as a label: Active, Warning, Checking, Invalid, Check Failed |
| Serial Number | The unique number of the license |
| Company | Which company the license was issued to |
| Email | The contact email on the license |
| Edition | The licensed product edition |
| Issued At | The date the certificate was issued |
| **Expires** | **The certificate expiry date — this is what you watch for renewal** |

If this shows "No license configured", the platform has no license imported yet and you need to follow the update steps below.

## What an expired license limits

Once the license expires, becomes invalid, no longer matches the current cluster, or usage exceeds the licensed limit, **some features are restricted**. Typical symptoms:

- Creating or expanding resources (clusters, nodes, accelerators and so on) is restricted.
- Products or features that are not part of the entitlement become unavailable.
- The page shows a message such as "The product license validation failed. Some features may be unavailable.".

:::warning Renew in good time before it expires
A license in "Warning" usually means it is **about to expire**. Contact the issuer to renew and update it before that happens, so users are not blocked from creating and expanding resources.
:::

## Update the license

1. Click **Update License** in the top-right corner of the page.
2. In the dialog, **paste** the new license string into the multiline field (the placeholder is "Paste the license string here").
3. Click **Submit**.
4. A successful submission shows "License updated successfully", the dialog closes automatically and the entitlement status on the page refreshes.

Things to know:

- While the field is empty, the **Submit** button cannot be clicked.
- The dialog **cannot be closed** while the submission is in progress, so wait for the result.
- If something goes wrong, the error appears inside the dialog; check the license contents or contact the issuer as the message suggests.

## Check resource usage details

When the license includes product quotas, a **Product Quota Status** section appears at the bottom of the page, one table per product:

| Column | Meaning |
| --- | --- |
| Feature | Shown as a clickable link, for example Clusters, Nodes, Accelerators |
| Resource Usage | Used amount / licensed limit |
| Status | The entitlement status of that feature |

Clicking a feature name opens the **Licensed Resource Details** page, which lists the individual resource records. On that page you can click **Refresh License Records** to request a usage check; the result is updated in the background.

## Common questions

| What you see | Likely cause | What to do |
| --- | --- | --- |
| Status shows "Invalid" | The license contents are wrong or corrupted | Get a fresh license from the issuer and paste it again |
| "Does not match this cluster" appears | The license was issued for a different cluster | Give the **Cluster Fingerprint** at the top of the page to the issuer and have it reissued |
| Status shows usage exceeded | Used resources exceed the licensed limit | Remove resources you no longer use, or ask the issuer for a larger entitlement |
| The Submit button cannot be clicked | The field is empty | Paste the license string first |

## Related

- [AI Assistant Settings](/boss/settings/ai-assistant)
- [System Member](/boss/settings/members)
