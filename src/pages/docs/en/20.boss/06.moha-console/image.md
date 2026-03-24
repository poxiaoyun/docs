---
title: 'Image Registry'
updated: '2026-03-23'
---

## Overview

The Images module provides a private container image registry. Store and manage the Docker/OCI images used by your inference services, fine-tuning jobs, and dev environments. Images can be pushed to the registry using standard Docker CLI commands.

## Navigation

**Console → Moha → Images**

## Image List

![Image Registry](/assets/screenshots/console/moha-image-list.png)

| Column | Description |
|--------|-------------|
| Repository Name | `namespace/image-name` format |
| Tags | List of image tags (versions) |
| Size | Compressed image size |
| Last Pushed | Most recent push timestamp |
| Visibility | Public / Private |
| Actions | Pull / Delete |

## Creating an Image Repository

1. Click **New Image Repository**.
2. Enter the repository name and choose visibility.
3. Click **Create**.

## Pushing an Image

After creating the repository, follow these steps:

1. Log in to the registry:
   ```bash
   docker login rune.develop.xiaoshiai.cn \
     --username YOUR_USERNAME \
     --password YOUR_ACCESS_TOKEN
   ```
2. Tag your local image:
   ```bash
   docker tag my-image:latest \
     rune.develop.xiaoshiai.cn/YOUR_USERNAME/my-image:v1.0
   ```
3. Push to the registry:
   ```bash
   docker push rune.develop.xiaoshiai.cn/YOUR_USERNAME/my-image:v1.0
   ```

## Pulling an Image

```bash
docker pull rune.develop.xiaoshiai.cn/YOUR_USERNAME/my-image:v1.0
```

Or reference it directly in a Rune template using the full registry URL.

## Image Tags

Each tag represents a specific image version. Best practices:

- Use **semantic versioning** (e.g., `v1.0.0`, `v1.1.0`) for production images
- Use `latest` for development convenience only
- Never overwrite tags in production — use immutable tags

## Security Scanning

Images are automatically scanned for known CVEs after being pushed. Scan results are available in the image detail page:

| Severity | Description |
|----------|-------------|
| Critical | Actively exploited vulnerabilities — remediate immediately |
| High | Significant risk — patch as soon as possible |
| Medium | Moderate risk — include in next maintenance cycle |
| Low | Low risk — informational |

## Permissions

| Action | Required Role |
|--------|--------------|
| View public images | Anyone |
| View private images | Repository members |
| Push / manage | Developer or Admin |
| Delete | Admin or owner |
