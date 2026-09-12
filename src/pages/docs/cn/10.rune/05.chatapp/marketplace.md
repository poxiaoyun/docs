---
title: '模型广场'
updated: '2026-09-12'
description: 'ChatApp 模型广场：模型浏览、筛选、渠道与价格、API 文档。'
---

## 功能简介

模型广场（`src/pages/chatapp/marketplace.tsx`）是 ChatApp 内部的**模型浏览入口**，前端路由为 `/chatapp/marketplace`，界面标题为「模型广场」。

> ⚠️ 注意: 这里的「模型广场」是 ChatApp 内的模型浏览入口，**与 Rune 的应用市场（`/rune/console/app-market`，用于部署应用模板）不是同一功能**。

## 页面结构

| 区域 | 说明 |
|------|------|
| 左侧筛选栏（`md` 起显示） | 按类型、类别、提供商、上下文长度、参数量级筛选 |
| 顶部可见性标签页 | 全部 / 公开 / 租户内 / 个人，并显示各自数量 |
| 搜索与排序 | 按名称搜索；排序支持「按名称」「最新」 |
| 模型卡片网格 | 1 / 2 / 4 列自适应；卡片显示模型 ID、提供商、可见性、类型、类别、上下文与参数量级标签 |
| 详情抽屉 | 从右侧滑出，展示模型信息、可用渠道、价格与 API 文档 |

## 筛选维度

筛选条件来自模型元数据（`model-utils.ts` 与 `types/model-metadata`）：

| 筛选组 | 取值 |
|--------|------|
| 类型（`metadata.type` / 推断） | LLM / VLM / Embedding 等 |
| 类别（`metadata.categories`） | 由模型元数据中的类别定义 |
| 提供商（`metadata.vendor` / `provider`） | 由模型元数据定义 |
| 上下文长度 | `<32K`、`32K~128K`、`128K~1M`、`≥1M` |
| 参数量级 | `<10`、`10~30`、`30~100`、`100~300`、`≥300`（单位 B） |

> 💡 提示: 卡片列表与筛选一致地只展示对话类模型（`isChatModel`：`metadata.type` 存在，或 `metadata.task` 为空/为 `generate`）。

## 可见性标签页

| 标签 | `visibility` | 计数口径 |
|------|--------------|----------|
| 全部 | — | 去重后的模型数 |
| 公开 | `public` | 按模型 ID 去重的数量 |
| 租户内 | `tenant` | 同上 |
| 个人 | `private` | 同上 |

## 模型卡片

卡片展示（`marketplace.tsx:198-357`）：

- 模型图标与 **模型 ID**
- 提供商名称
- 右上角：**New** 标签（元数据标记为近期创建时）与可见性标签
- 描述（最多两行）
- 底部标签：类型、最多 2 个类别、上下文长度、参数量级、最多 2 个自定义标签

## 详情抽屉

点击卡片后从右侧打开抽屉（宽度 `50vw`，小屏全宽）：

| 区块 | 内容 |
|------|------|
| 头部 | 模型 ID、可见性、提供商、描述、全部标签；两个操作按钮 |
| **去模型体验** | 跳转到模型体验页并自动选中该模型（携带 `model` / `channel_id` 参数） |
| **API 文档** | 在抽屉内展示该模型的调用示例 |
| 可用渠道 | 该模型 ID 下的所有渠道及其**渠道优先级**、归属租户 |
| 价格 | 输入价、输出价、缓存读取价、缓存写入价（缺省显示 `-`） |

> 💡 提示: 同一模型 ID 可能对应多个渠道（即同一模型的不同接入），详情页会按渠道优先级排序展示，并默认选中优先级最高的渠道进入体验。

## API 文档内容

「API 文档」区块给出的调用示例使用 ChatApp 数据面地址（`model-docs-content.tsx:39-40`）：

```text
{origin}/airouter-data/v1/chat/completions
```

| 示例 | 语言 |
|------|------|
| cURL | `curl --request POST ... --header 'Authorization: Bearer YOUR_TOKEN'` |
| Python | `requests.post` |
| Go | `net/http` |

> ⚠️ 注意: 示例中的 `YOUR_TOKEN` 需要替换为在 [Token 管理](./token.md) 中创建的 ChatApp Token；`YOUR_MODEL` 替换为卡片上的模型 ID。
