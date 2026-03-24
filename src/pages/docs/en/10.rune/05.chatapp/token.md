---
title: 'ChatApp API Tokens'
updated: '2026-03-23'
---

## Overview

ChatApp API Tokens grant programmatic access to ChatApp's AI services via the OpenAI-compatible API. Use these tokens to integrate your applications, scripts, and tools directly with the platform's LLM Gateway.

## Navigation

**ChatApp → Tokens**

## Token List

![ChatApp Tokens](/assets/screenshots/console/chatapp-tokens.png)

| Column | Description |
|--------|-------------|
| Name | Token display name |
| Token Preview | First and last characters of the token |
| Created At | Creation timestamp |
| Last Used | Most recent API call timestamp |
| Expires At | Expiry date (or "Never") |
| Actions | Revoke |

## Creating a Token

1. Click **Create Token**.
2. Enter a descriptive name.
3. Set an optional expiry date.
4. Click **Generate**.
5. **Copy the token immediately** — it is shown only once.

## Using the Token

ChatApp tokens are passed in the HTTP `Authorization` header following the OpenAI convention:

```bash
curl https://rune.develop.xiaoshiai.cn/api/airouter/v1/chat/completions \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "your-model-name",
    "messages": [
      {"role": "user", "content": "Hello!"}
    ]
  }'
```

### OpenAI SDK Compatibility

```python
from openai import OpenAI

client = OpenAI(
    api_key="YOUR_CHATAPP_TOKEN",
    base_url="https://rune.develop.xiaoshiai.cn/api/airouter/v1"
)

response = client.chat.completions.create(
    model="your-model-name",
    messages=[{"role": "user", "content": "Explain quantum computing"}]
)
print(response.choices[0].message.content)
```

## Revoking a Token

Click **Revoke** next to any token to immediately invalidate it. This cannot be undone.

## Permissions

| Action | Required Role |
|--------|--------------|
| Create / view tokens | Developer or Admin |
| Revoke tokens | Developer (own) or Admin |

## Security Notes

- Store tokens in environment variables or secret managers — never hardcode them.
- Use short-lived tokens (set an expiry) for automated pipelines.
- Revoke tokens immediately if they are exposed or no longer needed.
