#!/usr/bin/env python3
"""Phase 5: Fill Moha module stub files with user-facing content."""
import os

BASE = '/Volumes/datas/project/rune/runeDoc/docs/src/pages/docs/cn/30.moha'

# Map: relative path -> content (without frontmatter - we preserve existing frontmatter)
STUBS = {}

STUBS['01.models/01.intro.md'] = """
## 模型广场介绍

模型广场是魔哈仓库的核心页面，集中展示平台上所有公开的 AI 模型，帮助您快速发现和选择适合的模型。

## 进入路径

Console → Moha → **模型广场**

## 页面布局

### 搜索与筛选

- **关键词搜索**：输入模型名称、标签或描述关键词进行搜索
- **标签筛选**：按模型类型（NLP、CV、语音等）、框架（PyTorch、TensorFlow）、许可证等标签过滤
- **排序方式**：按热度、最新更新、下载量、评分排序

### 模型卡片

每个模型以卡片形式展示：

| 信息 | 说明 |
|------|------|
| 模型名称 | 组织/模型名，如 `ai-lab/qwen2-7b` |
| 描述 | 模型简要说明 |
| 标签 | 任务类型、框架、语言等 |
| 下载量 | 历史下载总次数 |
| 收藏数 | 被收藏的次数 |
| 更新时间 | 最后一次提交时间 |

### 排行榜

模型广场提供多维度排行，包括趋势模型、热门下载、最新发布等。

## 操作指南

### 浏览模型

1. 进入模型广场页面
2. 使用搜索栏或标签筛选感兴趣的模型
3. 点击模型卡片进入详情页

### 收藏模型

点击模型卡片或详情页上的 ⭐ 按钮，将模型加入个人收藏夹，便于后续快速访问。

:::tip
收藏的模型可在首页"我的收藏"中快速找到。
:::
"""

STUBS['01.models/02.download.md'] = """
## 模型下载

从魔哈仓库下载模型文件到本地环境。

## 下载方式

### Web 界面下载

1. 进入模型详情页 → **文件** 标签页
2. 浏览模型文件目录
3. 点击目标文件右侧的下载按钮

:::tip
Web 下载适合单文件或小体积模型。对于大型模型（如数十 GB），推荐使用 Git 克隆方式。
:::

### Git 克隆

使用 Git 克隆完整模型仓库：

```bash
# 克隆模型仓库
git clone https://moha.your-domain/organizations/ai-lab/models/qwen2-7b.git

# 如果模型包含大文件（LFS）
git lfs install
git clone https://moha.your-domain/organizations/ai-lab/models/qwen2-7b.git
```

### 下载指定版本

```bash
# 克隆后切换到指定分支或标签
git checkout v1.0
```

## 认证配置

下载私有模型需要认证：

1. 在个人设置中创建**访问令牌**
2. 使用令牌配置 Git 认证

```bash
git clone https://<用户名>:<访问令牌>@moha.your-domain/organizations/ai-lab/models/my-private-model.git
```

:::warning
请妥善保管访问令牌，不要在公开代码或文档中泄露令牌信息。
:::

## LFS 大文件

魔哈仓库使用 Git LFS 管理大型模型文件（如权重文件）。克隆时需确保已安装 `git-lfs`：

```bash
# 安装 git-lfs
git lfs install

# 仅下载某些文件（选择性下载）
GIT_LFS_SKIP_SMUDGE=1 git clone <url>
git lfs pull --include="*.safetensors"
```
"""

STUBS['01.models/03.upload.md'] = """
## 模型上传

将模型文件上传到魔哈仓库。

## 上传方式

### Web 界面上传

1. 进入模型详情页 → **文件** 标签页
2. 点击 **上传文件** 按钮
3. 选择本地文件并上传

:::warning
Web 上传受浏览器限制，建议单文件不超过 **5GB**。大型模型请使用 Git 推送方式。
:::

### Git 推送

使用 Git 推送模型文件到仓库：

```bash
# 克隆模型仓库
git clone https://moha.your-domain/organizations/ai-lab/models/my-model.git
cd my-model

# 添加模型文件
git lfs track "*.safetensors" "*.bin" "*.pt"
cp /path/to/model/* .

# 提交并推送
git add .
git commit -m "上传模型权重文件"
git push origin main
```

## 注意事项

- 大型模型文件（>100MB）会自动使用 Git LFS 存储
- 推荐使用 `.safetensors` 格式存储权重（更安全、加载更快）
- 上传后可在文件页查看所有已上传的文件
"""

