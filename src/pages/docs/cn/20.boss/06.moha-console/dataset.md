---
title: '数据集管理'
updated: '2026-03-23'
---

## 功能简介

数据集管理提供完整的 Git 式数据集仓库管理能力，用于存储、版本控制和协作管理 AI 训练数据、评测数据和标注数据。数据集仓库与模型仓库共享统一的 数据管理器 接口，采用相同的 Git 版本管理、Pull Request 协作和讨论系统，为数据驱动的 AI 开发提供坚实基础。

### 数据集管理能力总览

```mermaid
graph TB
    Dataset["📊 数据集仓库"]

    Dataset --> Files["文件管理<br/>上传/浏览/下载"]
    Dataset --> Version["版本控制<br/>Commit / Branch / Tag"]
    Dataset --> Collab["协作<br/>PR / 讨论 / 评论"]
    Dataset --> Meta["元数据<br/>许可证/任务/标签/语言"]
    Dataset --> Community["社区<br/>收藏/评分/下载统计"]

    Files --> LFS["Git LFS<br/>大文件存储"]
    Files --> Encrypt["加密文件支持"]
    Files --> Format["多种数据格式<br/>CSV/JSON/Parquet/Arrow"]
    Version --> Branch["分支管理"]
    Version --> Tag["标签管理"]
```

## 进入路径

Moha → **数据集**

## 数据集列表

![数据集列表页面](/assets/screenshots/console/moha-datasets.png)

数据集列表页展示当前用户有权限查看的所有数据集仓库：

| 列 | 说明 |
|----|------|
| 名称 | 数据集仓库名称，格式为 `组织名/数据集名` |
| 可见性 | 🔓 公开（Public）/ 🔒 私有（Private）/ 🏢 内部（Internal） |
| 标签 | 任务类型、语言、数据规模等元数据标签 |
| 更新时间 | 仓库最后一次 Commit 的时间 |
| 下载量 | 数据集被下载的总次数 |
| 收藏量 | 用户收藏（Star）的总数 |

### 列表操作

- **搜索**：按数据集名称关键词搜索
- **标签过滤**：按任务类型、语言、标签等元数据组合过滤
- **排序**：按更新时间、下载量、收藏量排序
- **视图切换**：列表视图 / 卡片视图

:::tip
可以组合多个标签进行过滤，快速找到与您的训练任务匹配的数据集。
:::

## 创建数据集

![创建数据集表单](/assets/screenshots/console/moha-dataset-create.png)

点击列表页右上角的 **新建数据集** 按钮，打开创建表单。

### 表单字段详解

| 字段 | 类型 | 必填 | 验证规则 | 说明 |
|------|------|------|----------|------|
| 所属组织 | 下拉选择 | ✅ | — | 选择数据集所属的个人空间或组织 |
| 名称 | 文本输入 | ✅ | 正则 `^[a-zA-Z0-9][a-zA-Z0-9._-]*$` | 以字母或数字开头，可包含字母、数字、`.`、`_`、`-` |
| 可见性 | 单选按钮组 | ✅ | — | `Private`（私有）/ `Internal`（内部）/ `Public`（公开） |
| 描述 | 多行文本域（4行） | — | — | 数据集的简要描述 |
| 许可证 | 自动补全 | — | 从 `LICENSE_OPTIONS` 列表选择 | 如 Apache-2.0、CC-BY-4.0、CC-BY-SA-4.0 等 |
| 任务类型 | 任务选择器 多选 | — | 从预定义任务列表选择 | 如 text-classification、question-answering 等 |
| 语言 | 自动补全多选 | — | 从 `LANGUAGE_OPTIONS` 选择，最多显示 3 个标签 | 如 Chinese、English 等 |
| 标签 | freeSolo 自动补全多选 | — | 从 `TAG_OPTIONS` 选择或自定义输入 | 自由标签，便于分类检索 |
| 框架 | freeSolo 自动补全多选 | — | 从 `LIBRARY_OPTIONS` 选择或自定义，最多显示 5 个标签 | 如 datasets、pandas 等 |
| 成员 | 成员管理 | — | 角色：`admin` / `member` | 添加仓库级别的协作成员 |

:::warning
当所属组织类型为 `internal` 时，可见性默认值为 `Internal`。名称创建后不可修改，请仔细确认。
:::

:::tip
建议为数据集选择合适的许可证，特别是公开数据集。常见选择：`CC-BY-4.0`（允许商用并注明出处）或 `CC-BY-SA-4.0`（需以相同许可证分发衍生作品）。
:::

### 创建流程

```mermaid
flowchart TD
    A["点击新建数据集"] --> B["选择所属组织"]
    B --> C["填写名称与描述"]
    C --> D["设置可见性"]
    D --> E["配置元数据标签<br/>许可证/任务/语言/标签"]
    E --> F["添加成员（可选）"]
    F --> G["点击创建"]
    G --> H["进入数据集详情页<br/>上传数据文件"]
```

## 数据集详情

创建或进入数据集后，展示数据集的详情页面：

![数据集详情页](/assets/screenshots/console/moha-dataset-detail.png)

### README 与数据集卡片

数据集详情页默认展示仓库根目录的 `README.md`，渲染为数据集卡片。建议包含：

- 数据集介绍与用途
- 数据来源和收集方法
- 数据格式和字段说明
- 数据集规模（样本数、文件大小等）
- 使用限制和引用方式

