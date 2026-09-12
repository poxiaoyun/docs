---
title: 'MindCluster (cluster scheduling component)'
updated: '2026-09-12'
author: Rune Docs Team
description: 'Cluster scheduling component installation preparation and key component deployment points based on MindCluster 26.0.0.'
tags:
  - ecosystem
  - huawei
  - ascend
  - mindcluster
  - kubernetes
---
## Overview

MindCluster cluster scheduling components run around Kubernetes and commonly involve:

- Container runtime adaptation (Docker/containerd)
- Resource monitoring (NPU Exporter)
- Device registration and scheduling (Ascend Device Plugin, optionally combined with Volcano)
- Node status/fault reporting (NodeD)

This catalog organizes the pre-installation preparation and key component deployment steps from a "delivery perspective" to facilitate implementation.

> 💡 Tip: The same set of components may have different YAML and parameters under different runtimes (Docker/containerd) and different hardware forms (training/inference/development kits). It is recommended to first clarify: runtime type, K8s version, node type, and then select YAML as needed.
