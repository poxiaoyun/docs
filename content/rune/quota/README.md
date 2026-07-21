# 配额

本目录描述 `rune` 的资源配额能力。配额用于控制租户和工作空间可以使用的资源范围，并影响资源规格可见性和后续调度队列容量。

## 文档列表

- [需求](requirements.md)
- [设计](design.md)

## 关注点

- 租户级 `ClusterResourceQuota`。
- 工作空间级 `ResourceQuota`。
- 配额如何表达资源名、型号、厂商和资源池。
- 配额如何生成 Kubernetes quota hard 和 scopeSelector。
- 配额如何影响 Flavor 可见性。
- 配额如何作为调度队列容量来源。
