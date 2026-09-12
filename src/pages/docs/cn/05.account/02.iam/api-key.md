---
title: 'IAM API Key（AK/SK）'
updated: '2026-09-12'
description: 生成 / 重新生成 AccessKey 与 SecretKey，仅展示，不支持删除。
---

## 功能简介

IAM API Key 是账号级的 API 访问凭证，由 **AccessKey（AK）** 与 **SecretKey（SK）** 组成。用户中心提供生成与重新生成能力。

- 路由：`/iam/account/api-key`
- 视图：`src/pages/iam/account/api-key.tsx`

## 进入路径

右上角头像 → 个人设置 → 顶部 Tab「API Key」

## 接口

| 操作 | 接口 |
|------|------|
| 读取密钥列表 | `GET /api/iam/current/apikeys` |
| 生成密钥 | `POST /api/iam/current/apikeys`（请求体 `{}`） |

## 页面说明

页面是一个**单密钥视图**：

| 区域 | 说明 |
|------|------|
| 空状态 | 尚无密钥时展示空内容 |
| 密钥区 | 展示密钥的 `name`，以及 `accessKey` 全文与复制按钮 |
| 底部按钮 | 无密钥时为「生成」，已有密钥时为「重新生成」 |

> ⚠️ 注意: 列表只展示 `name` 与 `accessKey`，**没有**创建时间列，**没有**删除按钮，也**没有**有效期/最近使用等字段。若已有密钥，按钮文案变为「重新生成」（`api-key.tsx:169`）。

## 生成密钥

1. 点击页面底部的「生成」/「重新生成」按钮
2. 前端调用 `POST /api/iam/current/apikeys`
3. 成功后页面顶部弹出成功提示，其中包含：
   - `accessKey` + 复制按钮
   - `secretKey` + 复制按钮

> ⚠️ 注意: SecretKey 只在生成成功的提示中出现（文案提示「仅在此出现一次」），列表中无法再次查看。

## 使用场景

生成的 AK/SK 用于 API 认证。以下 header 名仅为示例，实际字段名以后端契约为准：

```bash
curl -X GET https://your-domain/api/resource \
  -H "X-Access-Key: YOUR_ACCESS_KEY" \
  -H "X-Secret-Key: YOUR_SECRET_KEY"
```

> ⚠️ 注意: 上述 header 名称、签发/校验方式未在本文档对应的前端代码中体现，属后端契约，暂未确认。

## 注意事项

- 生成操作会立即刷新列表并显示新的 AK/SK
- 页面不提供删除密钥的入口
- SecretKey 仅生成时显示一次，请及时保存
