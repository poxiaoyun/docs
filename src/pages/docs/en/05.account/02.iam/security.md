---
title: 'Security Settings'
updated: '2026-09-12'
description: Change password / email / phone and MFA (collection page).
---

## Overview

"Security Settings" is a documentation-level grouping. There is **no** dedicated "Security" Tab in code. The features live in four Personal Center tabs, described together here.

| Feature | Tab | Route | View |
|---------|-----|-------|------|
| Change password | Password | `/iam/account/change-password` | `change-password.tsx` |
| Change email | Email | `/iam/account/change-email` | `change-email.tsx` |
| Change phone | Mobile Number | `/iam/account/change-mobile` | `change-mobile.tsx` |
| MFA | Multi-factor Authentication | `/iam/account/mfa` | `mfa.tsx` |

## Change Password

| Field | Key | Front-end Validation |
|-------|-----|----------------------|
| Old password | `oldPassword` | Non-empty |
| New password | `newPassword` | ≥ 8 chars, printable ASCII |
| Confirm new password | `confirmNewPassword` | ≥ 8 chars, printable ASCII, must match |

Extra rule: `oldPassword` must differ from `newPassword`.

| Item | Value |
|------|-------|
| Endpoint | `POST /api/iam/current/reset-password` |
| Body | `{ "password": "<old>", "newPassword": "<new>" }` |

> ⚠️ Note: There is **no** password strength indicator (weak/medium/strong). Rules come from `schemaHelper.password`, the same as registration.

## Change Email

| Field | Key | Front-end Validation |
|-------|-----|----------------------|
| New email | `newEmail` | Non-empty + email format |
| Code | `code` | Non-empty (email code) |

| Item | Value |
|------|-------|
| Endpoint | `POST /api/iam/current/reset-email` |
| Body | `{ "newEmail": "...", "code": "..." }` |

## Change Phone

| Field | Key | Front-end Validation |
|-------|-----|----------------------|
| New phone | `newPhone` | Non-empty + 6–16 digits |
| Code | `code` | Non-empty (SMS code) |

| Item | Value |
|------|-------|
| Endpoint | `POST /api/iam/current/reset-phone` |
| Body | `{ "newPhone": "...", "code": "..." }` |

## Verification Code Mechanism

Email and phone changes share `RHFVerifyCode`:

- Send: `POST /api/iam/send-code` with `{ action, target, type }`
  - `action` defaults to `reset`; for email/phone change, `target` is the newly entered value and `type` is `email` / `phone`
- The button enters a **60-second countdown** after sending
- If the backend returns `Need captcha`, the front-end:
  1. Calls `GET /api/iam/captcha`
  2. Opens a dialog for the graphic CAPTCHA
  3. Resends with `captcha: { code, key, provider, name }`

> ⚠️ Note: The graphic CAPTCHA is not a fixed prerequisite; it is triggered only when the backend returns `Need captcha`. Code TTL is backend-defined and unconfirmed.

## MFA

See [MFA](/account/auth/mfa). Key points: entering the page auto-calls `POST /api/iam/init-mfa`; there is no separate "Enable MFA" button; the Stepper has two steps; only the first recovery code is shown.

## Notes

- Security actions all live in Personal Center tabs — there is no dedicated Security page
- Changing the password requires the old password
- Changing email/phone requires a code for the new value
