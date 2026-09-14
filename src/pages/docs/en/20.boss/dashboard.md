---
title: Home
updated: '2026-09-14'
description: What each number on the three Home cards means, where it leads, and how fresh the data is.
---

# Home

Home is the first screen you see after signing in to BOSS, and it gives you **the whole platform at a glance**. It is made of three cards: Moha Resources across the top, LLM Gateway Overview at the bottom left, and Platform Management at the bottom right. All three read from real endpoints — none of the numbers are sample data.

:::tip How to use this page
Treat it as your dashboard. Glance at it when you start work: is the **Attention Needed** list in the Platform Management card empty, and is the **Error Rate** on the gateway card close to 0? If something is red or flagged, click through and deal with it.
:::

## Before you start

- You need an administrator account that can sign in to BOSS. Nothing else is required.
- This page is read-only; make actual changes from the corresponding management menus.

## What the three cards show

| Card | What to look at | Data scope |
| --- | --- | --- |
| Moha Resources | Platform-wide totals and trending rankings for models, datasets, Spaces and images | Whole platform |
| LLM Gateway Overview | Request volume, latency, token usage and error rate of model calls | Last 24 hours |
| Platform Management | Number of tenants, clusters and users, plus anything that needs your attention | Whole platform |

## Moha Resources card

The card title is **Moha Resources** and the subtitle is **Asset Statistics**.

### The four numbers on the left

| Metric | What it means |
| --- | --- |
| Models | Total models in the platform model library |
| Datasets | Total datasets on the platform |
| Spaces | Total development Spaces on the platform |
| Images | Total images in the platform image registry |
| Storage | Shown separately to the right of the title; total storage used by these resources |

### Distribution below

A three-segment proportion bar with percentages beside it, showing how much of the content is Public, Tenant Only or Private:

| Label | Meaning |
| --- | --- |
| Public | Everyone can see and download it |
| Tenant Only | Only members of the owning tenant can see it |
| Private | Only the creator (and members they authorize) can see it |

If all three add up to 0, the bar shows **No data**.

### Trending Now on the right

This lists the most-downloaded resources recently. Each row shows the resource name (hover to see its `organization/name` full name), size, download count, and a type label on the right (Models / Datasets / Spaces / Images). When there is nothing to show it displays **No trending items**.

:::info Trending Now is read-only
The rows here cannot be opened; they are only for spotting trends. To manage a resource, use the matching menu under the **Asset Management** group.
:::

## LLM Gateway Overview card

The card title is **LLM Gateway Overview** and the subtitle is **Traffic and usage over the last 24 hours**. This screen is fixed to the **last 24 hours** — there is no time-range selector, and you cannot change it to something like the last 7 days.

### The four key numbers at the top

| Metric | What it means | How to read the change below the number |
| --- | --- | --- |
| Total Requests | How many times all models were called in these 24 hours | Green means it went up, which is good |
| Avg Latency | Average time per call, in milliseconds (ms) | Green means it got faster, which is good |
| Total Tokens | Total tokens consumed in these 24 hours | Green means it went up |
| Error Rate | Share of calls that failed | Green means it went down, which is good |

The change is calculated against the previous window of the same length. When the change is extremely small (essentially 0) the card shows `0%` with no sign.

A token is the billing unit model APIs use for text: a paragraph is chopped into small pieces and each piece counts as one token. The fewer calls you make and the shorter the text, the fewer tokens you burn.

### Traffic Trend (24h) in the middle

An area chart whose horizontal axis is the most recent 24 hours (formatted like `14:00`), with two series: **Request Count** and **Token Usage**. Hover over the chart to read the value at a specific time. When there are no calls at all it shows **No data**.

### Top Models by Usage on the right

Lists up to 5 models, ordered by request volume. Each entry has the model name, the request count, a progress bar for that model's share of total requests, and a line showing how many tokens and requests it handled. With no call records it shows **No model usage data**.

:::warning When the whole block errors out
If this card shows only a red error message and no numbers, the gateway statistics endpoint is temporarily unavailable. This does not mean the gateway is broken — come back to this page later and it should load.
:::

## Platform Management card

The card title is **Platform Management**, and the **Open Management** button in the top-right corner jumps to the tenant list.

### The three numbers at the top

| Metric | What it means |
| --- | --- |
| Tenant | Total tenants on the platform |
| Cluster | Total compute clusters that have been connected |
| User | Total user accounts on the platform |

### Platform snapshot in the middle

The snapshot appears only after the matching list has loaded completely. If an item cannot be loaded it is left out entirely rather than shown as 0:

| Snapshot item | What it means |
| --- | --- |
| Enabled Tenants | How many tenants are in the active state |
| Connected Clusters | How many clusters have successfully connected |
| Published Clusters | How many clusters are published and available to tenants |
| MFA Enabled Users | How many users have turned on multi-factor authentication themselves |

### Attention Needed at the bottom

Only real problems are listed here. Each row shows the names of the objects involved (at most two, with the rest summarised as `+2` and so on) plus a **Detail** button that takes you straight to the page where you can fix it:

| Attention item | When it appears | Where Detail takes you |
| --- | --- | --- |
| Disabled Tenants | Some tenants are disabled | Tenant list |
| Disconnected Clusters | Some clusters cannot connect | Cluster list |
| Unpublished Clusters | Some clusters have not been published | Cluster list |

When none of these exist, the bottom shows a green **No attention items right now**, which means the platform is in good shape. If neither the tenant nor the cluster data could be loaded, you get a grey **No data** instead — that only means nothing could be checked, not that everything is fine.

:::info What happens when data is incomplete
If any one of the tenant, user or cluster lists fails to load, a yellow warning appears at the top of the card naming the unavailable source. Everything else still displays normally.
:::

## How often the data refreshes

The page loads its data once when you open it and caches it for the session. There is **no refresh button** and no place to set an automatic refresh interval. To get the latest numbers, open the page again.

## FAQ

| Symptom | Likely cause | What to do |
| --- | --- | --- |
| No filters or time selection on Home | This page is designed that way | For finer statistics go to **Model Gateway → Dashboard**, or to a cluster dashboard page |
| A number shows as `-` | That data source failed on this load | Open the page again later |
| Want to reorder or swap out a card | Not supported | The content and position of the three cards are fixed |

## Related

- [Overview](/boss)
- [Account Center](/boss/iam)
- [Model Gateway](/boss/gateway)
- [Dashboard](/boss/gateway/operations)
- [Rune Admin](/boss/rune-admin)
