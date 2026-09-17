---
title: 设备插件
updated: '2026-09-17'
author: Rune Docs Team
description: ACK 侧的 PPU 设备插件：它上报哪些资源、装完怎么验证、怎么调调度、怎么切 MIG。
tags:
  - ecosystem
  - aliyun
  - ppu
  - device-plugin
---

# 设备插件

集群要能调度 PPU，先得有组件把卡上报成 Kubernetes 资源。这一步由 ACK 的两个组件完成：

| 组件 | 作用 | 装不装 |
| --- | --- | --- |
| `ack-ppu-device-plugin` | 发现并上报节点上的 PPU，按 Pod 申请分配设备并挂载进容器 | 必装，PPU 节点全靠它 |
| `ack-rdma-device-plugin` | 把 RDMA 网卡上报成 `rdma/hca` | 跨机训练、多机推理必装 |

:::warning 这两个组件不在平台的「系统应用」里
昇腾和英伟达的集群侧组件可以从平台的**集群管理 → 运维管理 → 系统应用**里一键装。
PPU 的这两个组件是阿里云 ACK 的官方组件，要在**阿里云容器服务控制台**的组件管理里安装。
平台侧负责的是识别资源、建实例、看监控，不代管 ACK 组件的安装。
:::

设备插件的工作内容就四件事：发现设备、上报健康状况与数量、按请求分配、把设备挂载进容器。
它遵循社区设备插件标准，所以 `resources.limits` 的写法和 GPU 完全一样。

## 上报哪些资源

整卡：

```yaml
alibabacloud.com/ppu
```

切分实例（MIG）：

| 显存规格 | 可选算力份数 |
| --- | --- |
| `1g12gb`（12GB） | `4u`、`8u` |
| `2g24gb`（24GB） | `1u`、`12u`、`16u` |
| `4g48gb`（48GB） | `1u`、`2u`、`3u`、`4u`、`8u`、`16u`、`24u`、`32u`、`64u` |

写成完整资源名就是 `alibabacloud.com/ppu-4u.4g48gb` 这种形式。命名按字面读：
`u` 前面是 CU（算力单元）份数，`g` 前面是显存份数，末尾是这个实例的显存总量。
算力和显存是**分开切**的，所以会出现 `64u.4g48gb` 这种「算力给满、显存只给一份」的组合。

:::info 档位以节点实际上报为准
不是每张卡都具备上面所有档位。设备插件按卡的实际切分能力上报，以节点上的 `Allocatable` 为准。
:::

```bash
kubectl describe node <NODE_NAME> | grep -A 20 "Allocatable"
```

## 这一组页面

| 页面 | 解决什么问题 |
| --- | --- |
| [安装与验证](/ecosystem/aliyun/device-plugin/install) | 装组件、勾开关、确认资源已上报 |
| [调度策略](/ecosystem/aliyun/device-plugin/scheduling) | 拓扑感知、Binpack、多机与成组调度 |
| [MIG 切分](/ecosystem/aliyun/device-plugin/mig) | 把一张卡切成多份给不同任务 |

## 版本

`ack-ppu-device-plugin` 的第一个对外开放版本是 **1.4.0**：

| 版本 | 镜像 | 发布时间 | 说明 |
| --- | --- | --- | --- |
| 1.4.0 | `registry-cn-wulanchabu.ack.aliyuncs.com/acs/ppu-device-plugin:v1.4.0-8a13b6d4-topology-aliyun` | 2026-08-05 | 首次全量发布，全面支持 M890P |

存量集群升级不受影响。镜像地址含地域前缀，其他地域以控制台给出的地址为准。

## 相关

- [阿里云（PPU）](/ecosystem/aliyun)
- [灵骏节点池](/ecosystem/aliyun/lingjun-nodepool)
- [安装与验证](/ecosystem/aliyun/device-plugin/install)
- [在平台上使用](/ecosystem/aliyun/platform-usage)
