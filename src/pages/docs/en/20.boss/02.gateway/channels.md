---
title: 'Channel Management'
updated: '2026-10-21'
description: 'Connect model providers to the gateway: create a channel, pick the protocol, fill in endpoint and keys, bind models and verify it works.'
tags:
  - boss
  - gateway
---

# Channel Management

A channel is **one model provider** behind the gateway — think of it as one phone line. Callers submit only a model name, and the gateway decides which line to use. This page shows you how to set up a channel from scratch and confirm that it really works.

After reading it you can: create a channel pointing at a provider (or a self-hosted model service), pick the right upstream protocol, list the models it serves, control who can use it, and disable or delete it when needed.

:::tip A channel is like a phone line
One "support number" can be wired to several lines. Which line is up and which is cheaper is decided by the switchboard. A channel is one of those switchable lines for the gateway: the address, the key and the models it can serve all live in one channel record.
:::

## Before you start

- Permission: a platform administrator account (able to open the BOSS admin console).
- Have the **API base URL** and **API key** from the provider ready (usually a string starting with `sk-`).
- Create the **tenant** on the platform first — a new channel must belong to a tenant, plus a workspace.
- **Set prices first**: the models this channel serves must already have a currently effective price in the platform default plan under [Rate Plans](/boss/gateway/rate-plans). Unpriced models make "Enable" fail; see "Priced first, then enabled" below.

## Understand the concepts

| Term | Plain explanation |
| --- | --- |
| Channel | One upstream configuration: address, key, models it serves, who may use it |
| Provider | Which vendor this channel connects to. It decides the default endpoint the form fills in |
| API base type | Which "dialect" the upstream speaks: OpenAI (Chat Completions) or Anthropic (Messages API) |
| Endpoint | The provider's API base URL; requests actually go here |
| Visibility | Who may use this channel: public / internal / private |
| Priority | Which channel wins when several can serve the same model |
| RPM / TPM / QPS / Concurrency | Four speed caps: requests per minute, tokens per minute, requests per second, in-flight requests |

## Reading the channel list

| Column | Meaning |
| --- | --- |
| Name | The channel name, for your own reference |
| Provider | The provider name on the first line, the endpoint on the second |
| Visibility | Public / Internal / Private |
| Supported models | Which models this channel serves; expandable |
| Priority | Higher numbers win |
| RPM / TPM | "∞" means unlimited; TPM is in `K` |
| Status | Green check means enabled, grey cross means disabled |
| Tenant | The cluster on the first line, the workspace on the second |
| Owner | Who created the channel |
| Created at | When the channel was created |

Above the list there is a **search box** (by name) plus two filters, **Visibility** and **Provider**. Select several rows to **batch delete**; you will be asked to confirm once more.

![Channel list: name, provider, visibility, supported models, priority, RPM / TPM](/assets/screenshots/boss/gateway-channel-01.png)

The list squeezes "provider" and "endpoint" into one cell: the provider name on top, the endpoint below. In this screenshot only one channel has a **Priority** of `10` and the rest are `0` — higher numbers are picked first. The **Status**, **Tenant** and **Owner** columns sit further right, so you need to scroll horizontally on a narrow window.

## Create a channel

1. On the **Channel Management** page, click **Create Channel** in the top right corner.
2. Fill in the form from top to bottom, following the four sections below.
3. Click **Confirm** at the bottom of the form to save.

Mistakes are not final: go back to the list, click **Edit** and change it.

### Ownership and name

| Field | How to fill it | Notes |
| --- | --- | --- |
| Tenant | Search and pick a tenant | Required; disabled tenants cannot be picked, and the field is locked when editing |
| Workspace | For example `default` | **Required**; separates spaces inside the same tenant |
| Name | For example `my-openai` | Required, any name you recognise |
| Visibility | Public / Internal / Private | Required, defaults to Public |
| Priority | For example `0` | Required, defaults to `0`; higher numbers win |
| Enabled | On by default | When off, the channel is never selected |

![Create channel form, upper half: tenant, workspace, name, provider, visibility, priority](/assets/screenshots/boss/gateway-channel-02.png)

