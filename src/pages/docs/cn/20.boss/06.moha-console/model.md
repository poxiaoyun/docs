---
title: '模型管理'
updated: '2026-03-23'
---

## 功能简介

模型管理是 Moha 的核心功能模块，提供完整的 Git 式模型仓库管理能力。您可以在此创建模型仓库、上传模型文件（包含 LFS 大文件支持）、管理版本（Commit / 分支 / 标签）、通过 Pull Request 协作开发、参与社区讨论，并追溯模型血缘关系。

### 核心能力一览

```mermaid
graph TB
    Model["📦 模型仓库"]

    Model --> Files["文件管理<br/>上传/浏览/下载"]
    Model --> Version["版本控制<br/>Commit / Branch / Tag"]
    Model --> Collab["协作<br/>PR / 讨论 / 评论"]
    Model --> Meta["元数据<br/>许可证/任务/框架/标签"]
    Model --> Genealogy["血缘追溯<br/>父模型 / 子模型"]
    Model --> Community["社区<br/>收藏/评分/下载统计"]

    Files --> LFS["Git LFS<br/>大文件存储"]
    Files --> Encrypt["加密文件支持"]
    Version --> Reset["Reset / Revert"]
    Collab --> Diff["差异对比 Diff"]
    Collab --> Merge["PR 合并"]
```

## 进入路径

Moha → **模型**

## 模型列表

![模型列表页面](/assets/screenshots/console/moha-models.png)

模型列表页展示当前用户有权限查看的所有模型仓库：

| 列 | 说明 |
|----|------|
| 名称 | 模型仓库名称，格式为 `组织名/模型名` |
| 可见性 | 🔓 公开（Public）/ 🔒 私有（Private）/ 🏢 内部（Internal） |
| 标签 | 任务类型、框架、语言等元数据标签 |
| 更新时间 | 仓库最后一次 Commit 的时间 |
| 下载量 | 模型文件被下载的总次数 |
| 收藏量 | 用户收藏（Star）的总数 |

### 列表操作

- **搜索**：按模型名称进行关键词搜索
- **标签过滤**：按任务类型（如 text-generation、image-classification）、框架（如 PyTorch、TensorFlow）、语言等标签组合过滤
- **排序**：支持按更新时间、下载量、收藏量排序
- **视图**：列表视图 / 卡片视图切换

:::tip
标签过滤支持多选组合，例如同时筛选 "text-generation" + "PyTorch" + "中文"。
:::

## 创建模型仓库

![创建模型表单](/assets/screenshots/console/moha-model-create.png)

点击列表页右上角的 **新建模型** 按钮，打开创建表单。

### 表单字段详解

| 字段 | 类型 | 必填 | 验证规则 | 说明 |
|------|------|------|----------|------|
| 所属组织 | 下拉选择 | ✅ | — | 选择模型所属的个人空间或组织 |
| 名称 | 文本输入 | ✅ | 正则 `^[a-zA-Z0-9][a-zA-Z0-9._-]*$` | 以字母或数字开头，可包含字母、数字、`.`、`_`、`-` |
| 可见性 | 单选按钮组 | ✅ | — | `Private`（私有）/ `Internal`（内部）/ `Public`（公开） |
| 描述 | 多行文本域（4行） | — | — | 模型的简要描述 |
| 许可证 | 自动补全 | — | 从 `LICENSE_OPTIONS` 列表选择 | 如 Apache-2.0、MIT、CC-BY-4.0 等 |
| 任务类型 | 任务选择器 多选 | — | 从预定义任务列表选择 | 如 text-generation、image-classification 等 |
| 语言 | 自动补全多选 | — | 从 `LANGUAGE_OPTIONS` 选择，最多显示 3 个标签 | 如 Chinese、English、Japanese |
| 标签 | freeSolo 自动补全多选 | — | 从 `TAG_OPTIONS` 选择或自定义 | 自由输入或从预设列表选择 |
| 框架 | freeSolo 自动补全多选 | — | 从 `LIBRARY_OPTIONS` 选择或自定义，最多显示 5 个标签 | 如 PyTorch、TensorFlow、JAX |
| 基础模型 | 关联关系 数组 | — | — | 指定父模型及关系类型（仅模型） |
| 成员 | 成员管理 | — | 角色：`admin` / `member` | 添加仓库级别的成员 |

