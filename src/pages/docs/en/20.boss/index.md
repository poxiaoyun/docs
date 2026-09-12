---
title: Overview
updated: '2026-09-12'
author: Rune Docs Team
description: 'Boss user documentation for platform administrators, operations, and platform teams, covering IAM, multi-tenant governance, the LLM Gateway, Rune resource governance, and product-level settings.'
tags:
  - boss
  - overview
---

# Overview

Boss is the management center of the entire product suite. It handles account and tenant governance, cluster resource management, LLM Gateway operations, product settings, and Moha resource review.

## Current product structure

The "Console entrance" column lists the **real console routes** (the BOSS route root is `/`); documentation-site URLs use the `/boss/` prefix.

| Module | Function | Console entrance | Docs |
| --- | --- | --- | --- |
| Dashboard | Overall operating status and key statistics | `/`, `/dashboard` | [Home Dashboard](/boss/dashboard) |
| IAM | Users, tenants and membership | `/iam/users`, `/iam/tenants` | [IAM](/boss/iam) |
| Rune Admin | Clusters, resource pools, flavors, system images, tenant resource allocation | `/rune/clusters`, `/rune/tenants` | [Rune Admin](/boss/rune-admin) |
| LLM Gateway | Channels, model metadata, tokens, call logs and moderation | `/service-registrations`, `/tokens`, `/gateway/*` | [LLM Gateway](/boss/gateway) |
| Gateway Moderation | Policies, lexicon, sensitive hits | `/gateway/moderation/*` | [Content Moderation](/boss/gateway/moderation) |
| Moha Repository Management | Models, datasets, images, Spaces and repository content | `/moha/*`, `/moha/mirrors/*` | [Moha Repository Management](/boss/moha-admin) |
| System Settings | Platform, Rune, Moha, ChatApp and license configuration | `/settings/*` | [System Settings](/boss/settings) |

> ⚠️ Note: The docs sidebar previously contained a "Platform Operations" group at `/boss/operations`. That route **does not exist** in the console (`src/routes/sections/boss.tsx` has no top-level `operations` path), and its pages have been archived. Cluster, tenant-quota and gateway-moderation capabilities live under Rune Admin, IAM and LLM Gateway respectively, as shown above.

## Typical administrator path

1. Create users (`/iam/users`) and tenants (`/iam/tenants`) in IAM.
2. Connect clusters (`/rune/clusters`) and configure resource pools and flavors in Rune Admin.
3. Assign quotas and workspaces to tenants (`/rune/tenants/:tenant/quotas`, `/rune/tenants/:tenant/workspaces`).
4. Maintain channels and model metadata, issue tokens and configure moderation (`/service-registrations`, `/gateway/model-metadata`, `/tokens`, `/gateway/moderation`).
5. Maintain brand, logo, switches and license information in System Settings (`/settings/*`).

## Recommended reading

- [Home Dashboard](/boss/dashboard)
- [IAM](/boss/iam)
- [LLM Gateway](/boss/gateway)
- [Moha Repository Management](/boss/moha-admin)
- [Rune Admin](/boss/rune-admin)
- [System Settings](/boss/settings)
