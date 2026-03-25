---
title: 'Resource management'
updated: '2026-03-24'
author: Rune Docs Team
description: 'Introduces the resource governance capabilities in Rune related to shared templates, tenant quotas, and available compute flavors.'
tags:
  - rune
  - resources
---
# Resource Management

The `Resource Management` column corresponds to the "shared resources and governance" capabilities of Rune. The focus is not on the running process of a single instance, but on the templates, quotas, and specifications that are reused before and after instance creation.

## Differences from the console

| Column | Focus |
| --- | --- |
| Console | Daily operations such as inference, fine-tuning, development environment, applications, logs, storage, etc. |
| Resource Management | Instance template reuse, tenant and workspace quotas, available compute flavors |

## Current Coverage

| Page | Description |
| --- | --- |
| [Instance templates and reuse](/rune/resources/templates) | Save existing instances as templates and reuse them in new deployment tasks |
| [Quotas and Policies](/rune/resources/quotas) | View tenant quotas and understand how workspace quotas are allocated hierarchically |
| [Compute flavors](/rune/resources/flavors) | View the resource specifications that the current tenant can use in the specified cluster |

## Recommended reading order

1. Look at the template first to understand how instances are precipitated into reusable configurations.
2. Look at the quota again and confirm the resource boundaries of the current tenant and workspace.
3. Finally, look at the specifications and select the resource combination that is actually available in the current cluster.