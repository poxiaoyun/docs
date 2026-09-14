---
title: AI Assistant Settings
updated: '2026-09-14'
description: 'Set the AI assistant avatar, name and key, and enable it when the service is ready.'
tags:
  - boss
  - settings
---

# AI Assistant Settings

The AI assistant is a **small helper that diagnoses problems for users**. It appears on the **right edge** of AI Platform pages: click it and a chat panel slides out, so a user can simply ask "why will my instance not start?" and the assistant looks at the current workspace resources and suggests a diagnosis.

This page is where you set the assistant's **avatar, name and authentication key**, and decide **whether it is enabled for users**.

This page is under **System Settings → AI Assistant Settings** in the left-hand menu.

:::tip Where it appears
Once enabled, users see a small vertical bar on the right edge of any AI Platform page (a tenant and workspace must be selected first), showing the assistant avatar; clicking it slides the chat panel out from the right.
When it is off, that vertical bar **is not shown** and users have no entry point.
:::

## Before you start

- Your account must be a **system administrator**.
- For the assistant to work, the underlying diagnostics service must be **ready** and must have loaded an available model; otherwise the switch cannot be turned on.
- If you are going to change the Holmes API Key, get it from the Holmes plugin first.

## Page structure

| Setting | What to fill in | What happens when you change it |
| --- | --- | --- |
| Assistant avatar | Upload a PNG/JPG/WEBP, no larger than **128 KB** | Replaces the avatar in the assistant entry and the chat panel; the upload is cropped to 160 px square automatically |
| Name | At most **32 characters**; defaults to the built-in assistant name | Replaces the assistant entry tooltip and the chat panel title; saving an empty value restores the default name |
| Holmes API Key | Password input | Used to authenticate with the Holmes plugin; **saving an empty value does not overwrite the existing key**, only a new value updates it |
| AI Assistant | Switch | Decides whether users can see and use the assistant |

## Set the appearance and key

1. Choose an image under **Assistant avatar**. At this point it is only a local preview and the page shows "Avatar selected. Save to apply it.".
2. Enter the assistant name under **Name** — at most 32 characters.
3. To update the authentication key, paste a new value into **Holmes API Key**. The hint under the input tells you the current state:

   | Hint | Meaning |
   | --- | --- |
   | Managed by Boss settings… | The key has already been configured here; leaving it empty keeps the current value, entering a new one updates it |
   | Currently using a server-side compatibility setting… | The old server-side configuration is in use; save a new key to manage it from here instead |
   | Not configured… | Nothing has been set up yet; enter the API Key from the Holmes plugin |

4. Click **Confirm** at the bottom of the page. If you entered a new key, the platform saves the key first, then the avatar, name and switch state.

## Enable or disable the assistant

1. Look at the **Service status** label on the page:

   | Label | Meaning |
   | --- | --- |
   | Ready (followed by a number) | The service is healthy and ready, and has loaded models, so the assistant can be enabled |
   | Not ready | The service exists but is not ready, or has no available model |
   | Unavailable | The service is unhealthy and cannot be used right now |

2. When the status is not "Ready", click **Refresh status** to check again.
3. Once it reads "Ready", turn on the **AI Assistant** switch and click **Confirm**.

:::warning The switch is forced off while the service is unavailable
Whenever the service shows "Not ready" or "Unavailable" (or there are 0 models), the **AI Assistant switch is forced to off and cannot be operated**; even if you save, the platform stores it as off.
:::

## Confirming the result

- After a successful save the page shows "**Update successfully, please refresh the page**".
- Refresh the browser, open any AI Platform page (select a tenant and workspace first) and check whether the assistant avatar appears on the right edge.
- If clicking the avatar slides out the chat panel with the name and avatar you configured, the setting has taken effect.

## Common questions

| What you see | Likely cause | What to do |
| --- | --- | --- |
| The switch will not turn on and is greyed out | The service is not ready, is unavailable, or has no available model | Click **Refresh status**; if that does not help, check the Holmes service |
| Users cannot see the assistant entry | The switch is off, no workspace is selected, or the service is unhealthy | Confirm the switch is on, and have the user select a tenant and workspace |
| The avatar changed but did not take effect | The avatar is written to the configuration only on save | Remember to click **Confirm** after choosing the avatar |
| You do not want to expose it to users | The assistant is enabled | Turn the **AI Assistant** switch off and save |

## Related

- [License](/boss/settings/license)
- [Platform Settings](/boss/settings/platform)
