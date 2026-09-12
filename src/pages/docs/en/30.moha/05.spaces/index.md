---
title: 'Spaces'
updated: '2026-09-12'
description: 'Space list, filters, detail, lifecycle and deployment entry.'
tags:
  - moha
  - spaces
---

# Spaces

Spaces host interactive applications or demos — the closest thing to a runnable artefact in Moha.

## Entry

Top navigation -> Space

Route: `/moha/spaces`

## Capabilities

| Capability | Description |
| --- | --- |
| List filters | Featured section, visibility switch, search, sorting and `domain` / `scene` filters |
| Detail | Overview, files, version freezes, discussions and settings |
| Deployment | Configure deploy parameters in settings; saving restarts automatically |
| Lifecycle | "Online" when not deployed; "Stop / Restart / Logs" once deployed |
| Collaboration | Members, discussions and file changes |

## Create a Space

Besides basic info (organization, name, visibility, description, `license`, `domain`, `scene`), the form requires `spaceMetadata`:

| Field | Description |
| --- | --- |
| `cluster` | Target cluster |
| `namespace` | Namespace |
| `flavorID` | Runtime flavor |
| `product` | Product template (`{ id, name }`) |
| `gitAddress` | Code repository URL (defaults to this repository) |
| `gitUsername` / `gitPassword` | Credentials for pulling code (default to the current user and token) |
| `baseDomain` | Base domain |
| `env` | Runtime environment variables |

> 💡 Tip: Space repositories have no Tags tab; tags are for image repositories.

## See also

- [Space List & Filters](/moha/spaces/list)
- [Collaboration](/moha/repository)
- [Version Freezes](/moha/repository/freezes)
