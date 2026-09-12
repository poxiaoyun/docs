---
title: 'App Market'
updated: '2026-09-12'
description: 'Template browsing, category tabs, search, recommended carousel, and one-click deployment in App Market.'
tags:
  - rune
  - console
---

# App Market

The App Market is Rune's template center. It provides product templates covering inference, fine-tuning, dev environments, experiments, applications, and other scenarios. Users can browse, search, view template details and versions, and jump to the deployment page with one click.

Path: `/rune/app-market`

## Browsing Templates

App Market uses the product list component to display templates.

### Template Cards

Each card shows the template icon, name, summary, category, and version information; the card grid adapts to the window width.

### Category Tabs

The top of the page provides category tabs (`FilterTabs`), each with a count, whose values come from the template category configuration:

| Category identifier | Description |
| --- | --- |
| `inference` | Inference deployment templates |
| `tune` | Fine-tuning templates |
| `im` | Interactive dev environment templates |
| `experiment` | Experiment tracking templates |
| `app` | General application templates |

> ⚠️ Note: The category identifier for dev environments is `im`, not `devenv`.

### Keyword Search

The search box performs a fuzzy search over template names and descriptions and has a built-in **500 ms debounce** (`useDebounce(searchQuery, 500)`, see `src/business/components/product/list-view.tsx`).

> ⚠️ Note: The App Market currently has **no filtering by language / framework / OS / tool tags**. The "tag filtering" from the old documentation has been removed; to locate a template, use "category tabs + keyword search", or open the detail page to read the README.

### Recommended Carousel and Pagination

- A **recommended products carousel** (`RecommendedProducts`) at the top of the page sorts by recommendation priority and time, auto-rotates every 10 seconds, and shows left/right buttons on hover.
- **Pagination** controls are provided below the list; the toolbar provides a **refresh** button.

## Template Detail

Click a template card to open the detail page (`/rune/app-market/:product`), which uses the product detail layout and contains:

| Area | Content |
| --- | --- |
| Introduction / Note tabs | Two tabs, `introduction` and `note` |
| Product info card | Name, description, category, creation time |
| Version selection | Switch versions through the version popover |
| Deployment entry | The deploy button in the upper-right of the detail page |

## One-Click Deployment

1. On the template detail page, select a version and click **Deploy**.
2. The frontend navigates to the instance list path of the corresponding category, carrying `action=deploy`, the product ID (`product`), and the version (`version`) (once a workspace context is resolved this becomes `.../clusters/:cluster/workspaces/:workspace/<category>s?action=deploy`, where that route renders the deploy form):
   - `inference` → `/rune/tenants/:tenant/inferences?action=deploy&product=<id>&version=<version>`
   - `tune` → `/rune/tenants/:tenant/tunes?action=deploy&product=<id>&version=<version>`
   - `im` → `/rune/tenants/:tenant/ims?action=deploy&product=<id>&version=<version>`
   - `experiment` → `/rune/tenants/:tenant/experiments?action=deploy&product=<id>&version=<version>`
   - `app` → `/rune/tenants/:tenant/apps?action=deploy&product=<id>&version=<version>`
3. The deploy form renders parameters from that version's Schema; fill in the basic information and parameters, then submit.

> 💡 Tip: The deploy form has only three fixed fields — `id` / `name` / `description`; all other parameters are determined by the selected version's Schema.

## Permission Requirements

App Market belongs to the Dashboard group and can be browsed within a workspace context; the actual deployment action is constrained by the module permission of the selected template category.
