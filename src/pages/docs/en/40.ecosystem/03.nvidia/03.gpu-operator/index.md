---
title: GPU Operator (cluster components)
updated: '2026-09-17'
author: Rune Docs Team
description: Overview of the NVIDIA cluster components: what each one does, when it is required, how to verify it, and which switches the platform sets by default.
tags:
  - ecosystem
  - nvidia
  - gpu-operator
  - kubernetes
---

# GPU Operator (cluster components)

The GPU Operator is NVIDIA's official cluster-side component bundle, running on Kubernetes. It turns the GPUs on a host
into resources the cluster can schedule, monitor and split. After the host driver is installed the cluster still does not
know about the cards; installing these components is what makes the cards visible and usable.

:::info On the platform this installs as one package
Choosing the NVIDIA scheduling component in **Cluster Management → Operations → System Apps** deploys every
component listed on this page at once, with no need to apply YAML files one by one. This section explains what each
component does, how to check it afterwards, and where to look when something is wrong.
:::

## Before you start

- GPU nodes have the driver installed and `nvidia-smi` shows the cards.
- The cluster has a working container runtime (Docker or containerd) and can schedule Pods.
- The platform's `apps.xiaoshiai.cn` application controller is installed (done during platform initialisation).
- If you want monitoring data, the cluster has the Prometheus Operator — otherwise disable the ServiceMonitor option.

## Component summary

| Component | What it does | Prerequisites | How to verify |
| --- | --- | --- | --- |
| [NFD (node feature discovery)](/ecosystem/nvidia/gpu-operator/node-labels) | Detects hardware features and writes node labels | None | Node shows `feature.node.kubernetes.io/*` labels |
| [GFD (GPU feature discovery)](/ecosystem/nvidia/gpu-operator/node-labels) | Writes GPU model, memory and driver version as node labels | NFD ready, driver installed | Node shows labels such as `nvidia.com/gpu.product` |
| [Container toolkit](/ecosystem/nvidia/driver-runtime) | Makes GPUs visible inside containers | Driver installed | The device plugin starts and finds the cards |
| [Device plugin (k8s-device-plugin)](/ecosystem/nvidia/gpu-operator/device-plugin) | Registers GPUs as schedulable cluster resources | Container toolkit ready | Node allocatable shows `nvidia.com/gpu` |
| [DCGM Exporter](/ecosystem/nvidia/gpu-operator/dcgm-exporter) | Collects GPU metrics for scraping | Driver installed, DCGM image available | `/metrics` on port `9400` returns data |
| [MIG Manager](/ecosystem/nvidia/gpu-operator/mig-manager) | Partitions MIG instances according to node labels | Hardware supports MIG, profile declared | Node shows `nvidia.com/mig-*` resources (declared nodes only) |
| Validator / Node Status Exporter | Post-install self-check of every component | None | Validation Pods complete without failures |

## Why the order matters

There are real dependencies between the components:

1. **NFD / GFD**: write the node and card information as labels first. Both the device plugin and the MIG Manager use labels to decide which nodes they manage.
2. **Container toolkit**: lets containers reach the card devices. The device plugin checks for it at startup.
3. **Device plugin**: registers the cards into the cluster. Only after this step does the cluster see them.
4. **DCGM Exporter**: monitoring only; it takes no part in resource registration, so it can go before or after.
5. **MIG Manager**: depends on the registration above, and only acts on nodes with a declared profile.

## Platform defaults

The table below lists the values the platform sets. Use it to check whether the current behaviour is the expected
behaviour when troubleshooting:

| Setting | Platform default | Meaning |
| --- | --- | --- |
| GPU Operator version | `v23.6.0` | Component bundle version; namespace `gpu-operator` |
| Container runtime | `containerd` | Which runtime the nodes use; change it for Docker clusters |
| Install driver via GPU Operator | **Off** | Reuses the driver already on the node, so host kernel modules are left untouched |
| Driver version (only when the switch above is on) | `595` | Uses a precompiled driver package instead of building the kernel module on the node |
| DCGM Exporter | On | Also creates a ServiceMonitor by default, scrape interval `30s` |
| GPU Operator's own vGPU components | **Off** | See the note below |

### The two components that are turned off, and why

The GPU Operator ships its own vGPU management components (`vgpu-manager` / `vgpu-device-manager`). The platform turns
both **off** and uses [Volcano vGPU](/ecosystem/nvidia/volcano-vgpu) instead.

The reason is that both approaches inject their own shared library at the `libvgpu.so` path and each registers devices
with kubelet. Running both overwrites each other, and the symptom is "the job schedules, but the memory limit the
workload sees is wrong". Only one of the two may be active.

:::warning Do not turn these two components back on by hand
Enabling the vGPU components by editing the GPU Operator values outside the platform will conflict with Volcano vGPU.
When you need card splitting, enable it through [Volcano & vGPU Splitting](/ecosystem/nvidia/volcano-vgpu) instead.
:::

## Related

- [NVIDIA (GPU)](/ecosystem/nvidia)
- [Drivers & Container Runtime](/ecosystem/nvidia/driver-runtime)
- [Device plugin](/ecosystem/nvidia/gpu-operator/device-plugin)
- [Volcano & vGPU Splitting](/ecosystem/nvidia/volcano-vgpu)
