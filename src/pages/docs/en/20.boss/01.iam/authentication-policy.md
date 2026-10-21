---
title: Authentication Policy
updated: '2026-10-21'
description: Decide who may sign up, which sign-in methods are offered, how strict passwords must be, whether authenticators are required, and whether login shows a CAPTCHA.
tags:
  - boss
  - iam
---

# Authentication Policy

Authentication policy decides **what the login page looks like and how users get in**: whether people can sign themselves up, which sign-in methods exist, the minimum password length, whether a second factor is required, and whether a CAPTCHA appears. It applies to everyone on the platform, so one change affects all users.

After reading this page you can turn open sign-up on or off, choose the available sign-in methods, set password strength, make the authenticator optional or required, and configure the login CAPTCHA.

:::tip Rules, not a roster
Accounts live in **User Management**; who belongs to which organization lives in **Tenant Management**. This page only sets the rules: whether the door opens, how many keys exist, and how complex a key must be.
:::

## What this page controls

Go to **Account Center → System Management → Authentication policy**. The page has four setting cards, each with an **Edit** action in the top-right corner:

| Card | What it controls | What an edit affects |
| --- | --- | --- |
| Login and signup | Open sign-up, password login, email code login, SMS code login | The entries shown on the login and sign-up pages |
| Password rules | Minimum length, uppercase/lowercase/digit requirement, special-character requirement | Validation when a user sets or changes a password |
| Multi-factor authentication | Whether the authenticator is **Optional** or **Required** | Whether every sign-in needs a second factor |
| Login captcha | Whether a challenge appears, graphic or slider, length, expiry, slider tolerance | The CAPTCHA area of the login page |

Below each card a summary line states the current setting, for example "Local login methods disabled" or "Minimum length: 8".

![Authentication policy: four cards for login and signup, password rules, MFA and login captcha, each with an edit action](/assets/screenshots/boss/auth-policy-01.png)

## Before you start

- You need a **system administrator** account.
- Before changing sign-in methods, confirm that **at least one usable method remains**.
- Email code login and SMS code login require a provider carrying the **Login** purpose, configured in [Email Providers](/boss/iam/email-providers) or [SMS Providers](/boss/iam/sms-providers).
- Open sign-up also needs a provider carrying the **Signup** purpose, otherwise the login page shows no sign-up entry.

## Login and signup

Click **Edit** on the first card. The dialog has four switches:

| Switch | When on | When off |
| --- | --- | --- |
| Allow signup | The platform advertises the available sign-up channels to the login page, which renders a sign-up option for each channel it receives (email, mobile) | No sign-up entry appears; only administrators can create accounts in **User Management** |
| Password login | Users sign in with username and password | The password form is hidden |
| Email code login | Users sign in with a code sent to their email | Email code login is hidden |
| SMS code login | Users sign in with a code sent to their phone | SMS code login is hidden |

Below the two code-login switches there are links to **Email providers** and **SMS providers** that open in a new window, so you can configure delivery immediately.

:::info How "Allow signup" actually works
The login page does not read this switch directly. When it is on, the platform sends the list of **currently available sign-up channels** to the login page; the page only renders what it receives. A single missing channel means no sign-up entry at all. So "the switch is on but there is no sign-up button" almost always means **no delivery provider carries the Signup purpose**.
:::

:::info Relationship with third-party authentication
The **Allow provider signup** switch on a third-party provider only takes effect while **Allow signup** here is on. With global sign-up off, provider sign-in can still authenticate existing accounts but cannot create new ones. See [Third-Party Authentication](/boss/iam/identity-providers).
:::

:::warning Do not turn everything off
With password login, email code login and SMS code login all off, users have no local way in. Only provider sign-in remains, and if that provider breaks, administrators are locked out too. Always confirm one working path before saving.
:::

## Password rules

Click **Edit** on the second card:

| Setting | Options | Notes |
| --- | --- | --- |
| Minimum password length | **No additional length requirement** / **6** / **8** | Defaults to no requirement; 6 or 8 rejects shorter passwords |
| Require uppercase, lowercase and digits | Switch | When on, a password must contain all three |
| Require a special character | Switch | When on, a password must contain at least one special character such as `!`, `@` or `#` |

The summary line concatenates the active rules, for example "Minimum length: 8, Require uppercase, lowercase and digits".

:::info Local passwords only
This governs passwords the platform stores itself. Users who sign in through a third-party provider follow that provider's password policy.
:::

## Multi-factor authentication

Click **Edit** on the third card. There is a single dropdown, **Authenticator requirement**:

| Option | Meaning |
| --- | --- |
| Optional | Users can choose whether to set up an authenticator. Enrolled users must still complete verification when signing in. |
| Required | All users must set up an authenticator and verify when signing in. Unenrolled users must complete setup, and enrollment cannot be removed. |

Choosing **Required** is platform-wide and mandatory: enrolled users cannot unbind either. If someone loses their authenticator, recovery is an administrator task.

:::warning Switching to "Required" locks out unenrolled users
Announce it first and allow a transition period (publish a notice, then switch) so people are not surprised at their next sign-in.
:::

## Login captcha

Click **Edit** on the fourth card:

| Setting | Options / range | Notes |
| --- | --- | --- |
| Trigger rule | **Off** / **Every sign-in** | With **Off**, the fields below have no effect |
| Challenge type | **Graphic** / **Slider** | Graphic shows code length; slider shows pixel tolerance |
| Code length | Number | Graphic only; how many characters the challenge contains |
| Expiration (seconds) | Number | How long a challenge stays valid |
| Slider tolerance (pixels) | Number | Slider only; the allowed pixel offset |

Fields appear and disappear with the chosen challenge type.

## Verify the result

| What you want to confirm | Where to look |
| --- | --- |
| A card saved | A success notice appears on the card and the summary line shows the new value |
| Sign-in methods changed | Sign out and check which entries the login page offers |
| Sign-up entry appears | A "Sign up" link on the login page; if missing, recheck **Allow signup** and the Signup purpose |
| Password rules applied | Have a test account try a too-short password and confirm it is rejected |

## FAQ

| Symptom | Likely cause | What to do |
| --- | --- | --- |
| Email code login enabled but absent on the login page | No email provider carries the **Login** purpose | Assign the **Login** purpose in [Email Providers](/boss/iam/email-providers) |
| Open sign-up enabled but no sign-up entry | No provider carries the **Signup** purpose | Assign **Signup** to an email or SMS provider |
| Provider sign-in refuses to create accounts | Global **Allow signup** is off | Turn on **Allow signup** on this page |
| A long password is still rejected | The uppercase/lowercase/digit or special-character rule is also on | Tell the user the actual rule, or relax it |
| Users are forced to enroll an authenticator | MFA is set to **Required** | Expected; switch back to **Optional** to relax it |

## Related

- [Third-Party Authentication](/boss/iam/identity-providers)
- [Email Providers](/boss/iam/email-providers)
- [SMS Providers](/boss/iam/sms-providers)
- [User Management](/boss/iam/users)
- [Account Center](/boss/iam)
