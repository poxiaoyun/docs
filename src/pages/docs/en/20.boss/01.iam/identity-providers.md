---
title: Third-Party Authentication
updated: '2026-10-21'
description: Connect an OAuth2 identity provider such as WeCom or GitLab so users can sign in with an existing account, with field mapping to match platform users.
tags:
  - boss
  - iam
---

# Third-Party Authentication

Third-party authentication lets you connect an external sign-in source: a user clicks "Sign in with …", is sent to the provider to authorize, and comes back as a platform account. Typical providers are WeCom, DingTalk, GitLab and Keycloak — anything that supports the OAuth2 authorization code flow.

After reading this page you can add a provider, fill in the three configuration sections, verify the callback URL, enable or disable sign-in, and delete an integration you no longer need.

:::tip An analogy
Third-party authentication is mutual door-access: the platform does not check the password itself, it trusts the other building's badge reader. When the user authenticates there, the platform accepts who they are. **Field mapping** is the cross-reference sheet the two sides use — the provider says "this person is sub=abc123", and the mapping tells the platform which field that is.
:::

## Key terms

| Term | Plain explanation |
| --- | --- |
| OAuth2 authorization code | The standard flow: the browser signs in at the provider, returns a one-time code, and the backend exchanges it for a token |
| Client ID / Client Secret | The credential pair the provider issued when you registered the application — effectively a username and password |
| Callback URL | Where the provider sends the user back; it must match the registered value character for character |
| Authorization URL | The page the browser opens when the user clicks sign in |
| Token URL | The endpoint that exchanges the code for an access token |
| UserInfo URL | The endpoint that returns the user profile using the token |
| Field mapping | Which provider response field fills which platform user field (subject ID, username, display name…) |
| PKCE | A hardening measure that binds the authorization code to this sign-in request; the provider must support it |

## Before you start

- You need a **system administrator** account.
- Register an application **at the provider first** to obtain the Client ID and Client Secret, and register the callback URL there.
- To let provider users **create new accounts automatically**, global **Allow signup** must be on — see [Authentication Policy](/boss/iam/authentication-policy).

## What the list shows

Go to **Account Center → System Management → Third-party authentication**. The list has three columns:

| Column | Explanation |
| --- | --- |
| Name | Display name plus the internal name below it, with the logo; click to open details |
| Provider sign-in | **Accepting sign-ins** or **Sign-ins disabled** |
| Client ID | The client identifier issued by the provider |

**Add third-party authentication** sits in the top-right corner. Row actions:

| Action | Notes |
| --- | --- |
| Edit | Open the edit page for configuration and field mapping |
| Enable sign-in / Disable sign-in | Only shown when it changes the current state; disabling asks for confirmation and states "Disabling prevents new sign-ins without revoking existing sessions" |
| Delete | Only shown for a **disabled** provider; the backend requires no linked accounts and no other application references |

![Third-party authentication list: name, provider sign-in state and Client ID, with an add action](/assets/screenshots/boss/identity-providers-01.png)

## Add a provider

1. Go to **Account Center → System Management → Third-party authentication**.
2. Click **Add third-party authentication**.
3. Fill in the three sections below, then save.

### Section 1: Configuration

| Field | Required | Notes |
| --- | --- | --- |
| Logo | No | Shown in the list and on the sign-in button |
| Name | Yes | Display name, for example "WeCom"; an internal name is derived for the URL |
| Allow sign-in | Switch | Only when on does the entry appear on the login page |
| Allow provider signup | Switch | Lets new provider users create platform accounts. The help text notes: "Global signup must be allowed. Account creation does not grant tenant membership or roles." |

### Section 2: OAuth2 configuration

| Field | Notes |
| --- | --- |
| Callback URL | Derived from the current site address, with a copy button. **Open the domain actually used for sign-in before copying**, and register it at the provider — scheme, host, port and path must all match |
| Client ID | The identifier the provider assigned to this application; must pair with the secret |
| Client Secret | The secret the provider assigned. Leave blank to keep the stored value |
| Authorization URL | The endpoint the browser opens, provided by the provider |
| Token URL | The endpoint that exchanges a code for a token; **must be reachable from the platform backend** |
| UserInfo URL | The endpoint that returns the profile; its response fields feed the mapping below |
| OIDC issuer | Optional. When set, signing out of the platform also ends the provider session |
| Scopes | The scopes this client may request, space separated, for example `openid profile email`; supported values depend on the provider |
| Enable PKCE | Uses S256 PKCE to bind the code to this request; **confirm the provider supports S256 first** |

### Section 3: User field mapping

Pick the platform field on the left and enter the provider's UserInfo field name on the right, for example `sub` for the subject ID.

| Platform field | Required | Notes |
| --- | --- | --- |
| Subject ID field | Yes | The provider's stable unique identifier. **Must be stable and unique**; cannot change after accounts are linked |
| Username field | Yes | Used to build the platform username |
| Display name field | Yes | The name shown in the UI |
| Email field | No | Map it if available; useful for notifications |
| Phone field | No | Map it if available |
| Avatar field | No | Map it if available |

**Add field mapping** lets you extend the optional fields.

:::warning Three things you cannot change after linking
Once accounts are linked, the **subject ID mapping**, the **endpoints** (authorization / token / UserInfo) and the **Client ID** are frozen. Changing any of them means creating a new integration and having users link again.
:::

:::info No OIDC ID token validation
This integration uses the OAuth2 authorization code flow plus UserInfo and **does not validate OIDC ID tokens**. If your IdP only exposes key claims inside the ID token, confirm that UserInfo returns the same fields.
:::

## Enable, disable and delete

| Action | Effect | Note |
| --- | --- | --- |
| Enable sign-in | The entry appears on the login page and users can sign in this way | — |
| Disable sign-in | Prevents new sign-ins, **does not revoke existing sessions** | To evict users immediately, expire their sessions at the provider or handle it on the platform |
| Delete | Removes the whole integration | Only allowed when **disabled**, with no linked accounts and no other references |

## Verify the result

| What you want to confirm | Where to look |
| --- | --- |
| Configuration saved | The list shows the entry with the right Client ID |
| Sign-in works | Sign out, click the entry on the login page, complete the provider flow, and come back signed in |
| Anyone linked yet | **User Management → a user → Third-Party Login** tab |
| Deletion is possible | Disable sign-in first; if the delete action is still unavailable, bindings or references remain |

## FAQ

| Symptom | Likely cause | What to do |
| --- | --- | --- |
| The provider reports a callback mismatch | The URL differs from the registered one | Copy it again on the real sign-in domain and compare scheme, host, port and path |
| Coming back fails to create an account | Provider signup off, or global sign-up off | Turn on **Allow provider signup** and confirm **Allow signup** in Authentication policy |
| The same person ends up with two accounts | The subject mapping uses a mutable field such as email | Switch to a stable unique identifier (usually `sub`) and clean up duplicates |
| No delete action | Still enabled, or has bindings and references | Disable it; unlink accounts before deleting |
| Token URL reports a connection failure | The backend cannot reach the provider | Check network and certificates; the URL must be reachable from the server side |
| Sign-in breaks after enabling PKCE | The provider does not support S256 | Turn PKCE off |

## Related

- [Authentication Policy](/boss/iam/authentication-policy)
- [User Management](/boss/iam/users)
- [Email Providers](/boss/iam/email-providers)
- [Account Center](/boss/iam)
