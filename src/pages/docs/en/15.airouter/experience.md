---
title: 'Chat'
updated: '2026-10-21'
description: 'First time chatting with a model? Choose a model and key, send and follow up on messages, attach images, preview HTML, read errors.'
---

# Chat

**Chat** is AIrouter's main conversation page. Pick a model here, type a question, and watch it write its answer token by token. Choosing a model, uploading images, toggling deep thinking and adjusting parameters all happen on this page.

Get there from the top nav: click **Playground** → **Chat**.

:::tip An analogy
This page is like the chat window of a messaging app: on the left is the "contact list" (the model list), in the middle is the message history, and at the bottom is the input box.
:::

## Before you start

- Any signed-in account works; no extra role is needed.
- Your account needs **at least one API key**; otherwise the whole page only shows "No API Key Found", and you can click **Create API Key** in that message to make one first (see [API Keys](./token.md)).
- Your account needs **at least one available model**; otherwise "No Models Available" is shown.
- The left-hand list only contains **chat models that are already priced**. Image, video, audio, embedding and rerank models, and models without a price, do not appear here.
- Use a **wide window**. On narrow windows the model list on the left is hidden, and the right-hand panel (Model information / Parameter settings) collapses into icons at the top of the conversation area.

## The page has three areas

| Area | Position | Notes |
| --- | --- | --- |
| **Model list** | Left | A three-level tree: visibility → model → channel |
| Conversation | Middle | Header bar + message list + input box at the bottom |
| **Model information** / **Parameter settings** | Right | Only shown from `1536px` wide and up; on narrow windows it collapses into icons in the conversation header |

![Chat before a model is selected: model list on the left, four prompt cards in the middle, input box at the bottom](/assets/screenshots/airouter/experience-01.png)

This is what you see on arrival: the **Model list** on the left has only the "Public" group expanded, the middle reads "Start with a question" with the subtitle "Please select a model", and the four prompt cards are greyed out until a model is chosen. Note the right-hand panel is missing in the screenshot — below `1536px` it collapses.

## Choose a model

1. Click **Playground** → **Chat** in the top nav.
2. Look at the **Model list** on the left. It has three levels: **visibility** (**Public** / **Internal** / **Private**), then **model** (followed by its channel count), then **channel**. Click a group header to expand or collapse it.
3. When there are more than 5 models, a **Search models** box appears at the top of the list, matching model ID, tenant, workspace, channel and provider.
4. Click a **channel** row (shown as "provider: channel-name") to select it. The selected row gets a highlighted border.
5. When one model has several channels, each channel is a separate selectable row — their prices and availability can differ.

:::warning Changing the model clears the conversation
Switching models clears the current chat history. Copy anything you need to keep first.
:::

![Chat after selecting deepseek-v4-flash: the conversation header shows the model name, key selector and Clear conversation](/assets/screenshots/airouter/experience-02.png)

Once a model is selected the page comes alive: the left row is boxed, the middle header shows the model ID and "provider · channel", the right side of the header shows the **key selector** and **Clear conversation**, and the middle prompt changes to "Using deepseek-v4-flash. Enter a message to start chatting."

:::info Where the rest of the model info lives
Type, visibility, tenant, workspace, task and creation time are all in the **Model information** panel on the right (visible on wide windows only).
:::

## Check which key is used

Conversations are sent under the identity of an **API key**, so confirm the selected key is usable before sending.

- On a narrow window: open the key selector in the conversation header and pick a key.
- On a wide window: the **API Key / credential** dropdown at the top of the right-hand **Parameter settings** panel is the same setting.
- The first **usable** key on the account is selected by default.
- **Expired** keys are marked `Expired` and **disabled** keys are greyed out — neither can be selected, so pick another.
- The key value is never shown in full; the page displays "first 8 characters … last 4 characters".

