---
title: 'Resources & Quotas'
updated: '2026-09-12'
description: 'Introduces the resource governance capabilities in Rune related to shared templates, tenant quotas, and available compute flavors.'
tags:
  - rune
  - resources
---
# Resources & Quotas

The "Resources & Quotas" section covers the shared-resources and governance capabilities of Rune. The focus is not the runtime of a single instance, but the templates, quotas and flavors that are reused before and after instance creation. In the console these live under the **Templates** menu in the sidebar and the **Quota / Flavor / Workspace** tabs of the tenant settings.

## How this maps to the console

| Capability | Console location | Focus |
| --- | --- | --- |
| Templates | Sidebar "Workbench → Templates" | Turn an existing instance into a reusable template for future deployments |
| Quota / Flavor / Workspace | Tenant settings tabs | Resource boundaries, selectable resource combinations and the instance isolation unit |

## Current Coverage

| Page | Description |
| --- | --- |
| [Templates](/rune/resources/templates) | Save existing instances as templates and reuse them in new deployment tasks |
| [Quota](/rune/console/quota) | View tenant quotas and understand how workspace quotas are allocated hierarchically |
| [Flavor](/rune/console/flavor) | View the resource specifications that the current tenant can use in the specified cluster |
| [Workspaces](/rune/console/workspace) | Create and maintain the smallest isolation unit that hosts instances |

## Recommended reading order

1. Start with templates to understand how instances become reusable configurations.
2. Then review quotas to confirm the resource boundaries of the current tenant and workspace.
3. Finally review flavors and pick a combination that is actually available in the current cluster.
