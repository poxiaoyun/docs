---
title: 'Development'
updated: '2026-09-12'
description: 'Dev environment list, creation, SSH/JupyterLab access, and credential resolution order.'
tags:
  - rune
  - console
---

# Development
Dev environments (Interactive Machine Learning, `category=im`) are used to launch interactive development environments on the platform. They can be used through **VSCode SSH remote connection** and **Web access**, and share the same deployment and lifecycle mechanism with inference and fine-tuning instances.

> ⚠️ Note: The dev environment category is `im`, not `devenv`. The list route is `.../ims`, and the product list category is `/rune/products/im`.

List path: `/rune/tenants/:tenant/clusters/:cluster/workspaces/:workspace/ims`

## Dev Environment List

| Column | Description |
| --- | --- |
| Name | Instance name; click to open the detail page |
| Template | The i18n key for this column is `dev_environment` |
| Flavor | Resource summary resolved from `values.flavor` |
| Status | `status.phase` |
| Created At | Instance creation time |
| Created By | Taken from the labels on the instance |
| Connect | Quick connect buttons (`ConnectionButtons`) |

The list supports search by name and refresh. The row action menu includes edit, start/stop, and delete; scaling is available in the instance detail page action menu (`ScaleAction`).

> ⚠️ Note: The current list has no status filtering and no batch start/stop. Related descriptions in the old documentation have been removed.

## Creating a Dev Environment

1. Click the **Create Resource** button in the upper-right corner of the list page; it navigates to `/rune/products/im`.
2. Select a template and version (you can also enter from the template detail page in App Market `/rune/app-market` via **Deploy**).
3. Fill in the basic information.

| Field | Required | Description |
| --- | --- | --- |
| `id` | ✅ | Instance ID; cannot be modified in edit mode |
| `name` | ✅ | Display name |
| `description` | — | Description |

4. Fill in the template parameters: rendered dynamically from the version's JSON Schema, with switchable form/JSON modes.

> 💡 Tip: Whether fields such as storage volume or flavor exist is determined by the selected template's Schema; the console has no fixed "mount storage volume" step.

## Using a Dev Environment

Once the instance is ready, the "Connect" column in the list and the endpoint area on the detail page provide quick connect buttons. The connection method depends on the endpoint protocol the instance exposes:

| Protocol | Button |
| --- | --- |
| SSH | VSCode connect (split button: the main button opens VSCode, the dropdown copies the SSH command) |
| HTTP/Web | Web access link |
| RDP | Remote desktop connection |

When the instance is in `Paused` status, the connect buttons are disabled.

### SSH Username Resolution Order

The connect component prefers the username embedded in the endpoint URL; when the URL has no username, it falls back to the instance `values` in the following order (`src/pages/rune/instances/components/instance-credentials.ts`):

1. `auth.username` / `auth.user` (password from `auth.password` / `auth.pass`)
2. `pipe.from[0].username` / `pipe.from[0].user`
3. `kubeSsh.credentials[0].username` / `kubeSsh.credentials[0].user`
4. `auth.users[0].username` / `auth.users[0].user`

If none of the four is found, an empty object is returned, i.e. no username.

> ⚠️ Note: The old documentation listed only `instance.values.pipe.from[0].username`; the actual resolution order is the table above.

### VSCode SSH Connection

The split button contains two actions:

| Action | Description |
| --- | --- |
| Connect | Generates and opens a `vscode://` URI to start a remote connection in local VSCode |
| Copy command | Copies a command line like `code --new-window --remote ssh-remote+user@host:port` |

When the instance exposes multiple SSH endpoints, the dropdown lists "Use VSCode" and "Copy SSH command" for each endpoint.

### Web Access

The Web access button opens the instance's Web endpoint (for example, JupyterLab) in a new tab. When multiple endpoints are available, the connect component selects one by endpoint type priority.

## Instance Detail

| Tab | Content |
| --- | --- |
| Overview | Basic information card, Pod list |
| Monitoring | Instance monitoring panel |
| Logs | Instance logs |
| Events | Kubernetes event stream |

## Permission Requirements

Dev environments belong to the PAI workbench group; navigation requires the tenant role to be `ADMIN` or `DEVELOPER`.
