---
title: 'API Key Management'
updated: '2026-03-23'
---

## Overview

API Keys in the IAM section are personal credentials scoped to the platform APIs (Cloud, Moha, etc.). They are distinct from ChatApp tokens and are used for direct programmatic access to platform REST APIs.

## Navigation

**IAM → API Keys**

## Key List

![API Keys](/assets/screenshots/console/iam-api-keys.png)

| Column | Description |
|--------|-------------|
| Name | Key label |
| Key Preview | Masked value showing first/last characters |
| Created At | Creation timestamp |
| Last Used | Most recent usage timestamp |
| Expires At | Expiry date or "Never" |
| Actions | Copy / Revoke |

## Creating an API Key

1. Click **New API Key**.
2. Enter a descriptive name (e.g., "terraform-automation", "ci-cd-pipeline").
3. Set an optional expiry date.
4. Click **Generate**.
5. **Copy the key immediately** — it will not be shown again.

## Using an API Key

Include the key in the `Authorization` header of API requests:

```bash
curl https://rune.develop.xiaoshiai.cn/api/iam/v1/workspaces \
  -H "Authorization: Bearer YOUR_API_KEY"
```

## Key Security Best Practices

- Use a separate key per application or environment (dev, staging, prod).
- Set short expiry times for keys used in CI/CD pipelines.
- Revoke keys immediately when an application is decommissioned.
- Never share keys between team members — each person should have their own key.
- Store keys in your deployment platform's secret store (AWS Secrets Manager, GitHub Actions secrets, etc.).

## Revoking a Key

Click **Revoke** next to a key. The key is immediately invalidated.

## Permissions

| Action | Required Role |
|--------|--------------|
| Create / manage own keys | Any logged-in user |
| View or revoke other users' keys | System Admin only |
