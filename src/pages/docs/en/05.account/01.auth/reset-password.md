---
title: 'Reset Password'
updated: '2026-09-12'
description: Forgot-password and update-password pages (v1 front-end placeholders).
---

## Overview

The "Forgot Password?" link on the login page starts the password reset flow. Two pages exist in the codebase:

| Page | Route | View |
|------|-------|------|
| Reset password (email input) | `/auth/reset-password` | `centered-reset-password-view.tsx` |
| Update password (code + new password) | `/auth/update-password` | `centered-update-password-view.tsx` |

> ❌ Error: In v1 these two pages are **not connected to a backend**. Submitting only runs `setTimeout(500)` and `console.info`s the form data (`centered-reset-password-view.tsx:48-55`, `centered-update-password-view.tsx:70-77`). No API is called and no password is actually changed. A full "email/phone + code → new password → redirect" flow does not exist.

## Reset Password Page

Route: `/auth/reset-password`

Only one field:

| Field | Type | Required | Front-end Validation |
|-------|------|----------|----------------------|
| `email` | Text | ✅ | Non-empty + email format |

The page has a Send button and a return-to-login link. There is no phone input, no code input, and no "Next" step.

> ⚠️ Note: The button says "Send", but submitting only prints data — it does not actually send an email code.

## Update Password Page

Route: `/auth/update-password`

Fields (`centered-update-password-view.tsx:27-46`):

| Field | Type | Required | Front-end Validation |
|-------|------|----------|----------------------|
| `code` | Text | ✅ | Non-empty and length ≥ 6 |
| `email` | Text | ✅ | Non-empty + email format |
| `password` | Password | ✅ | Non-empty and length ≥ 6 |
| `confirmPassword` | Password | ✅ | Non-empty and must match `password` |

A "resend code" component is rendered, but its callback is an empty function (`onResendCode={() => {}}`) and triggers no request.

> ⚠️ Note: The page title and description are hard-coded English (e.g. `Request sent successfully!`), independent of the platform language.

## Notes

- Field validation on these pages is the **only** front-end constraint and does not represent the backend contract
- The `password` ≥ 6 rule differs from the register page's `schemaHelper.password` (≥ 8) — a placeholder artifact
- The planned backend reset endpoint and request body are unconfirmed
