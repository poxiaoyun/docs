---
title: 'Storage'
updated: '2026-09-12'
description: 'Manage storage volumes as network drives: create, expand, upload files, and import data from external sources.'
tags:
  - rune
  - console
---

# Storage

A storage volume is a **reusable network drive**. You put model files and datasets into it, then mount it when you create an inference service, a fine-tuning job, or a dev environment. The files inside stay there even after an instance restarts or is deleted. Without a storage volume, files inside an instance disappear together with the instance.

In the **Storage** menu you can do all of this: create a storage volume, check usage, expand it, delete it, and upload files or import data from external sources.

:::tip Why storage volumes exist
Think of a storage volume as a USB drive: the inference service, fine-tuning job, and dev environment are like computers you can swap at any time, but as long as you plug in the same USB drive, your files are still there.
:::

## Before you start
- Role: your tenant role must be **Administrator** or **Developer**, otherwise the **Storage** menu is not shown on the left.
- Context: pick your **cluster** and **workspace** at the top of the page first.
- Storage backend: the cluster must have an available storage class so you can select one during creation.

## Where to find it
1. In the left menu, find the **Workbench** group.
2. Click **Storage**.

## Create a storage volume
1. Click **Create Storage Volume** at the top right of the list.
2. Fill in the form:

   | Field | What to enter | Notes |
   | --- | --- | --- |
   | Name | For example `my-model-files` | Lowercase letters, numbers, and hyphens only; must start and end with a letter or number; up to 63 characters; cannot be changed after creation |
   | Storage Class | Pick one from the dropdown | Determines where files are actually stored; cannot be changed after creation |
   | Capacity | For example enter `20` and select `Gi` | Value must be at least 1; units are `Mi`, `Gi`, `Ti`, default `Gi` |
   | Read & Write Permission | Default **Read & Write** | If you choose **Read-only**, instances that mount it can read but cannot write |
   | Volume Type | Default **Not Set** | Just a classification label; you can pick **Models** or **Datasets** to tell them apart. It does not affect behavior |
   | Description | Optional | One sentence about what this drive holds |

3. Click **Confirm**.

## Confirm it worked
Back in the **Storage** list you can see the new storage volume.

- The **Status** column first shows the creation in progress. Once ready it shows **Unmounted** (not used by any instance yet) or **Mounted** (attached to an instance; hover to see which apps are using it).
- Only a ready storage volume has a **clickable name** that opens its detail page.

## What else the list offers
- Four summary cards at the top: **Usage Rate** (used / total), **Total Volumes** (mounted and unmounted), **Total Files**, and **Storage Type**. These figures are for reference only and depend on whether the storage backend provides statistics.
- A **Only Mounted** switch on the right of the toolbar, which shows only storage volumes currently used by instances.
- Search by name, refresh, and select several rows to **Batch Delete**.

What each list column means:

| Column | Description |
| --- | --- |
| Name | The storage volume name, with a small icon showing the volume type (Models / Datasets); the description is below |
| Status | Unmounted / Mounted; before it is ready, the creation status is shown |
| Storage Cluster | Where the files actually live, that is the Storage Class you chose at creation |
| Usage/Capacity | Used / capacity with a percentage; when usage is high, the **Expand** entry appears here |
| Files | Total number of files inside |
| Read & Write Permission | Read & Write / Read-only |

## Expand: capacity can only grow, never shrink
1. In the **Usage/Capacity** column, click **Expand** (this entry appears only when usage is high).
2. In the **Expand Storage Volume** dialog, fill in:

   | Field | What to enter | Notes |
   | --- | --- | --- |
   | Current Capacity | Read-only, shows today's capacity | — |
   | Target Capacity | A number no smaller than the current capacity | Must be at least 1 |
   | Unit | `Mi`, `Gi`, or `Ti` | May differ from the current capacity unit |

3. Click **Confirm**.

:::warning Capacity can only grow
If the target capacity is smaller than the current capacity, the system blocks it and reports "Storage volume capacity cannot be reduced. New capacity must be greater than or equal to the current capacity". Once created, a storage volume's capacity can only **increase, never decrease**.
:::

## Detail page: Overview / File Manager / Storage Jobs
Click a storage volume name to open its detail page. The top has three tabs: **Overview**, **File Manager**, and **Storage Jobs**. **File Manager** appears only on supported storage volumes.

### Overview
- You can edit **Capacity**, **Read & Write Permission**, and **Volume Type** right here (capacity can still only grow).
- Shows **S3 Accounts**: S3 Endpoint, Bucket, Access Key, and Secret Key, each with one-click copy. The Secret Key is masked by default; click the eye icon to reveal it. With this information you can also read and write this drive from the command line or any other S3 tool.
- On the right you can render a `README.md` from the storage volume. If there is none, it prompts **Create README**; upload a `README.md` and its content appears.

> Only supported storage volumes have S3 accounts and a File Manager. Standard PVC volumes show "Standard PVC volumes do not provide S3 access credentials" and "File management, upload, and preview are not available for standard PVC volumes".

