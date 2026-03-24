---
title: 'Dataset Management'
updated: '2026-03-23'
---

## Overview

The Datasets module provides Git-based repositories for managing training, validation, and evaluation datasets. Datasets are versioned just like model repositories, ensuring that training runs are reproducible.

## Navigation

**Console → Moha → Datasets**

## Dataset List

![Dataset List](/assets/screenshots/console/moha-dataset-list.png)

Browse all datasets accessible to your account, filtered by:

- **Visibility**: Public / Private
- **Data Type**: Text / Image / Audio / Tabular / Multimodal
- **Task**: Text generation / Classification / QA / etc.

## Creating a Dataset Repository

1. Click **New Dataset**.
2. Fill in the metadata.
3. Click **Create**.

### Configuration Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| Owner | Select | ✅ | Personal namespace or organization |
| Name | Text | ✅ | Repository name |
| Description | Textarea | — | What the dataset contains |
| Visibility | Radio | ✅ | Public or Private |
| License | Select | — | Data license |
| Task Categories | Multi-select | — | Task types this dataset supports |

## Uploading Data

### Via Web UI

1. Go to the dataset repository page.
2. Click the **Files** tab.
3. Click **Upload Files** and drag-and-drop your files.
4. Add a commit message and click **Commit**.

### Via Git CLI

```bash
git clone https://rune.develop.xiaoshiai.cn/moha/username/my-dataset.git
cd my-dataset
# Add your data files
git add .
git commit -m "Add initial dataset"
git push
```

### Supported Data Formats

| Format | Description |
|--------|-------------|
| JSONL | Recommended for instruction tuning datasets |
| CSV | Tabular classification and regression |
| Parquet | Efficient columnar storage for large datasets |
| Plain text | Pre-training corpora |
| Images (ZIP) | Image classification / generation datasets |

## Dataset Card

Each dataset repository can include a `README.md` that serves as the **Dataset Card** — documentation describing the data source, format, intended use, and any limitations.

## Using a Dataset in Fine-tuning

1. Mount a storage volume that contains (or will download) the dataset.
2. In the fine-tuning job configuration, set environment variables to point to the data path.
3. Alternatively, configure the fine-tuning template to pull directly from the Moha Git URL at job start.

## Permissions

| Action | Required Role |
|--------|--------------|
| View public datasets | Anyone |
| View private datasets | Repository members |
| Create / upload | Developer or Admin |
| Delete | Admin or owner |
