---
title: 'SSH Key Management'
updated: '2026-03-23'
---

## Overview

SSH Keys are used to authenticate Git-over-SSH access to Moha repositories. Adding your SSH public key to your account allows you to clone, push, and pull repositories without entering a password.

## Navigation

**IAM → SSH Keys**

## Key List

![SSH Keys](/assets/screenshots/console/iam-ssh-keys.png)

| Column | Description |
|--------|-------------|
| Title | Friendly name for the key |
| Fingerprint | SHA256 fingerprint of the public key |
| Key Type | RSA / Ed25519 / ECDSA |
| Added At | When the key was added |
| Last Used | Most recent SSH authentication |
| Actions | Delete |

## Generating an SSH Key Pair

If you don't have an SSH key, generate one:

```bash
# Recommended: Ed25519
ssh-keygen -t ed25519 -C "your-email@example.com"

# Or RSA (if Ed25519 is not supported)
ssh-keygen -t rsa -b 4096 -C "your-email@example.com"
```

This creates two files:
- `~/.ssh/id_ed25519` — **private key** (keep this secret)
- `~/.ssh/id_ed25519.pub` — **public key** (this is what you add to the platform)

## Adding Your SSH Public Key

1. Copy your public key:
   ```bash
   cat ~/.ssh/id_ed25519.pub
   ```
2. In the platform, click **Add SSH Key**.
3. Paste the public key content into the **Key** field.
4. Enter a **Title** (e.g., "MacBook Pro", "Work Laptop").
5. Click **Add**.

## Testing SSH Access

```bash
ssh -T git@rune.develop.xiaoshiai.cn
# Expected output: Hi username! You've successfully authenticated.
```

## Cloning a Repository via SSH

```bash
git clone git@rune.develop.xiaoshiai.cn:username/model-name.git
```

## SSH Config (Optional)

Add this to `~/.ssh/config` to use a custom port or key:

```
Host rune.develop.xiaoshiai.cn
  HostName rune.develop.xiaoshiai.cn
  User git
  IdentityFile ~/.ssh/id_ed25519
  Port 22
```

## Permissions

| Action | Required Role |
|--------|--------------|
| Add / delete own SSH keys | Any logged-in user |
| View / manage other users' keys | System Admin only |

## Security Notes

- Never upload your **private key** (`id_ed25519`, not `id_ed25519.pub`).
- If your private key is compromised, delete the corresponding public key from the platform immediately and generate a new pair.
- Use passphrase-protected private keys for additional security.
