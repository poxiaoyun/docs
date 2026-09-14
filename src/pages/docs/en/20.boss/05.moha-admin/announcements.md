---
title: Announcements
updated: '2026-09-14'
description: Maintain the Moha Hub home page announcements — publish one, edit rich-text content, and set when it starts and stops showing.
---

# Announcements

Announcements are shown in the **Announcements card on the Moha Hub home page**, used to notify all users about things such as maintenance windows, new features and usage rules. Users can click a title to read the full text.

:::tip Where announcements appear

When a user opens the Moha Hub home page, there is an Announcements card on the right listing announcement titles by their valid date; clicking a title pops up the full text. At the bottom of the card there is also a **View All** button that opens the complete announcement list page.

:::

## Before you start

- You need the **System Administrator** role.
- In the left sidebar click **System Settings** → **Announcements**.

## What is on the list

| Column | Meaning |
| --- | --- |
| Title | The announcement title; the search box searches by title |
| Content | The announcement body; the list strips the formatting and truncates it |
| Valid Date | From when it starts showing |
| Invalid Date | Until when it stops showing |

Announcements whose **Invalid Date** has passed are **greyed out entirely**, meaning they no longer show.

## Publish an announcement

1. Click **Add Announcements** in the top right.
2. In the **Announcement Configuration** card fill in:

   | Form item | What to enter | Notes |
   | --- | --- | --- |
   | Title | e.g. `Platform maintenance notice` | Required |
   | Content | e.g. `Upgrading this Sunday 02:00–04:00; the service will be paused.` | Required; a rich-text editor, so you can bold, break into paragraphs and insert links |
   | Valid Date | Pick a date and time | Required; it starts showing from this moment |
   | Invalid Date | Pick a date and time | Required; must be **later than** the Valid Date |

3. Click **Confirm**.

Confirming the result: the page returns automatically to the announcement list, where you can see the record you just published. On the user side, it appears in the Announcements card on the Moha Hub home page once its Valid Date arrives.

:::info

The content cannot be only spaces: the platform strips the formatting first and checks again, and if no text is left it reports that this field is required.

:::

## Edit or delete

- **Edit**: on the target row, click the **⋯** button on the far right → **Edit**, then click **Confirm** when done.
- **Delete**: on the target row, click the **⋯** button on the far right → **Delete**; you can also tick several rows first and use the batch delete above the list. A second confirmation is required before deleting.

:::warning It disappears from the user side the moment you delete it

Deletion cannot be undone, and the announcement currently showing in the Announcements card on the user home page disappears immediately. If you only want to stop showing it for a while, take it offline with the Invalid Date instead.

:::

## When it goes live and when it goes offline

| Moment | What happens |
| --- | --- |
| The **Valid Date** arrives | It appears automatically in the Announcements card on the user home page |
| The **Invalid Date** arrives | It stops showing automatically, and the whole row greys out in the list |
| You want it offline early | Click **Edit**, move the **Invalid Date** to before the current time, then click **Confirm** |

:::info

The **Invalid Date** must be later than the **Valid Date**, otherwise clicking **Confirm** reports "End time must be later than start time" and the save does not go through.

:::

## Common questions

| Symptom | Likely cause | What to do |
| --- | --- | --- |
| It cannot be seen on the user side after publishing | The Valid Date has not arrived, or the Invalid Date has already passed | Check both times and edit them if needed |
| Clicking **Confirm** reports the Invalid Date is wrong | The Invalid Date is earlier than the Valid Date | Move the Invalid Date to after the Valid Date |

## Related

- [Banners](/boss/moha-admin/banners)