![Opening the key selector in the conversation header; the dropdown lists the account's two keys](/assets/screenshots/airouter/experience-03.png)

Above is the expanded key selector: each row shows a key name and a masked value. Both `link` and `test` are selectable here, and the current one is highlighted. The key values were blurred in the screenshot.

## Start a conversation

1. With a model and key selected, look at the input box at the bottom; the placeholder is "Type to chat with the model...".
2. Type your question.
3. Press **Enter**, or click the round send button at the bottom right.
4. The answer streams in token by token.
5. To add a line break press **Shift + Enter** (with a Chinese IME, an Enter that is still composing pinyin does not send by accident).

With no model selected, or an empty input box, the send button is greyed out and cannot be clicked.

![A complete exchange: your question above, the assistant reply with its reasoning collapsed, and token usage below](/assets/screenshots/airouter/experience-04.png)

A complete exchange looks like this: your message on the right, the assistant bubble on the left starting with **Hide thoughts** (the reasoning, expandable) followed by the answer, and the token usage on the last line. In multi-turn chats all of this is sent to the model together.

## Follow up (multi-turn)

No need to start over — keep typing in the same input box and press **Enter** again. The earlier messages are sent along with the model, so it can answer in context.

Only two things break the context: **switching models**, and clicking **Clear conversation**.

## Preview a web page the model generated

When the model's answer is web-page code that can be opened directly, a preview entry appears in the reply. Clicking it opens a **Preview** panel to the right of the conversation:

| Button | What it does |
| --- | --- |
| Full screen | Expands the preview to the whole window, handy for judging the full page |
| Close | Collapses the preview back to the normal conversation width |

:::tip When this is useful
It is most useful when you ask the model to "write a small page I can open directly": no copying code into a local file — check the result, click the buttons and inspect the layout right there. The preview only renders the model's output; it does not touch your account or other pages.
:::

## Change the system prompt (give the model a persona)

The system prompt is the rule you set before the conversation, for example "You are an AI assistant". It **only takes effect when it is not empty**.

1. Click the parameter icon at the top of the conversation area (hover shows **Parameter Settings**) to open the parameter dialog.
   - On a wide enough window you can also work in the right-hand **Parameter settings** panel: click **More parameters** to expand it.
2. Write your instruction in the multi-line **System** box, for example "You are a support assistant; answer in no more than three sentences".
3. Close the dialog; the change is remembered immediately.
4. Only messages sent after the change follow the new rule. Messages already sent are unaffected.

What each parameter controls is explained in [Parameter Settings](./debug.md).

## Send images to the model

The input box accepts **text and images only** — there is no voice or video upload, and **no web search**.

1. Click the leftmost image button in the input toolbar (hover shows **Upload image**).
2. Choose one or more images; you can also paste an image from the clipboard straight into the box.
3. Selected images appear as thumbnails above the input box with "N images selected".
4. To remove one, click the close icon on its thumbnail.
5. Press **Enter** as usual; the images go with the message.

To have images understood, choose a model whose **Category** includes **Vision** (visible in [Models](./marketplace.md)).

## Deep Thinking

The **Deep Thinking** button in the input toolbar is **on** by default. When on, the button is solid and the model works through its reasoning before answering; if the model supports it, the reply contains a reasoning block you can expand with **Show thoughts** / **Hide thoughts**.

Click again to turn it off; the button becomes outlined. Deep thinking makes answers more reliable but **burns more tokens**.

## Stop, retry, copy

| What you want | How to do it |
| --- | --- |
| Stop generating | Click **Stop** in the input area; what has already been generated is kept |
| Regenerate this answer | Click the retry icon under that answer. It regenerates from that message, and everything after it is dropped |
| Copy an answer | Click the copy button under the answer |
| See the token usage | Look under the answer: input tokens, output tokens and the total |

## Clear the conversation

1. With a model selected, **Clear conversation** appears at the top right of the conversation area.
2. Click it: the message list and reasoning content are cleared, the model and parameters stay, and you can start over.

## When you arrive with no messages

The page shows "Start with a question" and four ready-made prompt cards (explain a concept, plan an implementation, analyse key questions, generate a project template). Once a model is selected, clicking any card sends its question straight away.

## Confirm it worked

- Success: an answer appears in the assistant bubble, with a row of token usage numbers beneath it.
- Failure: the message position shows "Generation failed" or an error message. Match it against the tables below.

## Common issues

### Models and keys

| Message on the page | Possible cause | What to do |
| --- | --- | --- |
| No API Key Found | The account has no key | Click **Create API Key** in that message and create one |
| No Models Available | The account has no model channel | Ask the platform administrator to open a model for you |
| Invalid API key | The key was deleted, disabled or has expired | Check its status in [API Keys](./token.md) and use a valid one |
| This model is not priced. Contact an administrator. | The model has no price, so it cannot be used for chat | Switch to another model, or ask an administrator to price it |
| I cannot select a model | It is not a chat model, or it is not priced yet | Check its type in [Models](./marketplace.md) |

### Rate limits and content policy

| Message on the page | Possible cause | What to do |
| --- | --- | --- |
| Too many requests, please try again later | A rate limit was hit (token or channel RPM / TPM exhausted) | Wait a moment and send again, or slow down |
| Context length exceeded | The conversation is longer than the model can remember | Click **Clear conversation** to start over, or switch to a model with more context |
| The request was blocked by a content safety policy | The content hit a safety policy | Rephrase and remove anything that may violate policy |
| The model ended the reply early because sensitive-content policy was triggered | The reply was interrupted by policy | Rephrase and retry; the reply may carry an upstream request ID — give it to an administrator |
| Nothing happens mid-generation | Network hiccup or a dropped connection | Click **Stop**, then retry the message |

### Balance and plans (unrelated to parameters)

| Message on the page | What it means | What to do |
| --- | --- | --- |
| The balance is too low and the request was rejected. Buy a plan or turn on overage charging. Contact an administrator to add credit. | The balance cannot cover the call | Check [Account](./billing.md); buy a plan in [Subscribe](./subscribe.md); ask an administrator to add credit |
| The account is frozen or disabled. Contact an administrator. | Account status problem | Only an administrator can fix it |
| Plan credits are used up. Turn on overage charging to keep going; the extra is paid from your balance. | Credits are gone and overage charging is off | Buy a new plan, or ask an administrator to turn overage charging on |
| Your plan does not include this model. Turn on overage charging to use it from your balance. | This model is not part of the plan | Switch models, or turn overage charging on so the balance pays |
| Weekly quota is used up. It resets at a given time. You can also contact your administrator. | The weekly quota hit its ceiling | Wait for the reset time shown; if urgent, contact an administrator or buy a higher plan |

:::info What that trailing ID is
Most errors append "(Upstream request ID: xxx)". That is the number the model provider assigned to this request; pass it to an administrator and they can locate the call directly.
:::

## Related

- [Models](./marketplace.md)
- [Comparison](./compare.md)
- [Parameter Settings](./debug.md)
- [API Keys](./token.md)
- [Account](./billing.md)
- [Subscribe](./subscribe.md)
