---
title: 'Inference Services'
updated: '2026-09-12'
description: 'Deploy a model as an online service from scratch: pick a template, fill in parameters, wait for Healthy, and find the access address.'
tags:
  - rune
  - console
---

# Inference Services

An inference service is **opening a model for business**: once deployed, your model gets an access address that colleagues' programs or applications can call. This page walks you through deploying your first inference service, and tells you where to get the address afterwards, how to tell it succeeded, and where to look when something goes wrong.

:::tip Three analogies

- A template is like a machine assembly list: choose the list and Rune assembles the machine and software for you.
- An instance is a machine assembled from that list; the inference service is this machine.
- A resource spec is how many CPU cores, how much memory, and how many accelerator cards this machine gets.

:::

## Before you start

- Your tenant role must be **Administrator** or **Developer**.
- **Region** and **Workspace** are selected in the top-left.
- If the model files are in your own hands, create a **Storage** volume first and upload the model — see [Storage](/rune/console/storage). Skip this step if you use a platform model or an online model.
- Confirm the current workspace has enough quota, otherwise creation fails.

## Deploy an inference service from scratch

1. In the **Workbench** group in the left sidebar, click **Inference**.
2. Click **Create Inference** in the top-right to open the template picker.
3. Click into an inference template card, confirm the **Version** to use, and click **Deploy**.
4. When the form appears, fill in the basic info first:

   | Field | What to fill | Notes |
   | --- | --- | --- |
   | Name | For example `qwen-chat` | Required and for display; the ID below it is generated from it automatically |
   | ID | Generated automatically by default | Click the pencil icon below the name to customize it; it cannot be changed after creation |
   | Description | For example "customer service Q&A trial" | Optional |

5. Fill in the template parameters (see "How to fill in the parameters" below).
6. Click **Confirm** at the bottom of the page to submit.

:::tip You do not have to use the Inference menu to get an address
You can also pick a template directly in the **Marketplace**: open the template detail, choose the **Version**, and click **Deploy** — the result is exactly the same.
:::

## How to fill in the parameters

Apart from Name and Description, the other fields are **decided by the template**, so different templates look different. Taking the commonly used vLLM inference template as an example, you will see these:

| Field | What to fill | Notes |
| --- | --- | --- |
| Resource flavor | Pick a GPU compute resource flavor | Required. Confirm the quota is enough before choosing |
| Model configuration | Choose a platform model, or type an online model name | Required. Choosing "Local storage" associates the file storage volume you created |
| Model name (required) | For example `qwen-7b` | Required. Clients must send this name when calling |
| API access token | Leave empty or set your own string | Empty means callers need no authentication; if set, the request header must carry this token |
| GPU memory utilization | Defaults to `0.9` | Selectable from 70% to 100%. A higher value improves throughput but may cause OOM |
| LoRA configuration | Off by default | When enabled, mounts shared storage and loads fine-tuning artifacts |
| Scheduled autoscaling | Off by default | Needs cluster support; adjusts the replica count automatically by time window |

:::warning About images and ports
The **image and port of an inference template are preset by the template** and usually do not appear in the deploy form, so you do not need to fill them in. Only a few templates additionally expose "Image settings" or "Network configuration", and only then do you fill them in as the template says.
:::

If you are unsure what a parameter means, click **AI Config Guide** in the top-right of the form; it uses the current template and what you have filled in to explain the key settings, required fields, and the risks to check before deploying. You can also click the icon to switch to JSON mode and edit the underlying parameters directly, but new users are advised to stay in form mode.

## Confirming the result

After submitting, you return to the **Inference** list:

1. The service appears, with the **Status** column first showing **Pending** or **Installing**.
2. When the **Status** becomes **Running** or **Healthy**, the service is available.
3. Click the service name to open the detail page: the **Overview** tab shows the basic info and the pod list, **Monitoring** shows resource curves, **Logging** shows runtime output, and **Events** helps you diagnose failures.

