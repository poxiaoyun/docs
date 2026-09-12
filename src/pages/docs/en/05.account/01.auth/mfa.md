---
title: 'Multi-Factor Authentication (MFA)'
updated: '2026-09-12'
description: TOTP-based MFA binding and reset in the Personal Center.
---

## Overview

The Personal Center provides TOTP-based multi-factor authentication binding: on page load the server generates a secret and an otpauth URL, the front-end renders the URL as a QR code, and the user scans it and enters a dynamic code to finish binding.

- Route: `/iam/account/mfa`
- View: `src/pages/iam/account/mfa.tsx`

## Navigation

Personal Center (avatar menu → Settings) → top Tab "Multi-factor Authentication"

## Initialized on Page Load

> ⚠️ Note: This page has **no** "Enable MFA" button. Entering the page automatically calls `POST /api/iam/init-mfa` with `{ "provider": "" }` (`mfa.tsx:75`).

The response (`MFAConf`) contains:

| Field | Description |
|-------|-------------|
| `url` | otpauth URL, rendered as a 220px canvas QR code via `qrcode` |
| `secret` | Secret key |
| `recoveryCodes` | Recovery code array |
| `username`, `provider` | Account and provider |

## Step Structure

The Stepper has only **2 steps** (`mfa.tsx:55-62`):

| # | Label | Content |
|---|-------|---------|
| 1 | `enter_code` | QR code + code input + Bind button |
| 2 | `enabled` | Bound-success state |

It starts at step 1; if the current user's `mfa.enabled` is true, it starts at step 2 (`mfa.tsx:94-96`).

## Step 1: Scan and Bind

| Area | Description |
|------|-------------|
| QR code | Canvas rendered from `mfa.url`, with the platform logo centered |
| Hint | `enter_code_tip` |
| Code input | Field `code`, required |
| Action | "Bind" (`bind`), submits the form |

Bind request:

```json
{
  "code": "<current 6-digit TOTP code>",
  "action": "bind",
  "provider": "app"
}
```

Endpoint: `POST /api/iam/verify-mfa` (`mfa.tsx:174-179`). On success the form resets, a success message shows, and the step advances to step 2.

> ⚠️ Note: The page only renders the QR canvas. It does **not** render the secret as text, and there is no "can't scan / manual entry" entry.

## Step 2: Bound and Recovery Code

Step 2 shows the bound-success state and, in the success alert:

- The `mfa_success_tip` text
- The recovery code: **only the first one**, `recoveryCodes[0]` (`mfa.tsx:190`)

> ⚠️ Note: The code only shows `recoveryCodes[0]`, not the full list, and there are no copy/download buttons.

## Re-bind

Step 2 provides a "Reset" (`reset`) button that returns to step 1 for re-scanning and re-binding (`mfa.tsx:207-217`).

> ⚠️ Note: There is **no** "Disable MFA" button and **no** "disable with verification code" flow. The code only offers a re-bind path back to step 1.

## Notes

- The page calls `init-mfa` on entry — do not expect a "click the button first" flow
- The bind request always sends `action: 'bind'` and `provider: 'app'`
- Only the first recovery code is displayed
- The MFA check during login is not implemented by this page and is unconfirmed here
