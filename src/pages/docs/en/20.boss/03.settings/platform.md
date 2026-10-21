---
title: 'Platform Settings'
updated: '2026-10-21'
description: 'Change the platform title, subtitle, copyright holder and logo, and control the document, theme and language entries in the top bar.'
tags:
  - boss
  - settings
---

# Platform Settings

Platform Settings decides **what the login page and every top bar look like**: the platform name, the subtitle, the logo, the copyright line, and whether the top bar offers a document link, a theme switch and a language switch.

After reading this page you can replace the title and logo, fill in the copyright holder, hide or show the top-bar entries, and know why a refresh is required.

These changes are visible platform-wide — ordinary users see them **on the very first screen of the login page** — so confirm the wording is what you want to publish.

The page lives in the **Platform Settings** area: click **Platform Settings** in the top bar, then **Platform Settings** under the **Platform** group.

## Before you start

- You need a **system administrator** account.
- Prepare a logo no larger than **3 MB**. Uploads can be cropped 1:1 to a 512×512 output.

## Page layout

Two cards, each with **its own OK button** — save the card you edited:

| Card | What it controls |
| --- | --- |
| Title and Logo | Platform title, subtitle, copyright holder, logo |
| Platform top bar configuration | Default language, document entry, theme switch, language switch |

![Platform Settings: the Title and Logo card (logo, title, subtitle, copyright holder) and the top-bar configuration card](/assets/screenshots/boss/settings-platform-01.png)

## Set the title and logo

1. In the **Title and Logo** card fill in:

   | Setting | How to fill it | What changes |
   | --- | --- | --- |
   | Logo | Upload an image up to **3 MB**; croppable 1:1 | The favicon and the logo on the login page and top bar |
   | Platform title | **Required**, cannot be blank, for example `Xiaoshi Cloud` | Browser tab, top-bar title and the large login-page heading |
   | Subtitle | Optional, for example `Unbounded by design` | Shown on the login page and under the sidebar title |
   | Copyright holder | Optional, for example `Example Technology Ltd.` | Used by the portal and the About page; **left empty means nothing is shown** |

2. Choosing a logo file **uploads it immediately**. The image URL is stored, but the configuration is not saved yet.

3. Click **OK** at the bottom of the card to store the title, subtitle, copyright holder and logo together.

:::tip Uploading a logo is two steps
The upload only puts the file on the server. **You must click OK as well** before the platform starts using it.
The cropper keeps a 1:1 ratio, so the image is not stretched.
:::

## Configure the top bar

In the **Platform top bar configuration** card:

| Setting | How to fill it | What changes |
| --- | --- | --- |
| Default language | Dropdown, **required** | The language used the first time a user opens the platform |
| Show document entry | Switch, on by default | Turning it off removes the **Docs** button from the top bar |
| Document URL | Text, for example `https://docs.example.com` | Where the **Docs** button points; only shown while the entry above is on |
| Show theme switch | Switch, on by default | Turning it off prevents users from switching between light and dark mode |
| Enable language switch | Switch, on by default | Turning it off removes the language switcher from the top bar and login page |

- **Document URL** only appears while **Show document entry** is on; turning it off hides the field too.
- Click **OK** on this card to save.

:::warning Check the default language before hiding the switcher
With the language switch off, every user is stuck with **Default language**. If that is not their language, there is no other option. Confirm the default before turning the switch off.
:::

## The sign-up switch is not here

"Allow self-service sign-up" used to live on this page and has moved to Authentication policy:

1. Click **Account Center** in the top bar.
2. Go to **System Management → Authentication policy**.
3. Click **Edit** on **Login and signup** and turn on **Allow signup**.

See [Authentication Policy](/boss/iam/authentication-policy).

## Verify the result

- A successful save shows "**Update succeeded, please refresh the page**".
- **Refresh the browser**; the new title, logo, subtitle and entries appear.
- Open the login page: the title, subtitle and logo should match what you set, and the **Docs** button should be gone after you disable that entry.

## FAQ

| Symptom | Likely cause | What to do |
| --- | --- | --- |
| Nothing changed after saving | The value is stored but this page still holds old data | Refresh the browser |
| Upload fails | The image exceeds 3 MB | Use a smaller file; this limit is wider than the 1 MB used by sub-product settings |
| Changing the title also changed other products | It did not — this is the platform-level title | If a sub-product title also changed, you edited the wrong page |
| Cannot find "allow self-service sign-up" | It moved to Authentication policy | **Account Center → System Management → Authentication policy** |
| The Docs button disappeared | "Show document entry" is off | Turn it on and save |

## Related

- [AI Platform Settings](/boss/settings/rune)
- [Moha Hub Settings](/boss/settings/moha)
- [Gateway Settings](/boss/settings/chatapp)
- [Authentication Policy](/boss/iam/authentication-policy)
