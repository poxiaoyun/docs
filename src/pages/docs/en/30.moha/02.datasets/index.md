---
title: 'Datasets'
updated: '2026-09-12'
description: 'What datasets do, where to enter them, and which page covers creation, upload, download and maintenance.'
tags:
  - moha
  - datasets
---

# Datasets

Datasets are where Moha keeps **training and evaluation data**. Upload data you have prepared, add an introduction, and anyone on the team can download it instead of passing zip files around in chat.

Datasets use the same repository framework as models, so the way you work with them is almost identical: files, snapshots, discussion and settings.

| Term | What it means |
| --- | --- |
| Repository | A folder that holds a dataset, for example `ai-lab/chinese-qa` |
| Branch | One timeline of the data; the default is `main` |
| Snapshot | A saved photo of the current data state that you can return to at any time |

## Where to enter

Click **Datasets** in the top navigation to open the dataset hub (the list page).

## First time uploading a dataset? Follow these steps

1. Open the home page and click **Created by Me** on the left, then switch to the **Datasets** category.
2. Click **Create Dataset** at the top right, fill in the name and organization, and click **Confirm**, see [Create Datasets](/moha/datasets/create).
3. Open the repository's **File** tab and upload your data files, see [Upload Datasets](/moha/datasets/upload).
4. On the **Dataset card** tab, write the README describing the content, the field meanings and the license, see [Dataset card](/moha/datasets/card).
5. When you need to pin a usable release, create a snapshot on the **Snapshot** tab, see [Dataset Maintenance](/moha/datasets/maintain).

## Pages in this section

| Page | Description |
| --- | --- |
| [Dataset Overview](/moha/datasets/info) | How to search, sort and filter the list, and what the cards show |
| [Create Datasets](/moha/datasets/create) | How to fill in every form field and the rules for the name |
| [Upload Datasets](/moha/datasets/upload) | Three ways to upload: web, Git, SDK |
| [Download Datasets](/moha/datasets/download) | Three ways to download: web, Git, SDK, plus loading directly |
| [Dataset card](/moha/datasets/card) | How to write the introduction and where the right column comes from |
| [Dataset Maintenance](/moha/datasets/maintain) | Append data, roll back, create snapshots |
| [Dataset File Rules](/moha/datasets/rules) | Name rules, directory layout and the platform's size limits |

## Related

- [Models](/moha/models) work almost exactly the same way as datasets.
- [Dataset File Rules](/moha/datasets/rules) lists the hard limits you must know before uploading.
