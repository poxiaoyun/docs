# 产品设计

本文描述 `rune` 的产品设计。产品能力由 `Product`、`ProductVersion`、`ProductChart`、`ProductService` 和 `ArtifactService` 组成。

## 核心模型

### Product

```yaml
id: vllm
name: vLLM
icon: ""
tenant: system
category: inference
domain: user
published: true
versions:
- version: 1.0.0
  appVersion: 0.8.0
  url: registry.example.com/system/vllm
i18n: {}
status: {}
```

职责：

- 保存应用模板元数据。
- 控制可见性。
- 保存已发布版本列表。
- 作为 Instance 创建时的产品引用来源。

### ProductVersion

```yaml
version: 1.0.0
appVersion: 0.8.0
url: registry.example.com/system/vllm
releaseNote: ""
creationTimestamp: ""
```

版本排序规则：

- 优先 semver 降序。
- 无法比较时使用创建时间。

### ProductChart

```yaml
metadata: {}
values: {}
schema: {}
i18n: {}
readme: ""
readmes: {}
changelog: ""
raw: []
```

来源：

- Helm chart metadata。
- `values.yaml`。
- `values.schema.json`。
- `README.md`。
- `README.{locale}.md`。
- `CHANGELOG.md`。
- `i18n/{locale}.yaml`。

## 仓库命名

租户 chart repository：

```text
{tenant}/{product}
```

完整 OCI 地址由 ArtifactService 拼接：

```text
{registryHost}/{tenant}/{product}
```

system product 使用 system repository。

## 上传链路

```text
upload chart archive
  -> loader.LoadArchive
  -> ProductChartFromChart
  -> UploadHelmChart
  -> syncChartMetadataToProduct
  -> PublishProductVersion
```

行为：

- 从 Chart.yaml 读取 version 和 appVersion。
- 上传到 OCI chart repository。
- 尝试把 chart metadata 同步到 Product。
- 自动发布上传的 chart 版本。
- 如果版本已经存在，忽略 already exists 错误。

## 获取链路

获取产品附带 chart：

```text
GetProductWithVersion
  -> GetProduct
  -> choose requested version or latest
  -> LoadChart
  -> ProductChartFromChart
```

如果 chart 下载失败：

- 记录日志。
- Product 仍可返回。
- chart 字段为空。

## 发布和删除约束

发布 Product：

- 必须至少存在一个版本。
- patch `published=true`。

取消发布 Product：

- patch `published=false`。

删除 Product：

- 不能有 versions。
- 不能处于 published。

发布版本：

- version 和 product name 必填。
- version 不能重复。
- 写入 creationTimestamp。

取消发布版本：

- 从 versions 列表删除对应 version。

## Chart 列表

Chart 列表来自 OCI tags，并与 Product 已发布版本合并：

```text
OCI tags
  + Product.versions
  -> ApplicationChartMetadata
```

如果 Product 中有版本但 OCI tag 已不存在：

```yaml
chartNotExisted: true
published: true
```

这能暴露“版本记录和制品仓库不一致”的问题。

## API 摘要

产品：

```text
GET    /products
POST   /products
GET    /products/{product}
PUT    /products/{product}
DELETE /products/{product}
POST   /products/{product}:publish
POST   /products/{product}:unpublish
```

版本：

```text
GET    /products/{product}/versions/{version}
POST   /products/{product}/versions
DELETE /products/{product}/versions/{version}
```

Chart：

```text
GET    /products/{product}/charts
POST   /products/{product}/charts
GET    /products/{product}/charts/{version}
DELETE /products/{product}/charts/{version}
```

具体路由会根据 system 或 tenant scope 包裹。

## 与其他模块的关系

### 应用

Instance 引用 ProductReference，并通过 Product URL 和 version 下载 chart。

### 资源规格

Product 的 chart schema 可以声明 `x-resource-enum: flavors`，Instance 创建时触发 Flavor 回填。

### 制品仓库

ProductService 依赖 ChartsProvider，默认实现是 OCI ArtifactService。

### 控制台

控制台依赖 ProductChart 的 schema、values、README、i18n 和 changelog 构建安装页面。

## 风险和约束

| 风险 | 说明 | 处理 |
| --- | --- | --- |
| Product 与 OCI 不一致 | 版本记录存在但 tag 不存在 | chart list 标记 `chartNotExisted` |
| 未发布内容泄露 | 普通用户看到草稿产品 | 用户侧 GetProduct 默认过滤 unpublished |
| 删除破坏历史 | 删除已有版本或已发布产品 | 删除前检查 versions 和 published |
| chart 元数据同步失败 | 上传成功但 Product 元数据未更新 | 记录日志，不阻塞上传 |
| schema 质量不稳定 | chart 表单不可用 | Instance 创建更新时再次校验 values |

## 演进方向

### 产品治理

- 增加版本审批流。
- 增加产品依赖和兼容性声明。
- 增加安装前检查。

### 制品一致性

- 增加 Product versions 与 OCI tags 的定期校验。
- 增加 chart 签名和摘要校验。
- 增加版本回滚策略。

### 用户体验

- 增加产品推荐和分类筛选。
- 增加 schema lint 和 README 质量检查。
- 增加 chart 示例 values。
