---
title: 'LLM gateway'
updated: '2026-03-23'
description: 'LLM gateway management - full-link management and control such as channel access, API Key issuance, content review, audit logs, etc.'
tags:
  - boss
  - gateway
---
## Overview

The LLM gateway is the unified large model access layer of the Xiaoshi Intelligent Computing Platform and is centrally managed by the Boss platform administrator. It realizes multi-supplier channel aggregation, unified API access, traffic control, content security review and complete audit tracking capabilities.

## Core functions

| Module | Description |
|------|------|
| [Channel Management](/boss/gateway/channels) | Configure upstream LLM service providers (OpenAI, local inference, etc.) |
| [API Key](/boss/gateway/api-keys) | Create and manage gateway API Key, set call limits |
| [Gateway Configuration](/boss/gateway/config) | Global parameters, routing policies, load balancing and other configurations |
| [Content Moderation](/boss/gateway/moderation) | Input/output content security filtering and auditing rules |
| [Operation Management](/boss/gateway/operations) | Call statistics, usage analysis and current limiting configuration |
| [Audit Log](/boss/gateway/audit) | Complete call record query and audit |
| [Service Registration](/boss/gateway/service-reg) | Register the inference service as a channel available to the gateway |