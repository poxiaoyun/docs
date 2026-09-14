---
title: 'Moha Repository'
updated: '2026-09-14'
description: 'What Moha is, what you can host on it, where to start, and what repository, version and card mean.'
tags:
  - moha
  - overview
---

# Moha Repository

Moha is the platform's **hosting platform for models and datasets**. Upload a model you trained or a dataset you prepared, add a description, and share it with your team or the whole world. You can also search the hub for other people's work and download it directly.

You do not need to know anything about servers or storage. A few clicks on the page, or one copied command, moves anything from a few hundred MB to tens of GB.

:::tip Think of Moha as a folder
A **repository** is a folder. Every time it changes, the platform saves a snapshot of that folder (called a **version**).
Moha keeps the whole history, so you can always go back to an earlier state.
:::

![Moha home: a personal column on the left (Overview / Created by me / Liked by me / Access token / Announcements), four quick-create entries and the announcements block on top, recommended models below](/assets/screenshots/moha/home-overview-01.png)

The top navigation only has **Home / Models / Datasets / Images / Spaces**; everything else lives in the left column of the home page. In the screenshot the **Recommended models** and **Joined organizations** blocks carry most of the page.

## Learn these words first

| Term | What it means |
| --- | --- |
| Repository | A folder that holds a model or a dataset, named like `ai-lab/qwen2-7b` |
| Version | One saved state of that folder; you can switch back to it at any time |
| Card | The detail page introduction for a repository, so others know what it is and how to use it |
| Git LFS | An extension of Git that moves multi-gigabyte files, which plain Git cannot handle |
| Access token | A pass that replaces your password; the command line and SDK use it to prove who you are |

## What you can do in Moha

| I want to... | Go to |
| --- | --- |
| Find a model someone else built | Top navigation **Models** |
| Find a dataset someone else prepared | Top navigation **Datasets** |
| See what I have uploaded | Left sidebar **Created by Me** |
| Upload local files | The **File** tab of a repository, or the command line / SDK |
| Download a model | **Download Models** at the top right of a model detail page |

## Before you start

- Sign in with your platform account so you can see your own and your private resources.
- To reach a private model or dataset, create an **access token** first, see [Access Tokens](/moha/quickstart/token).
- To transfer files with the command line or SDK, install Git, Git LFS and the SDK on your machine first, see [Upload Models](/moha/models/upload).

## Recommended reading

- [Quickstart](/moha/quickstart/guide)
- [Access Tokens](/moha/quickstart/token)
- [Resources created by me](/moha/home/created-by-me)
- [My Favorites](/moha/home/liked-by-me)
- [Models](/moha/models)
- [Datasets](/moha/datasets)
- [Images](/moha/images)
- [Spaces](/moha/spaces)
- [Repository detail page structure](/moha/repository/detail)
- [Snapshots](/moha/repository/freezes)
