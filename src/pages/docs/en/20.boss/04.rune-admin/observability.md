---
title: Logs & Scheduler
updated: '2026-09-12'
description: Cluster-level monitoring, events, log query, and Volcano scheduling configuration pages.
tags:
- boss
- rune-admin
- observability
---

## Overview

The cluster detail page provides several operations entry points for observing cluster state from different angles and adjusting scheduling policy.

## Page Capabilities

| Page | Frontend Route | Current Capability |
| --- | --- | --- |
| Monitoring & Alerts | `/rune/clusters/:cluster/metrics` | Reserved page, a ComingSoon placeholder in the frontend (not in the sidebar navigation) |
| Event Logs | `/rune/clusters/:cluster/events` | Reserved page, a ComingSoon placeholder in the frontend (not in the sidebar navigation) |
| Log Management | `/rune/clusters/:cluster/logs` | Log query, label filtering, and live streaming |
| Scheduler Management | `/rune/clusters/:cluster/schedulers` | Drag-and-drop editing and saving of Volcano scheduling configuration |

## Log Page

The log page uses the shared `LogViewer` component and supports:

- Custom query statements
- Query by label, with suggestions for label values
- Historical log queries
- WebSocket real-time log streaming (follow mode)
- Switching between the "All / Nodes" scopes

It is useful for troubleshooting:

- Platform component anomalies
- Cluster service startup failures
- Scheduling, storage, or gateway-side errors

> 💡 Tip: The logging capability depends on a log-collection component deployed in the cluster. If the page shows no data, check whether the corresponding component has been installed through System Apps.

## Scheduler Page

The scheduler page is aimed at advanced administrators and is used to maintain the cluster's Volcano scheduling configuration. The current frontend supports:

- Loading scheduling parameters (`actions` / `plugins` / `presets`) and the existing configuration (`actions` / `metrics` / `tiers`)
- Dragging to adjust action order, adjusting plugin order within a tier, and dragging actions / plugins across containers
- Editing a local copy of the configuration (not pushed immediately)
- Previewing the configuration, refreshing the latest configuration, and saving and pushing to the backend

> ⚠️ Note: Scheduling configuration directly affects the cluster's job scheduling behavior. Validate in a test environment before changing a production cluster.
