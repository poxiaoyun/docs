# 产品

本目录描述 `rune` 的产品和应用市场能力。产品是可安装应用模板，Helm chart 是产品版本的交付包，Instance 是产品安装后的运行实例。

> 本目录记录 Rune 基线中的迁移期旧路径。新产品目录和版本能力位于 [Apps](../../apps/README.md)，新安装由 Installer 执行；同一实例不能由两条路径同时管理。

## 文档列表

- [需求](requirements.md)
- [设计](design.md)

## 关注点

- Product 如何描述应用模板。
- Chart 如何上传、解析和发布为版本。
- README、CHANGELOG、values schema 和 i18n 如何进入控制台。
- system product 和 tenant product 如何区分。
- Product、Artifact、Instance 的职责边界。
