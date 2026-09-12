---
title: 'Evaluation Management'
updated: '2026-09-12'
description: 'List, creation flow, status enum, and benchmark notes for evaluation tasks.'
tags:
  - rune
  - console
---

# Evaluation Management

Evaluation Management (`category=evaluation`) is used to deploy model evaluation services. As with other categories, evaluation services are created through a template + JSON Schema form; which benchmarks and metrics are supported is determined by the selected template.

List path: `/rune/tenants/:tenant/clusters/:cluster/workspaces/:workspace/evaluations`

## Evaluation Task List

| Column | Description |
| --- | --- |
| Name | Instance name; click to open the detail page |
| Evaluation Framework | The template column, whose i18n key for this category is `evaluation_framework` |
| Flavor | Resource summary resolved from `values.flavor` |
| Status | `status.phase` |
| Access | `ConnectionButtons`, providing quick Web / SSH access |
| Created By | Taken from the labels on the instance |
| Created At | Task creation time |

### Status Notes

`status.phase` values come from `InstanceStatusPhaseEnum` (12 values; see [Creating Workloads](/rune/guide/workloads) for the full list). Common statuses for evaluation instances include `Reconciling`, `Pending`, `Running`, `Healthy`, `Succeeded`, `Failed`, `Unhealthy`, and `Degraded`.

### Access Entry

The evaluation service's Web UI is embedded in the template. The "Access" column in the list and the endpoint area on the detail page provide quick access buttons; the interface style may differ between templates.

## Creating an Evaluation Task

1. Click the **Create Resource** button in the upper-right corner of the list page; it navigates to `/rune/products/evaluation`.
2. Select an evaluation template and version (you can also enter from App Market with one click).
3. Fill in the basic information.

| Field | Required | Description |
| --- | --- | --- |
| `id` | ✅ | Instance ID; cannot be modified in edit mode |
| `name` | ✅ | Display name |
| `description` | — | Description |

4. Fill in the template parameters: rendered dynamically from the version's JSON Schema, with switchable form/JSON modes.

> 💡 Tip: The deployment form has no fixed "Template Version / Flavor / Storage Volume" step. Evaluation parameters (model path, evaluation dataset, batch size, etc.) and whether a GPU is needed are all determined by the selected template's Schema.

## Benchmarks and Metrics

The platform does not ship a built-in benchmark list; the following depends on the template, and different templates usually provide different datasets and metrics:

| Category | Common benchmarks / metrics |
| --- | --- |
| General language ability | MMLU, C-Eval, HellaSwag, ARC |
| Specialized ability | HumanEval, GSM8K, TruthfulQA, BBH |
| Metric types | Accuracy / Top-K, BLEU / ROUGE / METEOR, Pass@K, Exact Match / F1, Toxicity / Bias |

> ⚠️ Note: The table above lists benchmarks and metrics that templates may provide; it is not a built-in console list. The actual available items are determined by the selected template's Schema and documentation.

## Instance Detail

| Tab | Content |
| --- | --- |
| Overview | Basic information card, Pod list |
| Monitoring | Instance monitoring panel |
| Logs | Instance logs |
| Events | Kubernetes event stream |

## Permission Requirements

Evaluation services belong to the Observability group; navigation requires the tenant role to be `ADMIN` or `DEVELOPER`.
