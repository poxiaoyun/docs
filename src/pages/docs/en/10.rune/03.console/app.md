---
title: 'Apps'
updated: '2026-09-14'
description: 'Deploy general-purpose apps and understand the extra PVC list this instance type has.'
tags:
  - rune
  - console
---

# Apps

App instances are for **deploying general-purpose applications**: tools with a web interface, internal services, and ready-made apps packaged by others. Like the other features it is an instance, only it behaves more like "a whole application" than "one model service". This page covers how to deploy one and how to read the **PVC List** that other instance types do not have.

:::tip Do not confuse Marketplace with Apps

- **Marketplace** is a shelf of templates. It holds templates made by others and consumes no resources by itself.
- **Apps** are the running entities you deploy from that shelf. They really do consume compute and storage.

Pick from the shelf first, then manage the result in the app list.

:::

## Before you start

- Your tenant role must be **Administrator** or **Developer**.
- Pick your **region** and **workspace** in the upper-left corner first.
- To keep an app's data long term, create a **Storage** volume first, see [Storage](/rune/console/storage).
- Make sure the quota is sufficient, especially if you plan to deploy an app that uses accelerators.

## Deploy an app instance

Start on the list page. This workspace already has one app instance:

![App instance list: each row shows name, app, resource flavor, status, creator and creation time, with the create button in the top-right](/assets/screenshots/rune/app-01.png)

The `test-app` row is **Paused**, meaning it was stopped manually; click **Start** in the row menu whenever you need it running again.

1. In the left **Workbench** group, click **Apps**.
2. Click **Create Apps** at the top right to open the template selection page.

![App template picker: one card per template with a tool tag, a version dropdown and a Deploy button](/assets/screenshots/rune/app-02.png)

3. Pick an app template, confirm the **Version**, and click **Deploy**.
4. Fill in the basic information:

   | Field | What to enter | Notes |
   | --- | --- | --- |
   | Name | For example `my-webui` | Required, for display only; the ID below is generated to match |
   | ID | Generated automatically by default | Click the pencil icon to customize it; cannot be changed after creation |
   | Description | For example "internal trial" | Optional |

5. Fill in the template parameters (see the next section).
6. Click **Confirm** at the bottom of the page to submit.

:::tip You can also deploy in one step from Marketplace
Go to [Marketplace](/rune/console/app-market), find the template you want, open its detail page, choose the **Version**, and click **Deploy**. This jumps straight to the deployment form with the template already filled in, skipping the selection step.
:::

## How to fill in the parameters

App templates vary a lot in what they ask for. The blocks below are the most common ones in general-purpose app templates. **Whether a given field exists depends on the template you pick.**

| Field | What to enter | Notes |
| --- | --- | --- |
| Resource Spec | Choose a CPU / memory / accelerator spec | Required by most templates |
| Image | Pick an image from the image registry, or type an address | For example a public image; private registries also need a username and password |
| Image Pull Policy | Usually leave the default | Controls when the image is pulled again |
| Replicas | Default `1` | Increase it when concurrency is high |
| Protocol + Port | Choose a protocol and enter the port the container listens on | Port range 1–65535, default `80`; this is the port **the app itself listens on**, not an arbitrary number |
| Expose Externally | Turn on if external access is needed | When on, an access entry can be generated for HTTP / gRPC protocols |
| Access Domain | Only when exposing externally | The domain used from outside to reach this app |
| Command / Args | Usually leave empty | Only change it when the image already has a default startup method to override |
| Environment Variables | Add them as `KEY=VALUE` | Configuration values the app needs |
| Storage Mount | Choose a new or existing storage volume | Required when the app must persist data |
| Autoscaling | Off by default | When on, replicas scale automatically with CPU / memory utilization |

:::warning A wrong port makes the app unreachable
The port must match the port the app actually listens on (many apps use `80`, others `8080` and so on). If it is wrong the instance still starts, but clicking **Access** will not open the page. If you are unsure, check the notes on the template detail page first.
:::

## Confirm it worked

Back in the **Apps** list:

1. You can see the instance, and its **Status** column first shows **Pending** or **Installing**, then changes to **Running** or **Healthy**.
2. Click the instance name to open the detail page; the **Overview** tab has basic information, the container group list, and the PVC List.
3. When the app exposes an access entry, the external address appears in the access address area; open it to reach the app.

:::warning What if the status shows "Processing failed"
Common causes are an image pull failure, a wrong port, or insufficient quota. Open the detail page and check **Events** and **Logs**, fix the parameters, and click **Edit** to resubmit. You do not need to delete and recreate the instance.
:::

## What the PVC List is

The **Overview** tab of an app instance has one extra section, the **PVC List**, which lists the persistent storage this app uses. It pairs with the **Storage Mount** you chose in the template: however many volumes you mounted, that is how many appear here, with their names and current status.

To put files in or download files from them, open the file manager of the matching storage volume under [Storage](/rune/console/storage).

## Day-to-day management

From the row action menu in the list or the **Actions** menu on the detail page:

| Operation | Description |
| --- | --- |
| Edit | Change the name, description, and template parameters; changed parameters take effect only after you resubmit |
| Start / Stop | Stopping releases compute resources; click **Start** again to resume |
| Scale | Appears only when the template declares replicas; enter a new replica count and click **Confirm** |
| Delete | After a second confirmation, deletes the instance and releases resources; cannot be undone |

:::warning Confirm your data is backed up before deleting
Deleting an app instance also cleans up its runtime environment, and this **cannot be undone**. Persistent data survives only if it lives in a mounted storage volume.
:::

## FAQ

| Symptom | Likely cause | What to do |
| --- | --- | --- |
| The instance runs but the app will not open | The port does not match the one the app listens on | Edit the parameters to the correct port and resubmit |
| There is no external access address | **Expose Externally** was not turned on, or the protocol is unsupported | Turn on external exposure when editing, and choose an HTTP / gRPC protocol |
| Data in the app is gone after a restart | No storage mount was configured | Choose a storage volume to mount when editing |
| The list has no status filter or batch start/stop | Not provided in the current version | Use name search to locate instances and operate them one by one |

## Related

- [Marketplace](/rune/console/app-market)
- [Storage](/rune/console/storage)
- [Development](/rune/console/devenv)
- [Inference Service](/rune/console/inference)
