---
title: 'Playground'
updated: '2026-09-14'
description: 'First time chatting with a model? Choose a model and key, send and follow up on messages, attach images, tune parameters, clear the chat.'
---

# Playground

**Playground** is AIrouter's main conversation page. Pick a model here, type a question, and watch it write its answer one character at a time. Choosing a model, uploading images, toggling deep thinking and adjusting parameters all happen on this page.

:::tip An analogy
This page is like the chat window of a messaging app: on the left is the "contact list" (the model list), in the middle is the message history, and at the bottom is the input box.
:::

## Before you start

- Any signed-in account works; no extra role is needed.
- Your account needs **at least one API key**; otherwise the whole page only shows "No API Key Found", and you can click **Create API Key** in that message to make one first (see [API Keys](./token.md)).
- Your account needs **at least one available model**; otherwise "No Models Available" is shown.

## The page has three parts

| Area | Position | Description |
| --- | --- | --- |
| **Model list** | Left | A collapsible list grouped by visibility → channel → model |
| Conversation | Center | Top info bar + message list + bottom input box |
| **Model information** / **Parameter settings** | Right | Shown only when the window is wide enough; on a narrow window the right side collapses and you open them with icons at the top of the conversation area |

![Model Playground with no model selected: model list on the left, four prompt cards in the middle, input box at the bottom](/assets/screenshots/airouter/experience-01.png)

This is the initial state: the left **Model list** has only the "Public" group expanded, the middle says "Select a model", and the four prompt cards stay greyed out until a model is picked. Note there is no right-hand panel here — below `1536px` it collapses and is replaced by the two icons in the conversation header.

## Choose a model

1. Click **Playground** in the top navigation.
2. Look at the **Model list** on the left. It is grouped **Public** → **Private** → **Tenant**, then by channel within each group, and the model entries come last; click a group heading to expand or collapse it.
3. When there are more than 5 models, a **Search models** box appears at the top of the list, which searches by model name, tenant, workspace, channel and provider.
4. Click a model entry to select it. The entry shows its type (`LLM`, `VLM`, `Embedding`), visibility, and the tenant and workspace it belongs to; the copy button beside the name copies the model ID.

:::warning Choosing a model clears the current conversation
Switching a model wipes the current chat history. Copy anything you need to keep first.
:::

![After selecting deepseek-v4-flash: the model name, key selector and Clear conversation appear in the header](/assets/screenshots/airouter/experience-02.png)

Once a model is selected the page becomes live: the left entry is highlighted with its `LLM` badge, scope and owning tenant; the header shows the model name, provider, **key selector** and **Clear conversation**; the middle now reads "Using deepseek-v4-flash. Type to start chatting."

## Confirm which key is used

The conversation is sent under the identity of an **API key**, so check the selected key before sending.

- On a narrow window: open the key selector at the top of the conversation area and pick a key.
- On a wide window: the **API Key / credential** dropdown in the right-hand **Parameter settings** panel is the same setting.
- By default the first key in the account is selected automatically. Expired keys in the dropdown are marked `Expired` — do not pick them.

![The key selector opened, listing both keys of the account](/assets/screenshots/airouter/experience-03.png)

The key selector expanded is shown above: each row is a key name plus a masked value. This account has two keys, `link` and `test`, with the currently selected one highlighted. The key values are blurred in the screenshot; the page itself shows the first 8 and last 4 characters.

## Start a conversation

1. With a model and key selected, look at the bottom input box; its placeholder reads "Type to chat with the model...".
2. Type your question.
3. Press **Enter** to send, or click the round send button at the bottom right.
4. The answer streams in character by character.
5. For a new line, press **Shift + Enter** (with an IME, an Enter that has not finished composing does not send by mistake).

If no model is selected or the input box is empty, the send button is grey and cannot be clicked.

![A completed exchange: your question on the right, the answer with a collapsed reasoning block and a token usage row](/assets/screenshots/airouter/experience-04.png)

A complete exchange looks like this: your message on the right, and on the left the assistant bubble starting with a **Hide thinking** toggle (the reasoning trace, expandable), then the answer, then a row of token counts. On follow-up turns all of this is sent to the model along with your next message.

