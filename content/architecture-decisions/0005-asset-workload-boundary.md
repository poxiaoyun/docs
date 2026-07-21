# ADR-0005：AI 资产与工作负载保持独立生命周期

- 状态：accepted
- 日期：2026-07-16

## 背景

模型、数据集和镜像需要版本、权限、复用与分发；训练、推理和 Space 工作负载需要算力、调度、部署和运行观测。将两者合并会使资产版本随部署变化，或让资产服务承担集群控制职责。

## 决策

Moha 持有模型、数据集、镜像和 Space 的资产元数据与内容；Apps 持有 Product、ProductVersion 与面向用户的 Instance 视图，Rune 持有集群和算力配置，Installer 持有新路径的安装期望与状态，Kubernetes 持有运行事实。工作负载通过稳定资产 revision 或镜像引用消费 Moha 内容，部署状态不回写为资产版本。

Rune 当前基线仍包含旧 ProductChart/Instance Helm Controller。迁移期间旧路径与 Apps/Installer 新路径可以并存，但同一逻辑 Instance 只能由其中一条路径管理。

## 后果

- 同一资产版本可以被多个产品版本、集群和 Instance 复用。
- 资产可用、部署成功和服务可调用是三个不同状态，需要分别展示。
- 删除资产前必须处理仍在使用的引用，删除 Instance 不应默认删除资产。

## 验证

测试覆盖固定 revision、无权限资产、内容拉取失败、同一资产多次部署、Instance 删除和资产删除冲突。
