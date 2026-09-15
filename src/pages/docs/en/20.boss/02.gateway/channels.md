---
title: Channel Management
updated: '2026-09-14'
description: 'Connect a provider: build a channel, fill in the address and keys, bind models and verify it works.'
tags:
  - boss
  - gateway
---

# Channel Management

A channel is **one model provider** the gateway is connected to — you can think of it as a telephone line. Callers only submit a model name; the gateway decides which line to take. This page shows you how to build a channel from scratch and confirm that it really works.

By the end you will be able to create a channel pointing at a provider (or a self-hosted model service), bind it to a set of models, control who can use it, and disable or delete it when needed.

:::tip A channel is like a telephone line
One "support number" can sit in front of several lines. The switchboard decides which line is up and which is cheaper. A channel is one of these switchable lines for the gateway: its address, its keys and the models it carries all live inside one channel.
:::

## Before you start

- Permission: you need a platform administrator account (one that can enter the BOSS console).
- Prepare in advance: the **endpoint address** and **API key** the provider gave you (usually a string starting with `sk-`).
- Create a **tenant** on the platform first — a tenant must be selected when creating a channel.

## Concepts you need

| Term | Plain explanation |
| --- | --- |
| Channel | One upstream configuration: address, key, usable models, who may use it |
| Visibility | Who this channel is open to (everyone / one tenant / only you). The tenant option is labelled **Tenant / Workspace** in the UI |
| Priority | When several channels can serve the same model, which one is tried first |
| RPM / TPM | Speed caps: at most how many requests / tokens per minute |
| Endpoint | The provider's interface address; requests are actually sent here |

## Open Channel Management

1. Click **Model Gateway** in the top navigation bar.
2. Expand **Model Services** and click **Channel Management**.
3. The **Create Channel** button is in the top-right corner, and the list below shows the channels that already exist.

## Reading the channel list

| Column | Meaning |
| --- | --- |
| Name | A channel name for you to tell channels apart |
| Provider / Endpoint | Provider type on top, interface address underneath |
| Visibility | Public, Tenant / Workspace, Private |
| Applicable Models | Which models this channel supports; click to expand |
| Priority | The higher the number, the higher the priority |
| RPM / TPM | An infinity symbol means unlimited; TPM is in units of `K` |
| Status | A green check means enabled, a grey cross means not enabled |
| Tenant / Workspace | Shown for tenant-level or private channels |
| Owner | Who created the channel |
| Created At | When the channel was created |

The list supports multi-select, and there is a **refresh** button in the top-right corner to pull the data again manually. Above it you can filter by **Visibility** and by **Provider**.

![Channel list: name, provider / endpoint, visibility, applicable models, priority and RPM / TPM](/assets/screenshots/boss/gateway-channel-01.png)

The channel list packs provider and endpoint into one cell: the provider type on top, the endpoint URL below. Only `pipellm` has a non-zero **Priority** (`10`) in the screenshot — higher wins. `RPM / TPM` reading `∞ / ∞` means neither channel is rate limited. Further right the table also has **Status**, **Tenant / Workspace** and **Owner** columns, which need horizontal scrolling on a narrow window.

## Create a channel

1. On the **Channel Management** page click **Create Channel** in the top-right corner.
2. Fill in the form field by field:

   | Form field | How to fill it | Notes |
   | --- | --- | --- |
   | Tenant | Search and select a tenant | Required; disabled tenants cannot be selected |
   | Workspace | For example `default` | Optional, to distinguish ownership further |
   | Name | For example `my-openai` | Required, anything you can recognize |
   | Provider / Endpoint | Pick one from the dropdown | Required; see "Supported providers" below |
   | Endpoint | The provider's interface address | Required; on a new channel the default address is filled in for you once you pick a provider |
   | Visibility | Public, Tenant / Workspace, Private | Required, defaults to **Public** |
   | Priority | For example `0` | Required, defaults to `0`; higher wins |
   | Enabled | On by default | When off, this channel is never selected |
   | RPM | For example `600` | Optional, `0`–`10000`; leave it empty for unlimited |
   | TPM (K) | For example `48000` | Optional, `0`–`100000`, in units of K (1K = 1000 tokens per minute) |
   | Upstream API Keys | The keys from the provider | One per line; several may be entered to rotate between |
   | Supported Models | For example `gpt-4o-mini` | One model name per line |

3. Under the Endpoint box the address this channel will actually call is shown live, in the form `Chat: <your endpoint>/chat/completions`. Check it against the provider's documentation.
4. When everything looks right, click **Create**.

