---
title: '内容审查'
updated: '2026-09-12'
description: '内容安全治理——敏感词库维护、审查策略配置与命中记录查询。'
tags:
  - boss
  - gateway
---

## 功能简介

内容审查对经网关的请求与响应做敏感内容检测，由两套机制协同工作：

- **敏感词管理**：维护词条（`term`）及其风险评分（`score`），作为匹配的基础数据
- **策略管理**：定义「评分满足什么条件时执行什么动作」
- **命中记录**：查询触发过敏感检测的调用记录

内容审查由 [网关配置](/boss/gateway/config) 的 `moderationEnabled` 全局开关控制，关闭后所有策略暂停执行，但配置不丢失。

## 进入路径

BOSS 控制台 → 大模型网关 → 安全服务

| 页面 | 菜单文案 | 前端路由 |
|------|---------|---------|
| 敏感词管理 | `navbar.moderation_lexicon` = 敏感词管理 | `/gateway/moderation/lexicon` |
| 策略管理 | `navbar.moderation_policies` = 策略管理 | `/gateway/moderation/policies` |
| 命中记录 | `navbar.sensitive_hits` = 命中记录 | `/gateway/moderation/sensitive-hits` |

创建/编辑子路由分别为 `/gateway/moderation/lexicon/new`（编辑为 `/gateway/moderation/lexicon/:term/edit`）与 `/gateway/moderation/policies/new`（编辑为 `/gateway/moderation/policies/:id/edit`）。

## 策略管理

### 策略列表

| 列 | 字段 | 说明 |
|----|------|------|
| 名称 | `name` | 策略名称 |
| 触发条件 | `operator` + `threshold` | 如「大于等于 (≥) 50」 |
| 动作类型 | `action` | 见下表 |
| 优先级 | `priority` | 数值 `1`–`10` |
| 是否启用 | `enabled` | 启用状态 |
| 更新时间 | `updatedAt` | 日期时间 |

支持按名称/描述搜索，筛选器提供「是否启用」（全部 / 启用 / 未启用）。

### 创建 / 编辑策略

表单字段：

| 字段 | 标识 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|------|--------|------|
| 名称 | `name` | 文本 | ✅ | 空 | 策略名称 |
| 描述 | `description` | 多行文本 | — | 空 | 策略说明 |
| 运算符 | `operator` | 选择 | ✅ | `ge` | 见下表 |
| 阈值 | `threshold` | 数字 | ✅ | `50` | 取值 `0`–`100` |
| 动作类型 | `action` | 选择 | ✅ | `block` | 见下表 |
| 优先级 | `priority` | 选择 | — | `1` | 取值 `1`–`10` |
| 启用 | `enabled` | 开关 | — | 开启 | 是否立即生效 |

> ⚠️ 注意: 阈值的取值范围是 **`0`–`100`，默认 `50`**（不是 0–1 / 0.8）。旧文档中的 `0.8`、`0-1` 等写法与代码不符。

**运算符枚举**（`CompareOperator`，只有 4 个，**没有 `=`**）：

| 标识 | 界面文案 | 含义 |
|------|---------|------|
| `ge` | 大于等于 (≥) | `score >= threshold` |
| `gt` | 大于 (>) | `score > threshold` |
| `le` | 小于等于 (≤) | `score <= threshold` |
| `lt` | 小于 (<) | `score < threshold` |

**动作枚举**（`PolicyAction`）：

| 标识 | 界面文案 | 说明 |
|------|---------|------|
| `log` | 记录日志 | 仅记录，不改动内容 |
| `replace` | 替换敏感词 | 按替换配置遮蔽敏感内容 |
| `webhook` | 委托外部服务 | 调用外部服务判定 |
| `block` | 拦截请求 | 直接拦截 |

### 动作相关配置

提交时会按所选动作写入 `config`（JSON 字符串）：

**`replace`**：

| 字段 | 默认值 | 说明 |
|------|--------|------|
| `maskChar` | `*` | 掩码字符 |
| `maskMode` | `char_repeat` | 掩码模式：`char_repeat`（逐字替换）/ `fixed_length`（固定长度）/ `single_char`（整词替换为单个字符） |

