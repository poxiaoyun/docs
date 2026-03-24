---
title: 'Security Settings'
updated: '2026-03-23'
---

## Overview

The Security Settings page lets you manage your account security configuration, including your password and multi-factor authentication (MFA).

## Navigation

**IAM → Security**

## Sections

![Security Settings](/assets/screenshots/console/iam-security.png)

### Change Password

1. Click **Change Password**.
2. Enter your **current password**.
3. Enter your **new password** (at least 8 characters, mix of letters and numbers).
4. Confirm the new password.
5. Click **Update Password**.

> If you are changing your password due to a security concern, also revoke all active API keys and sessions after the change.

#### Password Requirements

| Rule | Requirement |
|------|-------------|
| Minimum length | 8 characters |
| Complexity | At least one letter and one number |
| History | Cannot reuse the last 3 passwords |

### Multi-Factor Authentication (MFA)

| State | Action |
|-------|--------|
| MFA is disabled | **Enable MFA** button |
| MFA is enabled | **Disable MFA** button + **Regenerate Recovery Codes** |

See [MFA Setup Guide](../../auth/mfa) for full setup instructions.

#### Recovery Codes

Recovery codes allow you to sign in when you don't have access to your authenticator app.

- Codes are generated when you enable MFA.
- Each code can only be used **once**.
- Click **Regenerate Recovery Codes** to get a new set (requires current TOTP code to confirm).
- Store recovery codes in a secure place such as a password manager.

### Active Sessions

View and manage active login sessions:

| Column | Description |
|--------|-------------|
| Device | Browser and operating system |
| IP Address | Source IP of the session |
| Last Active | Most recent activity timestamp |
| Actions | Revoke this session |

Click **Revoke** to immediately sign out a specific session. Click **Revoke All Other Sessions** to sign out all devices except the current one.

## Permissions

Security settings are personal — only you can modify your own security configuration. Administrators cannot change individual user passwords directly but can trigger a password reset email.
