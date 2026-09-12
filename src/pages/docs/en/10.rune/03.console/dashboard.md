---
title: 'Home'
updated: '2026-09-12'
description: 'The actual block composition, context selection, and usage of the Rune console dashboard.'
tags:
  - rune
  - console
  - dashboard
---

# Home
The Rune dashboard is the default landing page after entering the workbench. It shows a resource overview and workload status for the current tenant, cluster, and workspace context.

## Entry Path

Rune Workbench → Dashboard

Path: `/rune/dashboard`

## Prerequisites

- Signed in and a tenant is selected.
- The current account has access to the Rune product.
- A cluster and workspace must be selected at the top; when no workspace is selected, the page prompts you to select one first.

## Page Blocks

The dashboard renders the following blocks in order (`src/pages/rune/home/dashboard.tsx`):

| Block | Component | Description |
| --- | --- | --- |
| Header | `OverviewHeader` | Title and refresh button; shows the refreshing state |
| Attention banner | `AttentionBanner` | Shown when there are items that need attention |
| Overview cards | `OverviewCards` | Resource/workload summary cards for the current workspace |
| Resource overview | `ResourceOverview` | Resource usage vs. quota |
| Storage overview | `StorageOverview` | Storage volume usage overview |
| Workload status | `WorkloadStatus` | Status distribution across workload categories |
| Action overview | `ActionOverview` | Common action entry points |

If some data sources fail, a warning is shown at the top of the page (`overview:partial_data_warning`: "Some overview data is temporarily unavailable; the remaining modules still work normally.").

> ⚠️ Note: The old documentation mentioned "Recent Activities" and "Resource Usage Trend" blocks, but the current home page does not render the corresponding components (`recent-activities.tsx` and `resource-usage-chart.tsx` exist in the codebase but are not rendered by `dashboard.tsx`). The blocks listed above reflect the actual implementation.

## Top Context Selection

The upper-left of the dashboard shows, together with the product configuration:

- Region/cluster selector: switches the currently operable cluster.
- Workspace selector: switches the current workspace; all block data updates accordingly.

> 💡 Tip: If the page appears empty or asks you to select a workspace, first check whether you switched to the wrong workspace, or whether the current cluster has no workspaces yet.

## Common Operations

1. Open the dashboard to confirm the current working context.
2. Use the overview cards and resource overview to judge whether quotas are sufficient.
3. Use the workload status to locate abnormal instances, then drill into the corresponding list or detail page.
4. Use the action overview to quickly reach deployment or management pages.

## Related Pages

- [Workspaces](/rune/console/workspace)
- [Quota Management](/rune/console/quota)
- [Run Logs](/rune/console/logging)
