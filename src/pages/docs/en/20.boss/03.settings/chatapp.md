---
title: 'ChatApp Settings'
updated: '2026-03-23'
---

## Feature Overview

ChatApp Settings is used to customize the branding of the **ChatApp Conversation Experience** subsystem, including the module Logo, navigation bar title, and module description. Its configuration structure is identical to Rune Settings and Moha Settings. Configuration is saved under the `config.chatapp` namespace and changes are immediately reflected in the ChatApp module's navigation bar and entry page.

> 💡 Tip: ChatApp is the conversational AI experience portal for end users. Branding settings directly impact users' first impressions of the AI conversation product.

## Access Path

BOSS → Platform Settings → **ChatApp Settings**

Path: `/boss/settings/chatapp`

## Page Description

![ChatApp Settings](/assets/screenshots/boss/settings-chatapp.png)

## Configuration Items

### Module Logo

| Property | Description |
|----------|-------------|
| Field Name | `logo` |
| File Size Limit | Maximum **128KB** |
| Encoding | **Base64** encoded storage |
| Supported Formats | **PNG**, **SVG** |
| Purpose | Displayed in the ChatApp module's navigation bar and conversation entry page |

Steps:

1. Click the Logo upload area
2. Select a local PNG or SVG file (no larger than 128KB)
3. Preview the Logo effect
4. Confirm and click **Save**

> ⚠️ Note: The module Logo is stored as Base64 in the configuration with a 128KB size limit. It is recommended to use simple graphics and SVG format to ensure loading efficiency and display quality.

### Navigation Bar Title

| Property | Description |
|----------|-------------|
| Field Name | `navbar_title` |
| Maximum Length | **10 characters** |
| Purpose | Title text displayed next to the Logo in the ChatApp module navigation bar |

The default value is "ChatApp". Administrators can customize it to a user-facing product name, such as "AI Assistant", "Smart Chat", etc.

### Module Description

| Property | Description |
|----------|-------------|
| Field Name | `description` |
| Maximum Length | **100 characters** |
| Input Rows | **4-row** text area |
| Purpose | Product introduction text displayed on the ChatApp module's entry page |

The description text explains ChatApp's features and positioning, for example: "An intelligent conversation assistant powered by large language models, supporting multi-turn dialogue, document Q&A, and code generation..."

## Configuration Storage

All ChatApp settings are saved under the `config.chatapp` namespace:

```yaml
# config.chatapp namespace
logo: "data:image/png;base64,iVBORw0KGgo..."     # Base64 encoded Logo
navbar_title: "ChatApp"                            # Navigation bar title
description: "ChatApp provides intelligent..."     # Module description
```

## Settings Effect Preview

After saving, the following locations in the ChatApp module are affected:

| Display Location | Affected Configuration |
|------------------|----------------------|
| Top-left of navigation bar | Logo + Navigation bar title |
| Conversation entry page | Logo + Description |
| Browser tab | Navigation bar title (as tab prefix) |
| Platform module switch menu | Logo + Navigation bar title |

![ChatApp Settings Effect Preview](/assets/screenshots/boss/settings-chatapp-preview.png)

> 💡 Tip: Since ChatApp is user-facing, the Logo and title choices should align with the product's brand tone. Avoid overly technical names.

## Comparison of Three Module Settings

| Configuration | Rune Settings | Moha Settings | ChatApp Settings |
|---------------|---------------|---------------|-----------------|
| Namespace | `config.rune` | `config.moha` | `config.chatapp` |
| Logo Limit | 128KB, PNG/SVG | 128KB, PNG/SVG | 128KB, PNG/SVG |
| Title Length | 10 characters | 10 characters | 10 characters |
| Description Length | 100 characters | 100 characters | 100 characters |
| Storage Method | Base64 | Base64 | Base64 |

## Steps

1. Navigate to BOSS → Platform Settings → ChatApp Settings
2. Modify the Logo, title, and description as needed
3. Preview the changes on the page
4. Click the **Save** button to submit changes
5. Confirm changes have taken effect (refresh the ChatApp module page to verify)

> ⚠️ Note: After modifying ChatApp branding, it is recommended to also review Rune Settings and Moha Settings to ensure consistent branding across all three subsystems.

## Permission Requirements

Requires the **System Administrator** role to access the ChatApp Settings page.
