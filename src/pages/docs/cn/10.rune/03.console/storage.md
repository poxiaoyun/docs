---
title: 文件存储
updated: '2026-09-12'
description: 存储卷的字段、创建、文件管理器、导入任务与扩容规则。
tags:
  - rune
  - console
---

# 文件存储

存储卷（StorageVolume）为推理、微调、开发环境等实例提供持久化存储，底层对应 S3 兼容对象存储，并内置文件管理器与多来源数据导入任务。

列表路径：`/rune/tenants/:tenant/clusters/:cluster/workspaces/:workspace/storagevolumes`

## 存储卷列表

列表列（`src/pages/rune/storagevolumes/list.tsx`）：

| 列 | 字段 | 说明 |
| --- | --- | --- |
| 名称 | `name` | 名称旁带一个卷类型图标（见下），下方展示描述 |
| 状态 | `status.phase` | 未绑定时展示对象状态 |
| 存储集群 | `storageClass` | 列的 i18n key 是 `storage_cluster`，但绑定的字段是 **`storageClass`**（不是 `storageCluster`） |
| 使用量 / 容量 | `size` | 展示用量与扩容入口 |
| 文件数量 | `fileCount` | 存储卷中的文件总数 |
| 读写权限 | `mountMode` | 由只读 Label 决定，展示 `read_write` 或 `read_only` |

> ⚠️ 注意: 旧版本文档把字段写成 `storageCluster`，实际是 `storageClass`（见 `storagevolumes/components/form.tsx`）。

附加能力：

- 顶部统计卡片（总数、用量、文件数）。
- 工具栏「仅显示已挂载」开关（`only_mounted`）。
- 支持按名称搜索、刷新、多选与删除（删除需二次确认）。

> ⚠️ 注意: 列表**没有按卷类型（models / datasets）过滤**的功能，也没有独立的「卷类型」列——卷类型只是名称旁的一个图标。

## 创建存储卷

表单字段（`storagevolumes/components/form.tsx`）：

| 字段 | 类型 | 必填 | 规则 / 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `name` | 文本 | ✅ | 1–63 字符，K8s 命名规范 `^[a-z0-9]([-a-z0-9]*[a-z0-9])?$` | 存储卷名称，编辑态禁用 |
| `storageClass` | 自动补全 | ✅ | 从租户在该集群下的存储类中选择 | 目标存储类，编辑态禁用 |
| `sizeValue` | 数字 | ✅ | ≥ 1 | 容量数值 |
| `sizeUnit` | 选择 | ✅ | `Mi` / `Gi` / `Ti`，默认 `Gi` | 容量单位 |
| `readonly` | 单选 | ✅ | `false`（读写）/ `true`（只读），默认 `false` | 通过 Label 存储 |
| `volumeType` | 单选 | — | 空 / `models` / `datasets` | 卷类型标签 |
| `description` | 文本域 | — | — | 描述 |

提交时写入的 Label：

| Label 键 | 取值 |
| --- | --- |
| `ai.xiaoshiai.cn/storagevolume-readonly` | `false` / `true` |
| `ai.xiaoshiai.cn/volume-type` | `models` / `datasets`（为空时不写入） |

> 💡 提示: 卷类型只是分类标签，不影响存储卷行为。

## 扩容规则

扩容入口在使用量列。容量**只能增大**：提交时会比较新旧容量，若新值小于当前值会报错 `capacity_shrink_not_allowed`，且数值必须 ≥ 1。

## 文件管理器

受管存储卷支持通过 S3 代理进行 Web 文件管理（浏览、上传、下载、删除、预览、搜索、面包屑导航）。详情页还有 S3 账户信息与 README.md 渲染。

> ⚠️ 注意: 旧版本文档中的搜索防抖时长等具体数值未经代码确认，文档暂未确认。

## 存储卷任务

任务用于从外部来源导入数据，位于存储卷详情 → 任务页签。

### 任务类型（kind）

| kind | 说明 | 关键字段与默认值 |
| --- | --- | --- |
| `Git` | 从 Git 仓库克隆 | `url`(必填)、`branch`(默认 `main`)、`username`、`password` |
| `HuggingFace` | 从 HuggingFace 下载 | `type`(`model`/`dataset`，默认 `model`)、`repo`(必填)、`branch`(默认 `main`)、`token` |
| `ModelScope` | 从 ModelScope 下载 | `type`、`repo`、`branch`(默认 **`master`**)、`token` |
| `PythonEnv` | 配置 Python 环境 | `reset`、`requires`、`version`(默认 `3.9`)、`pip`、`condas` |
| `Moha` | 从 Moha 内部仓库导入 | `type`、`visibility`、`repo`、`branch` |

> ⚠️ 注意: ModelScope 的默认分支是 `master`（Git 与 HuggingFace 默认 `main`）；Python 默认版本 `3.9`。

### Moha 可见性

Moha 任务的 `visibility` 有三个取值：

| 值 | 说明 |
| --- | --- |
| `public` | 公开（默认） |
| `internal` | 内部 |
| `private` | 私有 |

> ⚠️ 注意: 旧版本文档只写了 `public` / `private`，实际还包含 `internal`（`storagevolumes/jobs/components/form.tsx`）。

### 任务状态

`StorageJobPhase` 共 6 个取值（`src/types/storage-jobs.ts`）：

| 状态 | 说明 |
| --- | --- |
| `Pending` | 等待中 |
| `Running` | 运行中 |
| `Succeeded` | 成功 |
| `Failed` | 失败 |
| `Deleting` | 正在删除 |
| `Unhealthy` | 不健康 |

## 权限要求

存储卷属于 PAI 工作台分组，导航要求租户角色为 `ADMIN` 或 `DEVELOPER`。
