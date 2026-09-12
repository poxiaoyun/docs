---
title: 'Getting Started'
updated: '2026-09-12'
description: 'From account and workspace preparation, to creating a first workload from a template, to registering an inference service with the gateway.'
tags:
  - rune
  - getting-started
---

## Overview

Rune has no separate "workload" resource and no command-line tool. Every object you create is an **Instance**, distinguished by `category` (inference, fine-tuning, dev environment, application, experiment, evaluation). Deployment is uniform: pick a product template (Helm Chart), then fill a form generated from the template's JSON Schema.

## Chapter Navigation

1. [Environment preparation](./01.prerequisites) — confirm account, tenant, cluster, workspace, and quota
2. [Create workload](./02.workloads) — understand the template-driven model and create a first instance
3. [Inference hosting](./03.inference) — register an inference instance with the gateway

## Entry Points

| Entry | Front-end path | Description |
| --- | --- | --- |
| App Market | `/rune/app-market` | Browse all available templates |
| Product list | `/rune/products/:category` | Templates by category (`inference` / `tune` / `im` / `app` / `experiment` / `evaluation`) |
| Instance list | `/rune/tenants/:tenant/clusters/:cluster/workspaces/:workspace/<category>s` | Existing instances such as `.../ims` |
| Dashboard | `/rune/dashboard` | Resource and workload overview for the current workspace |