STUBS['01.models/05.version.md'] = """
## 模型版本管理

管理模型的多个版本，支持发布、回滚和版本对比。

## 版本机制

魔哈仓库使用 Git 分支和标签实现模型版本管理：

- **分支**：用于开发中的版本，如 `main`、`dev`、`feature-xxx`
- **标签**：用于已发布的稳定版本，如 `v1.0`、`v2.0-beta`

## 操作指南

### 查看版本

1. 进入模型详情页
2. 切换到 **版本** 标签页
3. 查看所有分支和标签

### 创建新版本

1. 在本地完成模型训练或更新
2. 将新文件推送到仓库
3. 创建标签标记版本号

```bash
git tag v1.0 -m "Release v1.0"
git push origin v1.0
```

### 切换版本

在模型详情页顶部的版本下拉框中选择目标分支或标签，即可查看该版本的文件和信息。

:::tip
建议使用语义化版本号（如 v1.0.0），major 版本号表示不兼容变更，minor 表示新增功能，patch 表示修复。
:::
"""

STUBS['02.datasets/01.info.md'] = """
## 数据集概览

数据集广场展示平台上所有公开的数据集，支持搜索和分类浏览。

## 进入路径

Console → Moha → **数据集**

## 页面功能

### 数据集列表

- **搜索**：按名称和关键词搜索数据集
- **筛选**：按标签、数据类型、许可证筛选
- **排序**：按更新时间、下载量、收藏数排序

### 数据集卡片

| 信息 | 说明 |
|------|------|
| 数据集名称 | 组织/数据集名 |
| 描述 | 数据集用途简介 |
| 标签 | 数据类型、领域、语言等 |
| 文件数 | 数据集包含的文件数量 |
| 大小 | 数据集总大小 |
| 更新时间 | 最后更新时间 |

### 收藏

点击 ⭐ 按钮收藏数据集，方便后续查找使用。
"""

STUBS['02.datasets/02.create.md'] = """
## 创建数据集

在魔哈仓库中创建新的数据集仓库。

## 操作步骤

1. 进入 Moha → 数据集页面
2. 点击 **创建数据集** 按钮
3. 填写数据集信息：

| 字段 | 说明 | 是否必填 |
|------|------|---------|
| 所属组织 | 选择数据集归属的组织 | 必填 |
| 数据集名称 | 唯一标识，用于 URL 和 Git 操作 | 必填 |
| 描述 | 数据集用途说明 | 选填 |
| 可见性 | 公开或私有 | 必填 |
| 许可证 | 数据使用许可证类型 | 选填 |

4. 点击 **创建** 完成

## 上传数据

创建数据集后，可通过以下方式上传数据文件：

### Web 上传

在数据集详情页 → 文件标签页 → 点击 **上传文件**

### Git 推送

```bash
git clone https://moha.your-domain/organizations/my-org/datasets/my-dataset.git
cd my-dataset

# 添加数据文件
git lfs track "*.parquet" "*.csv" "*.jsonl"
cp /path/to/data/* .

git add .
git commit -m "添加训练数据"
git push origin main
```

:::tip
大型数据文件推荐使用 Git LFS 管理，并选择 Parquet 或 JSONL 等高效格式。
:::
"""