:::warning
当所属组织类型为 `internal` 时，可见性默认值为 `Internal`。名称一旦创建后不可修改。
:::

:::tip
名称命名建议使用有意义的名称，如 `llama-7b-chat-finetuned`，便于搜索和识别。
:::

### 基础模型（血缘关系）

通过 关联关系 组件，您可以声明当前模型的 **父模型关系**，支持以下关系类型：

| 关系类型 | 说明 | 典型场景 |
|----------|------|----------|
| `adapter` | 适配器 | LoRA、QLoRA 适配层 |
| `finetune` | 微调 | 全量微调或指令微调 |
| `quantized` | 量化 | GPTQ、AWQ、GGUF 量化版 |
| `merge` | 合并 | 多模型权重合并 |
| `repackage` | 重新打包 | 格式转换或重新组织 |

```mermaid
graph TB
    Base["基础模型<br/>llama-2-7b"] --> FT["微调模型<br/>llama-2-7b-chat<br/>关系: finetune"]
    Base --> QT["量化模型<br/>llama-2-7b-gptq<br/>关系: quantized"]
    FT --> Adapter["适配器<br/>llama-2-7b-chat-lora<br/>关系: adapter"]
    FT --> Merge["合并模型<br/>llama-2-7b-merged<br/>关系: merge"]
```

:::tip
声明血缘关系后，基础模型页面也会自动展示所有衍生的子模型，形成完整的模型族谱。
:::

### 创建流程

```mermaid
flowchart TD
    A["点击新建模型"] --> B["选择所属组织"]
    B --> C["填写名称与描述"]
    C --> D["设置可见性"]
    D --> E["配置元数据标签<br/>许可证/任务/语言/框架"]
    E --> F{"是否基于已有模型?"}
    F -->|是| G["添加基础模型关系"]
    F -->|否| H["添加成员（可选）"]
    G --> H
    H --> I["点击创建"]
    I --> J["进入模型详情页<br/>上传文件或 Git 推送"]
```

## 模型详情

创建或进入模型后，将展示模型的详情页面：

![模型详情页](/assets/screenshots/console/moha-model-detail.png)

### 模型卡片（README）

模型详情页默认展示仓库根目录下的 `README.md` 文件内容，渲染为模型卡片。模型卡片通常包含：

- 模型介绍与用途
- 训练数据和方法
- 使用示例代码
- 评估结果和基准测试
- 限制和偏差说明

通过 API 相关接口 获取渲染后的 README 内容。

:::tip
一个好的 README 可以显著提高模型的可发现性和可用性。建议参考社区最佳实践编写。
:::

### 文件浏览器

![文件浏览器](/assets/screenshots/console/moha-model-files.png)

以树形目录展示模型仓库中的所有文件和目录：

| 功能 | 说明 |
|------|------|
| 目录导航 | 点击目录展开子文件，面包屑导航回溯 |
| 文件预览 | 在线预览文本文件、Markdown、JSON、YAML 等格式 |
| 文件信息 | 显示文件大小、最后修改时间和对应的 Commit 消息 |
| 下载文件 | 单文件下载，支持通过 `raw` 接口获取原始内容 |
| LFS 文件 | 大文件以 LFS 指针存储，显示 `oid`（对象 ID）和 `size`（实际大小） |
| 加密文件 | 支持加密文件的标记和管理 |
| 分支/标签切换 | 顶部下拉框切换查看不同分支或标签下的文件 |

:::warning
Git LFS 文件不会直接存储在 Git 仓库中，而是通过 LFS 指针引用。下载 LFS 文件时，系统会自动解析指针并返回实际文件内容。
:::

### Commit 历史

![Commit 历史](/assets/screenshots/console/moha-model-commits.png)

查看模型仓库的完整提交历史：

- **提交列表**：按时间倒序展示所有 Commit，包含作者、时间、提交消息
- **按文件过滤**：查看特定文件的提交记录
- **提交详情**：点击进入 Commit 详情，查看完整的差异对比（diff）
- **Reset 操作**：回退到指定的提交版本
- **Revert 操作**：创建一个新的提交来撤销指定提交的更改

