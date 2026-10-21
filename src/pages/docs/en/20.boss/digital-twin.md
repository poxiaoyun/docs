---
title: Digital Twin
updated: '2026-10-21'
author: Rune Docs Team
description: Enter the RUNE Digital Twin from BOSS — read the authorisation state first, then jump into the 3D data hall, and know who to ask when access is not enabled.
tags:
  - boss
  - digital-twin
---

# Digital Twin

**Digital Twin** is a product doorway inside BOSS. It does no 3D rendering itself: it tells you whether this platform has Digital Twin enabled, and — when it does — sends you into the real 3D data hall.

After this page you will understand the authorisation label, know when the button is clickable, and know where to ask when you cannot get in.

:::tip Three sentences to understand this page

- This page is the **door**, not the **room**: the 3D view lives in a separately deployed Digital Twin system.
- The coloured label next to the title is the **door state**: Authorized / Not authorized / Checking / Check failed.
- The **Open Digital Twin** button is clickable only when the state is **Authorized**.

:::

## Concepts

| Term | Plain explanation |
| --- | --- |
| Digital twin | A 3D model of the real data hall; racks, servers and cabling can all be clicked open on screen |
| License | The product entitlement the platform bought; Digital Twin is a separate product that must be enabled on its own |
| Open Digital Twin | Jumps to where the 3D system is served — usually the same site as BOSS, under `/twin/` |

## Before you start

- You need a **system administrator** account.
- The platform has a license for the **Digital Twin** product; without one the page still opens, you just cannot get past it.
- To check the expiry date, see [License](/boss/settings/license).

## Open the page

Click **Digital Twin** in the top navigation bar.

## What is on the page

| Area | Content |
| --- | --- |
| Title row | The title **RUNE Digital Twin** with the authorisation label on its right |
| Button at the top right | **Open Digital Twin**, clickable only when authorised and not checking |
| Main card | On the left, what the system solves plus three capability highlights; on the right, a product screenshot of the 3D data hall |

The three highlights are **3D data hall**, **Device topology** and **Hardware monitoring**: they answer "what does the room look like", "where is this machine connected", and "are temperature and power normal right now".

![Digital Twin entry page: title row with the authorisation label and the open button at the top right, capability text on the left and a 3D data hall screenshot on the right](/assets/screenshots/boss/digital-twin-01.png)

## Reading the authorisation state

The label next to the title has only four values:

| Label | Meaning | Clickable |
| --- | --- | --- |
| Authorized | This platform owns Digital Twin and the license is still valid | Yes |
| Not authorized | Not enabled, or the license has expired | No |
| Checking | The platform is being asked for the result | No; the button reads **Verifying access…** |
| Check failed | No answer this time (network or license service problem) | No; a retry hint appears at the top |

:::info Check failed does not mean not purchased
"Check failed" only means no answer came back. The page will not quietly decide you never bought it. Click retry in the hint at the top, or refresh the page.
:::

## Open the Digital Twin

1. Confirm the label next to the title reads **Authorized**.
2. Click **Open Digital Twin** at the top right.
3. The platform **verifies the license once more**, then redirects to the 3D system.
4. If verification passes you go straight in; if it fails you stay on this page with the reason shown at the top.

:::info Why verify again on click
Whether the button is clickable was decided when the page loaded. If the page has been open a long time and the license expired meanwhile, letting you through would mean being thrown out again one step later. The second check tells you at the door.
:::

## Confirming the result

| What you want to confirm | Where to look |
| --- | --- |
| Whether the platform has it enabled | Whether the label next to the title reads **Authorized** |
| When the license expires | The records under [License](/boss/settings/license) |
| Whether the 3D system really opens | After clicking **Open Digital Twin** the address moves to `/twin/` and the 3D hall appears |

## Common questions

| What you see | Likely cause | What to do |
| --- | --- | --- |
| The label says **Not authorized** and the button is dead | The platform has no Digital Twin license | Check [License](/boss/settings/license), ask your account manager to enable it, then refresh |
| The label says **Check failed** | Network problem, or the license service is down | Click retry in the hint; if it keeps failing, check the network and refresh |
| Clicking Open does nothing | The license expired in between, or verification failed | Read the hint at the top; check whether the label became **Not authorized** |
| The redirect lands on a blank page | The Digital Twin system itself is not deployed properly, or the address is wrong | Not a problem with this page — ask your implementation contact to confirm the deployment address |
| You want to inspect one machine in 3D | This page is only the doorway | Once inside, drill down data hall → rack → server |

## Related

- [License](/boss/settings/license)
- [Platform Settings](/boss/settings/platform)
- [System Members](/boss/settings/members)