### 文件浏览器

![数据集文件浏览器](/assets/screenshots/console/moha-dataset-files.png)

| 功能 | 说明 |
|------|------|
| 目录导航 | 树形结构浏览数据集目录和文件 |
| 文件预览 | 在线预览 CSV、JSON、Markdown 等文本格式 |
| 文件信息 | 显示文件大小、最后修改时间和 Commit 消息 |
| 下载文件 | 支持单文件下载 |
| LFS 文件 | 大型数据文件以 LFS 存储，显示 `oid` 和 `size` |
| 加密文件 | 支持加密数据集的标记和管理 |
| 分支/标签切换 | 切换不同版本的数据集文件 |

### 支持的数据格式

Moha 数据集仓库支持存储各种常见的 AI 数据格式：

| 格式 | 扩展名 | 适用场景 |
|------|--------|----------|
| CSV | `.csv` | 表格数据，通用格式 |
| JSON / JSONL | `.json` / `.jsonl` | 结构化数据，NLP 训练数据 |
| Parquet | `.parquet` | 列式存储，大规模数据集 |
| Arrow | `.arrow` | 高性能内存格式 |
| 文本文件 | `.txt` | 纯文本语料 |
| 图片文件 | `.png` / `.jpg` / `.webp` | 计算机视觉数据集 |
| 音频文件 | `.wav` / `.mp3` / `.flac` | 语音和音频数据集 |

:::tip
对于大规模数据集，推荐使用 Parquet 格式，它具有更高的压缩率和查询效率。同时建议使用 Git LFS 追踪大文件。
:::

### Commit 历史与版本管理

![数据集 Commit 历史](/assets/screenshots/console/moha-dataset-commits.png)

- **提交列表**：按时间倒序展示所有 Commit，包含作者、时间、消息
- **按文件过滤**：查看特定数据文件的变更记录
- **提交详情**：查看完整的差异对比（diff）
- **Reset / Revert**：回退或撤销指定提交

```mermaid
gitGraph
    commit id: "初始化仓库"
    commit id: "上传训练集 v1"
    branch data-cleaning
    commit id: "数据清洗：去重"
    commit id: "数据清洗：格式化"
    checkout main
    merge data-cleaning id: "合并清洗结果"
    commit id: "添加评测集"
    commit id: "v2.0 发布"
```

:::tip
使用分支管理数据集的不同版本或进行数据清洗工作，通过 PR 合并确保数据质量。
:::

### Pull Request

数据集同样支持完整的 PR 工作流：

| 功能 | 说明 |
|------|------|
| 创建 PR | 从分支提交数据修改，指定源分支和目标分支 |
| 差异对比 | 查看 PR 中数据文件的变更详情 |
| 评论讨论 | 对数据修改进行审查和讨论 |
| 合并 PR | 审查通过后合并到目标分支 |
| 关闭/重开 | 关闭或重新打开 PR |

### 讨论系统

- **创建讨论**：发起数据集相关的讨论话题
- **回复和评论**：支持多层嵌套的回复
- **状态管理**：标记讨论为已关闭或重新打开
- **评论 CRUD**：创建、查看、更新、删除评论

### 收藏与评分

| 功能 | 说明 |
|------|------|
| 收藏（Star） | 一键收藏数据集 |
| 评分 | 对数据集质量进行打分 |
| 下载统计 | 自动统计下载次数 |

## Git 操作指南

### 克隆数据集

```bash
# HTTPS 克隆
git clone https://username:TOKEN@moha.your-domain/org-name/dataset-name.git
cd dataset-name
```

### 上传数据文件

```bash
# 设置 LFS 追踪大文件格式
git lfs install
git lfs track "*.parquet" "*.csv" "*.arrow" "*.zip"

# 添加数据文件
cp /path/to/data/*.parquet ./data/

# 提交并推送
git add .
git commit -m "Upload training data v1.0"
git push origin main
```

### 版本标签管理

```bash
# 为重要版本创建标签
git tag -a v1.0 -m "First stable release"
git push origin v1.0

# 查看所有标签
git tag -l
```

:::warning
数据文件通常较大，务必配置 Git LFS 追踪对应的文件格式。建议创建 `.gitattributes` 文件明确指定 LFS 追踪规则。
:::

## 数据集设置

在数据集详情页的 **设置** 标签中，管理员可以进行以下操作：

| 设置项 | 说明 |
|--------|------|
| 可见性变更 | 切换 Public / Internal / Private |
| 元数据更新 | 修改许可证、任务、标签、语言等 |
| 封面图片 | 上传或修改数据集的封面图 |
| README 编辑 | 在线编辑数据集卡片 |
| 成员管理 | 添加或移除仓库成员，设置角色 |
| 删除数据集 | 永久删除数据集仓库（不可恢复） |

:::warning
删除数据集仓库是不可逆操作。删除前请确保已备份重要数据。
:::

## 权限要求

| 操作 | 要求 |
|------|------|
| 浏览公开数据集 | 所有用户 |
| 浏览内部数据集 | 同组织成员 |
| 浏览私有数据集 | 仓库成员 |
| 创建数据集 | 登录用户，拥有组织成员以上权限 |
| 修改数据集设置 | 仓库管理员或组织管理员 |
| 删除数据集 | 仓库管理员或组织管理员 |
| 发起 PR / 讨论 | 登录用户 |
| 合并 PR | 仓库管理员 |
