---
title: SMS Providers
updated: '2026-10-21'
description: Connect Alibaba Cloud or Tencent Cloud SMS so login codes, sign-up codes and other verification codes reach user phones.
tags:
  - boss
  - iam
---

# SMS Providers

SMS providers decide **which cloud platform the messages are sent through, and with which signature and template**. When a user signs in or signs up with a phone number, the message comes from the provider configured here.

After reading this page you can add an Alibaba Cloud or Tencent Cloud SMS provider, fill in credentials, signature and template, assign delivery purposes, and know when a provider cannot be deleted.

:::tip One provider, one SMS lane
As with email: the signature says who is sending, the template says what is sent, and the key proves the platform is allowed to send. All three must line up before a message leaves.
:::

## Key terms

| Term | Plain explanation |
| --- | --- |
| SMS service | Which cloud sends the message; **Alibaba Cloud** and **Tencent Cloud** are supported |
| Access key ID / secret | The credential for calling the cloud API — effectively a username and password |
| SMS signature | The sender identity shown at the start of the message, already approved by the cloud platform |
| Template ID | The identifier of an approved message template on the cloud platform |
| Delivery purpose | Which kind of verification code this provider sends |
| SDK app ID | A **Tencent Cloud**-only application identifier |

## Before you start

- You need a **system administrator** account.
- Apply for the **SMS signature and template in the Alibaba Cloud or Tencent Cloud console first**, and get them approved.
- Have the access key ID and secret ready; Tencent Cloud also needs the SDK app ID.

## What the list shows

Go to **Account Center → System Management → SMS providers**. The list has three columns:

| Column | Explanation |
| --- | --- |
| Name | The provider's name; click to open details |
| Delivery purposes | All purposes, or specific ones; **No purposes assigned** when empty |
| SMS service | **Alibaba Cloud** or **Tencent Cloud** |

Row actions are **Edit** and **Delete**. **A provider with assigned purposes cannot be deleted**; clear its purposes first.

![SMS provider list: name, delivery purposes and SMS service](/assets/screenshots/boss/sms-providers-01.png)

## Add an SMS provider

1. Go to **Account Center → System Management → SMS providers**.
2. Click the add action and fill in the three sections below.

### Section 1: Configuration

| Field | Notes |
| --- | --- |
| Logo | Icon shown in the list; optional |
| Name | Display name, for example "Alibaba Cloud SMS" |

### Section 2: SMS service and credentials

Choose **SMS service** first; the fields below follow:

| Field | Alibaba Cloud | Tencent Cloud | Notes |
| --- | --- | --- | --- |
| SDK app ID | — | Required | Tencent Cloud SMS application identifier |
| Access key ID | Required | Required | The access key of the cloud account |
| Access key secret | Required | Required | The matching secret; leave blank to keep the stored value |
| SMS signature | Required | Required | The approved signature text |
| Template ID | Required | Required | The approved template identifier |

:::warning Signature and template must be approved first
Message content is reviewed by the cloud platform. With an unapproved signature or template, sending fails even when the credentials are correct. Confirm the status in the cloud console before configuring here.
:::

### Section 3: Delivery purposes

| Option | Meaning |
| --- | --- |
| All purposes | This provider handles every SMS. **Cannot** be combined with individual purposes |
| Login | SMS code login |
| Signup | Phone verification during sign-up |
| Account changes | Codes when a user changes their phone number |
| Password recovery | Self-service password recovery codes; **currently a reserved purpose** |
| MFA enrollment | Codes when binding an authenticator |
| MFA verification | Second-factor codes at sign-in |

The rules match email providers: **All purposes and individual purposes are mutually exclusive**; **each purpose maps to exactly one provider per channel**; clearing every purpose leaves the provider unused and deletable.

:::warning Do not confuse "Account changes" with "Password recovery"
**Account changes** covers changing a phone number; **Password recovery** covers self-service password reset. The login page's "Forgot password" currently only says the platform does not offer self-service recovery, so assigning **Password recovery** reserves the purpose without enabling anything. A forgotten password must be reset by an administrator in [User Management](/boss/iam/users).
:::

## Verify the result

| What you want to confirm | Where to look |
| --- | --- |
| Configuration saved | The list shows the provider with the right SMS service |
| Purposes assigned | The **Delivery purposes** column shows the purpose names |
| Users actually receive messages | Sign out, use SMS code login, and check the phone |

## FAQ

| Symptom | Likely cause | What to do |
| --- | --- | --- |
| Sending fails with a signature or template error | Signature or template not approved, or wrong template ID | Compare the signature name and template ID in the cloud console |
| Sending fails with an authentication error | Wrong access key, or no SMS permission | Use a key that has SMS permissions |
| Tencent Cloud always fails | Missing SDK app ID, or the app ID and keys belong to different accounts | Add the app ID and confirm all three belong together |
| No SMS code entry on the login page | No provider carries **Login**, or that method is off in Authentication policy | Check both places |
| Delete is unavailable | The provider still carries purposes | Clear **Delivery purposes** first |

## Related

- [Email Providers](/boss/iam/email-providers)
- [Authentication Policy](/boss/iam/authentication-policy)
- [User Management](/boss/iam/users)
- [Account Center](/boss/iam)
