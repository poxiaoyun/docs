---
title: 'Chat Experience'
updated: '2026-03-23'
---

## Overview

The Chat Experience page is the primary interface for conversing with AI models. It provides a clean, persistent conversation interface similar to consumer chat applications, but backed by your own deployed models.

## Navigation

**ChatApp → Experience**

## Interface Layout

![Chat Experience](/assets/screenshots/console/chatapp-experience.png)

| Section | Description |
|---------|-------------|
| Conversation List (left) | History of all previous conversations |
| Chat Area (center) | Message thread for the active conversation |
| Settings Panel (right) | Model selector and parameters |

## Starting a Conversation

1. Click **New Chat** in the top-left area.
2. Select a **Model** from the dropdown (lists all available LLM Gateway channels).
3. Type your message in the input box.
4. Press **Enter** or click the **Send** (➤) button.

## Conversation Features

| Feature | Description |
|---------|-------------|
| Message History | Full conversation context is sent to the model on each message |
| Streaming | Responses stream word-by-word for a natural feel |
| Copy | Click the copy icon on any message to copy its content |
| Regenerate | Click the regenerate icon to retry the last response |
| Edit | Edit a previous user message to branch the conversation |
| Delete Message | Remove a specific message from the thread |

## Model Parameters

Use the right settings panel to adjust generation parameters:

| Parameter | Description | Default |
|-----------|-------------|---------|
| System Prompt | Instructions given to the model before the conversation | (empty) |
| Temperature | Randomness — higher = more creative, lower = more deterministic | 0.7 |
| Max Tokens | Maximum response length in tokens | 2048 |
| Top-P | Nucleus sampling threshold | 1.0 |
| Frequency Penalty | Reduces repetition of frequent tokens | 0 |

## Managing Conversations

- **Rename**: Right-click a conversation in the list → Rename
- **Delete**: Right-click a conversation → Delete
- **Search**: Use the search box above the conversation list to find past chats

## Sharing a Conversation

You can share a read-only link to any conversation. Open the conversation and click the **Share** button to generate a link.

## File Attachments

If the selected model supports multimodal input:

1. Click the **Attachment** (📎) icon in the input area.
2. Select an image or document.
3. The file is included with your next message.

## Permissions

| Action | Required Role |
|--------|--------------|
| Use chat experience | Any tenant member |
| API token access | Developer or Admin |
