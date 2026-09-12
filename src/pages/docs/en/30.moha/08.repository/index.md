---
title: 'Collaboration'
updated: '2026-09-12'
description: 'What each tab does once you open someone else''s repository, and what you can do there.'
tags:
  - moha
  - repository
---

# Collaboration

Models, datasets, images and Spaces are four different kinds of resource, but they all open into **the same page structure**: a row of tabs at the top and the content below. Learn to read one repository and you can read all four.

## How to open a repository

- Click any card on a list page: **Models**, **Datasets**, **Images** or **Spaces**.
- Type a name into the search box on a list page and click the result.
- Open it from **Created by Me** or **My Favorites** on the home page.

Once it opens, the repository name appears at the top, the like count and download count sit in the top right, and the tabs are below.

## Which tabs each resource has

| Tab | Shown for | What you can do here |
| --- | --- | --- |
| Model card / Dataset card / Image card / Overview | All | Read the description and the info panel on the right; Spaces run the app right here |
| File | Models, datasets, Spaces | Browse files, preview content, read the commit history, upload or download |
| Snapshot | Models, datasets, Spaces | Take an archived snapshot of the repository, compare differences, roll back |
| Tags | Images | See image tags and security scan results |
| Discussion & Feedback | Models, datasets, Spaces | Ask questions, leave feedback, and open pull requests for code changes |
| Settings | Only with permission | Change visibility, members, metadata, deploy settings, or delete the repository |

:::tip What a snapshot is
A snapshot is an **archived picture of the repository's current state**. You can roll the repository back to any snapshot at any time, so take one before publishing an important version and you no longer have to fear breaking things. One repository can hold many snapshots.
:::

## The tabs are not the same for everyone

- **File**, **Snapshot** and **Discussion & Feedback** are visible to everyone who can open the repository.
- **Settings** only appears for people with management permission: a system administrator, the repository owner, an organization administrator, or a member granted admin or read-write permission.
- Image repositories have no **File**, **Snapshot** or **Discussion & Feedback**; instead they have the **Tags** tab.

## Common questions

| Symptom | Likely cause | What to do |
| --- | --- | --- |
| The **Settings** tab is missing | Your account has no management permission in this repository | Ask the repository owner or an organization administrator to add you as a member on the settings page |
| An image repository has no **File** | Image repositories manage versions through the **Tags** tab | Go to the **Tags** tab |

## See also

- [Repository detail page layout](/moha/repository/detail)
- [Browsing files and versions](/moha/repository/files)
- [Discussion & feedback](/moha/repository/discussion)
- [Repository settings and publishing](/moha/repository/settings)
- [Snapshots](/moha/repository/freezes)
