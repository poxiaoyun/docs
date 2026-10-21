---
title: 'API 文档'
updated: '2026-10-21'
description: '要把模型接进自己的程序：服务地址填什么、请求头怎么带、有哪些接口、第一段代码怎么跑通。'
---

# API 文档

**API 文档** 页是给「写代码的人」看的：它把三件必须先搞清楚的事摆在一页里——**用哪把密钥、请求发到哪个地址、请求头怎么带**，再给出完整的接口清单。

照着这一页做完，你就能用自己的程序调用平台上的模型；不需要读完所有文档，只需要改两个占位符。

:::tip 打个比方
这一页像门禁说明书：先告诉你去哪办卡（API 密钥），再告诉你大门在哪（服务地址），最后告诉你怎么刷卡（请求头）。剩下的事就是按门牌号（接口路径）找房间。
:::

![API 文档页：按接口分组的说明与请求示例](/assets/screenshots/airouter/api-docs-01.png)

## 开始之前

- 已登录账号，并且**已经有一把 API 密钥**。没有的话先看 [API 密钥](./token.md)。
- 知道要调哪个**模型 ID**。到 [模型广场](./marketplace.md) 挑一个，卡片上的名字就是模型 ID。
- 密钥要有对应模型的权限，账户也要有余额或套餐点数，否则调用会返回计费类错误（见 [账户](./billing.md)）。

## 三步接进来

页面顶部并排三张引导卡，就是接入的三个步骤：

| 引导卡 | 说明 | 你要做的 |
| --- | --- | --- |
| **创建 API Key** | 「打开密钥页创建密钥，调用时替换示例里的密钥。」 | 点卡片上的链接去 [API 密钥](./token.md)，建一把并把完整值复制出来 |
| **配置服务地址** | 显示当前站点的网关根地址，右边有复制按钮 | 复制它，作为所有请求的前缀 |
| **携带鉴权请求头** | 「OpenAI 兼容接口使用 Authorization，Anthropic 接口使用 x-api-key。」 | 按你用的协议选对请求头名字 |

### 服务地址怎么拼

引导卡里显示的地址形如：

```
https://你的站点域名/airouter-data
```

**所有接口都挂在它后面。** 例如对话补全的完整地址是：

```
https://你的站点域名/airouter-data/v1/chat/completions
```

:::warning 别漏掉 `/airouter-data`
这个前缀是模型网关的入口，不是可选的。少了它，请求会打到站点本身，返回的通常是网页而不是模型结果。
:::

## 常用接口一览

下面两张表来自页面里的 **常用接口** 区块，用页签 **OpenAI** / **Anthropic** 切换。路径都是**相对**服务地址的，实际请求时要在前面拼上 `/airouter-data`。

### OpenAI 兼容协议

鉴权列显示 **Bearer API Key**，即请求头写成 `Authorization: Bearer 你的密钥`。

| 方法 | 路径 | 用途 |
| --- | --- | --- |
| POST | `/v1/chat/completions` | 对话补全，支持流式 |
| GET | `/v1/models` | 列出可调用模型 |
| POST | `/v1/embeddings` | 文本向量 |
| POST | `/v1/rerank` | 文档重排 |
| POST | `/v1/audio/speech` | 语音合成 |
| POST | `/v1/audio/transcriptions` | 语音转写 |
| POST | `/v1/responses` | 创建 Responses |
| GET | `/v1/responses/{id}` | 查询 Responses |
| DELETE | `/v1/responses/{id}` | 删除 Responses |
| POST | `/v1/responses/{id}/cancel` | 取消 Responses |
| GET | `/v1/responses/{id}/input_items` | 列出 Responses 输入项 |
| POST | `/v1/responses/compact` | 压缩 Responses 会话 |
| POST | `/v1/responses/input_tokens` | 估算 Responses 输入 Token |
| POST | `/v1/responses/count_tokens` | 统计 Responses Token |
| POST | `/v1/memories/trace_summarize` | 摘要会话轨迹 |

### Anthropic 协议

鉴权列显示 **x-api-key**，即请求头写成 `x-api-key: 你的密钥`（**不加** `Bearer`）。

| 方法 | 路径 | 用途 |
| --- | --- | --- |
| POST | `/v1/messages` | 消息补全，支持流式 |
| POST | `/v1/messages/count_tokens` | 统计输入 Token |

:::info 两套协议怎么选
你现有的代码用的是哪套 SDK，就选哪套：用 OpenAI SDK 的走 OpenAI 协议，用 Anthropic SDK 的走 Anthropic 协议。两边都能调到同一批模型，区别只在请求格式和鉴权头。
:::

## 鉴权两种写法

| 协议 | 请求头 | 示例 |
| --- | --- | --- |
| OpenAI 兼容 | `Authorization` | `Authorization: Bearer sk-xxxxxxxx` |
| Anthropic | `x-api-key` | `x-api-key: sk-xxxxxxxx` |

:::warning 密钥别写死在代码里
把密钥放进环境变量或密钥管理服务，不要提交进代码仓库。密钥泄露等于别人可以拿你的余额去调用模型。发现泄露立刻到 [API 密钥](./token.md) 删除那把密钥并新建一把。
:::

## 第一次调用

以对话补全为例，把两个占位符换掉就能跑：

- `YOUR_TOKEN` → 你复制的密钥；
- `YOUR_MODEL` → 模型广场卡片上的模型 ID。

```bash
curl --request POST 'https://你的站点域名/airouter-data/v1/chat/completions' \
  --header 'Authorization: Bearer YOUR_TOKEN' \
  --header 'Content-Type: application/json' \
  --data '{
    "model": "YOUR_MODEL",
    "stream": false,
    "messages": [
      {"role": "user", "content": "你好，介绍一下你自己"}
    ]
  }'
```

想直接拿到已经填好模型 ID、语言也选好的版本：到 [模型广场](./marketplace.md) 打开任意模型详情，点 **调用示例**，里面有 **curl**、**Python**、**Go** 三个标签页。

:::tip 验证是否成功
返回里有 `choices` 数组和 `usage` 字段，就说明通了。`usage` 里的 Token 数会体现在 [调用分析](./usage-statistics.md) 里。
:::

## 调用失败了怎么看

| 现象 | 可能原因 | 怎么办 |
| --- | --- | --- |
| 返回的是网页 HTML，不是 JSON | 地址少了 `/airouter-data`，或者路径写错 | 用引导卡里的地址拼完整路径 |
| 401 / 无效的 API 密钥 | 密钥写错、被禁用或已过期 | 到 [API 密钥](./token.md) 确认状态，重新复制 |
| 余额不足，请求被拒绝 | 余额扣不动了 | 到 [账户](./billing.md) 看余额；充值找管理员 |
| 套餐点数已用完 | 点数用完，且没开超额扣费 | 买套餐见 [订阅](./subscribe.md)，或请管理员开启超额扣费 |
| 当前模型不在套餐覆盖范围内 | 这份套餐不含该模型 | 换模型，或请管理员开启超额扣费 |
| 请求过于频繁，请稍后再试 | 触发 RPM / TPM 限速 | 降低并发或频率；限速值由管理员配置 |
| 上下文长度超出限制 | 单次请求内容超过模型上限 | 缩短输入或换上下文更大的模型 |

逐条明细可以到 [API 密钥](./token.md) 的 **请求日志** 里查，把 **请求 ID** 交给管理员能更快定位。

## 相关

- [API 密钥](./token.md)
- [模型广场](./marketplace.md)
- [价格](./prices.md)
- [账户](./billing.md)
- [调用分析](./usage-statistics.md)