STUBS['02.datasets/03.upload.md'] = """
## 数据上传

将数据文件上传到魔哈仓库的数据集中。

## 上传方式

### Web 界面上传

1. 进入数据集详情页 → **文件** 标签页
2. 点击 **上传文件** 按钮
3. 选择文件或拖拽文件到上传区域

:::warning
Web 上传单文件大小限制为 **5GB**。超大数据集请使用 Git 推送。
:::

### Git 推送上传

适用于大量文件或大型数据集：

```bash
cd my-dataset

# 配置 LFS 追踪大文件
git lfs track "*.parquet" "*.csv.gz" "*.tar.gz"

# 添加并推送
git add .
git commit -m "上传数据集 v2"
git push origin main
```

## 支持的格式

| 格式 | 扩展名 | 适用场景 |
|------|--------|---------|
| CSV | `.csv` | 表格数据 |
| Parquet | `.parquet` | 高效列式存储 |
| JSONL | `.jsonl` | 结构化文本数据 |
| 图片 | `.jpg`, `.png` | 视觉数据集 |
| 音频 | `.wav`, `.mp3` | 语音数据集 |
| 压缩包 | `.tar.gz`, `.zip` | 批量数据打包 |

## 注意事项

- 上传时会自动检测文件是否适用 Git LFS
- 同名文件会覆盖旧版本（Git 会保留历史记录）
- 上传完成后可在线预览 CSV、JSON 等文本格式文件
"""

STUBS['02.datasets/04.download.md'] = """
## 数据集下载

从魔哈仓库下载数据集文件。

## 下载方式

### Web 下载

进入数据集详情页 → **文件** 标签页，点击文件旁的下载按钮。

### Git 克隆

```bash
# 克隆数据集仓库
git lfs install
git clone https://moha.your-domain/organizations/ai-lab/datasets/my-dataset.git
```

### 选择性下载

只下载部分文件：

```bash
# 跳过 LFS 大文件，仅下载指针文件
GIT_LFS_SKIP_SMUDGE=1 git clone <url>

# 按需下载指定文件
git lfs pull --include="train/*.parquet"
```

## 认证

下载私有数据集需要配置访问令牌，参见 [访问令牌管理](../03.quickstart/03.token.md)。
"""

STUBS['02.datasets/05.card.md'] = """
## 数据集卡片

数据集卡片（Dataset Card）是数据集的说明文档，帮助使用者了解数据集内容和使用方法。

## 编写数据集卡片

在数据集仓库根目录创建 `README.md` 文件即可作为数据集卡片。

### 推荐结构

```markdown
# 数据集名称

## 概述
简述数据集的用途和来源。

## 数据内容
- 数据量：10万条
- 格式：JSONL
- 语言：中文

## 字段说明
| 字段 | 类型 | 说明 |
|------|------|------|
| text | string | 原始文本 |
| label | int | 类别标签 |

## 使用方式
说明如何加载和使用数据集。

## 许可证
数据使用的许可证信息。
```

:::tip
完善的数据集卡片可以显著提高数据集的可发现性和使用率。
:::
"""

STUBS['02.datasets/06.maintain.md'] = """
## 数据集维护

管理和维护日常数据集，确保数据质量。

## 版本管理

使用 Git 分支和标签管理数据集版本：

- **分支**：`main` 为正式版本，创建其他分支用于开发
- **标签**：为稳定版本打标签（如 `v1.0`、`v2.0`）

## 数据更新

### 追加数据

```bash
cd my-dataset
cp /path/to/new-data/*.parquet .
git add .
git commit -m "追加 2025-01 训练数据"
git push origin main
```

### 回滚版本

如果新数据有问题，可回退到之前的版本：

```bash
git revert HEAD
git push origin main
```

## 清理与归档

- **清理无用文件**：删除过期或无用的数据文件
- **归档历史版本**：将旧版本数据归档到独立分支

:::warning
大型数据集的 Git 历史可能占用大量存储空间。建议定期清理不再需要的历史大文件。
:::
"""