Nothing is lost if you get it wrong: go back to the list, click **Edit** and change it.

![The top half of the Create channel form: tenant / workspace, workspace, name, provider / endpoint and endpoint](/assets/screenshots/boss/gateway-channel-02.png)

The first field, **Tenant / Workspace**, is required. Once you pick a **Provider**, the **Endpoint** field below is prefilled with that provider's default address. The credential fields are further down and need a scroll.

### Supported providers

The dropdown has 10 providers. Picking one fills in the default endpoint (when editing an existing channel, your current address is not overwritten).

| Dropdown name | Typical use | Default endpoint |
| --- | --- | --- |
| openai | Official OpenAI | `https://api.openai.com` |
| openai-compatible | Self-hosted or OpenAI-compatible services | You must fill it in yourself |
| dashscope | Alibaba Cloud Qwen | `https://dashscope.aliyuncs.com/compatible-mode/v1` |
| baidu | Baidu Qianfan | `https://qianfan.baidubce.com/v2` |
| moonshot | Kimi | `https://api.moonshot.cn/v1` |
| zhipu | Zhipu | `https://open.bigmodel.cn/api/paas/v4` |
| siliconflow | Aggregator | `https://api.siliconflow.cn/v1` |
| openrouter | Aggregator | `https://openrouter.ai/api/v1` |
| doubao | Volcano Ark Doubao | `https://ark.cn-beijing.volces.com/api/v3` |
| deepseek | DeepSeek | `https://api.deepseek.com/v1` |

:::tip Connecting a self-hosted model service
If you run your own inference service such as vLLM or TGI, choose **openai-compatible**, enter its interface address manually, and list the model names the service actually serves under **Supported Models**.
:::

### Choosing a visibility

| Choice | Who can use this channel |
| --- | --- |
| **Public** | Every authenticated caller |
| **Tenant / Workspace** | Only members of the selected tenant |
| **Private** | Only the person who created the channel |

:::warning Narrowing visibility is risky
Once the scope is reduced, callers that could use this channel lose access to it immediately. Before changing it, make sure no running workload depends on the channel.
:::

### Filling in RPM / TPM

- Leaving both empty or at `0` means **unlimited**.
- RPM caps at `10000` and TPM at `100000` (in units of K, i.e. one hundred thousand K tokens per minute).
- This rate limit is applied to the **channel**; an API key can carry a second limit on top, and both take effect at the same time.

## Verify the channel works

There is **no "test" button** on the page, so you verify by sending a real request.

1. Confirm the channel's status is enabled and that **Supported Models** contains the model name you want to test.
2. Use any valid **API key** to make one real call to that model.
3. Go to **User Management → Call Logs** in the left sidebar. If the call appears there with a **Success** result, the channel is working.

If the call log shows a failure, first check the endpoint address, the upstream API key and the model name against the provider's documentation.

## Day-to-day actions

In the collapsed menu at the end of each row you can:

| Action | Notes |
| --- | --- |
| Enable / Disable | Flip whether this channel takes part in routing; the list refreshes automatically |
| Update Visibility | The dialog can change **Visibility** only; tenant and workspace are left alone |
| Edit | Go back to the form and change the channel's settings |
| Delete | You must **type the channel name in the confirmation dialog** before it will delete |

:::warning Deleting cannot be undone
A deleted channel cannot be restored, and calls that referenced it lose that line immediately. Disabling is usually safer than deleting — a disabled channel can be enabled again at any time.
:::

## Confirm it worked

Go back to the **Channel Management** list: the new channel appears with a green check. If **Call Logs** shows successful calls going through it, your configuration is live.

## FAQ

| Symptom | Likely cause | What to do |
| --- | --- | --- |
| Nothing in Call Logs | The channel is not enabled, or no caller is using it | Confirm the channel is enabled and actually send one request |
| Calls fail with an authentication error | The upstream API key is wrong or expired | Edit the channel and paste the key again |
| Requests never reach this channel | The visibility scope excludes the caller, or the priority is too low | Adjust the visibility or the priority |
| Changed the provider but the endpoint did not change | Editing never overwrites an existing endpoint | Set the endpoint to the correct address yourself |

## Related

- [Model Configuration](/boss/gateway/model-metadata): maintain model prices and context length
- [Token Management](/boss/gateway/api-keys): issue the API keys used for calls
- [Call Logs](/boss/gateway/audit): inspect the details of every call
