# Moha 需求

本文描述 AI 资产中心的稳定需求和平台边界。资产包括模型、数据集、镜像和 Space；资产发布成功与工作负载部署成功是不同结果。

## 背景

训练、微调、评测和推理需要复用大量模型权重、数据集、容器镜像与应用代码。若只用文件路径或页面名称引用，内容变化、权限、来源和版本无法可靠追踪，工作负载也无法重现。

Moha 需要提供带组织和可见性边界的版本化资产服务，并让 Git、LFS、OCI 客户端和平台 API 使用一致的仓库语义。

## 用户问题

### 发布者需要版本化资产

- 模型、数据集和 Space 使用仓库、branch/tag/commit 等 Git 语义管理版本。
- 大文件通过 Git LFS 和对象存储传输，避免进入普通 Git object 路径。
- 容器镜像通过 OCI/Docker Registry V2 协议 push、pull 和按 digest 定位。
- 展示名称可变，但组织、仓库、类型和不可变 revision/digest 能唯一定位内容。
- 删除元数据、Git 内容、LFS 对象和镜像 blob 时必须定义顺序、重试和保留策略。

### 消费者需要可重现地获取内容

- 工作负载引用固定 revision、tag 解析结果或镜像 digest；生产流程不只依赖会移动的分支或 latest。
- 大文件下载不经过 Rune Cloud API 内存中转。
- 下载失败能够区分无权限、不存在、对象存储不可用和内容校验失败。
- 资产引用保留来源和版本信息，便于部署、审计与问题复现。

### 组织需要控制资产可见性

- 支持 public、internal 和 private 可见性。
- public 允许符合策略的匿名或全平台读取；internal 限定组织成员；private 限定所有者和显式协作者。
- Git HTTP/SSH、LFS、REST 与 Registry 对同一资产执行一致的权限语义。
- Moha 可复用 IAM 的组织和授权能力，但仓库成员与资产特有权限仍由 Moha 解释。

### 用户需要导入外部资产

- 支持从 Hugging Face、ModelScope 等来源建立镜像或同步任务。
- 保存上游来源、目标仓库、同步状态和失败原因。
- 重复同步保持幂等，不因网络超时创建多份逻辑仓库。
- 上游变化不会静默改写已经被平台固定引用的本地 revision。

### Space 需要运行资源

- Space 仓库保存应用代码与资产版本，运行工作空间由 Rune 提供。
- 创建、更新或删除 Workspace 的调用可重试，并能在 Moha 中观察同步状态。
- Rune 不可用不应破坏 Space 仓库内容；Git 仓库删除也不应静默遗留不可识别的运行资源。

## 质量需求

- Git/LFS/Registry 的鉴权结果在不同协议入口保持一致。
- LFS 和 Registry blob 使用内容摘要校验，元数据不得声称不存在的内容已可用。
- 大文件上传、下载支持流式处理、合理超时和失败续传或安全重试。
- MongoDB、Git 存储、S3/文件系统或 IAM 不可用时返回可区分的依赖错误。
- 后台镜像、扫描、谱系更新等任务具有幂等键、状态、重试与单实例执行约束。
- 日志至少关联用户、组织、仓库类型、仓库、revision/digest、协议和 request ID，且不包含凭据。
- 备份恢复必须覆盖元数据与内容存储的一致时间点或提供可检测、可修复的差异流程。

## 非目标

- Moha 不选择集群、ResourcePool、Flavor 或 Scheduler。
- Moha 不持有 Rune Instance 的期望状态或 Kubernetes 运行事实。
- Moha 不把资产 revision 当作一次部署或模型服务 Channel。
- Moha 不替代 IAM 成为全平台用户和组织的权威来源。
- Moha 不替代 KMS 或通用 Secret 管理系统。

## 验收标准

- 用户可以创建不同类型仓库，并通过 Git/LFS 或 OCI 发布内容。
- 固定 revision/digest 在内容未被明确删除时可重复获取并通过摘要校验。
- public、internal、private 在 REST、Git、LFS 和 Registry 路径下产生一致的允许或拒绝结果。
- 非成员无法通过构造组织、仓库或 blob 路径绕过授权。
- 外部来源同步失败可重试，且不会产生重复逻辑资产。
- Moha 不可用时，已在集群中运行且不需重新拉取内容的 Rune 工作负载继续运行。
- 删除或更新 Space 时，仓库状态和 Rune Workspace 投影的部分失败可被观察和修复。
