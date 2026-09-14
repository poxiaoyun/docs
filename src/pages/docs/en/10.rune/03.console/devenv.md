---
title: 'Development'
updated: '2026-09-14'
description: 'Open a browser-based dev environment, get into it from the console, and understand the difference between stop, restart, and delete.'
tags:
  - rune
  - console
---

# Development

A dev environment gives you **a machine with tools, opened in your browser**: the page is Jupyter or a similar online IDE where you can write code, run scripts, and debug models. When you need a command line you can open a terminal, or connect remotely from your own VS Code. This page covers how to create it, how to get into it, and how stop, restart, and delete actually differ.

:::tip How a dev environment differs from inference and fine-tuning
An inference service "stays open and serves requests", a fine-tuning job "runs and finishes", and a dev environment is "a machine you sit down at and use". It is still an instance, just meant for interactive work.
:::

## Before you start

- Your tenant role must be **Administrator** or **Developer**.
- Pick your **region** and **workspace** in the upper-left corner first.
- If you want code and large files to survive after the instance stops, create a **Storage** volume first, see [Storage](/rune/console/storage). Without a mounted storage volume, the files inside disappear with the instance.
- To connect from VS Code, have your SSH public key ready.

## Create a dev environment

Creation follows the same path as other workloads: list page → template picker → deploy form. Start on the list page:

![Development Service list: the create button sits in the top-right corner](/assets/screenshots/rune/devenv-01.png)

This workspace has no dev environments yet, so the footer reads "0 of 0". Once instances exist, each row shows the name, environment, resource flavor, status, connection method, creator and creation time.

1. In the left **Workbench** group, click **Runebox**.
2. Click **Create Runebox** at the top right to open the template selection page.

![Development template picker: one card per template with a framework tag, a version dropdown and a Deploy button](/assets/screenshots/rune/devenv-02.png)

3. Pick a dev environment template (for example a Notebook template with Jupyter), confirm the **Version**, and click **Deploy**.
4. Fill in the basic information:

   | Field | What to enter | Notes |
   | --- | --- | --- |
   | Name | For example `my-dev` | Required, for display only; the ID below is generated to match |
   | ID | Generated automatically by default | Click the pencil icon to customize it; cannot be changed after creation |
   | Description | For example "for algorithm debugging" | Optional |

5. Fill in the template parameters. Taking the Notebook template as an example:

   | Field | What to enter | Notes |
   | --- | --- | --- |
   | Resource Spec | Choose a CPU / memory spec | Required |
   | Access Password | Your own, or leave it empty | If left empty, a random 24-character password is generated; **save it right after deployment** |
   | Authorized Users | Select one or more SSH public keys of tenant users | If you select none, no external SSH entry is created, so VS Code remote connection is not available |
   | Storage | Select an existing storage volume | Mounted into the working directory; if left empty a temporary directory is used and **its files are cleared when the instance ends** |

6. Click **Confirm** at the bottom to submit.

:::warning Do not let your work disappear with the instance
Without a **Storage** volume, the Notebook uses a temporary directory, and its files are cleared when the instance stops or is deleted. If you have code or data worth keeping, be sure to select a storage volume.
:::

## Get in from the console (Web IDE / Jupyter / terminal)

Once the instance status becomes **Running** or **Healthy**, there are three ways in.

### Option 1: web IDE (recommended for beginners)

1. In the **Connection** column of the **Runebox** list, or in the access address area of the detail page, click **Access**.
2. A new browser tab opens the instance's web interface, for example JupyterLab, where you write code and run cells directly.
3. If the template set an **Access Password**, enter it as prompted. For an auto-generated password, use the string you recorded at deployment time.

### Option 2: container terminal (when you need a command line)

1. Open the instance detail page and find the container group list in **Overview**.
2. On the row of the container you want, click **Terminal**. A command line window opens in the page where you can run commands directly.

### Option 3: VS Code remote connection (with VS Code installed locally)

1. In the **Connection** column, click **Connect VSCode**, or choose **Use VSCode** in the dropdown; your local machine starts the remote connection automatically.
2. If you prefer not to open it automatically, choose **Copy SSH Command** and paste the command into a terminal.
3. When the instance exposes several SSH addresses, the dropdown lists options for each address separately.

:::tip Two things to check when you cannot connect
First, whether the instance **Status** is Running or Healthy (the buttons are greyed out until it is ready). Second, whether you selected your SSH public key under **Authorized Users** at creation time; without it there is no SSH entry.
:::

## How stop, restart, and delete differ

You operate an instance from the row action menu in the list or the **Actions** menu on the detail page. The three differ a lot, so do not click the wrong one:

| Action | What happens | Is data lost | When to use it |
| --- | --- | --- | --- |
| Stop | Releases compute resources and stops billing; the instance stays in the list | Files on a mounted storage volume survive; the temporary directory is lost | You will not use it for a while and want to save resources |
| Start | Allocates resources again and runs the instance | Not affected | To continue using a previously stopped instance |
| Delete | After a second confirmation, removes the instance and its related resources for good | **Cannot be undone**, except for files in a storage volume | When you are sure you no longer need it |

:::tip How do I "restart"?
There is no separate **Restart** button. To restart, click **Stop**, wait until the status becomes **Paused**, then click **Start**.
:::

:::warning Deletion is irreversible
Deleting releases both the compute resources the instance occupies and its related resources, and cannot be undone. Data is safe only if it lives in a mounted storage volume, so check before you delete.
:::

## Confirm it worked

- The instance appears in the list, and its **Status** changes from Pending / Installing to **Running** or **Healthy**.
- The **Connection** column shows **Access** or **Connect VSCode**, which means the instance is ready.
- Clicking **Access** opens the web interface, which means the dev environment is usable.

## FAQ

| Symptom | Likely cause | What to do |
| --- | --- | --- |
| The connection buttons are greyed out | The instance is not ready yet, or it was stopped | Wait until the status becomes Running, or click **Start** first |
| There is no SSH / VS Code entry | No **Authorized Users** were selected at creation time | Redeploy and select your SSH public key |
| The web interface asks for a password | The template set an access password | Use the password you entered; for an auto-generated one, find your deployment record |
| Files inside the instance are gone after a restart | No storage volume was mounted, so a temporary directory was used | Redeploy and mount a **Storage** volume |
| I stopped it and want to continue | Stopping only releases resources and does not delete the instance | Click **Start** in the list or on the detail page |

## Related

- [Storage](/rune/console/storage)
- [Inference Service](/rune/console/inference)
- [Training and Fine-tuning](/rune/console/finetune)
- [App Instances](/rune/console/app)
