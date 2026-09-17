---
title: 'MindCluster (cluster scheduling component)'
updated: '2026-09-17'
author: Rune Docs Team
description: 'Overview of the Ascend cluster-side components: what the platform installs, what it does not, the default values, and the install order.'
tags:
  - ecosystem
  - huawei
  - ascend
  - mindcluster
  - kubernetes
---

# MindCluster (cluster scheduling component)

MindCluster is Huawei Ascend's set of cluster scheduling components, running on Kubernetes. Its job is turning the NPUs
on the host into resources the cluster can schedule, monitor, and recover from. After the host driver is installed, the
cluster still knows nothing about the cards; install this set of components and the cluster can finally see and use them.

:::info The platform ships a complete set of components
The platform includes an Ascend scheduling component bundle that deploys **Ascend Device Plugin, NPU Exporter, and the
Ascend-customized Volcano** together. If you install through the platform, take the namespace and image versions from that
bundle. The per-component installation described in this section is for filling in a single missing component or for
troubleshooting. The version covered in this section is **MindCluster 26.0.0**.
:::

## Before you start

- The NPU nodes already have a driver matching the hardware, and `npu-smi info` shows the cards.
- The `/usr/local/Ascend/driver` directory exists on the nodes.
- The cluster already has a container runtime (Docker or containerd) and can schedule Pods normally.
- Label the NPU nodes (components such as the device plugin select nodes by this label):

  ```bash
  kubectl label node <npu-node> accelerator=huawei-Ascend910
  ```

- When deploying the Ascend-customized Volcano, the scheduler and controller run on management nodes by default, so management nodes need a label:

  ```bash
  kubectl label node <management-node> masterselector=dls-master-node
  ```

## What the platform does and does not install

| Component | Platform package | Notes |
| --- | --- | --- |
| [Ascend Device Plugin](/ecosystem/huawei/mindcluster/ascend-device-plugin) | **Installed** | Registers NPUs as cluster resources |
| [NPU Exporter](/ecosystem/huawei/mindcluster/npu-exporter) | **Installed** | Metric collection; creates a ServiceMonitor by default |
| Volcano (Ascend-customized) | **Installed** | Scheduler, controller and admission deployed together |
| [Ascend Docker Runtime](/ecosystem/huawei/mindcluster/ascend-docker-runtime) | Not installed | Host-side; install it by hand on every NPU node |
| NodeD | Not installed | Node and card fault reporting; deploy it separately from this section when needed |
| ClusterD (with ClusterInfoManager) | Not installed | See below |

### What "no ClusterD" means

ClusterD is the component in MindCluster that manages cluster information. Capabilities such as fault rescheduling for
resumable training and dynamic vNPU depend on it, and the platform package does not deploy it: it sets the scheduler's
`useClusterInfoManager` parameter to `false`.

The consequence is direct: **capabilities that rely on the cluster information manager are unavailable by
default**. In exchange, the platform turns on two self-maintenance switches:

| Parameter | Default | Purpose |
| --- | --- | --- |
| `useClusterInfoManager` | `false` | Does not connect the cluster information manager; the scheduler manages on its own |
| `selfMaintainAvailableCard` | `true` | The scheduler removes a faulty card itself instead of waiting for an external report |
| `forceEnqueue` | `true` | A job whose resources are not yet available stays queued instead of failing outright |

If you really need what ClusterD provides, deploy it separately and wire it into Volcano, keeping every MindCluster
component version matched.

## Component summary

| Component | Purpose | Prerequisite | How to verify |
| --- | --- | --- | --- |
| [Get the package](/ecosystem/huawei/mindcluster/packages) | Obtain the binaries, images, and YAML of each component | None | Signature verification passes; the extracted directory is complete |
| [Ascend Docker Runtime](/ecosystem/huawei/mindcluster/ascend-docker-runtime) | Let containers see the NPUs too | Host driver installed; container engine installed | The installer's `--check` passes; after restarting the engine the device plugin can recognize the card |
| [NPU Exporter](/ecosystem/huawei/mindcluster/npu-exporter) | Collect NPU metrics for the monitoring system to scrape | Host driver installed; image ready | The `npu-exporter` Pod is `Running`; `/metrics` on port `8082` returns data |
| [Ascend Device Plugin](/ecosystem/huawei/mindcluster/ascend-device-plugin) | Register the NPU as a schedulable Kubernetes resource | Ascend Docker Runtime installed and restarted | `huawei.com/Ascend910` appears in the node's allocatable resources |
| [NodeD](/ecosystem/huawei/mindcluster/noded) | Report node and card fault status | Driver installed; version matches the device plugin | The `noded` Pod is `Running`; faults can be reported |
| Volcano (Ascend-customized) | Multi-card job queuing and scheduling | Device Plugin installed | The scheduler and controller Pods under `volcano-system` are `Running` |

## Why this order is required

The components have real dependencies and cannot be reordered freely:

1. **Get the package**: every later step uses an installer or YAML from it.
2. **Ascend Docker Runtime**: it must be installed and the container engine restarted first. The device plugin checks for it at startup; if the order is reversed, the plugin may need a restart or even a reinstall before it recognizes the card.
3. **NPU Exporter**: monitoring only. It depends on the host driver but does not take part in resource registration, so it can go before or after.
4. **Ascend Device Plugin**: registers the cards into the cluster. Only after this step does the cluster start to see the cards.
5. **NodeD, Volcano**: depend on the registration result above. Volcano's Ascend plugin needs the Device Plugin to have reported devices.

:::warning Shutdown order when upgrading the driver
Before upgrading the host driver, stop the workload, then stop the components in the reverse order: NodeD and the device
plugin first, then the Exporter, and only then touch the driver. Both the Exporter and the Device Plugin call driver
interfaces periodically, so upgrading with them running easily causes trouble.
:::

## Platform defaults

When installed from the platform these values are already set. Use the table to check whether the observed behaviour is
the expected behaviour:

| Where | Parameter | Default | Purpose |
| --- | --- | --- | --- |
| Device plugin | Node label selector | `accelerator=huawei-Ascend910` | Decides which nodes run the device plugin |
| Device plugin | `volcanoType` | `true` | Reports in Volcano mode, required for gang scheduling of multi-card jobs |
| Device plugin | `presetVirtualDevice` | `true` | Static virtualisation: reports pre-partitioned vNPU profiles |
| Device plugin | `listWatchPeriod` | `5` | Device information refresh period (seconds) |
| NPU Exporter | Metrics port | `8082` | Port for `/metrics` |
| NPU Exporter | Collection interval | `5` | Metric refresh period (seconds) |
| NPU Exporter | ServiceMonitor | On (`10s`) | Scraped automatically by the Prometheus Operator |
| Volcano | Version | `1.9.0` | Ascend-matched tag `v1.9.0-v26.0.0` |
| Volcano | Scheduler placement | `masterselector=dls-master-node` | The scheduler and management node run on machines with that label |

## Related

- [Huawei (Ascend)](/ecosystem/huawei)
- [Drivers and Runtime](/ecosystem/huawei/driver-runtime)
- [Get the package](/ecosystem/huawei/mindcluster/packages)
