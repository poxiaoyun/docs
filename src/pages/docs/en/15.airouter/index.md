---
title: 'AIrouter'
updated: '2026-10-21'
description: 'Not sure what AIrouter is, where to open it, what its eight top entries do, or how to finish a first chat and a first purchase? Start here.'
---

# AIrouter

AIrouter is the platform's built-in **web entry point for using models**: chat with models, connect them to your own programs, check prices, buy plans and read your bill. On screen it appears as **Chat** by default; an administrator can change that name in the Boss console under **Gateway Settings**.

This page answers three questions: where to get in, what each of the eight entries in the top row does, and what order to follow the first time. Every task has its own page for the details.

:::tip An analogy
The AI Platform is like an office building: utilities, rooms and access control all belong to it. AIrouter is a service counter inside the building — you walk up to a seat (a model) and ask your question, and you can also read the price list (Prices), buy a plan (Subscribe) and check your bill (Account) at the same counter. The models themselves are configured by the platform administrator; you just pick a ready-made one.
:::

## How to get into AIrouter

1. Look at the **top-left corner** and find the button showing "current product name + dropdown arrow".
2. Click it to open a menu titled **Products**.
3. In the menu, choose this entry — these docs call it **AIrouter**, and on screen it reads **Chat** by default (if an administrator renamed it, go by the label you actually see).
4. You land on the **Models** page by default.

!["Product & Services" menu at the top left, listing AI Platform, Moha Hub and Model Gateway](/assets/screenshots/airouter/index-01.png)

That menu is the entry point itself: click **Product & Services** at the top left and pick the third item. Its label is configurable by an administrator in [Gateway Settings](../20.boss/03.settings/chatapp.md), so trust whatever your menu actually shows.

## What the eight top entries do

AIrouter has no left-hand menu; everything lives in **the single row at the top of the page**. Two of the eight are **dropdowns** — click them to see the sub-items:

| Entry | Type | What you do here |
| --- | --- | --- |
| **Models** | Link | Pick models. See what is available, how much context each has, what it can do, and read call samples |
| **Playground** | Dropdown | Two sub-items: **Chat** (talk to one model) and **Comparison** (ask two models the same question) |
| **API Keys** | Link | Create and manage the keys used by programs, and view the log of each call |
| **Usage analysis** | Link | Your usage dashboard: calls, token consumption, cost and success rate |
| **Prices** | Link | Unit prices for this account under its rate plan — see [Prices](./prices.md) |
| **Subscribe** | Dropdown (products) | Lists the products you can buy; pick one to open its plan page. Exclusive products carry an **Exclusive plan** label; with nothing to buy it shows **No plans** — see [Subscribe](./subscribe.md) |
| **Account** | Link | Balance, current plan, plan usage and weekly quota, plus top-up and charge ledgers — see [Account](./billing.md) |
| **API docs** | Link | Endpoint list and auth headers for connecting a program — see [API docs](./api-docs.md) |

:::info Three names, one subsystem
The docs section is called **AIrouter**, the product menu shows **Chat** by default, and the top nav has a parent item called **Playground**. They all point at the same subsystem: **AIrouter** is the docs name, **Chat** is the product name, **Playground** is the dropdown in the top nav.
:::

## Before you start

- Any signed-in account works; AIrouter applies no extra role restrictions.
- **Models**, **Prices** and **API docs** only need a signed-in account — no key required.
- To send messages in **Chat** or **Comparison**, your account needs **at least one API key**. Without one, the page shows "No API Key Found" and you can click **Create API Key** in that message (see [API Keys](./token.md)).
- Your account needs **at least one available model**. If you see none, the administrator has not opened a model channel for you yet.
- To buy a plan the account balance must be enough. **There is no top-up entry in the UI** — contact an administrator to add credit.

## Complete your first conversation

1. In the top-left corner click **Products**, choose **Chat** (the entry these docs call AIrouter), and land on **Models**.
2. In **Models**, pick a model (the larger the Context on the card, the more it can remember), and click the card to open the detail panel on the right.
3. In the detail panel, click **Try model**.
4. The page jumps to **Chat** with that model already selected.
5. Type your question in the input box at the bottom and press **Enter**.
6. The answer appears token by token. To see how it reasoned, expand **Show thoughts**.
7. To change topic, click **Clear conversation** in the top-right corner; to see what it cost, switch to **Usage analysis**.

Next time you can go straight to **Playground** → **Chat** in the top nav instead of starting from Models.

## Confirm it worked

The assistant bubble shows an answer, and a row of token usage numbers appears under the reply — that means the conversation succeeded.

## Terms to learn first

| Term | Plain explanation |
| --- | --- |
| Model | The "brain" that answers questions. Models differ in what they are good at, their price, and how much they can remember |
| Channel | The same model may be served from several sources, with different prices and availability |
| Visibility | Who can see a model: **Public** (whole platform), **Internal** (this tenant), **Private** (only you or your workspace) |
| Token | The smallest unit models are billed in — think of it roughly as "characters". Cost is calculated per token |
| Context length | The most content a model can remember within one conversation; beyond that it forgets the earliest part |
| System prompt | The rules or persona you give the model before a conversation, for example "You are an AI assistant" |
| Deep Thinking | Lets the model work through its reasoning before answering. More reliable answers, but more tokens |
| API key | A credential for programs, so external programs can call these models too |
| Rate plan | A price list an administrator attaches to your account; it decides the unit price you actually pay — see [Prices](./prices.md) |
| Plan | A prepaid block of usage for a period; what it contains is **credits** |
| Credits | The unit inside a plan, where 1 credit = CNY 0.01. Chats spend credits first, then the balance (depending on overage charging) |
| Weekly quota | A periodic call limit attached to the plan; when it runs out you wait for the reset or contact an administrator |
| Balance | Money in the account. Buys plans and pays for overage calls |
| Overage charges | Whether calls may keep charging the balance after plan credits run out. Set when you order |
| Ledger | A record of every top-up, charge, refund, adjustment and plan purchase — see [Account](./billing.md) |

## Common issues

| Symptom | Possible cause | What to do |
| --- | --- | --- |
| **Chat** shows "No API Key Found" | The account has no key yet | Click **Create API Key** in that message and create one first |
| **Chat** shows "No Models Available" | The account has no model channel at all | Ask the platform administrator to open a model for you in the gateway |
| Sending a message returns an error | Rate limiting, content moderation, context overflow and so on | Open [Chat](./experience.md) and match the error text against its common issues |
| "The balance is too low and the request was rejected" | The balance cannot cover the call | Check [Account](./billing.md); there is no top-up entry, so contact an administrator |
| "Plan credits are used up" | Credits are gone and overage charging is off | Buy a plan in [Subscribe](./subscribe.md), or ask an administrator to turn overage charging on |
| "Your plan does not include this model" | This model is not part of the plan | Switch models, or turn overage charging on so the balance pays |
| "The account is frozen or disabled" | Account status problem | Only an administrator can fix it |
| A model's unit price looks odd | Prices vary by rate plan, plan and channel | Check your own prices in [Prices](./prices.md) |

## Related

- [Models](./marketplace.md)
- [Chat](./experience.md)
- [Comparison](./compare.md)
- [API Keys](./token.md)
- [Usage analysis](./usage-statistics.md)
- [Parameter Settings](./debug.md)
- [Prices](./prices.md)
- [Subscribe](./subscribe.md)
- [Account](./billing.md)
- [API docs](./api-docs.md)