## Follow up (multi-turn conversation)

You do not need to start over — keep typing in the same input box and press **Enter** again. Earlier messages are sent along with the new one, so the model can answer in context.

Only two things break the context: **switching models**, and clicking **Clear conversation**.

## Edit the system prompt (give the model a persona)

The system prompt is the rule you set before the conversation starts, for example "You are an AI assistant". It **takes effect only when you type something into it**.

1. Click the parameter icon at the top of the conversation area (hover shows **Parameter Settings**) to open the parameter dialog.
   - On a wide enough window you can also work directly in the right-hand **Parameter settings** panel: click **More parameters** to expand it.
2. Write in the multiline **System** input, for example "You are a support assistant; answer in no more than three sentences".
3. Close the dialog — the change is remembered immediately.
4. Only messages sent after the change follow the new rule; messages already sent are unaffected.

## Send an image to the model

The input box accepts **text and images only** — there is no way to send voice or video.

1. Click the leftmost image button in the toolbar under the input box.
2. Choose one or more images; you can also paste an image from the clipboard straight into the input box.
3. Selected images line up as thumbnails above the input box, with "N images selected" shown.
4. To remove one, click the close icon at the top-right corner of its thumbnail.
5. Send as usual with **Enter**, and the images travel with that message.

To actually understand images, you need a model whose **Category** includes **Vision** (visible in [Models](./marketplace.md)).

## Deep Thinking

The **Deep Thinking** button in the input toolbar is **on by default**. When on, the button is filled, and the model works through its reasoning before giving a conclusion; if the model supports it, a reasoning block appears in the reply that you can fold or unfold with **Show thoughts** / **Hide thoughts**.

Click the button again to turn it off and it becomes outlined. Deep Thinking makes answers more reliable, but it also **consumes more tokens**.

## Stop, retry or copy while generating

| What you want | How to do it |
| --- | --- |
| Stop generating | Click **Stop** in the input area; content already generated is kept |
| Have the model answer again | Click the refresh icon under that answer. It regenerates from that answer, and anything after it is discarded |
| Copy an answer | Click the copy button under the answer |
| See how many tokens this used | Look at the usage under the answer: `prompt_tokens` (what you sent), `completion_tokens` (what the model generated) and `total_tokens` (the sum) |

## Clear the conversation

1. With a model selected, a **Clear conversation** button appears at the top right of the conversation area.
2. Click it: the message list and reasoning content are wiped, while the model and parameters stay as they are, so you can start again.

## When you arrive with no messages

The page shows "Start with a question" and four ready-made prompt cards (Explain a concept, Create a delivery plan, Analyze key questions, Generate a project template). With a model selected, click any card and the question inside it is sent immediately.

## Confirm it worked

- Success: an answer appears in the assistant bubble, with a row of token usage numbers below it.
- Failure: an error message or "Generation failed" is shown where the message would be. Use the table below.

## Common issues

| Message on the page | Possible cause | What to do |
| --- | --- | --- |
| No API Key Found | The account has no key yet | Click **Create API Key** in the message and create one |
| No Models Available | The account has no model channel at all | Ask the platform administrator to open a model for you |
| Invalid API key | The key was deleted or has expired | Check its status in [API Keys](./token.md) and switch to a valid one |
| Too many requests, please try again later | You hit the rate limit | Wait a moment, or send less frequently |
| Insufficient quota | The account allowance is used up | Ask the administrator to handle the allowance |
| Context length exceeded | The chat content exceeds what the model can remember | Click **Clear conversation** to restart, or switch to a model with a larger context |
| The request was blocked by a content safety policy | The content matched a safety policy | Rephrase and remove anything that may violate the policy |
| The model ended the reply early because sensitive-content policy was triggered | The reply was cut off mid-way by policy | Rephrase and retry; the reply may carry an upstream request ID that you can give the administrator |
| Nothing happens mid-generation | A network hiccup or a dropped connection | Click **Stop**, then retry the message |

## Related

- [Models](./marketplace.md)
- [Comparison](./compare.md)
- [Parameter Settings](./debug.md)
- [API Keys](./token.md)
