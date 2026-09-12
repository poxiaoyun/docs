---
title: Account Center
updated: '2026-09-12'
description: 'Boss platform user and tenant management, including user creation, password reset, tenant lifecycle and image push configuration.'
tags:
  - boss
  - iam
---

## Overview

The IAM (Identity and Access Management) module manages the identity and permissions of all users and tenants on the platform. Administrators can create/edit/delete users, reset user passwords, enable or disable tenants, and manage tenant members and image push configuration.

Console entrances:

- User management: `/iam/users`
- Tenant management: `/iam/tenants`

## Chapter Navigation

- [User Management](/boss/iam/users) — View, create, edit, reset password and delete users
- [Tenant Management](/boss/iam/tenants) — Create tenants, enable/disable, configure image push, and manage members

> 💡 Tip: Users have no standalone enable/disable switch. To stop an account, the current console practice is to **delete the user** or remove them from tenants. Tenants do support enable/disable.
