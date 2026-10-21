---
title: 'SSH Key'
updated: '2026-10-21'
description: From generating an SSH key pair to adding the public key on the platform, and deleting keys you no longer use.
---

# SSH Key

An SSH key is a matched pair of keys that lets you connect to a Git repository or a server without typing a password.
The platform stores only the **public** key; the private key never leaves your computer. This page walks you from
"generate a key pair" to "add the public key on the platform" and explains which actions cannot be undone.

:::tip The public key is the lock, the private key is the key
You hand the lock (public key) to the platform and keep the key (private key) yourself. Someone holding the lock still
cannot open your door, but if the private key leaks anyone can impersonate you.
:::

## Before you start

- This is a setting for your own account, so you can use it as soon as you sign in; no tenant role is needed.
- You need a terminal: Terminal on macOS, PowerShell on Windows.
- If you already have a key pair, do not generate a new one — use the existing public key file.

## Public key versus private key

| Term | Plain meaning |
| --- | --- |
| Public key | The file ending in `.pub`; safe to share, and the string you paste into the platform |
| Private key | The file without `.pub`; your actual key, never send it to anyone |
| Fingerprint | A short code derived from the public key, used to check that the platform record and your local key are the same |

:::warning Paste the public key only
The platform needs the public key. Pasting the private key hands over your key, and anyone can use it to impersonate you.
:::

## Step 1: generate a key pair

Run this in your terminal (the email is only a comment, use your own):

```bash
ssh-keygen -t ed25519 -C "your-email@example.com"
```

Press Enter at each prompt. By default you get two files: `~/.ssh/id_ed25519` (private key) and `~/.ssh/id_ed25519.pub`
(public key). When asked for a passphrase you may leave it empty.

Print the public key and copy it:

```bash
cat ~/.ssh/id_ed25519.pub
```

On Windows PowerShell use:

```powershell
Get-Content ~/.ssh/id_ed25519.pub
```

The public key is usually a **single line** starting with `ssh-ed25519`, `ssh-rsa`, or `ecdsa-sha2-nistp256`.

## Step 2: add the public key on the platform

1. Click your avatar in the top-right corner → **Personal settings**.
2. Open the **Access keys** tab and find the **SSH Key** section below.
3. Click **Add SSH Key** on the right of the section; a dialog with the same title opens.
4. Fill in two fields:

   | Field | How to fill it |
   | --- | --- |
   | **Key Name** | The name shown in the list, for example `My work computer`. Required |
   | **Public Key** | Paste the whole line you copied. The helper text below explains where the file usually lives |

5. Click **Add**.

:::tip The name can fill itself
If you paste the key while the name is still empty, the page fills in the comment at the end of the key (usually the email
you typed when generating it). If there is no comment, type a name yourself.
:::

![The SSH Key section on the Access keys page: the Add SSH Key action, and rows showing name, fingerprint, created time and delete](/assets/screenshots/account/ssh-key-01.png)

## Confirming the result

- A green notice **SSH key added successfully** appears at the top.
- The dialog closes and a new row appears with the name, fingerprint, and created time.

## Where the same key can be used

| Scenario | Works? | Advice |
| --- | --- | --- |
| One computer, several platforms | Yes, add the same public key to each | The private key stays as it is |
| Several computers, one identity | Yes, but the private key must be copied to each machine | Generating one key per machine is safer |
| A computer you stop using | Delete its row in the list | Other computers are unaffected |

One key per machine has an advantage: if a device is lost, deleting its row revokes just that device without touching the others.

## Deleting a key

1. Find the row in the **SSH Key** list.
2. Click **Delete** at the end of the row.
3. A confirmation opens, titled **Delete SSH key {name}**, stating that the deletion cannot be undone.
4. Confirm, and the top shows **SSH key deleted successfully**.

:::warning Deleting cannot be undone
The public key is removed from the platform and connections using the matching private key stop working immediately.
To use it again you must add it once more.
:::

## Common questions

| Symptom | Likely cause | What to do |
| --- | --- | --- |
| **Please enter key name** on submit | The name is empty and the key has no trailing comment | Type a name |
| **Please enter public key** on submit | The public key field is empty | Copy the whole `.pub` file content again |
| Added successfully but cannot connect | The platform holds a public key that does not match your private key | Compare the fingerprint in the list with your local key |
| The private key is lost | The platform never stores it, so it cannot be recovered | Generate a new pair locally, add the new public key, delete the old row |

## Related

- [API Key](/account/iam/api-key)
- [Personal settings](/account/iam)
- [Security](/account/iam/security)