STUBS['02.datasets/07.rules.md'] = """
## 数据治理规范

数据集管理的规范和最佳实践。

## 命名规范

| 项目 | 规范 | 示例 |
|------|------|------|
| 数据集名称 | 小写字母、数字、连字符 | `chinese-qa-v2` |
| 文件命名 | 清晰、包含版本或日期 | `train-2025-01.parquet` |
| 目录结构 | 按数据类型或用途分目录 | `train/`, `test/`, `validation/` |

## 数据质量要求

- **完整性**：确保所有字段有值，标注空值和缺失原因
- **一致性**：字段格式统一（如日期格式、编码方式）
- **准确性**：标注正确，数据无明显错误
- **时效性**：标注数据采集和更新时间

## 隐私与安全

- 脱敏处理个人隐私信息（姓名、手机号、身份证等）
- 在数据集卡片中注明数据来源和使用限制
- 敏感数据集设为私有可见性

## 许可证选择

常用的开放数据许可证：

| 许可证 | 说明 |
|--------|------|
| CC BY 4.0 | 允许自由使用，需注明出处 |
| CC BY-SA 4.0 | 允许使用，衍生作品需同许可 |
| CC BY-NC 4.0 | 允许非商业使用 |
| Apache 2.0 | 宽松许可，适合代码型数据 |
"""

STUBS['03.quickstart/03.token.md'] = """
## 访问令牌

访问令牌用于 Git 操作和 API 调用的身份认证。

## 创建令牌

1. 点击右上角头像 → **个人设置**
2. 进入 **访问令牌** 页面
3. 点击 **创建令牌**
4. 填写令牌名称并选择权限范围
5. 点击 **创建** 生成令牌

:::warning
令牌仅在创建时显示一次，请立即复制保存。如果丢失，需要删除后重新创建。
:::

## 权限范围

| 权限 | 说明 |
|------|------|
| 读取 | 克隆和下载仓库内容 |
| 写入 | 推送代码、上传文件 |
| 管理 | 创建和删除仓库 |

## 使用令牌

### Git 操作

```bash
# 方式 1：在 URL 中携带令牌
git clone https://<用户名>:<令牌>@moha.your-domain/organizations/org/models/repo.git

# 方式 2：配置凭证缓存
git config --global credential.helper store
# 首次操作时输入用户名和令牌
```

### API 调用

```bash
curl -H "Authorization: Bearer <令牌>" \\
  https://moha.your-domain/api/moha/organizations/my-org/models
```

## 令牌管理

- **查看令牌列表**：显示所有已创建的令牌及最后使用时间
- **删除令牌**：删除不再使用的令牌，立即吊销认证权限
"""

STUBS['03.quickstart/index.md'] = """
## 快速开始

帮助您快速上手魔哈仓库的核心功能。

## 准备工作

使用魔哈仓库前，请确认：

1. **拥有平台账户** — 联系管理员创建账户或自行注册
2. **加入组织** — 模型和数据集归属于组织，需先加入或创建组织
3. **创建访问令牌** — 用于 Git 操作和 API 调用的身份认证

## 快速上手流程

```mermaid
flowchart LR
    A["注册/登录"] --> B["加入组织"]
    B --> C["创建令牌"]
    C --> D["上传模型/数据集"]
    D --> E["协作分享"]
```

## 相关文档

| 文档 | 说明 |
|------|------|
| [新手指南](./01.guide) | 从零开始的完整操作流程 |
| [账户设置](./02.account) | 配置个人信息和偏好 |
| [访问令牌](./03.token) | 创建和管理认证令牌 |
"""

STUBS['04.marketplace/01.intro.md'] = """
## 应用市场介绍

应用市场提供预配置的 AI 应用模板，帮助您快速部署常用的模型服务和开发工具。

## 进入路径

Console → Moha → **应用市场**

## 页面功能

### 应用分类

应用市场按以下类别展示应用：

| 分类 | 说明 | 示例 |
|------|------|------|
| 推理服务 | 模型推理部署模板 | vLLM、TGI、Triton |
| 开发工具 | 模型开发和训练工具 | JupyterLab、VS Code Server |
| 数据处理 | 数据预处理和标注工具 | Label Studio |
| 监控运维 | 服务监控和日志工具 | Grafana、Prometheus |

### 应用卡片

每个应用展示名称、图标、简介、版本号和部署次数。

## 操作指南

1. 浏览应用列表，点击感兴趣的应用
2. 查看应用详情（文档、版本历史、配置说明）
3. 选择版本并点击 **部署**，填写所需参数
4. 等待部署完成，访问应用 URL
"""

