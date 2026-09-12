---
title: 'Metrics'
updated: '2026-09-12'
description: 'List, creation, experiment endpoint API, and fine-tuning integration for experiment tracking services.'
tags:
  - rune
  - console
---

# Metrics
Experiment Management (`category=experiment`) is used to deploy experiment tracking services (such as MLflow, Aim, etc.) and view their Web UI. Deployment follows the same approach as other categories: template + JSON Schema form.

List path: `/rune/tenants/:tenant/clusters/:cluster/workspaces/:workspace/experiments`

## Experiment Service List

| Column | Description |
| --- | --- |
| Name | Instance name; click to open the detail page |
| Metrics Service | The template column, whose i18n key for this category is `metrics_service` |
| Flavor | Resource summary resolved from `values.flavor` |
| Status | `status.phase` |
| Access | `ConnectionButtons`, providing quick Web / SSH access |
| Created By | Taken from the labels on the instance |
| Created At | Instance creation time |

Row action menu: start/stop, edit, delete.

## Creating an Experiment Tracking Service

1. Click the **Create Resource** button in the upper-right corner of the list page; it navigates to `/rune/products/experiment`.
2. Select an experiment template and version (you can also enter from App Market with one click).
3. Fill in the basic information (`id` / `name` / `description`).
4. Fill in the template parameters (rendered dynamically from the Schema, with switchable form/JSON modes), then submit.

## Experiment Endpoints and Fine-tuning Integration

The platform provides a dedicated API to obtain experiment tracking endpoints usable by fine-tuning tasks:

```typescript
// src/services/instance.ts
export const listExperimentEndpoints = (
  tenant: string,
  cluster: string,
  workspace: string
): Request<{ items: ExperimentEndpointItem[] }> => ({
  method: 'GET',
  url: `/api/cloud/tenants/${tenant}/clusters/${cluster}/workspaces/${workspace}/instances:experiment-endpoints`,
});
```

- **Method / path**: `GET .../instances:experiment-endpoints`
- **Response**: list of endpoints of experiment tracking instances (`{ items: [...] }`)
- **Purpose**: source of candidate values for the experiment tracking address when creating a fine-tuning task

> 💡 Tip: In the fine-tuning deployment form, the "experiment tracking address" is an extended control defined by the template Schema; once selected, the training process reports metrics to the corresponding tracking service. The exact field name is determined by the template Schema.

## Instance Status

`status.phase` values are defined in `InstanceStatusPhaseEnum` (see [Creating Workloads](/rune/guide/workloads) for the full table).

## Instance Detail

| Tab | Content |
| --- | --- |
| Overview | Basic information card, Pod list |
| Monitoring | Instance monitoring panel |
| Logs | Instance logs |
| Events | Kubernetes event stream |

## Permission Requirements

Experiment services belong to the Observability group; navigation requires the tenant role to be `ADMIN` or `DEVELOPER`.
