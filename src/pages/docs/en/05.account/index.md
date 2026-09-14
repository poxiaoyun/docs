---
title: 'Account & Access'
updated: '2026-09-14'
description: What sign-in, tenants, and roles mean, and what each account page helps you do.
tags:
- account
- overview
---

# Account & Access

Account & Access is the "access control" layer of the platform: it decides who you are, which company space you may enter, and what you can do once inside. Your first visit follows the order "sign in → select a tenant → enter the platform"; later on, whenever you forget your password, change your avatar, create access keys, or connect a code repository, you come back to these pages.

:::tip One way to picture it
Think of the platform as an office building: signing in is swiping your card at the entrance, a tenant is the company you work for, a role is your permission level inside that company, and your personal settings are the photo and nickname on your badge. The pages below cover each of these.
:::

## Words to remember first

| Term | Plain meaning |
| --- | --- |
| Sign in | Prove "who I am" with an account and a password |
| Tenant | A company's isolated account space on the platform; data in one tenant cannot be seen by another |
| Role | Your identity inside a tenant, which decides which features you can use |
| Multi-factor authentication | A second check besides your password: a 6-digit code on your phone that keeps changing |
| API key | A password pair for programs, so a script or app can call the platform on your behalf |
| SSH key | A matched pair of keys used to connect to a Git repository or server without typing a password |

## Your first time on the platform

1. Open the platform address, fill in **Username/Email/Mobile Number** and **Password** on the sign-in page, tick the agreement, then click **Login**.
2. After signing in you land on the tenant selection page. Choose your tenant in the dropdown and click **Enter Platform**.
3. Once inside, click your avatar in the top-right corner → **Settings**. There you can complete your avatar and nickname, and set your password and keys.

The very first step of the whole flow is the sign-in page:

![Sign-in page: product introduction and four capability cards on the left, sign-in card on the right with account field, password field, terms checkbox and Sign In button](/assets/screenshots/account/login-01.png)

After a successful sign-in you do not land in the platform directly — you pass through the tenant selection page first. See [Select/Register Tenant](/account/auth/select-tenant).

## Page navigation

### Authentication

| Page | What it helps you with |
| --- | --- |
| [Login](/account/auth/login) | How to sign in, whether you need a verification code, and what to do when sign-in fails |
| [Registration](/account/auth/register) | How to register a new account yourself |
| [Reset Password](/account/auth/reset-password) | What to do when you forget your password |
| [Multi-Factor Authentication (MFA)](/account/auth/mfa) | How to add a second lock with your phone's authenticator app |
| [Roles and Permissions](/account/auth/roles) | What administrators, developers, and members can each do |
| [Select / Register Tenant](/account/auth/select-tenant) | How to choose a tenant, and how to create a new one |

### Personal Center

| Page | What it helps you with |
| --- | --- |
| [User Profile](/account/iam/profile) | Change your avatar and nickname |
| [Security Settings](/account/iam/security) | Change your password, email, and mobile number |
| [IAM API Key (AK/SK)](/account/iam/api-key) | Generate an access key for programs |
| [SSH Key Management](/account/iam/ssh-key) | Add the public key used to connect to code repositories |
| [Tenant Management](/account/iam/tenant) | View tenant information and manage members |
| [Theme & Preferences](/account/iam/theme) | Switch light / dark, font, and primary color |

## Related

- [Platform concepts](/guide/architecture)
- [Glossary](/guide/glossary)
