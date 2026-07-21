# 产品需求

本文描述 `rune` 产品能力的需求。产品用于把 Helm chart 包装成用户可浏览、可安装、可版本化的应用模板。

## 背景

`rune` 的应用实例来自 Product。Product 保存应用模板元数据，Chart 保存真实交付内容，Instance 引用 Product 的某个版本进行安装。

用户不应该直接面对 OCI chart repository。平台需要提供产品列表、版本、说明、表单 schema、发布状态和租户可见性。

## 用户问题

### 应用发布者需要管理产品模板

发布者需要创建产品、上传 chart、同步 chart 元数据并发布版本。

需求：

- Product 需要有名称、分类、图标、描述和 domain。
- Product 支持 published 状态。
- Product 支持多个版本。
- 上传 chart 后自动读取 chart version 和 appVersion。
- chart 元数据可以同步回 Product。

### 用户需要看到可安装版本

用户安装应用时，需要看到当前产品的最新版本或指定版本，并获得表单、默认值和文档。

需求：

- 获取 Product 时可以附带最新 chart。
- 获取 ProductVersion 时可以附带指定 chart。
- 只展示已发布产品和版本给普通用户。
- 未发布产品只允许管理场景使用。

### 控制台需要完整 chart 信息

控制台需要用 chart 文件生成安装页面。

需求：

- 读取 `values.yaml` 作为默认值。
- 读取 `values.schema.json` 作为表单 schema。
- 读取 `README.md` 和本地化 README。
- 读取 `CHANGELOG.md`。
- 读取 `i18n/{locale}.yaml`。
- 保留 chart metadata 和 raw 文件。

### 产品需要区分系统和租户范围

平台内置产品和租户自定义产品的来源不同。

需求：

- 支持 system repository。
- 支持 tenant repository。
- system product 可作为平台内置应用。
- tenant product 可作为租户自定义应用。

### 版本发布需要可控

发布者可能上传 chart 但暂不发布，或撤销某个版本。

需求：

- Product 没有版本时不能发布。
- Product 删除前不能已发布，且不能有已发布版本。
- 版本按 semver 和创建时间排序。
- 上传 chart 后可自动发布对应版本。
- 支持取消发布版本。

## 产品能力需求

### Product 管理

需要支持：

- 创建。
- 更新。
- 删除。
- 发布。
- 取消发布。
- 列表过滤。
- 按 category、domain、published 过滤。

### Chart 管理

需要支持：

- 上传 chart。
- 列出 chart tags。
- 加载 chart。
- 删除 chart tag。
- 标记已发布但 chart 不存在的版本。

### Chart 解析

需要解析：

- metadata。
- values。
- schema。
- README。
- 本地化 README。
- CHANGELOG。
- i18n。

### 产品可见性

需要支持：

- 普通用户只看到 published product。
- 管理员可查看 unpublished product。
- 租户路径隔离 tenant product。
- system product 独立于租户 product。

## 非目标

第一阶段不要求：

- 不在 Product 层安装应用。
- 不在 Product 层管理运行状态。
- 不把 chart values 直接写进 Product。
- 不在 Product 中直接表达租户配额或调度策略。
- 不把 Artifact registry 的所有能力暴露为产品 API。

## 验收标准

- 可以创建 Product。
- 可以上传 chart 并解析 chart version。
- 上传 chart 后 Product 出现对应版本。
- 获取 Product 可以返回 chart schema、values、README 和 i18n。
- 普通用户看不到未发布 Product。
- 无版本 Product 不能发布。
- 有版本或已发布 Product 不能直接删除。
