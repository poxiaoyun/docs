---
title: 'SSH Key Management'
updated: '2026-09-14'
description: From generating an SSH key pair to pasting the public key here, and deleting keys you no longer use.
---

# SSH Key Management

An SSH key is a matched pair of "keys" that lets you connect to a Git repository or server without typing your password every time. The platform stores only the **public** key; the private key always stays on your own computer. This page takes you through the whole path from "generate a key pair" to "paste the public key here", and explains which actions cannot be undone.

:::tip The public key is the lock, the private key is the key
You hand the lock (public key) to the platform and keep the key (private key) yourself. Someone holding your lock still cannot open your door, but if the private key leaks, anyone can pretend to be you.
:::

## Before you start

- This is a setting for your own account, so you can use it as soon as you sign in; no tenant role is needed.
- You can store at most **5** public keys, and the same key cannot be added twice.
- You need to be able to open a terminal on your computer: Terminal on macOS, PowerShell on Windows.
- If you have generated a key before, there is no need to generate another one; just use your existing public key file.

## Telling the public and private keys apart

| Term | Plain meaning |
| --- | --- |
| Public key | The file whose name ends in `.pub`; it may be shared, and it is the text you paste here |
| Private key | The file without `.pub`; it is your real key and must never be sent to anyone |
| Fingerprint | A short string computed from the public key, used to check that the record here matches your local key |

:::warning Paste the public key only
The platform needs the public key. Pasting private key content is the same as handing over your key, and anyone could use it to impersonate you.
:::

## Step 1: generate a key pair

Run the command below in your terminal (the email is just a label, so use your own):

```bash
ssh-keygen -t ed25519 -C "your-email@example.com"
```

Press Enter through the prompts; by default this creates two files: `~/.ssh/id_ed25519` (the private key) and `~/.ssh/id_ed25519.pub` (the public key). When it asks for a passphrase you can press Enter to leave it empty.

Print the public key content and copy it:

```bash
cat ~/.ssh/id_ed25519.pub
```

On Windows PowerShell use this instead:

```bash
Get-Content ~/.ssh/id_ed25519.pub
```

The public key is usually a **single line** that starts with `ssh-ed25519`, `ssh-rsa`, or `ecdsa-sha2-nistp256`.

## Step 2: paste the public key here

1. Click your avatar in the top-right corner → **Settings**.
2. Click the **SSH Keys** tab at the top.
3. The add form sits at the top of the page. Fill in the two items below:

   | Setting | How to fill it in | What changes |
   | --- | --- | --- |
   | Key Name | For example `My work computer` | Just the name in the list, to help you tell keys apart; you can choose anything |
   | Public Key | Paste the **whole line** you copied in the previous step | The platform registers this public key, and the matching private key can then connect without a password |

4. Click **Save**.

:::tip The name can fill itself in
If you paste the public key before typing a name, the page fills the name in for you from the comment at the end of the key (usually the email you typed when generating it). The name cannot be empty; if the key has no comment at the end, just type one yourself.
:::

After you paste a public key, the page splits into two parts: the add form on top and the saved key cards below:

![SSH key page: Key Name and Public Key fields with a Save button on top; below, one card per saved key showing its name, creation time, fingerprint and a Delete action](/assets/screenshots/account/ssh-key-01.png)

## Confirming the result

- A green **SSH key added successfully** alert appears at the top of the page.
- The form below is cleared and a new card appears in the list, showing the name, creation time, and fingerprint; if the public key has a comment, one more comment line is shown.

## Where the same key can be used

| Situation | Works? | Advice |
| --- | --- | --- |
| One computer connecting to several platforms | Yes; add the same public key to each platform | The private key stays as it is |
| Several computers sharing one identity | Yes, but you must copy the private key to every machine | Generating one key per computer is better |
| A computer you no longer use | Delete its entry from the list | Other computers are unaffected |

Generating a separate key on each computer has one advantage: if a device is lost, deleting only its entry revokes just that device instead of dragging the others down with it.

## Deleting a key

1. Find the card to delete in the **SSH Keys** list.
2. Click **Delete** in the top-right corner of the card.
3. A **Delete SSH Key** confirmation dialog opens; click **Confirm**.

:::warning Deleting cannot be undone
After you delete it, this public key is removed from the platform and any connection using the matching private key stops working immediately. To use it again you must add it once more.
:::

## Common questions

| What you see | Likely cause | What to do |
| --- | --- | --- |
| **Please enter public key** when you click Save | The public key field is empty | Go back to the terminal and copy the whole line of the `.pub` file again |
| **Please enter key name** when you click Save | The name is empty and the public key has no comment at the end | Type a name yourself |
| Adding a sixth key is rejected | One account can store at most 5 public keys | Delete the keys you no longer use, then add the new one |
| Adding the same key again is rejected | That public key is already in the list | There is no need to add it twice; use the existing entry |
| It says the key was added but you still cannot connect | The platform holds the public key, but the local private key is not its match | Compare the fingerprint on the key card with your local private key |

## Related

- [IAM API Key (AK/SK)](/account/iam/api-key)
- [Security Settings](/account/iam/security)
- [Personal Center](/account/iam)
