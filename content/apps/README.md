# Apps

Apps 是晓石 AI 产品线的应用目录与应用生命周期产品。它管理租户作用域的 Product、ProductVersion 和 Chart artifact，并通过 Rune 提供的集群访问能力，在目标 Workspace 中创建和管理 Installer Instance。

## 文档列表

- [需求](requirements.md)
- [设计](design.md)
- [相关平台组件](../platform-components.md)

## 产品功能

| 功能 | 用户价值 |
| ---- | -------- |
| 应用目录 | 浏览系统或租户发布的开发、训练、推理和通用应用 |
| 产品版本 | 管理 ProductVersion、发布状态、Chart 和内容摘要 |
| 应用交付 | 选择集群、Workspace、版本和 values 创建 Instance |
| 生命周期 | 安装、升级、停止、恢复、扩缩容、重试和删除 |
| 运行视图 | 查询 Installer status、端点、关联资源和事件 |
| 多租户 | Product、版本、Instance 和未发布内容访问均受租户权限约束 |

## 现状判断

当前 `../apps` 工作树已经实现 Product、ProductVersion、OCI artifact 和基于 Installer CR 的 Instance API，但仓库尚无提交基线。因此本文将 Apps 列为“正在落地的独立产品边界”，不能将它描述为所有环境都已完成迁移。

Rune 仍存在历史 Product/Instance 能力。新旧路径不能同时管理同一个安装；迁移环境应明确由 Apps + Installer 还是 Rune legacy Controller 持有应用生命周期。

## 关注点

- Product、ProductVersion 和 Instance 如何保持租户边界。
- 发布版本、OCI artifact、digest 和 schema 如何形成不可变契约。
- Apps 如何通过 IAM 验证身份，通过 Rune 解析 Workspace，并由 Installer 执行安装。
- Installer status、端点和受管资源如何投影为用户可理解的 Instance 视图。
- 集群离线、重复请求、更新、重试和删除如何保持幂等。
- Apps 新路径与 Rune legacy Product/Instance 如何安全迁移且不重复管理。