Both **Tenant** and **Workspace** are required. After you pick a **Provider**, the **Endpoint** field below is pre-filled with that provider's default URL. The key field is not visible here because it sits further down the form.

### Provider and endpoint

The dropdown lists 17 providers. Choosing one fills in the default endpoint (editing an existing channel never overwrites the address you already entered).

| Option | Typical use | Default endpoint |
| --- | --- | --- |
| OpenAI | Official OpenAI | `https://api.openai.com` |
| OpenAI Compatible | Self-hosted or OpenAI-compatible service | Fill in yourself |
| Anthropic Claude | Official Claude | `https://api.anthropic.com` |
| Baidu / Wenxin | Baidu Qianfan | `https://qianfan.baidubce.com/v2` |
| DashScope | Alibaba Cloud Model Studio | `https://dashscope.aliyuncs.com/compatible-mode/v1` |
| Qwen | Qwen models | `https://dashscope.aliyuncs.com/compatible-mode/v1` |
| Moonshot Kimi | Kimi | `https://api.moonshot.cn/v1` |
| MiniMax | MiniMax | `https://api.minimaxi.com/v1` |
| Zhipu GLM | Zhipu | `https://open.bigmodel.cn/api/paas/v4` |
| Doubao | Volcengine Ark | `https://ark.cn-beijing.volces.com/api/v3` |
| DeepSeek | DeepSeek | `https://api.deepseek.com/v1` |
| Hunyuan | Tencent Hunyuan | Fill in yourself |
| Baichuan | Baichuan | Fill in yourself |
| Lingyi | 01.AI | Fill in yourself |
| SenseChat | SenseTime | Fill in yourself |
| SiliconFlow | SiliconFlow | `https://api.siliconflow.cn/v1` |
| OpenRouter | Aggregator | `https://openrouter.ai/api/v1` |

**Endpoint** is required. Once filled, a hint appears below it reading "After save the gateway calls about …" so you can compare the final path with the provider's documentation.

:::tip Connecting a self-hosted model service
If you run vLLM, TGI or a similar inference server, pick **OpenAI Compatible**, type its address, and list every model name that server actually exposes under **Supported Models**.
:::

### Protocol and outbound

These two fields decide the wire format the gateway uses with the upstream. Both are required.

| Field | Options | Notes |
| --- | --- | --- |
| API base type | **OpenAI** (Chat Completions) / **Anthropic** (Messages API) | Declares which upstream API this base URL uses. The gateway builds the path from it and converts the caller protocol when needed |
| /v1/responses outbound | **Native upstream Responses** (default) / **Gateway assembles history** | Only available when the base type is OpenAI. Decides how `/v1/responses` calls leave the gateway |

- With **OpenAI**, keep **Native upstream Responses** when the upstream really serves `/responses`; choose **Gateway assembles history** when it only offers Chat Completions, and the gateway will fold the history into a chat request.
- With **Anthropic**, this field is fixed to **Gateway assembles history**; nothing to change.

### Models and capabilities

| Field | How to fill it | Notes |
| --- | --- | --- |
| Upstream API Keys | The key from the provider | One per line, several allowed for rotation. When editing, leaving it empty keeps the current key |
| Supported Models | For example `gpt-4o-mini` | One model name per line, at least one |
| Model capabilities | Read-only labels | Calculated from the models after you save; shows tools, vision and so on |
| Advanced capability overrides | JSON | Usually left empty; only fill it in when a model's capabilities are detected wrongly |

**Advanced capability overrides** takes an object mapping model names to capability flags, for example:

```json
{ "my-model": { "tools": true, "videoInput": false } }
```

An invalid shape is rejected with "Capability overrides must be a JSON object of model names to boolean capability flags."

:::warning Editing Supported Models re-checks pricing
Adding a model to an enabled channel makes the control plane verify that every new model has a platform default price. If one is missing, the whole save fails and the unpriced models are named.
:::

## Filling in rate limits

