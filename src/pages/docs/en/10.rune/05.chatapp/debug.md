---
title: 'Debug Console'
updated: '2026-03-23'
---

## Overview

The Debug Console provides a developer-focused interface for testing model APIs, tuning parameters, and inspecting raw request/response data. It is designed for prompt engineering and integration development.

## Navigation

**ChatApp → Debug**

## Interface Overview

![Debug Console](/assets/screenshots/console/chatapp-debug.png)

The debug console consists of:

- **System Prompt area**: Set the `system` role message
- **Messages area**: Build a multi-turn conversation manually
- **Parameters panel**: Fine-grained control over all generation parameters
- **Raw API view**: Toggle to see the exact JSON sent to and received from the API
- **Run button**: Send the configured request

## Request Configuration

### System Prompt

Enter instructions for the model's behavior at the top of the conversation. Example:

```
You are a helpful customer service agent for XiaoShi AI. 
Always respond in a professional tone and escalate unresolved 
issues to a human representative.
```

### Multi-turn Messages

Build a manual conversation thread:

1. Click **Add Message**.
2. Select the role: **User** or **Assistant**.
3. Enter the message content.
4. Add more turns as needed.
5. Click **Run**.

### Parameter Controls

| Parameter | Range | Description |
|-----------|-------|-------------|
| Model | — | Select the target LLM Gateway channel |
| Temperature | 0.0 – 2.0 | Response randomness |
| Max Tokens | 1 – 16384 | Maximum tokens in the response |
| Top-P | 0.0 – 1.0 | Nucleus sampling |
| Top-K | 1 – 100 | Top-K sampling |
| Frequency Penalty | -2.0 – 2.0 | Token repetition penalty |
| Presence Penalty | -2.0 – 2.0 | Topic repetition penalty |
| Stop Sequences | Text list | Tokens that stop generation |
| Stream | Toggle | Enable/disable streaming |

## Raw API View

Toggle **Show Raw** to display:

- **Request JSON**: The exact payload sent to `/v1/chat/completions`
- **Response JSON**: The raw API response (or streamed chunks)
- **Latency**: Time to first token (TTFT) and total response time
- **Token Usage**: Prompt tokens, completion tokens, total tokens

This is useful for building integrations and understanding exactly what the model receives.

## Saving Prompts

Click **Save as Template** to save the current configuration (system prompt, messages, parameters) as a reusable template for future debugging sessions.

## Permissions

| Action | Required Role |
|--------|--------------|
| Use debug console | Developer or Admin |
