---
title: 'SSH Key 管理'
updated: '2026-03-23'
---

## 功能简介

SSH Key 管理页面用于添加和管理您的 **SSH 公钥**。SSH 公钥是通过 SSH 协议与平台进行安全通信的凭证，主要用于 **Git 仓库操作**（克隆、推送、拉取 Moha 模型仓库）和 **开发环境（DevEnv）** 的 SSH 连接。

通过将您的 SSH 公钥添加到平台，无需每次输入用户名和密码即可完成身份认证。

## 进入路径

右上角头像 → 个人中心 → **SSH Key**

路径：`/iam/account/ssh-key`

## 页面概览

![SSH Key 管理页面](/assets/screenshots/console/iam-ssh-keys.png)

---

## 生成 SSH 密钥对

如果您还没有 SSH 密钥对，需要先在本地生成。

### 推荐：Ed25519

```bash
# 生成 Ed25519 密钥对（推荐，更安全、更快速）
ssh-keygen -t ed25519 -C "your-email@example.com"
```

执行后会提示您选择保存路径和设置密码短语（passphrase）：

```
Generating public/private ed25519 key pair.
Enter file in which to save the key (/Users/you/.ssh/id_ed25519): [回车使用默认路径]
Enter passphrase (empty for no passphrase): [输入密码短语或直接回车]
Enter same passphrase again: [确认密码短语]
```

### 备选：RSA

```bash
# 生成 RSA 密钥对（兼容性更广）
ssh-keygen -t rsa -b 4096 -C "your-email@example.com"
```

### 查看公钥内容

```bash
# Ed25519 公钥
cat ~/.ssh/id_ed25519.pub

# RSA 公钥
cat ~/.ssh/id_rsa.pub
```

输出示例：

```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIGxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx your-email@example.com
```

:::tip
公钥文件以 `.pub` 结尾。请确保上传的是**公钥**（`.pub` 文件），而非私钥。私钥应始终保留在本地，不要上传或分享给任何人。
:::

:::warning
设置密码短语（passphrase）可以为私钥增加额外保护。即使私钥文件被窃取，没有密码短语也无法使用。强烈建议设置。
:::

---

## 添加 SSH Key

### 操作步骤

1. 点击页面右上角的 **添加 SSH Key** 按钮
2. 填写表单：

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| **名称** | 文本输入 | ✅ | 为 SSH Key 设置一个便于识别的名称（如 "MacBook Pro" 或 "CI Server"） |
| **公钥** | 多行文本域 | ✅ | 粘贴 SSH 公钥的完整内容（以 `ssh-ed25519` 或 `ssh-rsa` 开头） |

3. 点击 **确认** 提交

![添加 SSH Key 表单](/assets/screenshots/console/iam-ssh-key-add.png)

### 公钥格式要求

| 要求 | 说明 |
|------|------|
| 格式 | 标准的 OpenSSH 公钥格式 |
| 支持的类型 | `ssh-ed25519`、`ssh-rsa`、`ecdsa-sha2-nistp256` 等 |
| 内容 | 完整的一行公钥字符串，包括类型前缀和可选的注释 |
| 不可重复 | 同一公钥不可重复添加 |

---

## SSH Key 列表

添加成功后，SSH Key 会出现在列表中：

| 列 | 说明 |
|----|------|
| **名称** | 自定义名称 |
| **创建时间** | 添加时间 |
| **指纹** | 公钥指纹（fingerprint），格式如 `SHA256:xxxxxxxx`，用于快速识别 |
| **注释** | 公钥中的注释部分（通常为生成时填写的邮箱） |
| **操作** | 删除按钮 |

:::tip
指纹（fingerprint）是公钥的唯一标识哈希值。如果您不确定某个 Key 对应哪台设备，可以在本地运行 `ssh-keygen -lf ~/.ssh/id_ed25519.pub` 查看本地公钥的指纹进行比对。
:::

---

## 删除 SSH Key

1. 在 SSH Key 列表中找到要删除的条目
2. 点击 **删除** 按钮
3. 在确认对话框中确认删除

删除后：
- 该 SSH 公钥将从平台中移除
- 使用对应私钥的 SSH 连接将无法通过身份认证
- 删除操作不可撤销

:::warning
删除 SSH Key 前，请确保没有依赖该 Key 的 Git 仓库操作或 DevEnv 连接，否则将导致连接中断。
:::

---

## 使用场景

### 场景一：Git 仓库操作

添加 SSH Key 后，可以通过 SSH 协议对 Moha 模型仓库进行 Git 操作：

```bash
# 克隆模型仓库
git clone git@moha.your-domain:org/model-name.git

# 推送变更
cd model-name
git add .
git commit -m "update model files"
git push origin main
```

### 场景二：开发环境连接

在 Rune 的 DevEnv（远程开发环境）中，SSH Key 用于建立安全的 SSH 隧道连接：

```bash
# 通过 SSH 连接到远程开发环境
ssh user@devenv-hostname -p 22
```

### 场景三：多设备管理

为每台开发设备创建独立的 SSH Key，便于管理：

| 设备 | Key 名称 | 用途 |
|------|----------|------|
| 工作笔记本 | MacBook-Work | 日常开发 |
| 个人电脑 | Desktop-Home | 个人项目 |
| CI/CD 服务器 | CI-Server | 自动化构建 |

在不再使用某台设备后，仅需删除对应的 SSH Key，不影响其他设备。

---

## SSH 连接测试

添加 SSH Key 后，可以通过以下命令测试连接是否正常：

```bash
# 测试 SSH 连接
ssh -T git@moha.your-domain
```

如果连接成功，应看到欢迎信息。如果失败，请检查：

1. 本地私钥是否在默认路径（`~/.ssh/`）
2. 公钥是否已正确添加到平台
3. SSH Agent 是否已加载私钥（`ssh-add -l` 查看）

```bash
# 将私钥添加到 SSH Agent
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519
```

---
