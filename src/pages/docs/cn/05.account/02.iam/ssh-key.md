---
title: 'SSH Key 管理'
updated: '2026-09-12'
description: SSH 公钥的添加与删除（页内常驻表单）。
---

## 功能简介

SSH Key 页面用于添加和管理账号的 SSH 公钥，用于 Git-over-SSH 等免密认证场景。

- 路由：`/iam/account/ssh-key`
- 视图：`src/pages/iam/account/ssh-key.tsx`

## 进入路径

右上角头像 → 个人设置 → 顶部 Tab「SSH 密钥」

## 接口

| 操作 | 接口 |
|------|------|
| 列表 | `GET /api/iam/current/sshkeys` |
| 添加 | `POST /api/iam/current/sshkeys` |
| 删除 | `DELETE /api/iam/current/sshkeys/{fingerprint}` |

## 添加 SSH Key

> ⚠️ 注意: 页面顶部是一个**常驻表单**（不是「右上角按钮 + 弹窗确认」）。表单标题与列表同页，填写后直接点「保存」。

表单字段：

| 字段 | 标识 | 类型 | 前端校验 |
|------|------|------|----------|
| 名称 | `name` | 文本输入 | 非空 |
| 公钥 | `publicKey` | 多行文本域（4 行） | 非空 |

自动填充规则：当 `name` 为空时，前端会从公钥内容中提取注释部分（按空白切分后取第 3 段及之后）作为名称（`ssh-key.tsx:237-248`）。例如公钥以 `... your-email@example.com` 结尾时，名称会自动填为 `your-email@example.com`。

提交请求体：

```json
{ "name": "MacBook Pro", "publicKey": "ssh-ed25519 AAAA... your-email@example.com" }
```

> ⚠️ 注意: 前端只校验公钥非空，**不校验**密钥类型或格式，是否重复也由后端判定。

## 生成 SSH 密钥对

若本地还没有密钥，可用 `ssh-keygen` 生成：

```bash
# 推荐 Ed25519
ssh-keygen -t ed25519 -C "your-email@example.com"

# 或 RSA
ssh-keygen -t rsa -b 4096 -C "your-email@example.com"

# 查看公钥内容
cat ~/.ssh/id_ed25519.pub
```

公钥文件以 `.pub` 结尾，请上传**公钥**，不要上传私钥。

## 密钥列表

每条密钥以卡片展示：

| 字段 | 说明 |
|------|------|
| `name` | 自定义名称 |
| `creationTimestamp` | 创建时间 |
| `fingerprint` | 公钥指纹 |
| `comment` | 公钥注释（有则展示） |

> ⚠️ 注意: 列表**没有**「最近使用」「密钥类型」等字段。

## 删除 SSH Key

点击密钥卡片右侧的「删除」按钮，弹出确认对话框，确认后调用删除接口。删除后该公钥从平台移除，使用对应私钥的连接将无法通过认证。

## 注意事项

- 添加表单位于页面内，随页面常驻
- 名称可由公钥注释自动填充，也可手动修改
- 删除操作不可撤销
