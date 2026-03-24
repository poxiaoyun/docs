---
title: 'Access Tokens'
updated: '2026-03-23'
---

## Overview

Access Tokens are personal API credentials used to authenticate CLI, SDK, and programmatic access to Moha — for Git operations, the `huggingface-hub` SDK, and the Docker registry.

## Navigation

**Console → Moha → Tokens** (or **IAM → Personal Access Tokens**)

## Token List

![Access Tokens](/assets/screenshots/console/moha-tokens.png)

| Column | Description |
|--------|-------------|
| Name | Token display name |
| Permissions | Read-only / Read-write |
| Last Used | Timestamp of most recent use |
| Expires At | Expiry date (or "Never") |
| Actions | Copy / Revoke |

## Creating a Token

1. Click **New Token**.
2. Enter a descriptive name (e.g., "laptop-dev", "ci-pipeline").
3. Choose the permission level.
4. Set an optional expiry date.
5. Click **Generate Token**.
6. **Copy the token now** — it is shown only once.

### Configuration Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| Name | Text | ✅ | Descriptive label for this token |
| Permissions | Radio | ✅ | Read (pull only) or Read-write (pull + push) |
| Expiry | Date | — | Leave empty for a non-expiring token |

> **Security tip**: Use read-only tokens for download-only workflows. Use expiring tokens for CI/CD pipelines.

## Using a Token

### Git over HTTPS

```bash
git clone https://rune.develop.xiaoshiai.cn/moha/username/model.git
# When prompted for password, enter your access token
```

Or embed in the URL (not recommended for shared scripts):

```bash
git clone https://username:TOKEN@rune.develop.xiaoshiai.cn/moha/username/model.git
```

### huggingface-hub SDK

```python
from huggingface_hub import login
login(token="hf_your_moha_token")
```

### Docker Registry

```bash
docker login rune.develop.xiaoshiai.cn \
  --username YOUR_USERNAME \
  --password YOUR_TOKEN
```

## Revoking a Token

1. Find the token in the list.
2. Click **Revoke**.
3. Confirm the action.

The token is immediately invalidated. Any applications using it will lose access.

## Security Notes

- Treat tokens like passwords — never commit them to Git repositories.
- Rotate tokens regularly, especially for CI/CD systems.
- Use the minimum required permission (prefer read-only for download workflows).
- If you suspect a token has been compromised, revoke it immediately.