**`webhook`**：

| 字段 | 默认值 | 说明 |
|------|--------|------|
| `webhookUrl` | 空 | 外部服务地址（必填） |
| `webhookMethod` | `POST` | HTTP 方法 |
| `webhookTimeout` | `5` | 超时时间（秒） |
| `webhookHeaders` | 空 | 自定义请求头（键值对，可增删） |
| `decisionPath` | 空 | 从响应 JSON 中提取判定字段的路径 |
| `passValues` | 空 | 视为放行的值列表（可选值含 `pass` / `allow` / `true` / `1` / `ok`） |
| `blockValues` | 空 | 视为拦截的值列表（可选值含 `block` / `deny` / `reject` / `false` / `0`） |
| `defaultAction` | `block` | 无法判定时的默认动作（`block` / `pass`） |
| `messagePath` | 空 | 提取拦截提示消息的路径 |

> ⚠️ 注意: 表单的校验 schema 与默认值中还定义了 `notification`、`notifyEmails`（默认 `false` / 空数组），但**界面上没有渲染对应控件，提交时也不会写入 `config`**。因此文档中不再描述邮件通知能力。

### 策略操作

每行提供（收在折叠菜单中）：启用/禁用、编辑、删除。

> ⚠️ 注意: 删除需要在确认弹窗中**手动输入策略名称**（`secondaryConfirmText`）才能执行。

## 敏感词管理

### 统计与列表

页面顶部展示 4 个统计卡：词条总数、已启用数（含启用占比）、本月新增、本周命中。

| 列 | 字段 | 说明 |
|----|------|------|
| 词条 | `term` | 敏感词文本 |
| 启用状态 | `enabled` | 启用/停用 |
| 风险评分 | `score` | 取值 `1`–`10` |
| 分类 | `category` / `categories` | 单个或多个分类 |
| 标签 | `tags` | 多个标签 |
| 命中次数 | `hitCount` | 累计命中 |
| 更新时间 | `updatedAt` | 日期时间 |
| 操作 | — | 启用/停用、编辑、删除 |

筛选条件：关键词搜索、分类范围、风险等级、标签、更新时间（全部 / 今日 / 近 7 天 / 近 30 天）。

支持多选后的 **批量启用 / 批量停用 / 批量删除**。

### 创建 / 编辑词条

| 字段 | 标识 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|------|--------|------|
| 词条 | `term` | 文本 | ✅ | 空 | 敏感词文本 |
| 风险评分 | `score` | 数字 | ✅ | `5` | 取值 `1`–`10` |
| 分类 | `categories` | 多值输入 | — | 空 | 可从预置分类选择或自定义 |
| 词性 | `partOfSpeech` | 文本 | — | 空 | 词性标注 |
| 标签 | `tags` | 多值输入 | — | 空 | 可从预置标签选择或自定义 |

> ⚠️ 注意: 风险评分范围是 **`1`–`10`，默认 `5`**（不是 0–1 的小数）。

**预置分类**（`PRESET_LEXICON_CATEGORIES`，可在 `lexicon/constants.ts` 查看）：政治、暴恐、民生、涉枪涉爆、色情、非法网站、广告、GFW、反动。

**预置标签**（`PRESET_LEXICON_TAGS`）：中文、英文、拼音、政治敏感、选举相关、人名、个人信息、网址、营销、高风险。

> 💡 提示: 提交时会同时写入 `category`（取 `categories[0]`）与 `categories` 数组。

### 导入与导出

- **导入**：通过导入对话框从文件批量导入词条
- **导出**：将词库导出为文件，用于备份或迁移

## 命中记录

命中记录页固定按 `sensitiveDetected: true` 查询，只展示触发过敏感检测的调用，为只读查询页面。

详见 [敏感命中](/boss/gateway/sensitive-hits)。

## 权限要求

需要 **系统管理员** 角色。策略与词库的管理涉及平台内容安全基线，仅系统管理员可操作。
