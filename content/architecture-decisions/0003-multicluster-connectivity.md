# ADR-0003：中心组件分别连接被管集群

- 状态：accepted
- 日期：2026-07-16

## 背景

Cloud API 需要同步查询和代理集群资源，Cloud Controller 需要持续 watch 和调谐。两者是独立进程，无法共享内存 client 和 cache。

## 决策

中心侧保存受控的集群连接配置，Cloud API 与 Cloud Controller 分别根据 kubeconfig 建立 Kubernetes client 和 cache。基础通道由中心侧访问 Kubernetes API；Rune Agent 部署在被管集群内，用于本地 cache、终端、WebSocket 和特殊服务代理，不作为集群纳管的主动回连通道。

## 后果

- 两个中心进程的连接和 cache 就绪状态可能不同，必须分别判断。
- kubeconfig 是高敏感数据，需要严格授权、审计和网络限制。
- 单集群连接失败不应阻塞其他集群。

## 验证

测试覆盖 kubeconfig 更新、cache 未同步、连接断开与恢复、单集群隔离，以及 Agent 不可用时普通 Kubernetes API 能力的行为。