STUBS['04.marketplace/02.create.md'] = """
## 创建应用

将自定义应用发布到应用市场。

## 前置条件

- 拥有 **系统管理员** 或 **租户管理员** 角色
- 已准备好应用的 Helm Chart 包

## 创建步骤

1. 进入应用市场 → 点击 **发布应用**
2. 填写应用基本信息：

| 字段 | 说明 |
|------|------|
| 应用名称 | 应用的唯一标识 |
| 显示名称 | 在市场中展示的名称 |
| 分类 | 选择应用所属类别 |
| 图标 | 上传应用图标 |
| 描述 | 应用功能说明 |
| 文档 | 使用说明和配置指南 |

3. 上传 Helm Chart 包
4. 配置默认部署参数
5. 点击 **发布**

:::tip
发布前建议先在测试环境中验证部署流程，确保 Chart 包和默认参数正确。
:::
"""

STUBS['04.marketplace/03.upload.md'] = """
## 上传应用版本

为已有的应用市场应用上传新版本。

## 操作步骤

1. 进入应用详情页 → **版本管理** 标签页
2. 点击 **上传新版本**
3. 上传新的 Helm Chart 包（`.tgz` 格式）
4. 系统自动解析版本号和配置 Schema
5. 确认信息后点击 **保存**

## Chart 包要求

- 标准 Helm Chart 打包格式（`.tgz`）
- `Chart.yaml` 版本号遵循 SemVer 规范
- 建议包含 `values.yaml`（默认配置）
- 建议包含 `values.schema.json`（配置表单）

## 版本发布流程

上传后的版本默认为**未发布**状态，需手动发布后才对用户可见：

1. 上传 Chart → 未发布
2. 测试验证 → 发布版本
3. 如有问题 → 下架版本
"""

STUBS['04.marketplace/04.deploy.md'] = """
## 部署应用

从应用市场部署应用到您的开发环境。

## 部署步骤

1. 在应用市场中选择目标应用
2. 选择要部署的版本
3. 配置部署参数：

| 参数 | 说明 |
|------|------|
| 部署名称 | 实例的名称标识 |
| 目标集群 | 部署到哪个计算集群 |
| 资源规格 | 选择 CPU/GPU/内存配置 |
| 自定义配置 | 按需修改应用参数 |

4. 点击 **部署** 开始创建实例
5. 等待部署完成

## 查看部署状态

部署后可在 **我的实例** 中查看：

- **运行中**：应用已就绪，可正常使用
- **部署中**：正在创建和启动
- **失败**：部署出错，查看日志排查原因

:::tip
部署大型应用（如包含 GPU 推理服务）可能需要几分钟，请耐心等待镜像拉取和服务启动。
:::
"""

STUBS['04.marketplace/05.maintain.md'] = """
## 应用维护

管理已部署的应用实例和市场应用。

## 实例管理

### 查看实例

在 **我的实例** 页面查看所有已部署的应用，包括运行状态、资源占用和访问地址。

### 重启实例

如应用出现异常，可点击 **重启** 按钮重新启动。

### 升级版本

当应用市场中有新版本时：

1. 进入实例详情页
2. 点击 **升级**
3. 选择新版本并确认配置
4. 等待滚动升级完成

### 卸载实例

不再需要时，点击 **卸载** 释放资源。

:::warning
卸载将删除实例及其数据。如需保留数据，请提前备份持久化存储卷中的内容。
:::

## 市场应用管理

管理员可在应用市场管理页面：

- **下架应用**：暂时从市场中隐藏
- **删除应用**：永久移除（不影响已部署实例）
- **更新信息**：修改应用描述、图标等
"""

