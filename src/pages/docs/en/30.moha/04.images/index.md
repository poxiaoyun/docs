---
title: 'Mirror warehouse'
updated: '2026-09-12'
author: Rune Docs Team
description: 'What an image is, how it differs from a model or dataset, and where to enter the Images repository.'
tags:
  - moha
  - images
---

# Mirror warehouse

An **image** is a ready-made **runtime environment** that someone (possibly you) has built: a "system disk" with the operating system, Python, drivers and dependencies already installed, ready to boot as is instead of installing everything yourself. The Images repository is where these environments are collected.

Use it to accumulate the base environments needed for training, inference or Space runtime, so colleagues can pull them directly instead of rebuilding the same setup.

:::tip Think of an image as a system disk
Picture the **system disk template** you would use to install an operating system: you boot a machine from it and all the software it needs is already there. When everyone uses the same disk for the same kind of environment, the results match.
:::

## Where to enter

Click **Images** in the top navigation to open the image list page.

## A few terms

| Term | What it means |
| --- | --- |
| Image | A packaged runtime environment you can pull and run directly |
| Tag | The version of the environment, for example `v1.0` or `latest` |
| Image Scan | A check for known security vulnerabilities in this environment |
| Visibility | Who can see it: Public, Internal or Private |

## How it differs from models and datasets

| | Model | Dataset | Image |
| --- | --- | --- | --- |
| What is inside | Trained weights | Training and evaluation data | A complete runtime environment |
| How to take it | Web download, Git, command line | Same | Pull it with `docker pull` |
| Detail page tabs | Card, File, Snapshot | Card, File, Snapshot | Card, **Tags**, Settings |

An image detail page has no File or Snapshot tabs. Instead it has a **Tags** tab, where all versions of the same image live.

## What you can do here

| I want to... | Go to |
| --- | --- |
| Browse which images exist | [Image List & Filters](/moha/images/gallery) |
| See which versions an image has | Open the image and go to the **Tags** tab |
| Check an image for vulnerabilities | Click **Image Scan** on the **Tags** tab |
| Change an image's visibility or description | Open the image and go to the **Settings** tab (needs maintain access) |

## Related

- [Image List & Filters](/moha/images/gallery)
- [Repository detail page structure](/moha/repository/detail)
- [Models](/moha/models)
