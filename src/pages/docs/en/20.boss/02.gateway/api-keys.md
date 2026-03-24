---
title: 'API Key Management (Admin)'
updated: '2026-03-23'
---

## Feature Overview

API Key Management is the LLM Gateway's **admin-side token management** feature, allowing system administrators to view, create, and manage all API Keys on the platform. API Keys are the authentication credentials for calling the LLM Gateway API — every API request must carry a valid API Key to be accepted and processed by the gateway.

Unlike the personal Tokens that users self-manage in the Console, admin-side API Key Management provides a global view where administrators can view all users' Keys and have extended management capabilities (such as IP whitelisting, fine-grained rate limiting, etc.).

> 💡 Tip: Users can self-create and manage their own Tokens on the Console's [API Token](../../console/chatapp/token) page. Admin-side API Key Management is for system administrators, providing a global Key management view.

## Access Path

BOSS → LLM Gateway → **API Key**

Path: `/boss/tokens`

## API Key List

![API Key List](/assets/screenshots/boss/gateway-api-keys.png)

| Column | Field | Description | Notes |
|--------|-------|-------------|-------|
| Name | `name` | Custom name for the Key | Used to identify Key purpose |
| API Key | `apiKey` | Key value (partially hidden) | Displayed in `sk-xxxx...xxxx` format, supports one-click copy to clipboard |
| Owner | `account` / `belongTo` | User/account the Key belongs to | Shows creator information |
| RPM Limit | `rateLimitRPM` | Requests per minute limit | Shows `∞` (unlimited) when 0 |
| TPM Limit | `rateLimitTPM` | Tokens per minute limit | Displayed in K units (e.g., `100K`) |
| Allowed IPs | `allowedIPs` | IP access whitelist | Displayed using `CollapseItem` folding; shows `*` when unrestricted |
| Expires At | `expiresAt` | Key expiration time | Expired Keys show an `expired` label (Chip) |
| Created At | `createdAt` | Key creation time | Timestamp format |
| Actions | — | Edit / Delete | — |

### Key Masking Display

API Keys are displayed in masked form in the list, showing only the prefix and suffix:

```
sk-abc1...xyz9
```

Click the copy button next to the Key to copy the full Key to the clipboard.

> ⚠️ Note: The full API Key value is only displayed **once at creation time**. After creation, the system only stores the hash of the Key and the full Key cannot be viewed again. Please copy and securely store it immediately upon creation.

### Key Status

| Status | Description | List Behavior |
|--------|-------------|---------------|
| `active` | Active status, can be used normally | Displayed normally |
| `expired` | Past expiration time | `expiresAt` column shows red `expired` Chip label |

> 💡 Tip: Expired Keys are not automatically deleted but can no longer be used for API authentication. Administrators can manually delete expired Keys or edit their expiration time to extend validity.

## Create API Key

Click the **Create** button to open the creation form:

![Create API Key](/assets/screenshots/boss/gateway-apikey-create.png)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| Name | Text | ✅ | Custom name for the Key, used to identify purpose |
| Owner User | User Selector | ✅ | Specify the user account the Key belongs to |
| RPM Limit | Number | — | Maximum requests per minute, 0 means unlimited |
| TPM Limit | Number | — | Maximum Tokens per minute, 0 means unlimited |
| Allowed IPs | IP/CIDR List | — | IP access whitelist, leave empty for unrestricted |
| Expires At | DateTime Picker | — | Key expiration date, leave empty for never expires |

### Successful Creation

After successful creation, the system displays a dialog showing the full API Key:

```
✅ API Key Created Successfully

Your API Key:
sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

⚠️ Please copy this Key immediately. The full value cannot be viewed again after closing this dialog.
```

> ⚠️ Note: This is the only opportunity to view the full API Key. After closing the dialog, the system only retains the Key's hash for verification, and the original Key cannot be recovered.

## Rate Limiting

API Keys support independent rate limiting on two dimensions:

### RPM (Requests Per Minute)

Maximum number of requests allowed per minute. Returns HTTP `429 Too Many Requests` when exceeded.

| Setting | Effect |
|---------|--------|
| `0` | Unlimited (list shows `∞`) |
| `60` | Maximum 60 requests per minute (approximately 1 per second) |
| `600` | Maximum 600 requests per minute (approximately 10 per second) |

### TPM (Tokens Per Minute)

Maximum number of Tokens allowed per minute. Displayed in K units in the list (e.g., `100K` = 100,000 Tokens/minute).

| Setting | Effect |
|---------|--------|
| `0` | Unlimited (list shows `∞`) |
| `100000` | Maximum 100K Tokens per minute (list shows `100K`) |
| `1000000` | Maximum 1M Tokens per minute (list shows `1000K`) |

> 💡 Tip: RPM and TPM are calculated independently; exceeding either dimension triggers rate limiting. For high-frequency short request scenarios, focus on RPM limits; for low-frequency long text scenarios, focus on TPM limits.

## IP Access Whitelist

Each API Key can be configured with an independent IP access whitelist, restricting which IP addresses can use the Key.

- Supports individual IP addresses (e.g., `192.168.1.100`) and CIDR ranges (e.g., `10.0.0.0/8`)
- Multiple IPs are displayed using `CollapseItem` component folding in the list
- When no whitelist is configured, shows `*` (all IPs allowed)

> 💡 Tip: The IP whitelist and the global whitelist in [Gateway Configuration](./config) are two independent filtering layers. Requests must pass both whitelist layers to succeed.

## Admin vs User Self-Service Token

| Comparison | Admin API Key | User Self-Service Token |
|------------|--------------|------------------------|
| Management Entry | BOSS → LLM Gateway → API Key | Console → ChatApp → API Token |
| Permissions | System Administrator | Regular user (manages own Tokens) |
| Visible Scope | All Keys platform-wide | Own Tokens only |
| IP Whitelist | ✅ Supported | — |
| RPM/TPM Limits | ✅ Supported | ✅ Supported |
| View Owner User | ✅ Visible | — |

## Edit API Key

Click the **Edit** button in the list to modify the following fields:

- Name
- RPM / TPM limits
- Allowed IP list
- Expiration time

> 💡 Tip: The API Key value itself cannot be modified. To change the Key value, delete and recreate it.

## Delete API Key

Click the **Delete** button and confirm in the dialog to delete the Key. After deletion, all API requests using that Key will immediately fail.

> ⚠️ Note: Delete operations are irreversible. Before deleting, confirm that no production services are using the Key; otherwise, it will cause service interruption.

## Security Recommendations

### Key Lifecycle Management

1. **Regular Rotation**: Production API Keys should be rotated every 90 days
2. **Least Privilege**: Create separate Keys for different purposes, avoid sharing
3. **Timely Cleanup**: Expired or unused Keys should be promptly deleted
4. **IP Whitelist**: Production Keys should always have IP whitelists configured
5. **Monitoring Alerts**: Monitor Key usage through [Operations Overview](./operations) and address anomalies promptly

### Key Leak Response

If an API Key leak is discovered:

1. Immediately delete the Key in the admin panel
2. Create new Keys for affected services
3. Check [Audit Logs](./audit) to confirm whether there were abnormal calls
4. Notify affected users to update Key configurations

## FAQ

### What if I forget to copy the Key after creation?

It cannot be recovered. You must delete it and create a new Key.

### Can RPM and TPM be set independently?

Yes. Setting a dimension to `0` means unlimited. For example, setting RPM=60 and TPM=0 limits request frequency but not Token usage.

### Can API Keys be automatically renewed after expiration?

No automatic renewal. Administrators must manually edit the Key to set a new expiration time, or delete and create a new Key.

## Permission Requirements

Requires the **System Administrator** role. System administrators can view and manage API Keys for all users on the platform.