STUBS['04.marketplace/06.package.md'] = """
## 应用打包

将自定义应用打包为 Helm Chart 格式，准备发布到应用市场。

## Chart 结构

```
my-app/
├── Chart.yaml          # 应用元信息
├── values.yaml         # 默认配置
├── values.schema.json  # 配置表单 Schema
├── README.md           # 应用文档
└── templates/          # Kubernetes 资源模板
    ├── deployment.yaml
    ├── service.yaml
    └── ingress.yaml
```

## 关键文件说明

### Chart.yaml

```yaml
apiVersion: v2
name: my-app
version: 1.0.0
appVersion: "2.0"
description: 我的自定义应用
```

### values.yaml

定义用户可配置的参数及默认值。

### values.schema.json

定义配置表单的 UI 呈现方式和校验规则，部署时系统会据此渲染配置表单。

## 打包命令

```bash
helm package my-app/
# 输出: my-app-1.0.0.tgz
```

:::tip
打包前建议使用 `helm lint my-app/` 检查 Chart 的格式是否正确。
:::
"""

STUBS['06.model-integration/index.md'] = """
## 模型接入

将魔哈仓库中的模型接入到实际应用中。

## 接入方式

### 推理服务部署

通过 Rune 平台部署模型推理服务，获得 API 端点：

1. 在魔哈仓库中选择模型
2. 通过应用市场部署推理引擎（如 vLLM、TGI）
3. 配置模型路径指向魔哈仓库
4. 部署完成后获得推理 API 端点

### 直接加载

在开发环境中直接从仓库加载模型：

```python
# 配置魔哈仓库地址
import os
os.environ["HF_ENDPOINT"] = "https://moha.your-domain"

# 使用 transformers 加载
from transformers import AutoModelForCausalLM, AutoTokenizer

model = AutoModelForCausalLM.from_pretrained("ai-lab/qwen2-7b")
tokenizer = AutoTokenizer.from_pretrained("ai-lab/qwen2-7b")
```

### LLM 网关接入

将推理服务注册到 LLM 网关，通过统一 API 访问：

1. 部署推理服务
2. 在 BOSS → LLM 网关 → 服务注册 中添加
3. 通过网关 API 统一调用

## 相关文档

- [推理服务部署](/docs/cn/10.rune/inference)
- [LLM 网关](/docs/cn/20.boss/02.gateway/)
- [SDK 教程](../07.sdk-tutorial/)
"""

STUBS['07.sdk-tutorial/01.intro.md'] = """
## SDK 概述

魔哈仓库兼容 HuggingFace Hub 的 API 和 SDK，您可以使用熟悉的工具与平台交互。

## 兼容性

魔哈仓库兼容以下工具和库：

| 工具 | 说明 |
|------|------|
| `git` + `git-lfs` | 标准 Git 操作 |
| `transformers` | 模型加载和推理 |
| `datasets` | 数据集加载和处理 |
| `huggingface_hub` | Hub API 操作 |

## 配置环境

使用 SDK 前需要配置魔哈仓库的地址：

```bash
# 方式 1：环境变量
export HF_ENDPOINT=https://moha.your-domain

# 方式 2：Python 代码中设置
import os
os.environ["HF_ENDPOINT"] = "https://moha.your-domain"
```

## 认证

```bash
# 配置访问令牌
export HF_TOKEN=your_access_token
```

:::tip
所有兼容 HuggingFace Hub 的工具都可以通过配置 `HF_ENDPOINT` 指向魔哈仓库后直接使用。
:::
"""

STUBS['07.sdk-tutorial/02.usage.md'] = """
## 基本用法

使用 SDK 与魔哈仓库进行基本交互。

## 仓库操作

### 列出模型

```python
from huggingface_hub import HfApi

api = HfApi(endpoint="https://moha.your-domain")
models = api.list_models()
for model in models:
    print(model.modelId)
```

### 下载文件

```python
from huggingface_hub import hf_hub_download

file = hf_hub_download(
    repo_id="ai-lab/qwen2-7b",
    filename="config.json",
    endpoint="https://moha.your-domain"
)
```

### 上传文件

```python
from huggingface_hub import HfApi

api = HfApi(endpoint="https://moha.your-domain", token="your_token")
api.upload_file(
    path_or_fileobj="./model.safetensors",
    path_in_repo="model.safetensors",
    repo_id="ai-lab/my-model"
)
```

## 数据集操作

```python
from datasets import load_dataset

dataset = load_dataset("ai-lab/my-dataset")
print(dataset["train"][0])
```
"""

