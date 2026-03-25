---
title: 'Moha Repository'
updated: '2026-03-24'
author: Rune Docs Team
description: 'Moha Repository user documentation for model, dataset, mirror and Space collaboration, covering homepage, repository browsing, collaborative discussion, file management and settings publishing.'
tags:
  - moha
  - overview
---
#moharepository

Moha Repository is the AI ​​asset collaboration center within the platform, used for unified management of models, datasets, images and Spaces. It also provides personal homepage, organizational space, repository details, file browsing, discussion collaboration and repository setting capabilities, which can be used for both resource discovery and team collaboration.

## Current product information architecture

According to the `xiaoshi-rune-console` front-end implementation, Moha’s main user entrances include:

| Module | Function | Typical entrance |
| --- | --- | --- |
| Home page and personal workbench | View recommended resources, announcements, access tokens, resources I created and my favorites | `/moha/home` |
| Model Repository | Browse and maintain model resources | `/moha/models` |
| Datasets | Browse and maintain dataset resources | `/moha/datasets` |
| Image repository | Manage image resources | `/moha/images` |
| Space workspace | Browse and deploy interactive application resources | `/moha/Spaces` |
| Collaborate | View overview, files, discussions, tags and settings | `/moha/repository` |

## Typical usage process

1. Log in to the Moha homepage to view recommended resources and platform announcements.
2. Enter the personal or organizational view and locate the model, dataset, image or space you want to manage.
3. Create a new resource repository and fill in the alias, description, visibility and member permissions.
4. Maintain files, initiate discussions, update README or configure members in the repository details.
5. Space resources can be further deployed and linked to Rune for delivery.

## Recommended reading

- [Quickstart](/moha/quickstart)
- [Homepage and Personal Workbench](/moha/home)
- [Model Repository](/moha/models)
- [Datasets](/moha/datasets)
- [Image repository](/moha/images)
- [Space workspace](/moha/Spaces)
- [Collaboration](/moha/repository)