---
title: Banners
updated: '2026-09-12'
description: Maintain the banners at the top of the Moha Hub home page — create one, upload an image, and set its link and active time.
---

# Banners

A banner is shown **at the very top of the Moha Hub home page** and cycles automatically. You can use it to promote an event, announce a new feature, or send users to a particular page.

:::tip What a banner looks like

A large banner image at the top of the home page, switching to the next one every 5 seconds, with small dots in the bottom right you can click. A **title** and a line of **content** can be overlaid on the image; if a **link** is set, clicking the image opens that link.

:::

## Before you start

- You need the **System Administrator** role.
- In the left sidebar click **System Settings** → **Banners**.
- Prepare the image file in advance (a horizontal image around 4:1 is recommended, for example 1600×400).

## What is on the list

| Column | Meaning |
| --- | --- |
| Banner Image | A thumbnail of the image; shows `-` when none has been uploaded |
| Title | The large title overlaid on the image |
| Content | The description overlaid on the image, truncated when too long |
| Link | The address the image opens when clicked; can be opened to preview |
| Valid Date | From when it starts showing |
| Invalid Date | Until when it stops showing |

- The search box searches by **Title**.
- Rows whose **Invalid Date** has passed are **greyed out entirely**, meaning they no longer show.

## Create a banner

1. Click **Add Banners** in the top right.
2. In the **Banner Configuration** card fill in:

   | Form item | What to enter | Notes |
   | --- | --- | --- |
   | Title | e.g. `New model release` | Optional; when filled it is overlaid on the image |
   | Content | e.g. `Try the latest open-source model in one click` | Optional; multi-line text shown below the title |
   | Link | e.g. `https://example.com/activity` | Optional; when filled it must be a complete URL, otherwise saving reports an error |
   | Valid Date | Pick a date and time | Required; it starts showing from this moment |
   | Invalid Date | Pick a date and time | Required; must be **later than** the Valid Date |

3. In the **Banner Image** card upload an image: click the upload area to choose a file, then crop to a 4:1 ratio in the cropping box that appears and confirm.
4. Click **Confirm**.

Confirming the result: the page returns automatically to the banner list, where you can see the record you just created. On the user side, it starts cycling at the top of the Moha Hub home page once its Valid Date arrives.

### Image requirements

| Item | Requirement |
| --- | --- |
| Supported formats | Common image formats such as JPG, PNG, GIF, WebP and APNG |
| Size | Static images are cropped to **4:1** and output 1600 pixels wide; preparing 1600×400 directly is recommended |
| Animation | Animated images such as GIF and APNG keep their animation |
| File size | No more than 3 MB each |

## Edit or delete

- **Edit**: on the target row, click the **⋯** button on the far right → **Edit**, then click **Confirm** when done.
- **Delete**: on the target row, click the **⋯** button on the far right → **Delete**; you can also tick several rows first and use the batch delete above the list. A second confirmation is required before deleting.

:::warning It disappears from the user side the moment you delete it

Deletion cannot be undone, and the banner currently showing on the user home page disappears immediately. If you only want to stop showing it for a while, take it offline with the Invalid Date instead.

:::

## When it goes live and when it goes offline

| Moment | What happens |
| --- | --- |
| The **Valid Date** arrives | It appears automatically in the rotation on the user home page |
| The **Invalid Date** arrives | It stops showing automatically, and the whole row greys out in the list |
| You want it offline early | Click **Edit**, move the **Invalid Date** to before the current time, then click **Confirm** |

:::info

The **Invalid Date** must be later than the **Valid Date**, otherwise clicking **Confirm** reports "End time must be later than start time" and the save does not go through.

:::

## Related

- [Announcements](/boss/moha-admin/announcements)
