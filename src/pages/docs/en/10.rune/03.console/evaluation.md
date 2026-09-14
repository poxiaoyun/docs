---
title: 'Evaluation Management'
updated: '2026-09-14'
description: 'Create a model evaluation task in the console, read its status, and find where the results are.'
tags:
  - rune
  - console
---

# Evaluation Management

**Evaluation Management** is the instance type in the Rune console dedicated to running **model evaluation tasks**. It takes an evaluation dataset, tests the model with it, and gives you a score, helping you decide "is this model good enough, and did switching versions make it better".

Evaluation tasks are also created from templates: which abilities are tested and which metrics are reported depend on the evaluation template you pick.

:::tip What evaluation is
Think of it as "arranging an exam for the model": the evaluation dataset is the exam paper, the evaluation framework is the grader, and the metrics are the score.
:::

## Before you start
- Role: your tenant role must be **Administrator** or **Developer**, otherwise the **Evaluation Management** menu is not shown on the left.
- Context: pick your **cluster** and **workspace** at the top of the page first.
- Template: the cluster must have evaluation templates.

## Where to find it
1. In the left menu, find the **Observability** group.
2. Click **Evaluations** to open the evaluation task list.

![Evaluation task list: the create button sits in the top-right, and an empty list reads "No data"](/assets/screenshots/rune/evaluation-01.png)

Evaluation tasks are instances too, so the columns are the usual ones — name, evaluation engine, resource flavor, status, access, creator and creation time — except that the engine column carries the template name.

## Create an evaluation task
1. Click **Create Evaluations** at the top right of the list.
2. On the template page, choose an evaluation template and its version.

![Evaluation template picker: one card per template with a framework tag, a version dropdown and a Deploy button](/assets/screenshots/rune/evaluation-02.png)

3. Fill in the basic information, then the template parameters (for example the model path, the evaluation dataset, and the batch size; whether a GPU is needed is also determined by the template). You can switch between form and JSON modes while filling them in.
4. Submit, then go back to the **Evaluation Management** list and wait for the task to run.

> The concrete fields of the basic information and template parameters come from the template you select, and the page marks which ones are required in real time.

## How to read the evaluation list
| Column | Description |
| --- | --- |
| Name | Task name; click to open the detail page |
| Framework | Which evaluation template this task uses |
| Resource Spec | CPU, memory, and accelerators it occupies |
| Status | Running state, see the table below |
| Access | Quick access buttons such as Web and SSH |
| Creator | Who created it |
| Created At | When the task was created |

Common statuses:

| Status | Meaning |
| --- | --- |
| Pending | Queued, or the image is still being pulled |
| Installing | Starting the evaluation |
| Running / Healthy | Evaluating, or already ready |
| Succeeded | The task finished; if some samples failed, it shows "Completed with failures" |
| Paused | Manually stopped |
| Processing failed | Something went wrong; check the **Logging** tab for the reason |
| Deleting | Being deleted |

Hovering over or selecting a row also gives you **Start**, **Stop**, **Edit**, and **Delete** in the row action menu.

## Where to find the evaluation results
The results are produced by the evaluation framework you selected. The usual entry points are:

| What you want to see | Where to go |
| --- | --- |
| Web report | Click the Web icon in the **Access** column of the list, or use the access area on the detail page |
| Command-line output directory | In **Overview** on the detail page, open a container terminal from the container list |
| Runtime logs | The **Logging** tab on the detail page |

:::tip Benchmarks and metrics come from the template
The platform itself does not ship a fixed list of evaluation benchmarks. Which datasets you can run and which metrics are reported depend on the evaluation template you choose; go by the template's description and the fields on the page.
:::

## What the detail page can do
Click a task name to open the detail page. It has four tabs at the top:

| Tab | Content |
| --- | --- |
| Overview | Basic information card and container list |
| Monitoring | Instance resource monitoring panel |
| Logging | Instance runtime logs |
| Events | System event stream for troubleshooting scheduling, mounting, and similar problems |

The **Actions** menu at the top right contains **Edit**, **Start**, **Stop**, **Scale**, and **Delete**. Deletion cannot be undone and asks for a second confirmation first.

## Confirm it worked
In the **Evaluation Management** list you can see the new task, and once its **Status** becomes Running or Succeeded the evaluation is running or has finished. If the status is Processing failed, open the **Logging** tab to locate the cause.

## FAQ
| Symptom | Likely cause | What to do |
| --- | --- | --- |
| The status stays Pending | Not enough resources, or the image is still being pulled | Wait a few minutes, or check the **Events** tab for hints |
| The status is Processing failed | Wrong parameters or data path | Open the **Logging** tab and read the error lines |
| No benchmarks are visible | This template does not provide that ability | Switch to another evaluation template |
| The task is missing after creation | The context switched to another cluster or workspace | Check the cluster and workspace at the top of the page |

## Related
- [Metrics](/rune/console/experiment)
- [Logs](/rune/console/logging)
- [Create Workloads](/rune/guide/workloads)
