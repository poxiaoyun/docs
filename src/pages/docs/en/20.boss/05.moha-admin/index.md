---
title: 'Moha Repository Management'
updated: '2026-09-12'
description: The platform administrator's console for governing the Moha Hub — models, datasets, images, Spaces and operations content.
tags:
  - boss
  - moha-admin
---

# Moha Repository Management

Moha Hub is the platform's internal "model app store plus cloud drive": users upload the models, datasets, container images and Spaces they build, and can also download content others have made public. This group of pages is the **platform administrator** back office, where you can see every user's content across the whole platform (including the parts that are not public) and govern it.

:::tip How to picture Moha Hub

Think of it as a company-internal "app store plus cloud drive": models and datasets are the goods on the shelves, a container image is a system-disk template for installing an OS, and a Space is an online mini-app someone has built. Users put their own items on the shelf, and administrators keep the shelves in order.

:::

## Before you start

- Your account needs the **System Administrator** role. Ordinary users cannot see this menu group; they can only manage their own content inside their own Moha Hub.
- These pages are spread across four groups in the left sidebar: **Asset Management**, **Data Sync**, **Security Audit** and **System Settings**.

## A few terms first

| Term | Plain explanation |
| --- | --- |
| Moha Hub | The site inside the platform that hosts models and data, where users upload, download and share AI assets |
| Repository | A content unit you can upload, download and version; models, datasets, images and Spaces are all repositories |
| Model | A trained model file package; download it to run inference or continue fine-tuning |
| Dataset | A data file package used to train or evaluate |
| Image registry | Where container images are kept; a container image is a "system-disk template for installing an OS" |
| Space | An online AI app a user has built with code, with its own address; it can be published online or stopped |
| Visibility | Who can see a repository: Public / Tenant Only / Private |
| Organization | The team account that owns content; every repository belongs to an organization |
| Recommendation | A mark an administrator gives a good repository, with a score and a reason; it feeds the recommendation slots on the user side |
| Mirror source | A relay station that pulls ready-made content from HuggingFace and ModelScope into the platform |
| Announcement | Information shown on the Moha Hub home page |
| Banner | The banner image shown at the top of the Moha Hub home page, which can link somewhere when clicked |

## Pages in this group

| Page | What you can do there | Menu location |
| --- | --- | --- |
| [Models](/boss/moha-admin/models) | View, unlist, recommend and delete models across the platform | Asset Management → Models |
| [Datasets](/boss/moha-admin/datasets) | View, unlist, recommend and delete datasets across the platform | Asset Management → Datasets |
| [Images](/boss/moha-admin/images) | View, unlist and delete container images across the platform | Asset Management → Images |
| [Spaces](/boss/moha-admin/spaces) | View, unlist, recommend and delete Spaces across the platform | Asset Management → Spaces |
| [Mirror](/boss/moha-admin/mirrors) | Sync content from HuggingFace / ModelScope into the platform | Data Sync → Mirror |
| [Audit Logs](/boss/moha-admin/audit) | See who did what and when, and export the records | Security Audit → Audit Logs |
| [Announcements](/boss/moha-admin/announcements) | Maintain the announcements on the Moha Hub home page | System Settings → Announcements |
| [Banners](/boss/moha-admin/banners) | Maintain the banners at the top of the Moha Hub home page | System Settings → Banners |

## What you can do

- **See everything**: the four asset management pages list content from every organization on the platform, including repositories set to Private, which ordinary users cannot see on their side.
- **Change visibility (unlist)**: move content that should not be public from Public to Tenant Only or Private, and it disappears from the user side and from search.
- **Set recommendations**: give models, datasets and Spaces a recommendation score and a reason, and they enter the recommendation slots on the user side.
- **Delete**: delete repositories under any organization, and also delete mirror tasks, announcements and banners.
- **Audit and export**: filter the platform-wide operation records by time and other conditions, and export them to a file.

## What you cannot do

- You cannot upload, submit or edit the files inside a repository for a user — uploading and version management happen in the user's own Moha Hub.
- You cannot start, stop or restart instances: runtime control for Spaces and images is not in this group of pages.
- There is no separate "approve / reject" flow; the governance tools are the two categories **change visibility** and **delete**.
- Announcements and banners only control **when something is shown**; they cannot be targeted at a single organization or user.

## Related

- [Moha Hub Settings](/boss/settings/moha) (configure the Moha Hub name and logo)
