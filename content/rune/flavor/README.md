# 资源规格

本目录描述 `rune` 的资源规格能力。资源规格对应 `Flavor`，用于把用户选择的规格转换为 Kubernetes resources、节点选择、资源池约束和后续设备需求。

## 文档列表

- [需求](requirements.md)
- [设计](design.md)

## 关注点

- Flavor 如何封装 CPU、内存、GPU、NPU、vGPU、存储等底层资源。
- ResourcePool 如何进入规格的节点选择条件。
- 租户和工作空间配额如何过滤可用规格。
- Instance values 如何通过 `x-resource-enum: flavors` 校验和回填规格。
- 后续标准 DRA values（`resources.claims`、`resourceClaims`、`ResourceClaimSpec`）和拓扑设备需求如何扩展。
