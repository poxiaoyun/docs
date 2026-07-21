# 工作空间

本目录描述 `rune` 的工作空间能力。工作空间是租户在某个集群内的应用运行边界，主要映射为 Kubernetes namespace。

## 文档列表

- [需求](requirements.md)
- [设计](design.md)

## 关注点

- 工作空间如何映射到 namespace。
- 工作空间如何归属租户。
- 工作空间如何承载应用实例和资源树。
- 工作空间配额如何限制应用资源。
- 工作空间控制器如何创建 namespace 和默认 LimitRange。
