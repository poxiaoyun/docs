---
title: 'SSH Key Management'
updated: '2026-09-12'
description: Add and delete SSH public keys (inline form on the page).
---

## Overview

The SSH Key page manages the account's SSH public keys for Git-over-SSH style passwordless authentication.

- Route: `/iam/account/ssh-key`
- View: `src/pages/iam/account/ssh-key.tsx`

## Navigation

Top-right avatar → Settings → top Tab "SSH Keys"

## Endpoints

| Action | Endpoint |
|--------|----------|
| List | `GET /api/iam/current/sshkeys` |
| Create | `POST /api/iam/current/sshkeys` |
| Delete | `DELETE /api/iam/current/sshkeys/{fingerprint}` |

## Adding an SSH Key

> ⚠️ Note: The top of the page is an **inline form** (not a "top-right button + confirm dialog"). The form and the list share the page; submit with "Save".

| Field | Key | Type | Front-end Validation |
|-------|-----|------|----------------------|
| Name | `name` | Text | Non-empty |
| Public key | `publicKey` | Multiline (4 rows) | Non-empty |

Auto-fill: when `name` is empty, the front-end extracts the comment from the public key (split on whitespace, take the 3rd segment onward) as the name (`ssh-key.tsx:237-248`). For a key ending in `... your-email@example.com`, the name becomes `your-email@example.com`.

Request body:

```json
{ "name": "MacBook Pro", "publicKey": "ssh-ed25519 AAAA... your-email@example.com" }
```

> ⚠️ Note: The front-end only checks that the public key is non-empty. It does **not** validate key type/format, and duplicate detection is up to the backend.

## Generating a Key Pair

```bash
# Recommended: Ed25519
ssh-keygen -t ed25519 -C "your-email@example.com"

# Or RSA
ssh-keygen -t rsa -b 4096 -C "your-email@example.com"

# View the public key
cat ~/.ssh/id_ed25519.pub
```

The public key file ends in `.pub`. Upload the **public** key, never the private key.

## Key List

Each key is shown as a card:

| Field | Description |
|-------|-------------|
| `name` | Custom name |
| `creationTimestamp` | Created at |
| `fingerprint` | Public key fingerprint |
| `comment` | Public key comment (shown if present) |

> ⚠️ Note: The list has **no** "Last Used" or "Key Type" columns.

## Deleting an SSH Key

Click "Delete" on the key card, confirm in the dialog, and the delete endpoint is called. The public key is then removed from the platform.

## Notes

- The add form is inline and persistent on the page
- The name can be auto-filled from the key comment and edited manually
- Deletion cannot be undone
