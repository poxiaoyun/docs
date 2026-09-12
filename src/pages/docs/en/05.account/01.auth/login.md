---
title: 'Login'
updated: '2026-09-12'
description: Username + password login, CAPTCHA, third-party login, and post-login redirect.
---

## Overview

Console (user portal) and BOSS (admin portal) share the same authentication service and the same login route `/auth/sign-in`. The form renders a required agreement checkbox; the Login button stays disabled until it is checked.

## Page Load

On page load, the front-end fires two requests in parallel:

| Request | Purpose |
|---------|---------|
| `GET /api/iam/login-captcha` | Returns the CAPTCHA config and its `key` |
| `GET /api/iam/login-config` | Returns the platform login config |

`login-config` fields:

| Field | Description |
|-------|-------------|
| `allowSignup` | Whether registration is allowed |
| `methods` | Login method list, used to render third-party login buttons |

> ⚠️ Note: Whether a CAPTCHA is required and which kind is used are determined by the `provider` returned from `GET /api/iam/login-captcha`, not by `login-config`.

## Login Form

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `username` | Text | ✅ | Account (username / email) |
| `password` | Password | ✅ | Toggle plain/masked with the eye icon |
| `agreement` | Checkbox | ✅ | Must be checked before Login is enabled |
| `captchaInput` | Text | Conditional | Shown inline only when the provider is `Graphic`; for `Slider` it is entered in a dialog |

> ⚠️ Note: There is **no** "Remember Me" checkbox. `remeberMe` is hard-coded to `true` in the request body (`centered-sign-in-view.tsx:244`) and is not user-configurable.

## CAPTCHA

The backend may return two CAPTCHA providers:

| provider | Interaction |
|----------|-------------|
| `Graphic` | Inline CAPTCHA image + input; click the image to refresh (the `key` is updated too) |
| `Slider` | Clicking Login opens a slider dialog; completing the drag submits automatically |

The request body carries CAPTCHA data as:

```json
{
  "captcha": {
    "code": "<user input or slider offset>",
    "key": "<key from login-captcha>",
    "provider": "Graphic",
    "name": ""
  }
}
```

> 💡 Tip: The CAPTCHA field name is `key`, not `captchaId`.

## Request Body

```json
{
  "username": "alice",
  "type": "Password",
  "remeberMe": true,
  "password": { "algorithm": "PlainText", "value": "..." },
  "captcha": { "code": "...", "key": "...", "provider": "Graphic", "name": "" }
}
```

Endpoint: `POST /api/iam/login`

## Third-Party Login

When `login-config.methods` contains a recognized third-party method, a login button is rendered below the form:

- The method `type` includes `oauth` / `oauth2` / `oidc` / `saml`, or a `provider` is present
- A redirect target must be resolvable (`url` / `href` / `loginUrl` / `authUrl` / `authorizationUrl` / `redirectUrl`, at the top level or nested under `OAuth` / `OAuth2` / `OIDC` / `SAML`)
- The label comes from `displayName` / `label` / `name` / `provider`; the icon from `icon` or `logo`
- Clicking is a plain external link (`<a href>`)

> ⚠️ Note: Which providers are supported and how callbacks are configured is a backend/platform concern. The front-end only renders `methods`; this document does not confirm the provider list.

## Post-Login Redirect

Flow: `POST /api/iam/login` succeeds → `checkUserSession()` → redirect by platform.

| Platform | Target |
|----------|--------|
| Console | `/auth/select-tenant?returnTo=<returnTo>` |
| BOSS | `paths.boss.dashboard` |

> ⚠️ Note: On Console the user **always** goes to the tenant selection page first, not "straight to the console home when belonging to one tenant". With a single tenant, the selection page auto-enters it. There is no separate MFA verification page redirect from login.

## Error Handling

| Case | Behavior |
|------|----------|
| `reason === 'NeedCaptcha'` | Refresh CAPTCHA; `Slider` opens the dialog, `Graphic` shows an error |
| `reason === 'InvalidCaptcha'` | Refresh CAPTCHA and show a CAPTCHA error |
| `reason === 'LoginLocked'` | Refresh CAPTCHA if the dialog is open, then show the backend message |
| Code `401` or message `Invalid account or password` | Close the dialog and show "invalid account or password" |
| Message `Already logged in` | Treat as logged in, run the session check and redirect |

> ⚠️ Note: Lockout thresholds, lockout duration, and CAPTCHA TTL are backend policies; the front-end only relays the backend message. This document does not confirm the exact values.

## Logout

`POST /api/iam/logout`: calls the backend logout endpoint, clears local storage and session state, then redirects to the login page.