### File Manager
Manage files directly in the browser: open folders, **Upload** (choose files or a whole folder, drag and drop supported), download, delete, preview text and images, and search by file path prefix. A breadcrumb sits at the top; click **Back to parent directory** or **Root** to jump quickly.

:::warning Deleting a file really deletes it
Deleting a file in the File Manager takes effect **immediately and cannot be undone**. Make sure the file is backed up before you delete it.
:::

### Storage Jobs: import data from external sources
**Storage Jobs** download or clone data from external sources **into this storage volume**. Five types are supported: Git, HuggingFace, ModelScope, Moha, and Python Environment.

Click the **Storage Jobs** tab on the detail page to see the jobs for this storage volume. The columns are: Name, Job Type, Repository, Branch, Status, and Updated At. Each row offers **View** (preview the configuration), **Log** (see runtime output), edit, and delete.

#### Create an import job
1. On the **Storage Jobs** tab, click **Create Storage Job** at the top right.
2. In **Job Config**, select the **Job Type**.
3. Fill in the fields for the type you selected.
4. Click **Confirm**. The job name is generated automatically (the storage volume name plus a random suffix), so you do not need to name it.

**Git — clone a code repository**

| Field | What to enter | Notes |
| --- | --- | --- |
| Repository URL | For example `https://github.com/user/repo.git` | Required |
| Branch | Default `main` | Leave empty to pull the default branch |
| Username | Only needed for private repositories | Optional |
| Password or token | Only needed for private repositories | Optional |

**HuggingFace — download a model or dataset**

| Field | What to enter | Notes |
| --- | --- | --- |
| Type | **Model** or **Dataset** | Required, default **Model** |
| HuggingFace Repo | Formatted as `org/repo` | Required |
| HuggingFace Repo Branch | Default `main` | Leave empty to download the default branch |
| HuggingFace Access Token | Only needed for private repos or speed-limited downloads | Optional |

**ModelScope — download from Alibaba Cloud ModelScope**

| Field | What to enter | Notes |
| --- | --- | --- |
| Type | **Model** or **Dataset** | Required, default **Model** |
| ModelScope Repo | Formatted as `org/repo` | Required |
| ModelScope Repo Branch | Default `master` | Note: the default here is `master`, not `main` |
| ModelScope Token | Only needed for private repositories | Optional |

**Moha — download from a Moha platform repository**

| Field | What to enter | Notes |
| --- | --- | --- |
| Type | **Model** or **Dataset** | Required |
| Visibility | **Public**, **Internal**, or **Private** | Required, default **Public** |
| Moha Repo | Pick from the dropdown | Required; the candidates depend on Type + Visibility |
| Moha Repo Branch | Pick from the dropdown | Required; branches appear only after you choose a repository |

**Python Environment — prepare a Python environment inside the storage volume**

| Field | What to enter | Notes |
| --- | --- | --- |
| Reset | **Reset** or **Normal** | Required |
| Requirements | For example `tensorflow==2.5.0;fastapi==0.63.0` | Separate multiple packages with `;`; optional |
| Python Version | Default `3.9` | Required |
| Python Server | A pip mirror address | Optional; defaults to the Aliyun mirror |
| Conda Resource | A conda mirror address | Required; defaults to the Tsinghua mirror |

Job status:

| Status | Meaning |
| --- | --- |
| Pending | Queued |
| Running | Downloading or installing |
| Succeeded | Completed successfully |
| Failed | Something went wrong; click **Log** to see why |
| Deleting | Being deleted |
| Unhealthy | The job is in an abnormal state |

## Delete a storage volume
1. In the list, select one or more storage volumes and click **Batch Delete**; or open the detail page and click **Delete** in the **Actions** menu at the top right.
2. Confirm in the second confirmation dialog as prompted.
3. After you confirm, the storage volume enters "Deleting" and disappears from the list shortly after.

:::warning Deleted means gone for good
Deleting a storage volume also deletes **all files** inside it, and this **cannot be undone**. Back up anything you need somewhere else first.
:::

## FAQ
| Symptom | Likely cause | What to do |
| --- | --- | --- |
| The name does not open the detail page | The storage volume is not ready yet | Wait until the status becomes Unmounted / Mounted, then click |
| There is no File Manager tab | This is a standard PVC volume, which has no web file management | Read and write files from an instance that mounts it |
| Expansion reports "cannot be reduced" | The target capacity is smaller than the current one | Set a value no smaller than the current capacity |
| A job failed | Wrong address or token, or no network access | Open the job **Log** and read the errors line by line |
| Summary card figures are empty | This storage backend does not provide statistics | Go by actual usage and ignore the cards |

## Related
- [Inference Service](/rune/console/inference)
- [Training and Fine-tuning](/rune/console/finetune)
- [Dev Environment](/rune/console/devenv)
- [Quota](/rune/console/quota)
