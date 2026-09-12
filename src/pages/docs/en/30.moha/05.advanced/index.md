---
title: 'Advanced Integration'
updated: '2026-09-12'
description: 'Use the API, pipelines and the SDK instead of the UI, speed up large downloads, and contribute content back.'
tags:
  - moha
  - advanced
---

# Advanced Integration

This group of pages is for people who have outgrown clicking around the interface: those who want to reach Moha over an API instead of a web page, who want to put uploads and downloads into an automated pipeline, who want to fix slow large-model downloads, or who want to open their content up to more people. All four pages revolve around the same tool — the Moha SDK, which provides both the `moha` command line and Python APIs.

## Before you start

- First create an access token on the [Access Tokens](/moha/quickstart/token) page; it is the pass for everything below.
- Install Python 3.10 or later on your machine.
- Know your console address (the address you use to open the Moha web page).

## What each of the four pages solves

| Page | What it solves |
| --- | --- |
| [API Integration](/moha/advanced/api) | Call Moha directly over HTTP: how to authenticate and how to send requests |
| [CI/CD Workflows](/moha/advanced/cicd) | Upload and download automatically in a pipeline, and trigger a Space restart |
| [Performance Optimization](/moha/advanced/optimization) | Large-model downloads are slow — how to fetch only the files you need |
| [Community Contribution](/moha/advanced/contribution) | How to publish resources, collaborate, and contribute back to the platform |

## Install once, then use it directly

```bash
# Install the SDK and the moha command line
pip install moha-hub

# Sign in and save the token (the address must include https://)
moha login https://<your-console-address> --token <your-access-token>

# Confirm the login status
moha whoami
```

After a successful sign-in, the token and console address are saved on your machine, so later commands do not ask for them again.

:::tip Prefer not to install anything

To quickly pull just one model or dataset you can also clone it with Git, see [Performance Optimization](/moha/advanced/optimization).

:::

## Related

- [Access Tokens](/moha/quickstart/token)
- [SDK tutorial](/moha/sdk-tutorial/quick-start)
- [Full CLI reference](/moha/sdk-tutorial/cli-reference)
