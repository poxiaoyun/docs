---
title: 'Rune intelligent computing platform'
updated: '2026-09-12'
author: Rune Docs Team
description: 'Start here: what the Rune platform does, what each sidebar menu is for, and which page a first-time user should open first.'
tags:
  - rune
  - overview
---

# Rune intelligent computing platform

Rune is one AI workbench that strings together "prepare models and data → train and tune → deploy as a service → hand it to your team".
After signing in you only need a browser: menus are on the left, and the top bar has two selectors — **Region** (which data center to use) and **Workspace** (which office to use).
Everything you create on the platform is called an **instance**, and every instance is created the same way: pick a template, fill in a few fields, click **Confirm**.
Read this page to learn what each menu does and where a first-time user should click first.

:::tip Rune in one line
Think of Rune as an AI factory: the region is the factory site, the workspace is a workshop, a template is a standard work instruction,
and an instance is a production line you start by following that instruction.
:::

## Sidebar menu at a glance

Listed in the real top-to-bottom order of the left sidebar:

| Menu item | What it helps you do | Which page to read |
| --- | --- | --- |
| **Home** | See at a glance how many instances the current workspace has, how much resource is used, and whether anything is wrong | [Home](/rune/console/dashboard) |
| **Marketplace** | Browse every template the platform offers and deploy one directly | [Marketplace](/rune/console/app-market) |
| **Workbench → Inference** | Turn a model into a service that others can call | [Inference](/rune/console/inference), [Run your first inference](/rune/guide/inference) |
| **Workbench → Traning&Fine tuning** | Take an existing model and train it with your own data so it fits your business better | [Training & Fine-tuning](/rune/console/finetune) |
| **Workbench → Runebox** | Open an online development environment with accelerators (SSH / VSCode / remote desktop) | [Development](/rune/console/devenv) |
| **Workbench → Apps** | Deploy general applications, for example your own web service | [Apps](/rune/console/app) |
| **Workbench → Templates** | Save a tuned configuration as a template and reuse it with one click | [Templates](/rune/resources/templates) |
| **Workbench → Storage** | Create a reusable network disk for model files and datasets | [Storage](/rune/console/storage) |
| **Observability → Metrics** | Deploy an experiment tracking service to record and compare training data | [Metrics](/rune/console/experiment) |
| **Observability → Logs** | Search an instance's runtime logs by time and keyword | [Logs](/rune/console/logging) |
| **Observability → Evaluations** | Deploy an evaluation service to score your models | [Evaluations](/rune/console/evaluation) |

:::info Some menus may be hidden from you
The **Workbench** and **Observability** groups are shown only to the tenant roles **Administrator** and **Developer**.
If you can only see **Home** and **Marketplace** after signing in, your role is a regular member — ask your tenant administrator to adjust your permissions.
:::

## First steps for a new user

1. Read [Prerequisites](/rune/guide/prerequisites) first to confirm your account, role, region, and workspace are ready.
2. Then read [Create Workloads](/rune/guide/workloads) to understand the workload types and which one to pick.
3. Finally follow [Run your first inference](/rune/guide/inference) to turn a model into a service yourself.

## Three contexts you cannot avoid

| Term | Plain explanation |
| --- | --- |
| Tenant | Your company's own account space; other companies cannot see into it |
| Region | A data center building — choosing one means choosing whose machines you use |
| Workspace | One office inside that building; colleagues in the same office share its instances and files |
| Instance | The actual "machine" you create — inference services, fine-tuning jobs, and development environments all count |

## Related

- [Getting Started](/rune/guide)
- [Rune Console](/rune/console)
- [Resources & Quotas](/rune/resources)
- [AIRouter](/airouter)