STUBS['07.sdk-tutorial/03.model-load.md'] = """
## 模型加载

使用 transformers 从魔哈仓库加载模型。

## 基本加载

```python
import os
os.environ["HF_ENDPOINT"] = "https://moha.your-domain"

from transformers import AutoModelForCausalLM, AutoTokenizer

tokenizer = AutoTokenizer.from_pretrained("ai-lab/qwen2-7b")
model = AutoModelForCausalLM.from_pretrained("ai-lab/qwen2-7b")
```

## 指定设备

```python
# 自动分配到可用 GPU
model = AutoModelForCausalLM.from_pretrained(
    "ai-lab/qwen2-7b",
    device_map="auto"
)

# 指定数据类型，减少显存占用
import torch
model = AutoModelForCausalLM.from_pretrained(
    "ai-lab/qwen2-7b",
    device_map="auto",
    torch_dtype=torch.float16
)
```

## 加载指定版本

```python
# 通过 revision 参数指定分支或标签
model = AutoModelForCausalLM.from_pretrained(
    "ai-lab/qwen2-7b",
    revision="v1.0"
)
```

## 离线加载

先下载到本地缓存，再离线使用：

```python
# 第一次运行：下载到缓存
model = AutoModelForCausalLM.from_pretrained("ai-lab/qwen2-7b")

# 后续运行：使用缓存（无需联网）
model = AutoModelForCausalLM.from_pretrained(
    "ai-lab/qwen2-7b",
    local_files_only=True
)
```
"""

STUBS['07.sdk-tutorial/04.pipeline.md'] = """
## Pipeline 推理

使用 transformers Pipeline 快速进行模型推理。

## 文本生成

```python
from transformers import pipeline

generator = pipeline("text-generation", model="ai-lab/qwen2-7b")
result = generator("人工智能的未来", max_length=200)
print(result[0]["generated_text"])
```

## 文本分类

```python
classifier = pipeline("text-classification", model="ai-lab/bert-classifier")
result = classifier("这个产品非常好用")
print(result)  # [{'label': 'POSITIVE', 'score': 0.98}]
```

## 问答系统

```python
qa = pipeline("question-answering", model="ai-lab/qa-model")
result = qa(
    question="魔哈仓库是什么？",
    context="魔哈仓库是一个 AI 模型管理平台，支持模型托管和协作。"
)
print(result["answer"])
```

## 自定义参数

```python
generator = pipeline(
    "text-generation",
    model="ai-lab/qwen2-7b",
    device_map="auto",
    torch_dtype="float16"
)

result = generator(
    "请解释机器学习",
    max_length=500,
    temperature=0.7,
    top_p=0.9
)
```

:::tip
Pipeline 会自动处理模型加载、分词和后处理，适合快速原型验证。生产环境建议使用推理服务部署（如 vLLM）以获得更好的性能。
:::
"""

STUBS['07.sdk-tutorial/05.dataset.md'] = """
## 数据集加载

使用 datasets 库从魔哈仓库加载数据集。

## 基本加载

```python
import os
os.environ["HF_ENDPOINT"] = "https://moha.your-domain"

from datasets import load_dataset

dataset = load_dataset("ai-lab/my-dataset")
print(dataset)
```

## 加载特定分片

```python
# 仅加载训练集
train_data = load_dataset("ai-lab/my-dataset", split="train")

# 加载部分数据
small_data = load_dataset("ai-lab/my-dataset", split="train[:1000]")
```

## 流式加载

对于大型数据集，使用流式模式避免一次性加载到内存：

```python
dataset = load_dataset("ai-lab/my-dataset", streaming=True)
for sample in dataset["train"]:
    print(sample)
    break  # 只看第一条
```

## 数据预处理

```python
# 分词
from transformers import AutoTokenizer

tokenizer = AutoTokenizer.from_pretrained("ai-lab/qwen2-7b")

def tokenize(example):
    return tokenizer(example["text"], truncation=True, max_length=512)

tokenized = dataset.map(tokenize, batched=True)
```

## 加载本地数据

```python
# 从本地文件加载
from datasets import load_dataset

dataset = load_dataset("csv", data_files="data.csv")
dataset = load_dataset("json", data_files="data.jsonl")
dataset = load_dataset("parquet", data_files="data.parquet")
```
"""

