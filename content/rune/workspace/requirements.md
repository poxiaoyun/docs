# 工作空间需求

本文描述 `rune` 工作空间能力的产品需求。工作空间是租户在集群内组织应用实例、资源配额和运行资源的基本单元。

## 背景

Kubernetes 的 namespace 是运行隔离边界，但直接把 namespace 暴露给用户会缺少租户归属、产品语义、默认资源策略和控制台入口。`rune` 使用 Workspace 作为产品对象，并由控制器在目标集群中创建和维护 namespace。

## 用户问题

### 用户需要一个项目级隔离空间

一个租户可能有多个项目、团队或环境，例如 dev、staging、prod。

需求：

- 租户可以在集群下创建多个工作空间。
- 工作空间拥有名称、描述、标签和注解。
- 工作空间必须归属于一个租户。
- 工作空间对应一个 Kubernetes namespace。

### 工作空间需要自动初始化

用户创建工作空间后，不应该手工创建 namespace 和默认资源策略。

需求：

- 控制器自动创建 namespace。
- namespace 注入租户和工作空间标签。
- 控制器创建默认 LimitRange。
- 工作空间状态展示 Preparing、Ready、Failed。

### 工作空间需要承载应用实例

用户在工作空间内创建 Instance，所有应用资源应落在该工作空间 namespace。

需求：

- Instance API 位于租户/集群/工作空间路径下。
- Instance 渲染出的 namespaced 资源必须进入工作空间 namespace。
- 工作空间资源树可以展示该 namespace 内资源。
- 工作空间删除时需要清理对应 namespace。

### 工作空间需要独立配额

租户配额是上限，工作空间需要进一步分配项目级资源。

需求：

- 工作空间可以配置 namespace ResourceQuota。
- 工作空间配额从租户授权资源中选择。
- 工作空间可用 Flavor 受工作空间配额限制。
- 工作空间可查询 quota resources 和 quota selector。

### 工作空间需要安全命名

工作空间 ID 最终会成为 namespace 名称，不能和系统命名空间冲突。

需求：

- 自动生成 ID 使用 `ws-` 前缀。
- 禁止租户创建以 `kube-`、`system`、`default`、`rune-` 开头的工作空间。
- 工作空间资源不能跨 namespace 创建。

## 产品能力需求

### 工作空间管理

工作空间需要支持：

- 创建。
- 列表。
- 获取详情。
- 更新名称、描述、标签、注解。
- 删除。
- 状态展示。

### 资源视图

工作空间需要支持：

- 查看 namespace 内基础资源。
- 查看 Pod 扩展信息。
- 查看事件。
- 查看资源子节点。
- 服务代理能力。

### 应用实例

工作空间内需要支持：

- Instance 创建、更新、删除。
- Instance 停止、恢复、扩缩容。
- Instance 资源树。
- Instance 模板。

### 配额

工作空间配额需要支持：

- 设置 ResourceQuota。
- 更新 ResourceQuota。
- 删除 ResourceQuota。
- 查询工作空间可用资源。
- 查询工作空间 quota selector。

## 非目标

第一阶段不要求：

- 不支持一个 Workspace 映射多个 namespace。
- 不支持普通用户选择任意已有系统 namespace。
- 不在 Workspace 层实现完整项目成员权限模型。
- 不自动迁移工作空间内已有应用。
- 不在删除前做复杂资源保留策略。

## 验收标准

- 租户可以在有配额的集群下创建工作空间。
- 工作空间创建后目标集群出现同名 namespace。
- namespace 带租户和工作空间标签。
- namespace 内有默认 LimitRange。
- 工作空间状态能反映 Ready 或 Failed。
- 工作空间 API 只能访问当前租户工作空间。
- Instance 资源被限制在工作空间 namespace。
- 工作空间可以配置和查看 ResourceQuota。
