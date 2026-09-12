---
title: 高阶使用
updated: '2026-09-12'
description: 用接口、流水线和 SDK 代替点界面，并优化大文件下载、把内容贡献回平台。
tags:
  - moha
  - advanced
---

# 高阶使用

这一组页面给已经不满足于点界面的用户：想用接口而不是网页访问魔哈、想把上传下载写进自动流水线、想解决大模型下载慢的问题，或者想把内容公开给更多人。四篇都围绕同一个工具展开——Moha SDK（同时提供 `moha` 命令行和 Python 接口）。

## 开始之前
- 先去 [访问令牌](/moha/quickstart/token) 生成一个访问令牌，它是下面所有操作的通行证。
- 本机安装 Python 3.10 或更高版本。
- 知道自己的控制台地址（就是你平时打开魔哈网页时用的地址）。

## 四篇文档分别解决什么
| 页面 | 解决什么问题 |
| --- | --- |
| [API 集成](/moha/advanced/api) | 用 HTTP 接口直接调魔哈，怎么认证、怎么发请求 |
| [CI/CD 流程](/moha/advanced/cicd) | 在流水线里自动上传、下载，并触发空间重新发布 |
| [性能优化](/moha/advanced/optimization) | 大模型下载慢，怎么只拉需要的文件 |
| [社区贡献](/moha/advanced/contribution) | 怎么把资源公开、参与协作，贡献回平台 |

## 先装一次，之后直接用
```bash
# 安装 SDK 与 moha 命令行
pip install moha-hub

# 登录并保存令牌（地址要带 https://）
moha login https://<你的控制台地址> --token <你的访问令牌>

# 确认登录状态
moha whoami
```

登录成功后，令牌和控制台地址会保存在本机，后续命令都不需要再重复输入。

:::tip 不想装东西
只想快速拉一个模型或数据集，也可以直接用 Git 克隆，见 [性能优化](/moha/advanced/optimization)。
:::

## 相关
- [访问令牌](/moha/quickstart/token)
- [SDK 教程](/moha/sdk-tutorial/quick-start)
- [CLI 工具完整参考](/moha/sdk-tutorial/cli-reference)