:::tip How long to wait
There is no fixed duration; it depends on how fast the image is pulled and the model is downloaded: small models are quick, and large models load noticeably more slowly the first time. During this period the status stays at Pending / Installing, which is normal — do not submit again.
:::

## Find services in the list and delete them in bulk

Once you have a few services, use the toolbar above the list:

| Control | How to use it |
| --- | --- |
| Search box | Search by **service name / model / template** |
| **Status** | Switch between All / Healthy / Needs attention / Paused |
| **Template** | Show only services deployed from one template |
| **Resource** | Filter by the resource in use |
| **Visibility** | Filter by the service's visibility (for example Public / Tenant only / Private) |

To clean up several at once: tick the checkboxes at the start of the rows, then the toolbar shows a bin icon (**Batch Delete**) — click it and confirm.

:::warning There is no batch start/stop
Bulk actions only support **delete**. Start, stop and scaling are per-service: use that row's action menu, or the **Actions** menu on the detail page.
:::

## Where to get the access address

On the instance detail page, **Endpoints** in **Overview** shows the access address. Addresses fall into three kinds by network scope:

| Kind | Who can reach it |
| --- | --- |
| Cluster network | Only instances inside the cluster |
| Internal network | Reachable from the tenant's internal network |
| External network | Callable from outside |

## Publish the service to the gateway

To let callers reach the model through the unified gateway, click **Publish Service** in the row action menu or the **Actions** menu on the detail page:

1. The instance status must be **Healthy** or **Installed**, otherwise the menu item is greyed out.
2. In the dialog, confirm the **Endpoint** (choose from the instance addresses or type one), and choose the **Visibility** (Public / Tenant / Workspace / Private).
3. If needed, expand the LoRA configuration, choose the engine, and fill in the adapter name and path.
4. Click **Confirm**.

After publishing, the same place becomes **Gateway Configuration** and can be changed at any time; when you no longer want to offer it externally, click **Unpublish**.

:::warning After unpublishing, the outside world cannot call it
After unpublishing, users can no longer access this model through the model gateway. Only do this once you have confirmed no caller depends on it.
:::

## Day-to-day management

In the row action menu or the **Actions** menu on the detail page:

| Action | Notes |
| --- | --- |
| Edit | Change the name, description, and template parameters |
| Start / Stop | Stopping releases compute; click **Start** to resume |
| Scale | Appears only when the template declares replicas; fill in a new replica count and click **Confirm** |
| Save as Task Template | Save the current configuration as a template to reuse in one click |
| Decrypt model | For a deployed encrypted model, enter the decryption password and click **Decrypt** |
| Delete | After a second confirmation, deletes the instance and releases resources; cannot be undone |

:::warning What to do when the status says "Processing failed"
Do not rush to delete and recreate it. Open the **Events** and **Logging** tabs on the detail page; they usually show the specific cause (not enough quota, image pull failure, wrong model path, and so on). Once fixed you can click **Edit** and submit again.
:::

## FAQ

| Symptom | Likely cause | What to do |
| --- | --- | --- |
| Stuck at Pending for a long time | Not enough resource, queued for scheduling | Check the quota, or switch to a smaller flavor |
| Status becomes Processing failed | Wrong parameter, wrong model path, or not enough quota | Check **Events** and **Logging** to locate it |
| Cannot find where to fill in the entry point / port | This template does not expose a port | The port is fixed by the template; once the service is ready, get the link from **Endpoints** |
| You expect batch start/stop but there is no button | Bulk actions only support delete | Start and stop are per-service: the row action menu, or the **Actions** menu on the detail page |

## Related

- [Training & Fine-tuning](/rune/console/finetune)
- [Storage](/rune/console/storage)
- [Marketplace](/rune/console/app-market)
- [Inference Hosting](/rune/guide/inference)
- [Create Workloads](/rune/guide/workloads)
