# Moha

本目录描述晓石 AI 平台的 AI 资产中心。Moha 管理模型、数据集、镜像和 Space 的仓库元数据、版本、内容、可见性与协作关系；Rune 管理这些资产被部署后的资源和运行生命周期。

## 文档列表

- [需求](requirements.md)
- [设计](design.md)

## 产品功能

| 功能 | 用户价值 |
| ---- | -------- |
| 模型与数据集 | 以 Git revision 管理版本，以 LFS/S3 分发大文件 |
| 镜像 | 通过 OCI Registry 管理、扫描和分发容器镜像 |
| Space | 管理应用代码，并与 Rune 工作空间组合形成可运行环境 |
| 资产发现 | 提供模型卡、索引、讨论、收藏、谱系等协作信息 |
| 来源镜像 | 从 Hugging Face、ModelScope 等来源同步资产 |
| 权限 | 以 public、internal、private 和仓库成员控制访问 |

## 现状判断

Moha 已实现 Git 仓库、Git LFS、OCI Registry、资产 REST API、来源镜像、仓库协作和 Space 工作空间集成，实际能力明显多于仓库根 README 的简短介绍。当前主要短板是架构资料分散在代码和 Helm values 中，且 Git、Registry、MongoDB、对象存储、IAM 与 Rune 的故障边界尚未在平台文档中形成统一入口。

## 关注点

- 模型、数据集、镜像和 Space 如何形成稳定资产引用。
- Git、LFS、OCI 与 MongoDB 分别保存什么。
- public、internal、private 可见性如何结合组织和仓库权限。
- 外部模型站镜像如何同步并留下来源证据。
- Space 如何调用 Rune 的工作空间能力。
- 资产内容与 Rune Instance 运行状态如何保持独立生命周期。
