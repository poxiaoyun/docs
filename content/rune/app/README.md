# 应用

本目录描述 `rune` 的应用能力。应用由 `Product`、Helm chart 和 `Instance` 共同承载：

> 本目录记录 Rune 基线中的迁移期旧路径。新实例路径为 [Apps](../../apps/README.md) → Installer → Kubernetes；同一实例不能由 Rune 旧 Controller 与 Installer 同时管理。

- `Product` 描述可安装的应用模板和版本。
- Helm chart 是应用交付包。
- `Instance` 是用户在某个集群和工作空间中安装后的应用实例。

## 文档列表

- [需求](requirements.md)
- [设计](design.md)

## 关注点

- 应用模板如何发布、展示和版本化。
- 用户如何创建、更新、停止、恢复、扩缩容和删除应用实例。
- Instance values 如何通过 chart schema 校验和回填资源规格。
- Helm 渲染结果如何注入标签、命名空间、调度器、扩展和仪表盘。
- 应用状态、端点、角色和资源树如何聚合给控制台。