### Pull Request

![Pull Request 列表](/assets/screenshots/console/moha-model-pr.png)

Pull Request（PR）系统支持基于分支的协作开发：

| 功能 | 说明 |
|------|------|
| 创建 PR | 指定源分支（`from`）和目标分支（`base`），填写标题和描述 |
| PR 状态 | 开放（Open）/ 已关闭（Closed）/ 已合并（Merged） |
| 差异对比 | 查看 PR 中所有变更文件的详细 diff |
| PR 提交 | 查看 PR 包含的所有 Commit |
| 评论系统 | 在 PR 中发表评论，进行代码审查讨论 |
| 合并 PR | 审查通过后，将源分支合并到目标分支 |
| 关闭/重开 | 关闭或重新打开 PR |

### 讨论（Discussion）

讨论系统为社区交流提供便捷入口：

| 功能 | 说明 |
|------|------|
| 创建讨论 | 填写标题和内容，发起新的讨论话题 |
| 回复 | 对讨论进行回复，支持多层嵌套 |
| 状态管理 | 标记讨论为已解决（关闭）或重新打开 |
| 评论 CRUD | 创建、查看、更新和删除评论 |

讨论与 PR 功能类似，通过内容类型区分。

### 收藏、评分与下载

![收藏与评分](/assets/screenshots/console/moha-model-star.png)

| 功能 | 说明 |
|------|------|-----|
| 收藏（Star） | 一键收藏模型，收藏数量公开展示 |
| 评分（Rating） | 对模型进行打分，计算平均评分 |
| 下载统计 | 自动统计模型文件的下载次数 |

:::tip
收藏的模型可在 Moha 首页的"我的收藏"中快速找到。
:::

## Git 操作指南

### 克隆模型仓库

```bash
# HTTPS 克隆（使用个人访问令牌）
git clone https://username:TOKEN@moha.your-domain/org-name/model-name.git

# 克隆完成后进入目录
cd model-name
```

### 推送模型文件

```bash
# 添加模型文件
cp /path/to/model-weights.bin ./

# 对于大文件，先启用 Git LFS
git lfs install
git lfs track "*.bin" "*.safetensors" "*.gguf" "*.pt"

# 提交并推送
git add .
git commit -m "Add model weights"
git push origin main
```

### 分支管理

```bash
# 创建新分支
git checkout -b feature/add-quantized-version

# 推送新分支
git push origin feature/add-quantized-version
```

:::warning
模型权重文件通常很大（数 GB），务必使用 Git LFS 追踪这些文件。直接将大文件提交到 Git 仓库会导致仓库膨胀和性能问题。
:::

## 模型设置

![模型设置页](/assets/screenshots/console/moha-model-settings.png)

在模型详情页的 **设置** 标签中，管理员可以进行以下操作：

| 设置项 | 说明 |
|--------|------|
| 可见性变更 | 切换模型的可见性（Public / Internal / Private） |
| 元数据更新 | 修改许可证、任务类型、标签、语言、框架等元数据 |
| 封面图片 | 上传或修改模型的封面展示图片 |
| README 编辑 | 在线编辑模型卡片（README.md）内容 |
| 成员管理 | 添加或移除仓库级别的成员，设置 `admin` 或 `member` 角色 |
| 部署配置 | 配置模型的部署相关选项 |
| 删除模型 | 永久删除模型仓库（不可恢复） |

:::warning
删除模型仓库是不可逆操作，将永久删除所有文件、Commit 历史、PR 和讨论。请谨慎操作。
:::

## 权限要求

| 操作 | 要求 |
|------|------|
| 浏览公开模型 | 所有用户（含未登录） |
| 浏览内部模型 | 同组织成员 |
| 浏览私有模型 | 仓库成员 |
| 创建模型 | 登录用户，拥有组织成员以上权限 |
| 修改模型设置 | 仓库管理员或组织管理员 |
| 删除模型 | 仓库管理员或组织管理员 |
| 发起 PR / 讨论 | 登录用户 |
| 合并 PR | 仓库管理员 |
