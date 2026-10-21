---
title: Platform Audit
updated: '2026-10-21'
description: Query administrative actions recorded by the control planes — who did what, through which service, against which resource, and whether it succeeded.
tags:
  - boss
  - settings
  - audit
---

# Platform Audit

Platform Audit records **administrative actions**: who changed a platform setting, who deleted a cluster, who granted quota, which call failed. When you need accountability, troubleshooting, or simply the answer to "who changed this and when", start here.

After reading this page you can narrow the list by time range and filters, read every column, and open a single record to see the full request and response.

:::tip An action ledger, not business logs
It records **control-plane** write operations (change a setting, create or delete a resource). It is not user inference traffic and not container logs. For model calls go to **Model Gateway → Call Logs**; for container logs go to a cluster's **Log Management**.
:::

## Key terms

| Term | Plain explanation |
| --- | --- |
| Audit event | One recorded administrative action — one row per action |
| Source service | Which control plane wrote the record, for example account or AI Platform |
| Subject | The identity that actually performed the action |
| Actor | An identity acting on someone else's behalf (service accounts) |
| Target | What was touched: resource type + resource ID, plus the method and path |
| Outcome / status code | Whether the action succeeded, and the HTTP status it returned |
| Request ID | An identifier for one request, used to correlate records across services |

## How it differs from Moha Hub audit logs

Both answer "who did what", but from different sources:

| Item | Platform Audit (this page) | Moha Hub audit logs |
| --- | --- | --- |
| Scope | Administrative operations on every control plane | Data operations in Moha Hub (create, update, delete, push, pull, publish, restart) |
| Filters | Source service, request ID, subject ID, action, tenant, organization, resource, outcome | Organization, action type, resource type, date |
| Time window | Up to 7 days per query | About the last month by default |
| Export | Not supported | Exports to JSON |

## Before you start

- You need a **system administrator** account.
- The entry is **Platform Settings → Platform → Platform Audit** (its address is `/boss/audit-events`, outside the settings pages).
- To query older records, **query in segments**: one query covers at most 7 days.

## Narrowing the results

The filter row at the top offers:

| Filter | How to use it |
| --- | --- |
| Time range | Quick options of 1 hour, 6 hours, 1 day, 3 days or 7 days; **1 day** by default |
| Source service | Restrict to one control plane |
| Request ID | Jump straight to a request when you know its ID |
| Subject ID | Restrict to one operator |
| Action | Restrict to one action name |
| Tenant ID | Restrict to one tenant |
| Organization ID | Restrict to one organization |
| Resource type | For example clusters, tenants, quotas |
| Resource ID | Pinpoint one resource |
| Outcome | Success, Failed or Unknown |

:::info Seven days per query
The page header states it explicitly: a single query covers up to 7 days. To look a month back, page backwards in 7-day segments.
:::

## Reading the list

| Column | Meaning |
| --- | --- |
| Principal | Display name, with a secondary line in the form "actor → subject"; click to open details |
| Source service | Which control plane wrote the record |
| Action | The action name, for example create, update, delete |
| Target | Resource type / resource ID plus `METHOD path` |
| Tenant / organization | The scope the action happened in |
| Status code | Coloured by outcome: success, failed, unknown |
| Client IP | Where the request came from |
| Time | When the action happened |

![Platform audit list: principal, source service, action, target, tenant / organization, status code, client IP and time](/assets/screenshots/boss/platform-audit-01.png)

:::tip Start with Outcome = Failed
When a setting "did not take effect", filter **Outcome** to **Failed** and look at the status code and target. Many problems show up immediately as a rejected request.
:::

## Inspect a single record

Click the **Principal** cell or the details action to open **Audit event details**. Two views are available at the top: **Details** and **Raw**.

| Group | Fields |
| --- | --- |
| Identity of the record | Record ID, request ID, source service |
| Who | Subject, actor |
| What | Action, parent resources |
| Object | Resource type, resource name, tenant, organization |
| When and outcome | Occurred at, completed at, outcome |
| Payload | Request, response |

The **Raw** view shows the underlying structure — hand that to engineering when debugging an API call.

## Verify the result

| What you want to confirm | Where to look |
| --- | --- |
| Who made a change | Filter by resource type and resource ID, then read **Principal** and **Time** |
| Whether it succeeded | The **Status code** and **Outcome**, or the response in details |
| What happened in a window | Set only the time range, then add filters gradually |
| One request across services | Filter by **Request ID** |

## FAQ

| Symptom | Likely cause | What to do |
| --- | --- | --- |
| The expected record is missing | Time range too narrow, or too many filters | Widen to 7 days, clear filters, then narrow again |
| Need to look a month back | Queries are capped at 7 days | Query in 7-day segments |
| Only administrative actions, no user traffic | This page records control-plane writes only | Use **Model Gateway → Call Logs** for model calls |
| Status code is 403 | The action was rejected by permissions | Check whether the principal holds the required role |
| No export button | This page does not support export | Use Moha Hub audit logs when you need a file |

## Related

- [Platform](/boss/settings)
- [System Member](/boss/settings/members)
- [Moha Hub Audit Logs](/boss/moha-admin/audit)
- [Call Logs](/boss/gateway/audit)
