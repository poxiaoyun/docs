---
title: 'Rune intelligent computing platform'
updated: '2026-03-24'
author: Rune Docs Team
description: 'Rune intelligent computing platform user documentation for developers and algorithm engineers, covering workspace, inference, fine-tuning, development environment, experimental evaluation and resource management.'
tags:
  - rune
  - overview
---
#Rune Intelligent Computing Platform

Rune is an integrated AI workbench for model development, training and tuning, inference deployment and application delivery. Users enter the platform through a unified tenant, cluster, and workspace context, and complete resource preparation, instance creation, operation observation, and service release in the same console.

## Product structure

The current front-end product mainly consists of the following parts:

| Module | Function | Typical entrance |
| --- | --- | --- |
| Getting started | Understand basic platform concepts, prepare resources, and create your first workload | `/docs/rune/guide` |
| Console | The core workbench for daily use, covering dashboards, inference, fine-tuning, development environment, applications, experiments and evaluation | `/docs/rune/console` |
| Dialogue application | Provides model experience, multi-model comparison, parameter debugging and Token estimation | `/docs/rune/chatapp` |
| Resource Management | View templates, quotas and platform-side resource policies | `/docs/rune/resources` |

## Typical user path

1. The administrator allocates clusters, quotas, and workSpaces to tenants.
2. The user enters the Rune console and first selects the cluster and workspace context.
3. Select a template in the application market or template center to create inference, fine-tuning, development environment or application instances.
4. View status, monitoring, logs, events and access addresses in the instance details.
5. Combine experiments, evaluations and ChatApp to complete model verification, and then deliver the service to the team for use.

## Recommended reading

- [Get started](/docs/rune/guide)
- [Rune console](/docs/rune/console)
- [ChatApp](/docs/rune/chatapp)
- [Resource Management](/docs/rune/resources)

## Character perspective

| Role | Focus |
| --- | --- |
| Tenant Administrator | Workspace, quotas, specifications, template availability |
| Algorithm Engineer | Development environment, fine-tuning, experimentation, evaluation |
| Application developers | Inference services, application deployment, log troubleshooting |
| Platform operation and maintenance | Manage clusters, templates, resource pools and tenant quotas through Boss |