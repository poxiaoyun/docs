---
title: 'Kubernetes Resources'
updated: '2026-03-24'
description: A cluster-level browser for core Kubernetes resource types used in troubleshooting and change validation.
tags:
- boss
- rune-admin
- kubernetes
---

## Overview

The Kubernetes resource browser provides an object-centric view of the cluster. It is useful when you need to confirm whether a Pod, Service, Deployment, PVC, or other object actually exists and whether its status matches expectations.

## Good Use Cases

- Confirm that resources were created successfully after a deployment or template change.
- Check Services, Ingresses, StorageClasses, ConfigMaps, and Secrets when runtime behavior looks inconsistent.
- Cross-check object status with logs, events, and dashboard signals.
