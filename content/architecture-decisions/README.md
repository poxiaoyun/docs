# 架构决策记录

本目录记录已经体现在当前实现中的关键架构决策。ADR 解释决策背景、选择和后果，不记录路线图，也不代替代码和领域设计。

## 决策索引

| ADR                                               | 决策                                     | 影响范围               |
| ------------------------------------------------- | ---------------------------------------- | ---------------------- |
| [ADR-0001](0001-authoritative-state-ownership.md) | 按领域划分权威状态，不建立平台统一数据库 | 全平台                 |
| [ADR-0002](0002-api-controller-reconciliation.md) | API 保存期望状态，Controller 幂等调谐    | Rune Cloud、Installer  |
| [ADR-0003](0003-multicluster-connectivity.md)     | 中心组件分别建立到被管集群的连接         | Rune Cloud、Agent      |
| [ADR-0004](0004-airouter-control-data-plane.md)   | AIRouter 分离控制面与数据面              | 模型访问链路           |
| [ADR-0005](0005-asset-workload-boundary.md)       | AI 资产与工作负载保持独立生命周期        | Moha、Apps、Rune、Installer、Kubernetes |

## 状态定义

- `accepted`：决策已被当前架构采用。
- `superseded`：已由新的 ADR 替代，原文保留用于追溯。
- `deprecated`：当前实现仍可能存在，但不再作为有效设计依据。

新增 ADR 时使用下一个四位编号，至少包含状态、背景、决策、后果和验证方式。修改已接受决策的核心含义时创建新 ADR，并在旧 ADR 中指向替代记录。
