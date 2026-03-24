---
title: '个人访问令牌'
updated: '2026-03-23'
---

## 功能简介

个人访问令牌（Token）是 Moha 中用于 **Git 操作和 API 调用** 的身份验证凭据。在执行 Git clone、push、pull 等操作时，您需要使用个人令牌进行身份验证，替代传统的用户密码方式。Moha 的 Token 页面提供了一键获取和复制当前用户令牌的功能。

### Token 在 Moha 中的角色

```mermaid
graph TB
    User["👤 用户"]

    User --> Token["🔑 个人访问令牌<br/>getToken()"]

    Token --> Git["Git 操作"]
    Token --> API["API 调用"]

    Git --> Clone["git clone"]
    Git --> Push["git push"]
    Git --> Pull["git pull"]

    API --> REST["REST API 访问<br/>Authorization: Bearer TOKEN"]

    subgraph IAM
        IAMToken["IAM 认证令牌"]
    end

    IAMToken -.->|"底层认证"| Token
```

## 进入路径

Moha → 个人头像菜单 → **Token**

## Token 概述

![Token 页面](/assets/screenshots/console/moha-token.png)

Token 页面展示当前登录用户的认证令牌信息。页面核心功能是通过 相关操作 方法获取当前用户的有效认证令牌，并提供便捷的复制功能。

### 页面内容

| 元素 | 说明 |
|------|------|
| 令牌值 | 当前用户的认证令牌（脱敏显示） |
| 复制按钮 | 一键复制令牌到剪贴板 |
| 使用说明 | 令牌的用途和使用方式说明 |

:::tip
Token 页面显示的令牌与您当前的登录会话关联。每次访问该页面都可以获取到最新有效的令牌。
:::

## Token 与 IAM 令牌的关系

Moha 的个人访问令牌与系统的 IAM（身份与访问管理）认证体系紧密关联：

| 特性 | Moha Token | IAM Token |
|------|------------|-----------|
| 来源 | 通过 相关操作 获取 | IAM 认证系统签发 |
| 用途 | Moha Git 操作、API 调用 | 全平台认证 |
| 关系 | 基于 IAM Token 衍生 | 底层认证基础 |
| 管理位置 | Moha → Token 页面 | IAM → 安全设置 |

```mermaid
sequenceDiagram
    participant User as 用户
    participant Moha as Moha Token 页面
    participant IAM as IAM 认证系统
    participant Git as Git 仓库

    User->>Moha: 访问 Token 页面
    Moha->>IAM: getToken() 获取令牌
    IAM-->>Moha: 返回有效令牌
    Moha-->>User: 展示令牌 & 提供复制

    User->>Git: git clone (携带 Token)
    Git->>IAM: 验证 Token
    IAM-->>Git: 认证通过
    Git-->>User: 克隆成功
```

:::tip
如果您需要管理更细粒度的 API 密钥和令牌生命周期，请前往 [IAM 安全设置](../iam/security)。
:::

## 使用 Token 进行 Git 操作

### 克隆仓库

```bash
# 克隆模型仓库
git clone https://your-username:YOUR_TOKEN@moha.your-domain/org-name/model-name.git

# 克隆数据集仓库
git clone https://your-username:YOUR_TOKEN@moha.your-domain/org-name/dataset-name.git
```

### 推送更改

```bash
# 进入仓库目录
cd model-name

# 添加并提交更改
git add .
git commit -m "Update model weights"

# 推送到远程仓库
git push origin main
```

### 拉取最新内容

```bash
# 拉取远程最新更改
git pull origin main
```

### 配置 Git 凭据缓存

为了避免每次操作都输入 Token，可以配置 Git 凭据缓存：

```bash
# 缓存凭据 1 小时（3600 秒）
git config --global credential.helper 'cache --timeout=3600'

# 或者将凭据保存到磁盘（注意安全风险）
git config --global credential.helper store
```

:::warning
使用 `credential.helper store` 会将令牌以明文形式保存在磁盘上。在共享或不安全的环境中，建议使用 `cache` 方式或 macOS Keychain / Windows Credential Manager。
:::

### 配置仓库远程地址

如果仓库已经克隆但需要更新 Token：

```bash
# 查看当前远程地址
git remote -v

# 更新远程地址（包含新 Token）
git remote set-url origin https://your-username:NEW_TOKEN@moha.your-domain/org-name/repo-name.git
```

## 使用 Token 进行 API 调用

除了 Git 操作，Token 也可用于直接调用 Moha 的 REST API：

```bash
# 获取模型仓库文件列表
curl -H "Authorization: Bearer YOUR_TOKEN" \
  https://moha.your-domain/api/moha/organizations/org-name/models/model-name/contents/main/

# 获取 README 内容
curl -H "Authorization: Bearer YOUR_TOKEN" \
  https://moha.your-domain/api/moha/organizations/org-name/models/model-name/readme

# 获取分支和标签列表
curl -H "Authorization: Bearer YOUR_TOKEN" \
  https://moha.your-domain/api/moha/organizations/org-name/models/model-name/refs

# 收藏模型
curl -X POST -H "Authorization: Bearer YOUR_TOKEN" \
  https://moha.your-domain/api/moha/organizations/org-name/models/model-name/favorite
```

## Token 安全最佳实践

### 安全准则

| 准则 | 说明 |
|------|------|
| 不要硬编码 | 不要将 Token 直接写入代码或配置文件中提交到版本控制 |
| 使用环境变量 | 通过环境变量传递 Token |
| 定期轮换 | 定期更新 Token，降低泄露风险 |
| 最小权限 | 仅授予必要的访问权限 |
| 及时撤销 | 怀疑 Token 泄露时，立即重新生成 |

### 通过环境变量使用 Token

```bash
# 设置环境变量
export MOHA_TOKEN="your-token-here"

# 在 Git 操作中使用
git clone https://your-username:${MOHA_TOKEN}@moha.your-domain/org-name/model-name.git

# 在 API 调用中使用
curl -H "Authorization: Bearer ${MOHA_TOKEN}" \
  https://moha.your-domain/api/moha/organizations/org-name/models/model-name/readme
```

### 在 CI/CD 中使用 Token

```yaml
# 示例：GitHub Actions
- name: Clone Moha Model
  run: |
    git clone https://ci-user:${{ secrets.MOHA_TOKEN }}@moha.your-domain/org/model.git
```

:::warning
Token 的安全性等同于您的账户密码。泄露 Token 可能导致未授权访问您的私有资源。请务必妥善保管，不要在公开渠道（如公开仓库、聊天群）中分享。
:::

## 常见问题

### Token 无效或过期怎么办？

重新访问 Moha Token 页面，系统会通过 相关操作 获取最新的有效令牌。复制新令牌后更新您的 Git 配置或脚本。

### 可以创建多个 Token 吗？

Moha Token 页面展示的是基于当前会话的认证令牌。如果您需要管理多个独立的 API 密钥，请前往 [IAM API Key 管理](../iam/api-key) 创建和管理。

### Token 与 SSH Key 有什么区别？

| 方式 | 协议 | 管理位置 | 适用场景 |
|------|------|----------|----------|
| Token | HTTPS | Moha Token 页面 | Git clone/push、API 调用 |
| SSH Key | SSH | [IAM SSH Key](../iam/ssh-key) | Git clone/push（SSH 协议） |

:::tip
如果您习惯使用 SSH 协议进行 Git 操作，可以在 IAM 中配置 SSH Key。Token 方式更适合 HTTPS 协议和 API 调用场景。
:::
