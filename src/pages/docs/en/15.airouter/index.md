---
title: 'AIRouter'
updated: '2026-09-12'
description: 'What AIRouter is, what it is called on screen, what each of its five top entries does, and how to finish your first conversation.'
---

# AIRouter

AIRouter is the **web-based chat tool** built into the platform (it appears as **Playground** by default; an administrator can change that name in the Boss operations console). Open it, pick a model, type a sentence, and watch the model write its answer one character at a time — no code, no software to install, and no need to understand how the model is deployed.

It is a **sibling subsystem** of the AI Platform (Rune), not a part of it. The AI Platform manages the foundations — compute, clusters, instances and storage; AIRouter only does two things: chat with models, and connect models to external programs. The models themselves are configured by the platform administrator in the gateway, and you simply pick a ready-made one inside AIRouter.

:::tip An analogy
The AI Platform is like an office building: utilities, rooms and access control all belong to it. AIRouter is like a service counter inside the building — walk in, take a seat (a model), and ask your question.
:::

## How to get into AIRouter

1. Look at the **top-left corner** and find the button showing "current product name + dropdown arrow".
2. Click it to open a menu titled **Products**.
3. In the menu, choose **AIRouter** (shown as **Playground** by default).
4. You land on the **Models** page by default.

## What the five top entries do

AIRouter has no left-hand menu; everything lives in **the single row at the top of the page**:

| Entry | What you do here |
| --- | --- |
| **Models** | Pick models. See which models are available, each model's context length and price, copy model IDs, and view call samples |
| **Playground** | Chat with a single model. Choose a model, send messages, attach images, turn deep thinking on, and adjust parameters |
| **Comparison** | Ask two models the same question at once and compare the results side by side |
| **API Keys** | Create and manage the keys used by programs, and view the log of each call |
| **Usage analysis** | Your usage dashboard: call count, token consumption, cost and success rate |

## Before you start

- Any signed-in account works; AIRouter applies no extra role restrictions.
- Your account needs **at least one API key**. Without one, the **Playground** page shows "No API Key Found" and you can click **Create API Key** in that message (see [API Keys](./token.md)).
- Your account needs **at least one available model**. If you see none, the administrator has not opened a model channel for you yet.

## Complete your first conversation

1. In the top-left corner click **Products**, choose **AIRouter**, and land on **Models**.
2. In **Models**, pick a model (the larger the Context on the card, the more it can remember), and click the card to open the detail panel on the right.
3. In the detail panel, click **Try model**.
4. The page jumps to **Playground** with that model already selected.
5. Type your question in the input box at the bottom and press **Enter**.
6. The answer appears token by token. To see how it reasoned, expand **Show thoughts**.
7. To change topic, click **Clear conversation** in the top-right corner; to see what it cost, switch to **Usage analysis**.

## Confirm it worked

The assistant bubble shows an answer, and a row of token usage numbers appears under the reply — that means the conversation succeeded.

## Terms to learn first

| Term | Plain explanation |
| --- | --- |
| Model | The "brain" that answers questions. Models differ in what they are good at, their price, and how much they can remember |
| Channel | The same model may be served from several sources, with different prices and availability |
| Token | The smallest unit models are billed in — think of it roughly as "characters". Cost is calculated per token |
| Context length | The most content a model can remember within one conversation; beyond that it forgets the earliest part |
| System prompt | The rules or persona you give the model before a conversation, for example "You are an AI assistant" |
| Deep Thinking | Lets the model work through its reasoning before answering. More reliable answers, but more tokens |
| API key | A credential for programs, so external programs can call these models too |

## Common issues

| Symptom | Possible cause | What to do |
| --- | --- | --- |
| **Playground** shows "No API Key Found" | The account has no key yet | Click **Create API Key** in that message and create one first |
| **Playground** shows "No Models Available" | The account has no model channel at all | Ask the platform administrator to open a model for you in the gateway |
| Sending a message returns an error | Rate limiting, insufficient quota, content moderation and so on | Open [Playground](./experience.md) and match the error text against its common issues |

## Related

- [Models](./marketplace.md)
- [Playground](./experience.md)
- [Comparison](./compare.md)
- [API Keys](./token.md)
- [Usage analysis](./usage-statistics.md)
- [Parameter Settings](./debug.md)
