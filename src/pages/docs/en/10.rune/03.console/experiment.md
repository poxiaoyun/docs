---
title: 'Metrics'
updated: '2026-09-14'
description: 'Deploy an experiment tracking service in the console, get its access address, and record training metrics into it.'
tags:
  - rune
  - console
---

# Metrics

**Metrics** is the instance type in the Rune console dedicated to running **experiment tracking services**, most commonly tools like MLflow. While you train a model, you record each run's parameters, metrics, and model files into it, and afterwards you can compare the results of different runs on one web page.

When you finish this page you can do three things: **deploy a metrics service**, **get its access address**, and **record metrics into it during training**.

:::tip What a metrics service is
Think of it as the "record book server" of a lab: the training job does the writing, and it does the storing and displaying.
:::

## Before you start
- Role: your tenant role must be **Administrator** or **Developer**, otherwise the **Metrics** menu is not shown on the left.
- Context: pick your **cluster** and **workspace** at the top of the page first.
- Template: metrics services are created from templates, and which one you can deploy depends on which metrics templates your cluster has.

## Where to find it
1. In the left menu, find the **Observability** group.
2. Click **Metrics** to open the metrics service list.

![Metrics service list: the create button sits in the top-right, and an empty list reads "No data"](/assets/screenshots/rune/experiment-01.png)

A metrics service is an instance like any other, so the columns match: name, metrics service, resource flavor, status, access, creator and creation time.

## Deploy a metrics service
1. Click **Create Metrics** at the top right of the list.
2. The page jumps to the template selection page; pick a metrics template and its version.

![Metrics template picker: one card per template with a framework tag, a version dropdown and a Deploy button](/assets/screenshots/rune/experiment-02.png)

3. Fill in the basic information, then the template parameters. The parameters depend on the template, and you can switch between form and JSON modes while filling them in.
4. Submit, then go back to the **Metrics** list and wait for the deployment to finish.

> The concrete fields of the basic information and template parameters come from the template you select, and they may differ between templates. The page marks which ones are required in real time.

## How to read the metrics service list
| Column | Description |
| --- | --- |
| Name | Instance name; click to open the detail page |
| Service | Which template this instance uses |
| Resource Spec | CPU, memory, and accelerators it occupies |
| Status | Running state, see the table below |
| Access | Quick access buttons such as Web and SSH |
| Creator | Who created it |
| Created At | When the instance was created |

Common statuses:

| Status | Meaning |
| --- | --- |
| Pending | Queued, or the image is still being pulled |
| Installing | Being deployed |
| Running / Healthy | Deployed successfully and reachable |
| Paused | Manually stopped |
| Processing failed | Something went wrong; check the **Logging** tab for the reason |
| Deleting | Being deleted |

Hovering over or selecting a row also gives you **Start**, **Stop**, **Edit**, and **Delete** in the row action menu.

## What the detail page can do
Click an instance name to open the detail page. It has four tabs at the top:

| Tab | Content |
| --- | --- |
| Overview | Basic information card and container list |
| Monitoring | Instance resource monitoring panel |
| Logging | Instance runtime logs |
| Events | System event stream for troubleshooting scheduling, mounting, and similar problems |

The **Actions** menu at the top right contains **Edit**, **Start**, **Stop**, **Scale**, and **Delete**. Deletion cannot be undone and asks for a second confirmation first.

## Connect metrics to a training job
Once a metrics service is deployed, some **fine-tuning** templates offer an option in their deployment form for an "experiment tracking address", where you can pick one of your deployed metrics services. Metrics from training are then recorded into that metrics service.

Whether this option appears, and what it is called, depends on the fine-tuning template you choose. See [Training and Fine-tuning](/rune/console/finetune) for details.

## Confirm it worked
Back in the **Metrics** list you can see the new instance, and once its **Status** becomes Running or Healthy the deployment succeeded. At that point click the Web icon in the **Access** column to open the metrics service interface; some templates do not offer a web interface and only provide SSH.

## FAQ
| Symptom | Likely cause | What to do |
| --- | --- | --- |
| The status stays Pending | Cluster resources are temporarily short, or the image is still being pulled | Wait a few minutes, or check the **Events** tab for hints |
| The status is Processing failed | Wrong parameters, or the template does not match the resources | Open the **Logging** tab and read the error lines |
| The Access button does not open | The service is not ready yet, or this template has no web interface | Wait until the status becomes Running; otherwise use SSH |
| The instance is missing after creation | The context switched to another cluster or workspace | Check the cluster and workspace at the top of the page |

## Related
- [Logs](/rune/console/logging)
- [Training and Fine-tuning](/rune/console/finetune)
- [Create Workloads](/rune/guide/workloads)
