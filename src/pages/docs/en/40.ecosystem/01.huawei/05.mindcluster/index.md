---
title: 'MindCluster (cluster scheduling component)'
updated: '2026-09-12'
author: Rune Docs Team
description: 'Each Ascend cluster-side component: what it does, when it is mandatory, how to verify it, and the install order.'
tags:
  - ecosystem
  - huawei
  - ascend
  - mindcluster
  - kubernetes
---

# MindCluster (cluster scheduling component)

MindCluster is Huawei Ascend's **set of cluster scheduling components** that runs on Kubernetes. Its job is to "translate"
the NPUs on the host into resources the cluster can schedule, monitor, and recover from failures. After the host driver is
installed, the cluster still knows nothing about the cards; only once this set of components is installed can the cluster
actually see and use them.

Picture the cluster as an office building: the driver gives the machines "electricity", and MindCluster adds a door number,
an electricity meter, and a repair button to every card.

:::info The platform ships a complete set of components
The platform includes an Ascend scheduling component bundle that deploys **Ascend Device Plugin, NPU Exporter, and the
Ascend-customized Volcano** together. If you install through the platform, take the namespace and image versions from that
bundle. The per-component installation described in this section is for filling in a single missing component or for
troubleshooting. The version covered in this section is **MindCluster 26.0.0**.
:::

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

1. **Get the package** — every later step uses an installer or YAML from it.
2. **Ascend Docker Runtime** — it must be installed and the container engine restarted first. The device plugin checks for it at startup; if the order is reversed, the plugin may need a restart or even a reinstall before it recognizes the card.
3. **NPU Exporter** — monitoring only. It depends on the host driver but does not take part in resource registration, so it can go before or after.
4. **Ascend Device Plugin** — registers the cards into the cluster. Only after this step does the cluster start to "see" the cards.
5. **NodeD, Volcano** — depend on the registration result above. Volcano's Ascend plugin needs the Device Plugin to have reported devices.

:::warning Shutdown order when upgrading the driver

Before upgrading the host driver, stop the workload, then **stop the components in the reverse order**: stop NodeD and the
device plugin first, then the Exporter, and only then touch the driver. Both the Exporter and the Device Plugin call driver
interfaces periodically, so upgrading with them running easily causes trouble.

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

## Related

- [Huawei (Ascend)](/ecosystem/huawei)
- [Drivers and Runtime](/ecosystem/huawei/driver-runtime)
- [Get the package](/ecosystem/huawei/mindcluster/packages)
