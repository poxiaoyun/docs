# 资源池

本目录描述 `rune` 的资源池能力。资源池用于把集群节点划分成可选择、可配额、可观测的节点集合。

## 文档列表

- [需求](requirements.md)
- [设计](design.md)

## 关注点

- ResourcePool 如何表达节点集合。
- 节点如何被打上资源池标签。
- Flavor 和 ResourceQuota 如何绑定资源池。
- 资源池如何过滤 dashboard。
- 资源池与集群、调度和拓扑的边界。