STUBS['07.sdk-tutorial/06.model-training.md'] = """
## 模型训练

使用 transformers Trainer 在魔哈仓库的数据集上训练和微调模型。

## 基本训练流程

```python
import os
os.environ["HF_ENDPOINT"] = "https://moha.your-domain"

from transformers import (
    AutoModelForSequenceClassification,
    AutoTokenizer,
    TrainingArguments,
    Trainer
)
from datasets import load_dataset

# 1. 加载模型和分词器
model = AutoModelForSequenceClassification.from_pretrained(
    "ai-lab/bert-base", num_labels=2
)
tokenizer = AutoTokenizer.from_pretrained("ai-lab/bert-base")

# 2. 加载数据集
dataset = load_dataset("ai-lab/my-classification-data")

# 3. 数据预处理
def preprocess(examples):
    return tokenizer(examples["text"], truncation=True, max_length=512)

dataset = dataset.map(preprocess, batched=True)

# 4. 配置训练参数
training_args = TrainingArguments(
    output_dir="./results",
    num_train_epochs=3,
    per_device_train_batch_size=16,
    learning_rate=2e-5,
)

# 5. 开始训练
trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=dataset["train"],
    eval_dataset=dataset["test"],
)
trainer.train()
```

## 保存和上传模型

```python
# 保存到本地
trainer.save_model("./my-finetuned-model")

# 推送到魔哈仓库
model.push_to_hub("my-org/my-finetuned-model")
tokenizer.push_to_hub("my-org/my-finetuned-model")
```
"""

STUBS['07.sdk-tutorial/07.model-export.md'] = """
## 模型导出

将训练好的模型导出为不同格式，便于部署和分发。

## 导出格式

| 格式 | 适用场景 | 说明 |
|------|---------|------|
| Safetensors | 通用推理和存储 | 安全、加载快 |
| ONNX | 跨框架部署 | 兼容多种推理引擎 |
| GGUF | CPU 推理 | 适合 llama.cpp 等工具 |
| TensorRT | NVIDIA GPU 推理 | 高性能推理优化 |

## 导出为 Safetensors

```python
# transformers 默认支持 safetensors
model.save_pretrained("./output", safe_serialization=True)
```

## 导出为 ONNX

```python
from transformers import AutoModelForSequenceClassification
from optimum.onnxruntime import ORTModelForSequenceClassification

# 导出
model = ORTModelForSequenceClassification.from_pretrained(
    "ai-lab/my-model",
    export=True
)
model.save_pretrained("./onnx-output")
```

## 上传导出模型

将导出的模型上传到魔哈仓库：

```bash
cd onnx-output
git init
git lfs track "*.onnx"
git add .
git commit -m "导出 ONNX 模型"
git remote add origin https://moha.your-domain/organizations/my-org/models/my-model-onnx.git
git push origin main
```
"""


def fill_stub(relpath, content):
    """Fill a stub file: preserve frontmatter, replace body."""
    filepath = os.path.join(BASE, relpath)
    if not os.path.exists(filepath):
        print(f"  ❌ {relpath}: file not found")
        return

    with open(filepath, 'r', encoding='utf-8') as f:
        original = f.read()

    # Extract frontmatter
    if original.startswith('---'):
        end = original.find('---', 3)
        if end != -1:
            frontmatter = original[:end + 3]
        else:
            frontmatter = ''
    else:
        frontmatter = ''

    new_content = frontmatter + '\n' + content.strip() + '\n'

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)

    new_lines = len(new_content.splitlines())
    old_lines = len(original.splitlines())
    print(f"  ✅ {relpath}: {old_lines} → {new_lines} lines")


for relpath, content in sorted(STUBS.items()):
    fill_stub(relpath, content)

print(f"\nDone! Filled {len(STUBS)} stub files.")
