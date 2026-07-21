# 应用需求

本文描述 `rune` 应用能力的产品需求。应用能力的目标是让用户从产品市场选择一个应用模板，填写配置后在指定集群和工作空间中安装、运行、观察和运维一个应用实例。

应用模型包含：

- `Product` 是应用模板元数据。
- Helm chart 是应用包和表单 schema 的来源。
- `Instance` 是已安装的应用实例。
- `values` 是用户配置和 chart 渲染输入。

## 背景

`rune` 不直接要求用户编写 Kubernetes YAML。用户通过控制台或 API 选择产品、版本、资源规格和参数，系统负责下载 chart、校验 values、渲染资源、安装到目标 namespace，并把运行状态、访问端点和资源树聚合回来。

这要求应用模型同时服务三类人：

- 应用发布者：维护 Product 和 chart。
- 应用使用者：创建和管理 Instance。
- 平台运维者：控制权限、安全边界、状态诊断和资源可观测。

## 用户问题

### 用户需要从应用模板开始，而不是从 YAML 开始

用户想部署推理服务、实验追踪、数据库、训练任务或工具服务时，希望看到可安装的应用、版本、说明、默认参数和表单。

需求：

- 应用模板需要有名称、分类、图标、描述、版本、发布状态。
- 应用 chart 需要提供 README、CHANGELOG、values 和 values schema。
- 支持多语言说明和表单文案。
- 用户只能看到已发布且有权限访问的应用版本。

### 创建应用时需要稳定的配置入口

不同 chart 的 values 结构不同，用户不应该直接面对完整 values YAML。

需求：

- chart 通过 `values.schema.json` 定义表单。
- `rune` 在创建或更新 Instance 时校验 values。
- schema 扩展可以触发资源规格等服务端回填。
- 用户传入的 values 存为 Instance spec，渲染后的 values 存入 status，便于审计和对比。

### 应用需要绑定集群和工作空间

同一个应用模板可以安装到不同集群和工作空间。实例必须落到目标 namespace。

需求：

- Instance 必须记录 `cluster` 和 `namespace`。
- API 按租户、集群、工作空间隔离。
- 渲染出的 namespaced 资源必须被设置到目标 namespace。
- 默认不允许 chart 创建 cluster-scoped 资源。

### 用户需要应用级生命周期，而不是只看 Helm release

用户关心的是应用是否健康、是否正在安装、是否暂停、是否失败，而不是 Helm 内部状态。

需求：

- 支持创建、更新、删除。
- 支持停止和恢复。
- 支持单角色和多角色扩缩容。
- 支持保存当前实例为模板。
- 应用状态需要统一为产品可理解的 phase。

### 应用需要展示访问端点

用户部署服务后，需要直接拿到访问地址。

需求：

- 自动从 Service 和 Ingress 聚合端点。
- 支持端点地址补全。
- 支持关联端点，例如从 values 中读取外部依赖 URL。
- 端点需要区分内部、外部和公开访问。
- 健康的实验追踪和推理实例可以作为其他任务的可选端点。

### 应用需要状态聚合和角色视图

一个应用可能包含 Deployment、StatefulSet、Job、Pod 等资源，用户需要看到应用整体状态和关键组件状态。

需求：

- 默认从 Deployment、StatefulSet、DaemonSet、Job、Pod 计算状态。
- 支持 chart 注解自定义状态表达式。
- 支持 summary 表达式生成列表摘要。
- 多角色应用可以把 component label 映射为角色。
- Instance phase 需要区分长期服务和任务型应用。

### Chart 需要被产品层增强

应用包应该保持相对通用，但产品层需要统一注入标签、资源、安全和平台扩展。

需求：

- 所有资源注入 Instance label，便于资源树、日志、监控和追踪归属。
- 注入 common labels。
- 根据资源使用情况注入 schedulerName。
- 停止应用时把 Deployment/StatefulSet 副本置零，Job suspend。
- 支持 NodePort 等受控扩展。
- chart 中的 dashboards 可以转为实例仪表盘配置。

### 应用需要可观测和诊断入口

用户需要从 Instance 进入资源、日志、监控、追踪和事件。

需求：

- Instance 状态保存直接管理的 Kubernetes 资源引用。
- 资源树按 Instance label 关联资源。
- 控制台可以从应用进入 Pod、Service、Ingress、PVC、Event 等详情。
- 应用安装失败和运行失败都需要有 message。

## 产品能力需求

### Product

Product 需要支持：

- 名称、分类、图标、描述。
- domain 区分系统内部和用户可见应用。
- published 控制是否对用户可见。
- 多版本。
- chart 元数据同步。
- i18n 文案。

### Chart

Chart 需要支持：

- `values.yaml` 提供默认值。
- `values.schema.json` 提供表单和校验。
- `README.md`、`README.{locale}.md` 提供说明。
- `CHANGELOG.md` 提供变更记录。
- `i18n/{locale}.yaml` 提供翻译。
- `dashboards/` 提供实例仪表盘。
- Chart.yaml annotations 提供角色、状态、摘要和端点表达。

### Instance

Instance 需要支持：

- 选择 Product 和版本。
- 填写 values。
- 绑定集群和 namespace。
- 设置应用类型。
- 设置 common labels。
- 设置受控 extensions。
- 展示 phase、healthy、message、endpoints、states、summary、resources。

### 生命周期操作

应用实例需要支持：

- 创建。
- 更新。
- 删除。
- 停止。
- 恢复。
- 扩缩容。
- 保存为模板。
- 解密实例或 Pod 相关敏感信息。

### 安全边界

安全需求：

- 普通 Instance 默认不能创建 cluster-scoped 资源。
- namespaced 资源不能越过目标 namespace。
- 权限字段不能由普通用户直接设置。
- 服务端保留 managed labels，例如 creator。
- chart schema 校验必须在创建和更新前执行。

## 非目标

第一阶段不要求：

- 不把应用模型替换成 Kubernetes 原生 Application CRD。
- 不要求所有 chart 使用同一 values 结构。
- 不自动理解所有自定义 CRD 的健康状态。
- 不默认允许 cluster-scoped 资源。
- 不在 Instance 层直接实现所有业务控制器逻辑。
- 不把 Product、Instance、Flavor、Queue 合并成一个对象。

## 验收标准

基础能力：

- 可以上传或发布应用 chart。
- 可以从 Product 获取最新 chart、schema、README 和 i18n。
- 可以创建 Instance 并安装 Helm chart。
- 创建和更新时 values 被 schema 校验。
- Flavor 字段可以通过 schema 扩展回填。
- 渲染资源被注入 Instance label 并落到目标 namespace。
- Instance status 能展示 phase、healthy、message、endpoints、states、resources。
- 停止和恢复能通过 `global.paused` 控制。
- 扩缩容能修改单角色或多角色 replica path。

兼容能力：

- 没有自定义状态注解的 chart 可以使用默认状态检测。
- 没有角色注解的 chart 仍可作为单角色应用运行。
- 没有 dashboards 的 chart 不影响安装。
- 旧 chart 不声明 Flavor schema 时行为不变。
