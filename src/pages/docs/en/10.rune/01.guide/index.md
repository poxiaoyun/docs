---
title: 'Getting Started'
updated: '2026-09-14'
description: 'A three-step path for new users: prepare your account and resources, learn the workload types, then run one inference end to end.'
tags:
  - rune
  - getting-started
---

# Getting Started

This group of three pages is a single route from zero to a running service. Read them in order and you will be able to create your first workload on Rune on your own.
Even if you have never touched Kubernetes or a large model, do not worry — Rune needs no command line; everything happens by clicking on the page.

:::tip Three steps
Prepare → understand → do it. After these three steps you will own an inference service that you created and that others can call.
:::

## What each of the three pages solves

| Order | Page | What it solves | When to read it |
| --- | --- | --- | --- |
| 1 | [Prerequisites](/rune/guide/prerequisites) | Confirm your account, role, region, workspace, and quota are all in place | On your first sign-in, or when a create button reports an error |
| 2 | [Create Workloads](/rune/guide/workloads) | Understand what inference, fine-tuning, and development environments are, and which to pick | When you want to create something but are unsure which type |
| 3 | [Run your first inference](/rune/guide/inference) | Hand-hold you through deploying a model as a callable service | When you want to run the whole flow once from start to finish |

## One thing to remember first: everything is an instance

In Rune, an inference service, a training and fine-tuning job, a development service, an app instance, a metrics service, and an evaluation service are all the same kind of thing — an **instance**.
Their list pages, creation flow, and detail views are identical; the only differences are which template you pick and which parameters you fill in.

:::info What this means for you
Learn to create any one kind of instance and you can create the others. Step 3 uses an inference service only because its result is the most visible — once deployed you can call it straight from the browser.
:::

![App market: a recommended-template carousel on top, template cards laid out by category below, each deployable straight from its card](/assets/screenshots/rune/app-market-01.png)

**App market** is the second item under the **Home** group and gathers every available template in one page. The per-type instance lists live under the **Workbench** group, where you inspect instances you already created and open a detail page to troubleshoot.

## The two entry points you will use

| Entry point | Where it is | What it is for |
| --- | --- | --- |
| **Marketplace** | The second item in the left sidebar | Browse every available template and deploy one directly |
| Instance lists of each type | The menus under **Workbench** in the left sidebar | View the instances you already created and open a detail page to troubleshoot |

## Related

- [Rune platform overview](/rune)
- [Rune Console](/rune/console)
