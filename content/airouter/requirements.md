# AIRouter 需求

本文描述模型访问网关的稳定需求。AIRouter 解决“如何受治理地调用模型”，不负责创建训练或推理工作负载。

## 背景

业务应用直接对接不同公有云和自建推理服务会形成多套协议、凭据、限流、审核和用量口径。供应商故障或模型迁移还会迫使每个调用方分别修改。

AIRouter 需要提供统一的 OpenAI 兼容入口，把模型调用热路径与渠道、策略和账务管理分开扩展，并为租户隔离、内容安全、成本和故障诊断提供一致证据。

## 用户与管理员问题

### 应用需要统一模型协议

- 提供 OpenAI 兼容的 Chat Completions、Embeddings 等已支持接口。
- 对不同供应商执行请求、响应和流式 SSE 的协议适配。
- 调用方使用 AIRouter Token，不直接持有上游供应商密钥。
- 错误响应保留稳定分类，并在不泄露上游凭据的前提下提供诊断信息。

### 管理员需要管理渠道和访问范围

- Channel 描述供应商、模型、上游地址、凭据引用、优先级和可见性。
- 支持 public、tenant 和 private 访问范围。
- 自建 Rune 服务通过显式 `InferenceServiceRegistration` 创建或更新 Channel。
- Channel 注册成功只表示配置已同步，不代表上游服务持续健康。
- 更新和删除使用稳定外部标识，重复 reconcile 不产生重复 Channel。

### 平台需要限制和审核调用

- 对 Token 和 Channel 执行 RPM/TPM 限流。
- 请求前按策略审核输入，响应阶段审核输出，流式内容支持增量检测。
- Token、租户、用户和 Channel 范围必须一致，不能只凭模型名路由。
- 审核、限流或授权拒绝返回可识别原因并留下安全审计证据。

### 运营人员需要用量和账务

- 记录请求数、输入/输出 Token、延迟、状态、Channel 和上游结果。
- usage 采集与计费尽量不阻塞响应热路径。
- 重试、fallback 和消息重复不得造成重复计费。
- 余额预检、费率和扣费失败具有明确语义，不能与普通上游错误混淆。

## 热路径要求

- Data Plane 不连接业务数据库，只读取 Redis 或通过 gRPC 向 Control Plane 回源。
- 缓存命中、未命中、过期和失效广播均可观测。
- 并发 cache miss 使用 singleflight 或等价机制抑制击穿。
- 流式连接支持取消传播、上游连接释放和部分 usage 记录。
- Retry 与 fallback 只在安全条件下执行，已向客户端输出内容后不得无痕切换并生成重复片段。
- Control Plane 与 Data Plane 可独立扩缩容和设置资源、超时与 SLO。

## 平台集成契约

| 集成方 | AIRouter 提供 | AIRouter 不负责 |
| ------ | ------------- | ---------------- |
| Rune | Channel 管理 API 与受治理的数据面入口 | Instance、Service、Endpoint 和 Kubernetes 健康 |
| IAM | 用户、组织和成员的外部身份来源 | AIRouter Token、Channel 权限、usage 和 billing |
| Console / ChatApp / RAG / Agent | 统一模型调用与管理接口 | 上游模型内容正确性和业务会话事实 |
| 公有云或自建模型服务 | 被选择的上游目标 | 平台租户、配额和审计的权威状态 |

## 可用性与安全需求

- Control Plane 不可用而缓存仍有效时，Data Plane 按明确的缓存有效期继续服务。
- 缓存未命中且 Control Plane 不可用时必须失败关闭，不能绕过 Token、Channel 或策略校验。
- Redis 不可用时的本地降级范围需要显式配置；分布式限流不得静默退化为无限制。
- 上游凭据只在需要的适配器边界解密或使用，不出现在日志、响应和 tracing attributes 中。
- Control/Data gRPC 在生产跨网络部署时支持 TLS，敏感环境支持 mTLS。
- 每次请求可关联入口 request ID、AIRouter trace ID、Token 主体、Channel、上游尝试和 usage。

## 非目标

- AIRouter 不创建 Rune Product、Instance 或 Kubernetes Service。
- AIRouter 的 RPM/TPM 不替代 Rune 的计算资源 Quota 和 Scheduler。
- AIRouter 不成为全平台用户、组织与成员的第二权威来源。
- Redis 不作为 Channel、Token、usage 或账务的最终权威存储。
- Channel Ready 不等于上游模型 SLO 已满足。

## 验收标准

- 同一 OpenAI 兼容请求可以按 Channel 配置调用至少一个自建或公有云上游。
- Token 无效、范围不匹配、限流、审核拒绝、无可用 Channel 和上游失败得到不同错误与指标。
- Redis cache miss 只通过 gRPC 回源 Control Plane，Data Plane 进程没有数据库连接。
- Control Plane 配置变化可以广播并使所有 Data Plane 副本在约定窗口内更新。
- 流式中断后上游连接被取消，限流预占得到修正，usage/计费不会重复。
- 同一 `InferenceServiceRegistration` 重复同步只产生一个逻辑 Channel，删除可安全重试。
- 跨租户 Token 无法访问 tenant/private Channel，即使知道 Channel ID 或模型名。
