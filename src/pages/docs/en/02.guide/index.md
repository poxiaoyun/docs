---
title: 'Getting Started Guide'
updated: '2026-09-14'
description: 'Tells you what each of the three starter pages solves and in what order to read them, so you can run your first flow fast.'
tags:
  - guide
  - getting-started
---

# Getting Started Guide

This chapter is for people using XiaoShi AI for the first time. You do not need to learn Kubernetes first, and you do not need to know model terminology — after these three pages you will know what the platform is made of, what every word on the screen means, and where to click from sign-in to running your first model service.

## What each page solves

| Page | After reading it you can | When to read it |
| --- | --- | --- |
| [Quick Start](/guide/quick-start) | Follow five stages end to end: sign in → get compute → deploy an inference service → upload your own model → fine-tune and evaluate | First time, while you are actually clicking |
| [Platform Concepts](/guide/architecture) | Understand how the platform is layered, where a request goes, and where data is stored | After one round of practice, when you want to know why |
| [Glossary](/guide/glossary) | Look up any term and get a plain-English explanation, an analogy, and where you first meet it | Anytime something does not make sense |

## Recommended reading order

| You are | Recommended path |
| --- | --- |
| **Developer** | [Quick Start](/guide/quick-start) → [Glossary](/guide/glossary) → [Inference](/rune/console/inference) → [AIrouter](/airouter/) |
| **Tenant admin** | [Quick Start](/guide/quick-start) → [Permission Guide](/account/auth/roles) → [Workspace](/rune/console/workspace) → [Tenant Management](/account/iam/tenant) |
| **Platform admin** | [Platform Concepts](/guide/architecture) → [Cluster Management](/boss/rune-admin/clusters) → [Resource Pools](/boss/rune-admin/resource-pools) → [Model Gateway](/boss/gateway/) |
| **Just want to try a model** | The "Run your first inference service" stage in [Quick Start](/guide/quick-start) → [Playground](/airouter/experience) |

## Before you start

- You need an account. If you do not have one, ask a platform admin or register yourself from the sign-in page — see [Register an Account](/account/auth/register).
- You need to belong to at least one **tenant** (think of it as one company's own space). If you cannot get in after signing in, see [Select or Register a Tenant](/account/auth/select-tenant).
- You need a **workspace** under that tenant (think of it as one office inside the building). If there is none, a tenant admin can create one, or you can create it yourself — see [Workspace](/rune/console/workspace).

## Next steps

- [Quick Start](/guide/quick-start)
- [Platform Concepts](/guide/architecture)
- [Glossary](/guide/glossary)
