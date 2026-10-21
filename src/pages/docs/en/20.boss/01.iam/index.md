---
title: Account Center
updated: '2026-10-21'
description: How users and tenants relate, which one to create first, and what the six pages in this area cover.
tags:
  - boss
  - iam
---

# Account Center

**Account Center** is where BOSS answers "who may sign in, which organization they belong to, and how they sign in". After clicking **Account Center** in the top bar, the left sidebar shows two groups:

- **Account Center**: User Management and Tenant Management — create accounts and organizations.
- **System Management**: Authentication policy, Third-party authentication, Email providers and SMS providers — decide **how users sign in** and where verification codes are sent from.

Every account and every organization on the platform is created here.

:::tip Users and tenants in one sentence
A **user** is one person; a **tenant** is one company. A person must first exist as a user, then be added to a tenant, before they can sign in to the AI Platform.
:::

## Two groups, six pages

| Group | Page | What it covers | Details |
| --- | --- | --- | --- |
| Account Center | User Management | Create accounts, edit profiles, reset passwords, delete accounts | [User Management](/boss/iam/users) |
| Account Center | Tenant Management | Create tenants, enable/disable, configure image push, manage members | [Tenant Management](/boss/iam/tenants) |
| System Management | Authentication policy | Sign-up, password rules, multi-factor authentication, login CAPTCHA | [Authentication Policy](/boss/iam/authentication-policy) |
| System Management | Third-party authentication | Connect OAuth2 identity providers (WeCom, GitLab and similar) | [Third-Party Authentication](/boss/iam/identity-providers) |
| System Management | Email providers | Configure SMTP so codes and notices reach mailboxes | [Email Providers](/boss/iam/email-providers) |
| System Management | SMS providers | Configure Alibaba Cloud or Tencent Cloud SMS so codes reach phones | [SMS Providers](/boss/iam/sms-providers) |

## Key terms

| Term | Plain explanation |
| --- | --- |
| User | One platform account, one person. A user can belong to several tenants |
| Tenant | A company's isolated account space, holding members, quota and workspaces |
| Member | What a user becomes after joining a tenant, carrying a role inside that tenant |
| Role | What that person may do in the tenant: Administrator, Developer or Member |
| Delivery purpose | Which kind of message a given email or SMS service is allowed to send (login, sign-up, profile change…) |

## Recommended order

1. **Create the tenant first**: without a tenant a user has no home and no quota can be calculated. See [Tenant Management](/boss/iam/tenants).
2. **Then create the user**: the system generates an initial password; copy it and hand it over. See [User Management](/boss/iam/users).
3. **Add the user to the tenant**: on the tenant's **Members** tab click **Add Member**, pick the user and the role.
4. **Set up sign-in methods**: configure an email or SMS service under **System Management**, then enable the matching code login in **Authentication policy**. See [Authentication Policy](/boss/iam/authentication-policy).
5. **Give the tenant compute**: enable clusters in **AI Platform → Tenant Clusters**, then create quotas under the cluster's **Tenant Resources**. See [Tenant Clusters](/boss/rune-admin/tenant-clusters).

:::info Not the same as "personal settings"
Users can change their own nickname, email, password and MFA inside the AI Platform — that is personal settings. Account Center here is the **administrator view**, used to assemble people and organizations. If a user forgets the password, an administrator resets it here.
:::

## FAQ

| Symptom | Explanation | What to do |
| --- | --- | --- |
| No enable/disable switch on a user | Users genuinely have no such switch | Delete the user, or remove them from the tenant |
| Cannot delete a tenant | There is no delete entry | **Disable** the tenant instead |
| No "Sign up" on the login page | Open sign-up is off, or no sign-up channel is available | Turn on **Open sign-up** in [Authentication policy](/boss/iam/authentication-policy) and configure a delivery service |
| No code-based login on the login page | No email/SMS service carries the **Login** purpose | Configure it in [Email Providers](/boss/iam/email-providers) or [SMS Providers](/boss/iam/sms-providers) |

## Related

- [User Management](/boss/iam/users)
- [Tenant Management](/boss/iam/tenants)
- [Authentication Policy](/boss/iam/authentication-policy)
- [Third-Party Authentication](/boss/iam/identity-providers)
- [Email Providers](/boss/iam/email-providers)
- [SMS Providers](/boss/iam/sms-providers)
- [Home](/boss/dashboard)
