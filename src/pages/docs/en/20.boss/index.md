---
title: 'Boss Operations Platform'
updated: '2026-03-24'
author: Rune Docs Team
description: 'Boss user documentation for platform administrators, operations, and platform teams, covering IAM, multi-tenant governance, the LLM Gateway, Rune resource governance, and product-level settings.'
tags:
  - boss
  - overview
---
# Boss Operations Platform

Boss is the management center of the entire product suite. It is responsible for account and tenant governance, cluster resource management, LLM Gateway operations, product settings, and Moha resource review. Platform administrators usually use Boss as the single place to handle resource provisioning, permission control, policy rollout, and operational inspection.

## Current product structure

| Module | Function | Typical entrance |
| --- | --- | --- |
| Dashboard | View the overall operating status and key statistics of the platform | `/docs/boss` |
| IAM Identity Management | Manage users, tenants, and membership relationships | `/docs/boss/iam` |
| Platform governance | Manage cluster, tenant and gateway governance processes from the platform level | `/docs/boss/operations` |
| LLM Gateway | Configure API keys, model services, review workflows, and audit capabilities | `/docs/boss/gateway` |
| Rune AI Computing Management | Manage clusters, resource pools, compute flavors, system images, and tenant resource allocation | `/docs/boss/rune-admin` |
| Moha Management | Review models, datasets, images, Spaces, and repository operation content | `/docs/boss/moha-admin` |
| System Settings | Maintain platform, Rune, Moha, ChatApp, and license configuration | `/docs/boss/settings` |

## Typical administrator path

1. Create users and tenants in IAM.
2. Connect clusters and configure resource pools and compute flavors in Rune AI Computing Management.
3. Assign quotas, workspaces, and available templates to tenants.
4. Register model services in the LLM Gateway, issue API keys, and set audit policies.
5. Maintain brand, logo, switch items and license information in system settings.

## Recommended reading

- [Platform Dashboard](/docs/boss)
- [IAM Identity Management](/docs/boss/iam)
- [LLM Gateway](/docs/boss/gateway)
- [Rune AI Computing Management](/docs/boss/rune-admin)
- [System Settings](/docs/boss/settings)
