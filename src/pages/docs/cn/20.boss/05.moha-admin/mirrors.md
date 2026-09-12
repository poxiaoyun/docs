---
title: 镜像站
updated: '2026-09-12'
description: '从 HuggingFace / ModelScope 同步模型与数据集的镜像任务管理。'
---

## 功能简介

镜像源配置用于把外部平台（HuggingFace、ModelScope）的模型与数据集同步到本平台。管理员可创建镜像任务、触发 / 停止同步并查看同步状态。

## 进入路径

BOSS 控制台 → 数据同步 → **镜像站**

前端路由：`/moha/mirrors/models`（数据集为 `/moha/mirrors/datasets`）

---

## 列表

页面顶部通过标签页在**模型**与**数据集**之间切换。

### 列字段

| 列 | 字段路径 | 说明 |
| --- | --- | --- |
| 名称 | `name` | 镜像任务名称（同步后在本平台的名称） |
| 来源 | `source.url` | 由 URL 的 origin 识别：`www.modelscope.cn` → ModelScope，`huggingface.co` → HuggingFace，其他为 `-` |
| 组织 | `organization` | 组织头像 + 名称 |
| 状态 | `status` | 通过 `ObjectStatus` 渲染（命名空间 `data`） |
| 最后同步时间 | `status.lastSyncTime` | 上次同步时间 |

### 操作

| 操作 | 说明 |
| --- | --- |
| 同步 / 停止 | 动态切换：仅当 `status.phase === 'syncing'` 时显示**停止**，其余状态显示**同步**；均带确认弹窗 |
| 编辑 | 进入编辑页 |
| 删除 | 带确认弹窗，支持批量 |

> ⚠️ 注意: 状态以 `ObjectStatus`（后端返回的 `status`）为准，前端**没有** `paused` 字段，也没有「暂停 / 恢复自动同步」的开关。

---

## 创建镜像任务

前端路由：`/moha/mirrors/:type?action=create`

### 表单字段

| 字段 | 字段名 | 必填 | 说明 |
| --- | --- | --- | --- |
| 组织 | `organization` | — | 同步到哪个组织下；编辑时禁用 |
| 来源 | `source` | ✅ | 下拉选择：ModelScope（`https://www.modelscope.cn`）/ HuggingFace（`https://huggingface.co`）；编辑时禁用 |
| 仓库名 | `fullName` | ✅ | 源仓库路径（如 `org/repo`）；编辑时禁用 |
| 口令 | `password` | 条件必填 | HuggingFace 来源使用，提交时以密码字段传输 |
| 令牌 | `token` | 条件必填 | ModelScope 来源使用 |
| 同步所有引用 | `allRefs` | — | 开关，默认 `false`（仅主分支） |

> ⚠️ 注意: 表单**没有用户名输入框**。请求中的用户名字段由前端固定：HuggingFace 来源固定为 `oauth2`，其他来源为空字符串。

### 仓库探测

- 填写来源与仓库名后（防抖），系统会自动探测该仓库是否存在、是否可访问。
- 当仓库**存在但不可访问**时，才显示口令 / 令牌输入框，并将其置为必填。
- 仓库不存在时，提交按钮被禁用。

> 💡 提示: 公开仓库无需填写认证信息；受限仓库（如 Gated Models）需要提供令牌。

---

## 权限要求

需要 **系统管理员** 角色。

相关页面：[模型库管理](./models)、[数据集管理](./datasets)、[镜像仓库管理](./images)。
