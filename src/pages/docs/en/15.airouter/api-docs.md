---
title: 'API docs'
updated: '2026-10-21'
description: 'Connecting models to your own program: what the service address is, which auth header to send, which endpoints exist, and how to make the first call.'
---

# API docs

**API docs** is written for people who write code: it puts the three things you must get right on one page — **which key to use, where to send the request, and which header to send** — followed by the full endpoint list.

Follow this page and your program can call the platform's models; you only need to replace two placeholders.

:::tip An analogy
This page is like access-card instructions: first where to get the card (an API key), then where the door is (the service address), then how to tap the card (the auth header). After that you just follow the door numbers (endpoint paths).
:::

![API reference page: grouped endpoints with request examples](/assets/screenshots/airouter/api-docs-01.png)

## Before you start

- A signed-in account, with **an API key already created**. If not, see [API Keys](./token.md).
- The **model ID** you want to call. Pick one in [Models](./marketplace.md); the name on the card is the model ID.
- The key must be allowed for that model, and the account must have balance or plan credits, otherwise calls return billing errors (see [Account](./billing.md)).

## Three steps to connect

Three guide cards sit side by side at the top of the page:

| Guide card | Text | What you do |
| --- | --- | --- |
| **Create an API key** | "Open the key page, create a key, and replace the sample secret when you call." | Click through to [API Keys](./token.md), create a key and copy its full value |
| **Set the service address** | Shows this site's gateway root, with a copy button | Copy it and use it as the prefix for every request |
| **Send the auth header** | "OpenAI-compatible APIs use Authorization. Anthropic APIs use x-api-key." | Pick the right header name for your protocol |

### How to build the service address

The guide card shows an address shaped like:

```
https://your-site/airouter-data
```

**Every endpoint hangs off it.** For example, the full chat completion URL is:

```
https://your-site/airouter-data/v1/chat/completions
```

:::warning Do not drop `/airouter-data`
That prefix is the model gateway entry; it is not optional. Without it the request hits the site itself and usually returns a web page instead of a model result.
:::

## Endpoint reference

The two tables below mirror the **Endpoints** section, switched by the **OpenAI** / **Anthropic** tabs. Paths are **relative** to the service address; prefix them with `/airouter-data` when calling.

### OpenAI-compatible protocol

The auth column reads **Bearer API key**, so the header is `Authorization: Bearer your-key`.

| Method | Path | Purpose |
| --- | --- | --- |
| POST | `/v1/chat/completions` | Chat completion, including streaming |
| GET | `/v1/models` | List callable models |
| POST | `/v1/embeddings` | Text embeddings |
| POST | `/v1/rerank` | Document rerank |
| POST | `/v1/audio/speech` | Speech synthesis |
| POST | `/v1/audio/transcriptions` | Speech transcription |
| POST | `/v1/responses` | Create a response |
| GET | `/v1/responses/{id}` | Retrieve a response |
| DELETE | `/v1/responses/{id}` | Delete a response |
| POST | `/v1/responses/{id}/cancel` | Cancel a response |
| GET | `/v1/responses/{id}/input_items` | List response input items |
| POST | `/v1/responses/compact` | Compact a response session |
| POST | `/v1/responses/input_tokens` | Estimate response input tokens |
| POST | `/v1/responses/count_tokens` | Count response tokens |
| POST | `/v1/memories/trace_summarize` | Summarize a conversation trace |

### Anthropic protocol

The auth column reads **x-api-key**, so the header is `x-api-key: your-key` (**without** `Bearer`).

| Method | Path | Purpose |
| --- | --- | --- |
| POST | `/v1/messages` | Message completion, including streaming |
| POST | `/v1/messages/count_tokens` | Count input tokens |

:::info Which protocol to use
Use whichever your code already speaks: OpenAI SDKs go through the OpenAI protocol, Anthropic SDKs through the Anthropic protocol. Both reach the same set of models; only the request shape and auth header differ.
:::

## Two ways to authenticate

| Protocol | Header | Example |
| --- | --- | --- |
| OpenAI-compatible | `Authorization` | `Authorization: Bearer sk-xxxxxxxx` |
| Anthropic | `x-api-key` | `x-api-key: sk-xxxxxxxx` |

:::warning Never hard-code the key
Put the key in an environment variable or a secrets manager; never commit it to a repository. A leaked key lets someone else spend your balance. If it leaks, delete that key in [API Keys](./token.md) and create a new one immediately.
:::

## Your first call

Taking chat completions as the example, replace two placeholders and run it:

- `YOUR_TOKEN` → the key you copied;
- `YOUR_MODEL` → the model ID from the card in Models.

```bash
curl --request POST 'https://your-site/airouter-data/v1/chat/completions' \
  --header 'Authorization: Bearer YOUR_TOKEN' \
  --header 'Content-Type: application/json' \
  --data '{
    "model": "YOUR_MODEL",
    "stream": false,
    "messages": [
      {"role": "user", "content": "Hello, introduce yourself"}
    ]
  }'
```

Want a version with the model ID and language already filled in? Open any model in [Models](./marketplace.md) and click **Examples**; it offers **curl**, **Python** and **Go** tabs.

:::tip How to tell it worked
If the response contains a `choices` array and a `usage` field, the call succeeded. The token counts in `usage` show up in [Usage analysis](./usage-statistics.md).
:::

## When a call fails

| Symptom | Possible cause | What to do |
| --- | --- | --- |
| The response is HTML, not JSON | The address is missing `/airouter-data`, or the path is wrong | Build the full path from the address in the guide card |
| 401 / Invalid API key | The key is wrong, disabled or expired | Check its status in [API Keys](./token.md) and copy it again |
| The balance is too low and the request was rejected | The balance cannot cover the call | Check [Account](./billing.md); ask an administrator to add credit |
| Plan credits are used up | Credits gone and overage charging off | Buy a plan in [Subscribe](./subscribe.md), or ask an administrator to turn overage charging on |
| Your plan does not include this model | The plan does not cover the model | Switch models, or ask an administrator to turn overage charging on |
| Too many requests, please try again later | An RPM / TPM rate limit was hit | Lower concurrency or frequency; limits are set by administrators |
| Context length exceeded | A single request exceeds the model's ceiling | Shorten the input or use a model with more context |

For line-by-line detail, open **Request Logs** under [API Keys](./token.md); handing the **Request ID** to an administrator speeds up the investigation.

## Related

- [API Keys](./token.md)
- [Models](./marketplace.md)
- [Prices](./prices.md)
- [Account](./billing.md)
- [Usage analysis](./usage-statistics.md)
