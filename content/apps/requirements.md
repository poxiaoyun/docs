# Apps 需求

Apps 解决“有哪些可交付应用、有哪些版本、如何把一个版本安装到指定 Workspace”。它把产品目录与集群内安装连接起来，但不接管集群、身份或底层 Helm Controller 的权威状态。

## 产品需求

### 管理应用目录

- Product 和 ProductVersion 都具有明确租户范围，`system` 只是保留租户，不走另一套数据模型。
- 版本包含不可变 artifact 引用、内容摘要、schema、发布状态和展示信息。
- 普通用户默认只看到已发布版本；查看未发布内容需要独立授权动作。
- 上传或注册同一内容保持幂等，不得用相同版本覆盖不同 Chart 内容。

### 交付应用实例

- 用户选择 tenant、cluster、workspace、product、version 和 values 创建 Instance。
- Apps 通过 Rune 解析目标 Workspace 并使用受限 Kubernetes Proxy，不持有目标 kubeconfig。
- Apps 将 Chart 交付为同 Namespace 的不可变 Secret，并创建引用该 Secret 的 Installer Instance CR。
- API 创建成功表示期望对象已存在，不代表工作负载已经 Ready。

### 管理生命周期与状态

- 支持 Create、Get、List、Watch、Update、Patch、Delete 和 Retry。
- 安装、升级、停止、恢复和扩缩容通过 Installer Instance spec 表达。
- Installer Instance status 是安装状态、端点和受管资源的权威来源。
- Apps 不在中央 Store 保存第二份可独立变化的 Instance。
- 集群离线时 Instance 操作明确失败，恢复后由客户端安全重试。

## 集成边界

| 依赖 | Apps 使用的能力 | 权威状态 |
| ---- | --------------- | -------- |
| IAM | 认证、授权、租户范围 | IAM |
| Rune | Cluster、Workspace、Resource Graph 和受限 Kubernetes Proxy | Rune 与 Kubernetes |
| Installer | Instance CR、安装调谐与 status | 目标 Kubernetes 集群 |
| OCI Registry | Chart artifact 上传与读取 | Apps artifact storage |
| Plugins | 可发布的官方 Chart 与镜像集合 | Plugins 源仓库与发布制品 |

## 非目标

- Apps 不纳管 Kubernetes 集群或保存 kubeconfig。
- Apps 不执行 Helm、Kustomize 或 Template 渲染安装。
- Apps 不维护用户和组织主数据。
- Apps 不复制 Installer Instance 作为中央离线清单。
- Apps 不与 Rune legacy Controller 同时管理同一个安装。

## 验收标准

- 租户可发布 ProductVersion，并且不同内容不能覆盖同一不可变版本。
- 用户可在已授权 Workspace 创建 Instance，最终由 Installer CR 表达期望状态。
- 跨租户 Product、未发布版本、普通 Secret 和非受管 Namespace 访问被拒绝。
- Rune、目标集群或 Installer 不可用时返回可识别的依赖错误。
- 重复 Create、Update、Retry 和 Delete 不产生重复 release 或孤立 Chart Secret。
