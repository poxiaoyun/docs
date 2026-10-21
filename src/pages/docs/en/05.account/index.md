---
title: 'Account & Access'
updated: '2026-10-21'
description: What sign-in, tenants, and roles mean, and what each account page helps you do.
tags:
- account
- overview
---

# Account & Access

Account & Access decides three things: **who you are**, **which company space you may enter**, and **what you can do inside**.
Your first visit follows the order "sign in → select a tenant → enter the platform". Later on, changing your avatar,
switching your password, enabling a second factor, or creating access keys all happen in the same group of pages.
After this page you will know which task belongs to the sign-in page and which belongs to personal settings.

:::tip One way to picture it
Think of the platform as an office building: signing in is swiping your card at the entrance, a tenant is the company you work for, a role is your permission level inside that company, and personal settings are the photo and nickname on your badge. The pages below cover each of these.
:::

## Words to remember first

| Term | Plain meaning |
| --- | --- |
| Sign in | Prove "who I am" with a password or a one-time code |
| Tenant | A company's isolated account space on the platform; data in one tenant cannot be seen by another |
| Role | Your identity inside a tenant, which decides which features you can use |
| Multi-factor authentication | A second check besides your password — a code from an authenticator app, email, or SMS |
| API key | An account-and-password pair for programs, so a script or app can call the platform on your behalf |
| SSH key | A matched pair of keys used to connect to a Git repository or server without typing a password |

## Your first time on the platform

1. Open the platform address. On the sign-in page, pick a sign-in method (**Password**, **Email code**, **SMS code** — whichever the platform has enabled) and fill in your credentials.
2. Tick **I have read and agree to the Terms of Service and the Privacy Policy.** The **Login** button stays disabled until you do.
3. Click **Login**.
4. If your account belongs to several tenants, you land on **Select your tenant**. Choose one and click **Enter Platform**. With a single tenant you go straight in.
5. Once inside, click your avatar in the top-right corner → **Personal settings** to change your avatar and nickname, set your password, and manage access keys.

The first step of the whole flow is the sign-in page:

![Sign-in page: product introduction and four capability cards on the left; the sign-in card on the right with the sign-in method switch, account field, password field, terms checkbox and Login button](/assets/screenshots/account/login-01.png)

Whether you have to pick a tenant after signing in depends on how many tenants you belong to; see [Select / Register Tenant](/account/auth/select-tenant).

## Page navigation

### Authentication

| Page | What it helps you with |
| --- | --- |
| [Login](/account/auth/login) | How the three sign-in methods work, what the security check window is, and what to do when sign-in fails |
| [Registration](/account/auth/register) | How to register an account yourself, and which fields the page asks for |
| [Reset Password](/account/auth/reset-password) | What you can and cannot do when you forget your password |
| [Multi-Factor Authentication (MFA)](/account/auth/mfa) | How to bind an authenticator and how to pass the second step at sign-in |
| [Select / Register Tenant](/account/auth/select-tenant) | How to choose a tenant, and how to create a new one |
| [Roles and Permissions](/account/auth/roles) | What administrators, developers, and members can each do |

### Personal settings (four tabs)

| Tab | Page | What you can change |
| --- | --- | --- |
| General | [General](/account/iam/profile) | Avatar, nickname, email, mobile number; the username is read-only |
| Security | [Security](/account/iam/security) | Password, multi-factor authentication, and linked third-party sign-in accounts |
| Access keys | [API Key](/account/iam/api-key) · [SSH Key](/account/iam/ssh-key) | API keys for programs, public keys for repositories |
| Preferences | [Preferences](/account/iam/preferences) | Light/dark mode, theme color, interface language |

### Tenants

| Page | What it helps you with |
| --- | --- |
| [Tenant Management](/account/iam/tenant) | View tenant details and manage members; the entry lives in the avatar drawer, not in a personal settings tab |

:::info Two things people look for in the wrong place
**Switch Tenant** is the button at the bottom of the avatar drawer. **Tenant details and members** are behind the **Tenant {tenant name}** row in the same drawer. Neither is a personal settings tab.
:::

## Related

- [Platform concepts](/guide/architecture)
- [Glossary](/guide/glossary)
- [Permissions reference](/reference/permissions)