| Field | Range | Meaning of empty or `0` |
| --- | --- | --- |
| RPM | `0`–`10000` | No cap on requests per minute |
| TPM (K) | `0`–`100000` | No cap on tokens per minute (unit K, 1K = 1000 tokens) |
| QPS | `0` or more, no upper limit | No cap on requests per second |
| Concurrency | `0` or more, no upper limit | No cap on in-flight requests |

These caps apply to the **channel**. An [API key](/boss/gateway/api-keys) can carry another layer; both apply at the same time and whichever is reached first rejects the request.

## Choosing visibility

| Choice | Who can use this channel |
| --- | --- |
| **Public** | All authenticated callers. Note this is not anonymous access |
| **Internal** | Only members of the designated tenant |
| **Private** | Only the owner of the channel |

:::warning Narrowing visibility is risky
Once you narrow the scope, callers that used this channel lose it immediately. Confirm that no workload depends on it before you change it.
:::

## Priced first, then enabled

The gateway enforces one hard rule: **while a channel is enabled, every model it serves must be covered by the platform default plan right now**. Enabling a channel, and adding a model to an enabled one, therefore checks prices first.

- The form always shows this hint under the Enable switch: **Enable a channel only after its models have a platform price. Contact an administrator if a model is not priced.**
- A failed save reports: **These models are not priced, so the channel cannot be enabled:** (the missing model names). **Contact an administrator.**
- The fix: go to [Rate Plans](/boss/gateway/rate-plans), open the platform default plan and **Set price** for those models (an exact model name, a glob such as `gpt-*`, or `*` for all models all count as coverage), then come back and enable the channel.

:::info Why so strict
If a channel could be enabled before its models were priced, users could call it successfully while the bill said "not priced" — and there would be no defensible answer to "how much should this call have cost". The check therefore happens at save time, not after the first call.
:::

## Verifying a channel works

There is **no Test button** on the page, so you verify with a real request.

1. Confirm the channel status is Enabled and **Supported Models** contains the model you want to test.
2. Use any valid **API key** to make one real call to that model.
3. Open **User Management → Call Logs** in the sidebar. If the call appears with the result **Success**, the channel works.

If Call Logs shows a failure, check the endpoint address, the API base type, the upstream API key and the model name against the provider's documentation.

## Day-to-day actions

The collapsed menu at the end of each row offers:

| Action | Notes |
| --- | --- |
| Enable / Disable | Toggles whether the channel takes part in routing; the list refreshes afterwards. Enabling goes through the price check again |
| Change visibility | The dialog only changes **visibility**; tenant and workspace stay as they are |
| Edit | Returns to the form to change every setting of the channel |
| Delete | You must **type the channel name** in the confirmation dialog before it is deleted |

Selecting several rows also allows **batch delete**, which asks for confirmation as well.

:::warning Deletion is irreversible
A deleted channel cannot be restored, and calls that relied on it lose that line immediately. Disabling is usually safer — you can enable it again at any time.
:::

## Troubleshooting

| Symptom | Likely cause | What to do |
| --- | --- | --- |
| Save says "These models are not priced" | The platform default plan does not cover a model in the channel | Add a currently effective price for the missing model in [Rate Plans](/boss/gateway/rate-plans), then save again |
| Nothing in Call Logs | The channel is disabled, or nobody is calling | Confirm the channel is enabled and send a real request |
| Calls fail with an auth error | The upstream API key is wrong or expired | Edit the channel and paste the key again |
| Requests never reach this channel | Visibility does not include the caller, or priority is too low | Adjust visibility or priority |
| Upstream returns 404 / wrong path | Wrong API base type, or a missing/extra `/v1` in the endpoint | Check whether the provider needs OpenAI or Anthropic, and read the "After save the gateway calls about…" hint |
| Endpoint did not change after switching provider | Editing never overwrites an existing endpoint | Change the address manually |
| The model works but tool calls do not | Capability detection does not match reality | Add a per-model JSON entry under **Advanced capability overrides** |

## Related

- [Rate Plans](/boss/gateway/rate-plans): a channel's models must be priced there first
- [Model Configuration](/boss/gateway/model-metadata): display metadata and context length
- [API Keys](/boss/gateway/api-keys): issue the keys used for calling
- [Call Logs](/boss/gateway/audit): every call that went through this channel
