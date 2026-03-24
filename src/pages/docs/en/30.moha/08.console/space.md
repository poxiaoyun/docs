---
title: 'Space Apps'
updated: '2026-03-23'
---

## Overview

Spaces are hosted web applications that run within the Moha platform. They are ideal for creating interactive demonstrations of your models — think HuggingFace Spaces. You can build a Gradio, Streamlit, or any other web app and deploy it directly from your Space repository.

## Navigation

**Console → Moha → Spaces**

## Space List

![Space List](/assets/screenshots/console/moha-space-list.png)

| Column | Description |
|--------|-------------|
| Name | Space name |
| Framework | Gradio / Streamlit / Static / Docker |
| Status | Building / Running / Stopped / Error |
| Visibility | Public / Private |
| Last Updated | Most recent deployment |
| Actions | Open / Rebuild / Delete |

## Creating a Space

1. Click **New Space**.
2. Choose a framework (Gradio, Streamlit, Docker, etc.).
3. Set visibility and hardware.
4. Click **Create**.
5. Upload your `app.py` and `requirements.txt` (or `Dockerfile` for Docker spaces).
6. The Space automatically builds and launches.

### Configuration Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| Name | Text | ✅ | Repository name |
| Framework | Select | ✅ | Application framework |
| Visibility | Radio | ✅ | Public or Private |
| Hardware | Select | ✅ | CPU-only or GPU flavor |
| Description | Textarea | — | Space purpose |

## Supported Frameworks

| Framework | Description |
|-----------|-------------|
| **Gradio** | Python UI library for ML demos (auto-detected from `app.py`) |
| **Streamlit** | Data-focused Python web apps |
| **Static** | Pure HTML/CSS/JS sites |
| **Docker** | Custom Dockerfile for full control |

## Accessing a Space

Once the Space is **Running**:

- Click **Open** to view it in your browser
- The Space URL is: `https://rune.develop.xiaoshiai.cn/spaces/username/space-name`

## Space Lifecycle

Building → Running → (auto-sleep on inactivity) → Running (on next visit)

Public Spaces are discoverable by other users. Private Spaces are only accessible to repository members.

## Permissions

| Action | Required Role |
|--------|--------------|
| View public Spaces | Anyone |
| View private Spaces | Repository members |
| Create / manage | Developer or Admin |
| Delete | Admin or owner |
