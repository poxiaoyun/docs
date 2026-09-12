---
title: 'Other open source communities'
updated: '2026-09-12'
author: Rune Docs Team
description: 'Which open source components the platform ships, what each one solves, and where to install or view it.'
tags:
  - ecosystem
  - open-source
---

# Other open source communities

This chapter helps you understand **which open source components sit under the platform**: what each one does, which delivery or operations problem it solves, and where in the interface you install and check it.
After reading, you can use the table below to tell which component provides a given capability (logs, autoscaling, object storage) and which page to go to.

:::tip One thing to remember first
The platform is not written from scratch; it stands on a set of mature open source components. **Components are the "parts"; the interface is the "control panel".**
Most components are installed first in the **platform admin console**, then used by users in the **AI Platform**.
:::

## Open source components at a glance

Grouped by the four kinds of work you do in the interface. "Where to install / see it" gives interface locations only; follow the category pages for the detailed steps.

| Component | What problem it solves | Category | Where to install / see it |
| --- | --- | --- | --- |
| Kubernetes | Combines many servers into one cluster and schedules containers across them | Containers & Orchestration | Cluster Management → Cluster Status (the base the platform is deployed on) |
| Volcano | Queues, co-schedules and fairly shares resources for batch and AI-training jobs | Containers & Orchestration | Operations Management → Scheduler Management |
| Volcano vGPU | Splits one GPU into shares so several jobs can share it | Containers & Orchestration | Installed with the scheduling component; Cluster Status → Accelerator Status |
| GPU Operator / Ascend scheduling components | Lets NVIDIA / Ascend clusters recognize the cards and hand them to Volcano | Containers & Orchestration | Operations Management → System Apps |
| Multus-CNI | Gives a container a second network card and a fixed IP | Containers & Orchestration | Operations Management → System Apps |
| ingress-nginx | Routes outside HTTP traffic by domain to services inside the cluster | Containers & Orchestration | Operations Management → System Apps |
| Higress | A unified ingress gateway that can replace nginx-ingress | Containers & Orchestration | Operations Management → System Apps |
| kube-ssh / sshpiper | Provides one SSH entry point and forwards connections | Containers & Orchestration | Operations Management → System Apps |
| Global configuration (global) | Central place for the image registry, default storage class, schedulers and service endpoints | Containers & Orchestration | Operations Management → System Apps (usually pre-installed with the cluster) |
| vLLM (including the encrypted ENX build) | A high-throughput large-model inference engine; the ENX build serves encrypted models | Frameworks & Inference | Workbench → Inference → Create |
| SGLang (including the PD split) | High-performance inference; the PD build splits inference into three stages that scale separately | Frameworks & Inference | Workbench → Inference → Create |
| Xinference | Serves LLM, embedding, speech and image models from one service | Frameworks & Inference | Workbench → Inference → Create |
| llama.cpp | Runs quantized open models on CPU or with a small amount of VRAM | Frameworks & Inference | Workbench → Inference → Create |
| vLLM Ascend | The vLLM inference engine for Huawei Ascend NPUs | Frameworks & Inference | Workbench → Inference → Create |
| LLaMA-Factory | A fine-tuning framework for large models | Frameworks & Inference | Workbench → Traning&Fine tuning → Create |
| mock-openai-api | Mimics the OpenAI API for offline integration and demos | Frameworks & Inference | Workbench → Inference → Create |
| kube-prometheus-stack | Collects and stores metrics, fires alerts, and ships Grafana dashboards | Observability & Operations | Operations Management → System Apps |
| metrics-server | Provides basic resource usage for nodes and Pods | Observability & Operations | Operations Management → System Apps (monitoring) |
| Loki + Logging Operator | Collects, aggregates and queries container logs | Observability & Operations | Operations Management → System Apps; view logs under Log Management |
| VictoriaMetrics / VictoriaLogs | Stores and queries metrics and logs (Prometheus-compatible) | Observability & Operations | Operations Management → System Apps |
| OpenTelemetry Collector + Jaeger | Collects and stores request trace data | Observability & Operations | Operations Management → System Apps |
| Holmes | Uses a large model to diagnose resource problems for you | Observability & Operations | System Apps; System Settings → AI Assistant Settings |
| KEDA | Autoscales on external events or metrics | Observability & Operations | Operations Management → System Apps |
| VPA | Recommends and adjusts Pod CPU and memory requests automatically | Observability & Operations | Operations Management → System Apps |
| Descheduler | Moves load off hot nodes and tidies up fragmented resources | Observability & Operations | Operations Management → System Apps |
| Prometheus Adapter | Turns Prometheus metrics into custom metrics that Kubernetes can use | Observability & Operations | Installed with the monitoring and scheduling components |
| RustFS / MinIO | S3-compatible object storage for models, datasets and other large files | Artifacts & Security | Operations Management → Storage Cluster; built-in artifact storage on the platform |
| Longhorn | Distributed block storage that gives instances persistent volumes | Artifacts & Security | Operations Management → Storage Cluster |
| Local Path Provisioner | Uses a node's local disk to provide persistent volumes | Artifacts & Security | Operations Management → Storage Cluster |
| NFS / CephFS / JuiceFS | Connects storage you already have as a usable storage class | Artifacts & Security | Operations Management → Storage Cluster |
| cert-manager | Issues and renews HTTPS certificates automatically | Artifacts & Security | Operations Management → System Apps |

## What the four categories cover

| Category | What it solves | When you care about it |
| --- | --- | --- |
| [Containers & Orchestration](/ecosystem/open-source/container-orchestration) | How jobs are scheduled, how the network connects, how traffic comes in | Jobs queue up, you need a fixed IP, you configure a domain, you add GPUs |
| [Frameworks & Inference](/ecosystem/open-source/framework-inference) | Which engine runs a model and how to fine-tune it | Creating an inference service, running a training job, switching inference engine |
| [Observability & Operations](/ecosystem/open-source/observability-ops) | Seeing cluster state, querying logs, autoscaling | Troubleshooting, watching monitoring, configuring elastic scaling |
| [Artifacts & Security](/ecosystem/open-source/artifacts-security) | Where models and data live and how transfers are encrypted | Creating storage, setting up HTTPS, planning capacity |

## Before you start

- Actions that **install system components** need **platform administrator** rights and a specific cluster (Cluster Management → select a cluster).
- To only **use** these components (create an inference service, query logs, create a storage volume), an ordinary member can do it in the **AI Platform** without installing anything.

## Related

- [Containers & Orchestration](/ecosystem/open-source/container-orchestration)
- [Frameworks & Inference](/ecosystem/open-source/framework-inference)
- [Observability & Operations](/ecosystem/open-source/observability-ops)
- [Artifacts & Security](/ecosystem/open-source/artifacts-security)
- [FAQ](/ecosystem/open-source/faq)
