---
title: 'Rune Console'
updated: '2026-10-21'
description: 'Using Rune for the first time? Learn the whole sidebar, the Region and Workspace selectors, and the one deployment flow every instance shares.'
tags:
  - rune
  - console
---

# Rune Console

The Rune console is where you use the AI platform in a browser: deploying models as services, running fine-tuning jobs, opening development environments, and installing applications all happen in this interface. This page helps you learn the whole screen: what each sidebar menu does, how **Region** and **Workspace** differ, and why every feature is operated the same way. After reading it you will be able to find the feature you need and deploy your first instance with the shared flow.

:::tip Analogies to build intuition

- A cluster (called **Region** on screen) is like a data center building with many machines inside.
- A workspace is like one office inside that building, shared by colleagues.
- An instance is like a machine opened inside the office from a template — inference services, fine-tuning jobs, and development environments are all instances.
- A **batch inference job** is the exception: it is a batch of data sent through the workshop, so it does not occupy an office and finishes on its own.

:::

## Before you start

- Sign in first and select a tenant.
- **Home** and **Marketplace** are open to all members; the **Workbench** and **Observability** groups require your tenant role to be **Administrator** or **Developer**.
- Before using any feature, confirm that **Region** and **Workspace** are selected in the top-left of the page.
- The tenant must also have **enabled the current cluster**; otherwise the content area is replaced by an activation notice (see [Prerequisites](/rune/guide/prerequisites)).

![Console overview: region and workspace selectors, three sidebar groups, alerts bell on the right](/assets/screenshots/rune/console-01.png)

Both selectors are global: switching the **region** swaps the pool of machines, and switching the **workspace** swaps the office. The **quota** card on the home page reports the current workspace's usage, so the numbers change with the selector.

## First, get to know the two selectors at the top

There are two selectors in the top-left of the page, and the data on every page follows them:

| Selector | Plain explanation | What happens when you switch |
| --- | --- | --- |
| Region | A data center; decides which batch of machines is used | The available compute and workspaces change with it |
| Workspace | A resource boundary inside the tenant; members share its quota, storage, and instances | Every list on the left refreshes to that workspace; instances in different workspaces are invisible to each other |

- After switching **Region**, Rune automatically selects the first workspace under that region.
- After switching **Workspace**, every list in the left sidebar refreshes to the resources of that workspace.

:::tip Not being able to switch inside a detail page is normal
When you open an instance detail or a storage volume detail, these two selectors become unclickable to prevent accidental switching. To switch to another workspace, go back to a list page first.
:::

## Sidebar structure

The left navigation after signing in is split into three groups, 12 items in total:

| Group | Menu items | Purpose |
| --- | --- | --- |
| Home | Home, Marketplace | See the current workspace's assets and browse ready-made templates |
| Workbench | Inference, Batch inference, Training & Fine-tuning, Runebox, Application Instances, Presets, Storage | Deploy and manage your instances and data |
| Observability | Metrics, Logs, Evaluations | Watch training curves, search runtime logs, evaluate models |

Workbench and Observability require your tenant role to be **Administrator** or **Developer**.

:::info Why do I not see Batch inference
**Batch inference** is shown only where the deployment enables it; some environments ship with it turned off. Missing it does not affect anything else.
:::

## What else is in the top bar

Besides the two selectors, the top-right holds an **alerts bell**: it shows a red dot and a count when something is unread, and opens the alert inbox where you can switch between all and unread, mark one or all as read, and delete messages. See [Alerts](/rune/console/alerting).

## Every instance looks the same

Whatever you deploy, the platform calls it an **instance** and only the type differs:

| Menu | What you can use it for |
| --- | --- |
| Inference | Deploy a model as an online service that others can call |
| Training & Fine-tuning | Take an existing model and train it further so it fits your business better |
| Runebox | Open an interactive development environment with Jupyter / VSCode |
| Application Instances | Deploy general applications, such as a web UI or a utility service |
| Metrics | Deploy an experiment tracking service to record training curves |
| Evaluations | Deploy an evaluation service to score your models |

Because they share one model, the operations are completely consistent. Once you can deploy an inference service, the other types only add a few of their own parameters.
**Batch inference** is not in this table: it submits jobs, not instances.

## The shared four steps for deploying anything

1. Click the corresponding feature in the left sidebar, for example **Inference**.
2. Click the **Create …** button in the top-right (for example **Create Inference**) to open the template picker.
3. Pick a template, confirm the **Version**, and click **Deploy**; you can also pick a template in the **Marketplace** first and click **Deploy**.
4. Fill in the basic info and parameters, then click **Confirm** to submit.

:::tip What you fill in is decided by the template
Apart from fixed items such as "Name, Description", the other parameters all come from the chosen template. Different templates ask for different things, so do not carry one page's field list over to another template.
The parameter card's top-right corner offers **default values** and a form / JSON switch.
:::

## What the instance detail page shows

Click an instance name in a list to open its detail page; all types share the same page:

| Tab / menu | Content |
| --- | --- |
| Overview | Basic info and the pod list; application instances also add a storage volume list |
| Resources | A resource relationship graph for this instance |
| Monitoring | Resource usage curves for the instance |
| Logging | The instance's runtime logs |
| Events | The system event stream, used to diagnose failures |
| Image snapshots | Runebox only; saves the current environment as an image |
| Alerts | Alert rules and alert history for this instance |
| **Refresh** in the top-right | Pull the current page's data again immediately |
| **Actions** in the top-right | Edit, Start / Stop, Scale, Save as Instance Preset, Delete; **Scale** appears only when the instance has something that can be scaled |

:::warning Deleting clears the resources too
Clicking **Delete** inside **Actions** requires a second confirmation. Deleting an instance also releases the compute and related resources it used, and cannot be undone.
:::

## Confirming the result

- After creating, you can see the instance in the corresponding list, and the **Status** column first shows Pending / Installing, then becomes **Running** or **Healthy**.
- If the status stops at **Processing failed**, open the detail page and check the **Events** and **Logging** tabs for the cause.

## Related

- [Home](/rune/console/dashboard)
- [Batch inference](/rune/console/batch-inference)
- [Presets](/rune/resources/presets)
- [Tenant Clusters](/rune/console/tenant-clusters)
- [Marketplace](/rune/console/app-market)
- [Inference](/rune/console/inference)
- [Training & Fine-tuning](/rune/console/finetune)
- [Runebox](/rune/console/devenv)
- [Application Instances](/rune/console/app)
- [Storage](/rune/console/storage)
- [Alerts](/rune/console/alerting)
- [Create Workloads](/rune/guide/workloads)
