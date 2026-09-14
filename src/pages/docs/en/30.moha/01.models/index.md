---
title: 'Model Repositories'
updated: '2026-09-14'
description: 'What model repositories do, where to enter them, and which page covers upload, download, cards and versions.'
tags:
  - moha
  - models
---

# Model Repositories

Model repositories are where Moha keeps **models**. Upload a model you trained, add an introduction, and share it out. You can also browse what others uploaded and download it in one click or call it online.

One model is one **repository**. A repository holds files, versions, a description and various settings.

## Where to enter

Click **Models** in the top navigation to open the model hub (the model list page).

## First time uploading a model? Follow these steps

1. Open the home page and click **Created by Me** on the left, then switch to the **Models** category.
2. Click **Create Model** at the top right, fill in the name and organization, and click **Confirm**. An empty repository is created for you.
3. Open the repository's **File** tab and upload your model files. For large files use the command line or SDK, see [Upload Models](/moha/models/upload).
4. On the **Model card** tab, write the README so others understand what the model does, see [Model Cards](/moha/models/card).
5. When you need to pin a stable release, create a snapshot on the **Snapshot** tab, see [Model Versions](/moha/models/version).

![The Files tab of a model repository: name, tags and every tab (model card / Files / Snapshots / Discussions / Settings) on top, with Download model, Deploy and Use model at the right](/assets/screenshots/moha/repo-model-file-01.png)

Of the five tabs, **the model card** is what others see first, **Files** is where the files actually live, and **Settings** decides visibility. The three buttons at the top right are Use model, Deploy and Download model.

## Tabs inside a repository

Open any model repository and you will see these tabs at the top:

| Tab | What is inside |
| --- | --- |
| Model card | The README body and the right-hand info column (rating, downloads, model genealogy and so on) |
| File | File list, online preview, commit history, branch switching; uploads happen here too |
| Snapshot | Saved records of a version, where you can view a diff and roll back |
| Discussion & Feedback | Discuss this model with other people |
| Settings | Visibility, members, cover and more; only repository admins can see it |

There are also three buttons at the top right of a repository:

- **Download Models**: opens a dialog with clone and SDK commands.
- **Deploy**: jumps to the compute platform to create an inference service.
- **Use this model**: shows loading examples for Transformers, vLLM and SGLang.

## Pages in this section

| Page | Description |
| --- | --- |
| [Models Overview](/moha/models/intro) | How to search, sort and filter the list, and what the cards show |
| [Download Models](/moha/models/download) | Three ways to download: web, Git, SDK |
| [Upload Models](/moha/models/upload) | Three ways to upload: web, Git, SDK |
| [Model Cards](/moha/models/card) | How to write the detail page and where the right column comes from |
| [Model Versions](/moha/models/version) | Switch branches, create snapshots, roll back |

## Related

- [Datasets](/moha/datasets) work almost exactly the same way.
- [Repository detail page structure](/moha/repository/detail) covers files, discussion and settings in one place.
- [Snapshots](/moha/repository/freezes) explains snapshots in more detail.
