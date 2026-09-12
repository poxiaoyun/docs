---
title: 'Moha Repository'
updated: '2026-09-12'
description: 'Moha Repository user documentation for model, dataset, image and Space collaboration, covering the home page, repository browsing, collaboration, file management and settings publishing.'
tags:
  - moha
  - overview
---

# Moha Repository

Moha Repository is the AI asset collaboration center within the platform, used for unified management of models, datasets, images and Spaces. It also provides a personal home page, organization space, repository details, file browsing, discussion collaboration and repository settings, supporting both resource discovery and team collaboration.

## Current product information architecture

Based on the front-end implementation, the main Moha entrances are:

| Module | Purpose | Typical entry |
| --- | --- | --- |
| Home page and personal workbench | View recommended resources, announcements, access tokens, resources I created and resources I liked | `/moha/home` |
| Model repository | Browse and maintain model resources | `/moha/models` |
| Datasets | Browse and maintain dataset resources | `/moha/datasets` |
| Image repository | Manage image resources | `/moha/images` |
| Space workspace | Browse and deploy interactive application resources | `/moha/spaces` |
| Organization space | Browse the resources of an organization from a team perspective | `/moha/organizations/:organization` |
| Collaboration | View content, files, freezes, discussion and settings | `/moha/repository` |

## Typical workflow

1. Sign in and open the Moha home page to review recommended resources and platform announcements.
2. Enter a personal or organization view and locate the model, dataset, image or Space you want to manage.
3. Create a new repository and fill in the alias, description, visibility and member permissions.
4. Maintain files, start discussions, update the README or configure members in the repository details.
5. Space resources can be deployed and linked to Rune for delivery.

## Recommended reading

- [Quickstart](/moha/quickstart)
- [Home page and personal workbench](/moha/home)
- [Resources created by me](/moha/home/created-by-me)
- [Liked by me](/moha/home/liked-by-me)
- [Model repository](/moha/models)
- [Datasets](/moha/datasets)
- [Image repository](/moha/images)
- [Space workspace](/moha/spaces)
- [Repository detail page structure](/moha/repository/detail)
- [Freezes](/moha/repository/freezes)
