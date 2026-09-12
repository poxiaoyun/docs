---
title: 'IAM API Key (AK/SK)'
updated: '2026-09-12'
description: Generate / regenerate AccessKey and SecretKey; display only, no delete.
---

## Overview

IAM API Key is an account-level API credential composed of **AccessKey (AK)** and **SecretKey (SK)**. The Personal Center provides generate and regenerate capabilities.

- Route: `/iam/account/api-key`
- View: `src/pages/iam/account/api-key.tsx`

## Navigation

Top-right avatar → Settings → top Tab "API Key"

## Endpoints

| Action | Endpoint |
|--------|----------|
| List keys | `GET /api/iam/current/apikeys` |
| Generate key | `POST /api/iam/current/apikeys` (body `{}`) |

## Page Description

The page is a **single-key view**:

| Area | Description |
|------|-------------|
| Empty state | Shown when no key exists |
| Key area | Shows the key `name` and the full `accessKey` with a copy button |
| Bottom button | "Generate" when empty, "Regenerate" when a key exists |

> ⚠️ Note: The list shows only `name` and `accessKey`. There is **no** "Created At" column, **no** delete button, and **no** expiry / last-used fields. When a key exists, the button label becomes "Regenerate" (`api-key.tsx:169`).

## Generating a Key

1. Click "Generate" / "Regenerate" at the bottom
2. The front-end calls `POST /api/iam/current/apikeys`
3. A success alert appears with:
   - `accessKey` + copy button
   - `secretKey` + copy button

> ⚠️ Note: The SecretKey only appears in the success alert (the copy says it is shown once). It cannot be viewed again from the list.

## Usage

The generated AK/SK is used for API authentication. The header names below are illustrative only — actual field names follow the backend contract:

```bash
curl -X GET https://your-domain/api/resource \
  -H "X-Access-Key: YOUR_ACCESS_KEY" \
  -H "X-Secret-Key: YOUR_SECRET_KEY"
```

> ⚠️ Note: The header names and signing/validation are not represented in the front-end code covered here; they are a backend contract and unconfirmed.

## Notes

- Generating immediately refreshes the list and shows the new AK/SK
- The page provides no way to delete a key
- SecretKey is only shown at generation time
