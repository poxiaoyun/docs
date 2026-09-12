---
title: 'Registration'
updated: '2026-09-12'
description: Self-service registration form, field validation, and register API.
---

## Overview

The registration page creates a platform account. Whether the entry is available depends on the platform setting and the running platform.

> ⚠️ Note: The page renders only when the platform setting `enableBossSignup` is true, or when running on the Console platform; otherwise it redirects to 404 (`centered-sign-up-view.tsx:82-84`).

## Access Path

- Login page → "Don't have an account? Register now" (only shown when registration is allowed)
- Direct route: `/auth/sign-up`

## Registration Form

| Field | Type | Required | Front-end Validation | Description |
|-------|------|----------|----------------------|-------------|
| `username` | Text | ✅ | Non-empty | Account name |
| `password` | Password | ✅ | ≥ 8 chars, printable ASCII only | Toggle plain/masked |
| `email` | Text | ✅ | Email format | Receives the email verification code |
| `phone` | Text | ✅ | Non-empty + valid number | Must include country code |
| `code` | Text | ✅ | Non-empty | Email verification code |
| `agreement` | Checkbox | ✅ | Must be checked | Register button stays disabled otherwise |

> ⚠️ Note: There is **no** "Confirm Password", **no** "Invite Code", **no** password strength bar, and **no** SMS code. Only an email code is implemented.

### Password Rules

From `schemaHelper.password` (`components/hook-form/schema-helper.ts:57-67`):

- At least 8 characters
- Printable ASCII only: `/^[\x21-\x7E]{8,}$/`

> ⚠️ Note: The front-end does **not** enforce "must include upper/lowercase letters and digits". Any extra backend rules are unconfirmed here.

### Username Rules

The front-end only checks that `username` is non-empty (`schemaHelper.required`).

> ⚠️ Note: Length, character set, and uniqueness rules are defined by the backend and not enforced by the front-end; unconfirmed in this document.

### Phone Rules

`phone` is **required** and validated as a real number via `parsePhoneNumber(phone)?.isValid()` (`centered-sign-up-view.tsx:92-96`). The parsed `countryCode` is submitted along with the phone.

### Email Verification Code

Component parameters: `action="signup"`, `codeType="email"`, `target=<current email>` (`centered-sign-up-view.tsx:171-178`).

- Sending calls `POST /api/iam/send-code`
- Countdown and code TTL are controlled by the component and backend; unconfirmed here

## Submit

Request body (`centered-sign-up-view.tsx:41-68`):

```json
{
  "username": "alice",
  "displayName": "alice",
  "agreement": true,
  "email": { "value": "alice@example.com", "code": "123456" },
  "phone": { "value": "+8613800000000" },
  "countryCode": "CN",
  "password": { "algorithm": "PlainText", "value": "..." }
}
```

Endpoint: `POST /api/iam/register`

On success the page runs `router.replace(paths.auth.signIn)` and goes to the login page. On failure the backend message is shown at the top.

## Notes

- The phone number is required and must be a valid parsed number
- Whether the registration entry appears depends on `enableBossSignup` and the running platform
- After registration you belong to no tenant by default
