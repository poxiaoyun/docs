# ADR-0002：API 保存期望状态，Controller 执行调谐

- 状态：accepted
- 日期：2026-07-16

## 背景

创建工作空间、应用 Instance 和资源治理对象会访问远程集群或其他平台组件，执行时间长且可能部分失败。将全部操作放在 HTTP 请求中难以重试和恢复。

## 决策

Rune Cloud API 负责集群与算力治理对象的认证上下文、业务校验和 spec；对应 Controller 监听对象变化，以幂等方式创建、更新或删除外部资源，并把观察结果写入 status。Apps/Installer 新路径采用相同原则：Apps 受理产品实例请求，Installer Instance 保存安装 spec，Installer Controller 负责把制品调谐为 Kubernetes 资源。删除外部资源使用 finalizer，spec 与 status 通过 generation 关联。

## 后果

- API 响应表示期望状态已受理，不表示外部资源已经就绪。
- Controller 必须处理重复事件、进程重启、超时和外部漂移。
- 用户界面和自动化客户端需要轮询或 watch status。

## 验证

Rune 与 Installer Controller 测试覆盖重复 reconcile、旧 generation、外部超时、目标已存在、目标已删除和 finalizer 清理。
