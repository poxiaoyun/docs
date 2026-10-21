---
title: Email Providers
updated: '2026-10-21'
description: Configure SMTP delivery so login codes, sign-up codes, account-change codes and MFA codes reach user mailboxes.
tags:
  - boss
  - iam
---

# Email Providers

Email providers decide **which mailbox and which SMTP server the platform sends from**. Verification codes for signing in, signing up, changing an email address and enrolling an authenticator all go out through the service configured here.

After reading this page you can add an email provider, fill in SMTP and the sender template, test the connection, assign delivery purposes, and safely replace the provider currently handling login codes.

:::tip One provider, one delivery lane
Think of a provider as "a sending machine plus a template". You can configure several (one for notifications, one for codes), but **each purpose can only be attached to one provider per channel at a time**, so a user never receives two different codes for one action.
:::

## Key terms

| Term | Plain explanation |
| --- | --- |
| SMTP | The standard protocol for sending mail; you need a host, port, username and password |
| SMTP host | The server hostname or IP, **without** a protocol prefix such as `smtp://` and without the port |
| Transport encryption | How the connection is secured: automatic, implicit TLS, or STARTTLS |
| Delivery purpose | Which kind of mail this provider is allowed to send, for example only login codes |
| `%s` placeholder | Where the verification code goes inside the body; replaced when sending |
| Test connection | Checks connection and authentication with the current SMTP settings — **sends no mail and saves nothing** |

## Before you start

- You need a **system administrator** account.
- Have the provider's SMTP host, port, username and password (sometimes called an app password or authorization code).
- Make sure the sender address is verified with the mail provider and allowed to send.

## What the list shows

Go to **Account Center → System Management → Email providers**. The list has four columns:

| Column | Explanation |
| --- | --- |
| Name | The provider's name; click to open details |
| Delivery purposes | All purposes, or specific ones (Login, Signup, Account changes, Password recovery, MFA enrollment, MFA verification); **No purposes assigned** when empty |
| SMTP host | The configured server address |
| Sender address | The address recipients see |

Row actions are **Edit** and **Delete**. **Only a provider with no assigned purposes can be deleted** — one that still carries a purpose must be cleared first.

![Email provider list: name, delivery purposes, SMTP host and sender address](/assets/screenshots/boss/email-providers-01.png)

## Add an email provider

1. Go to **Account Center → System Management → Email providers**.
2. Click the add action and fill in the four sections below.

### Section 1: Configuration

| Field | Notes |
| --- | --- |
| Logo | Icon shown in the list; optional |
| Name | Display name, for example "Corporate Mail" |

### Section 2: Delivery purposes

| Option | Meaning |
| --- | --- |
| All purposes | This provider handles every email. **Cannot** be combined with individual purposes |
| Login | Login verification codes |
| Signup | Sign-up verification codes |
| Account changes | Codes sent when a user changes email or mobile number |
| Password recovery | Self-service password recovery codes. **Currently a reserved purpose** — see below |
| MFA enrollment | Codes when binding an authenticator |
| MFA verification | Second-factor codes at sign-in |

Rules:

- **All purposes** and individual purposes are mutually exclusive.
- Within a channel, **each purpose maps to exactly one provider at a time**.
- Clearing every purpose leaves the provider unused, which also makes it deletable.

:::warning "Account changes" and "Password recovery" are not the same
**Account changes** covers changing an email or mobile number; **Password recovery** covers self-service password reset. They read similarly, so pick carefully. The login page's "Forgot password" currently only says: "This platform does not yet offer self-service password recovery. Please contact your platform administrator to reset it." Assigning **Password recovery** merely reserves the purpose — it does **not** enable self-service reset. A forgotten password still has to be reset by an administrator in [User Management](/boss/iam/users).
:::

### Section 3: SMTP configuration

| Field | How to fill it | Notes |
| --- | --- | --- |
| SMTP host | For example `smtp.example.com` | Host or IP only, no protocol prefix and no port |
| SMTP port | For example `465`, `587`, `25` | Use the value from the provider |
| Transport encryption | **Automatic** / **Implicit TLS** / **STARTTLS** | Automatic lets the platform decide; STARTTLS is opportunistic and not guaranteed |
| SMTP username | The username from the provider | Leave empty only when the server allows unauthenticated sending |
| SMTP password | Password or app password | Leave blank to reuse the stored password |
| Test connection | Button | Checks connection and authentication with the values you entered; **no mail is sent and nothing is saved**. Success reads "The SMTP connection and authentication check passed." |

:::info A passing test is not proof of delivery
The test only covers SMTP connectivity and authentication. Whether the sender address is allowed, whether the template renders, and whether the message lands in spam all require an actual send.
:::

### Section 4: Sender and template

| Field | Notes |
| --- | --- |
| Sender address | For example `noreply@example.com` — what recipients see |
| Sender name | The name shown in the inbox |
| Email subject | For example "Verification code" |
| Email body | For example "Your verification code is %s. Do not share it with anyone." |

:::warning Keep exactly one %s in the body
`%s` is where the verification code is inserted at send time. **Keep it**, and never paste a real code here; without the placeholder the code never reaches the recipient.
:::

## Replace the provider handling login codes

Deleting the old provider directly does not work (it still carries a purpose). Follow this order:

1. In **Authentication policy → Login and signup**, **turn off** email code login.
2. Back in Email providers, remove the **Login** purpose from the old provider.
3. Assign the **Login** purpose to the new provider and save.
4. Return to **Authentication policy** and turn email code login back on.

If a step fails part-way, inspect what was actually saved before continuing, so you never end up with the old assignment removed and no new one in place.

## Verify the result

| What you want to confirm | Where to look |
| --- | --- |
| Configuration saved | The list shows the provider with the right SMTP host and sender |
| Connection works | **Test connection** in the edit page returns "The SMTP connection and authentication check passed." |
| Purposes assigned | The **Delivery purposes** column shows the purpose names |
| Users actually receive mail | Sign out, use email code login, and check the inbox |

## FAQ

| Symptom | Likely cause | What to do |
| --- | --- | --- |
| Test reports authentication failure | Wrong username or password, or the provider requires an app password | Use the app password; check whether the username is the full address or a short name |
| Test times out | Wrong host/port, or the port is blocked | Match port and encryption (465 with implicit TLS, 587 with STARTTLS are the common pairs) |
| Test passes but no mail arrives | Sender not verified, flagged as spam, or placeholder missing | Use a verified sender, keep `%s`, and check the spam folder |
| Save reports a purpose conflict | That purpose is already attached to another provider | Remove it there first |
| Delete is unavailable | The provider still carries purposes | Clear **Delivery purposes** first |
| No email code entry on the login page | No provider carries **Login**, or that method is off in Authentication policy | Check both places |

## Related

- [SMS Providers](/boss/iam/sms-providers)
- [Authentication Policy](/boss/iam/authentication-policy)
- [Third-Party Authentication](/boss/iam/identity-providers)
- [Account Center](/boss/iam)
