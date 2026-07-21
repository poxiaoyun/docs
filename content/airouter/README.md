# AIRouter

本目录描述晓石 AI 平台的模型访问网关。AIRouter 对外提供统一模型协议，对内管理渠道、网关 Token、访问范围、限流、审核、路由、用量和计费；Rune 负责部署自建模型服务并将显式服务注册投影为 AIRouter Channel。

## 文档列表

- [需求](requirements.md)
- [设计](design.md)

## 产品功能

| 功能 | 用户价值 |
| ---- | -------- |
| 统一协议 | 以 OpenAI 兼容 API 调用多家公有云或自建模型 |
| Channel 与 Token | 集中管理上游、访问范围和调用凭据 |
| 流量治理 | 执行 RPM/TPM 限流、渠道选择、retry 和 fallback |
| 内容安全 | 对输入、输出和流式内容执行策略审核 |
| 运营计量 | 记录 usage、延迟、错误、审计与 billing 数据 |
| 高可用架构 | Control Plane 与 Data Plane 独立扩缩容和隔离故障 |

## 现状判断

AIRouter 已形成相对完整的 Control Plane / Data Plane 架构，并覆盖多供应商适配、缓存、限流、审核、流式转发、审计、usage、billing、运行时配置和可观测性。当前平台集成的关键缺口不在基础代理能力，而在租户身份映射、Rune 注册对象与 Channel 的全生命周期、缓存失效与控制面故障语义，以及端到端 SLO 的统一验收。

## 关注点

- 管理请求与高频推理请求如何隔离。
- Channel、Token、策略、usage 和 billing 由谁持有。
- 数据面如何通过 Redis 和 gRPC 获取运行配置而不访问数据库。
- public、tenant、private Channel 如何结合身份和 Token 限定访问。
- 流式请求如何执行限流、审核、重试、计量和断连清理。
- Rune 自建推理服务如何显式注册、更新与删除。
