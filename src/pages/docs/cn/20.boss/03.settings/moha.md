---
title: 魔哈Hub设置
updated: '2026-09-12'
description: '魔哈Hub 展示配置与空间配置——Logo、标题、描述、基础域名与 TLS 证书。'
tags:
  - boss
  - settings
---

## 功能简介

Moha 设置维护魔哈Hub（Moha）在控制台中的展示信息，以及 Moha 空间的域名与 TLS 配置。页面包含两张配置卡：**魔哈Hub配置** 与 **空间配置**。

本页对应 BOSS 控制台「平台管理 → **魔哈Hub设置**」（菜单文案取自 `navbar.moha_setting`）。

## 进入路径

BOSS 控制台 → 平台管理 → **魔哈Hub设置**

前端真实路由：`/settings/moha`

## 魔哈Hub配置

| 界面标签 | 字段 | 类型 | 约束 | 说明 |
|---------|------|------|------|------|
| （Logo 上传） | `moha.logo` | 图片上传 | 最大 **128 KB**，仅 **PNG / SVG** | 以 Base64 存储 |
| 产品标题 | `moha.title` | 文本 | 最大 **10 个字符** | 导航栏标题 |
| 产品描述 | `moha.description` | 多行文本 | 最大 **100 个字符**，4 行 | 产品简介 |

> ⚠️ 注意: 「产品标题」的字段名是 **`moha.title`**（界面标签为 `navbar_title`），不是 `navbar_title` 字段。

写入的配置结构：

```yaml
moha:
  logo: "data:image/svg+xml;base64,PHN2ZyB..."
  title: "Moha"
  description: "模型、数据集与镜像托管服务简介"
```

接口：`PUT /api/iam/global-config`。

## 空间配置

空间配置独立于展示配置，保存到 Moha 全局配置（`PUT /api/moha/global-config`）。

| 界面标签 | 字段 | 类型 | 必填 | 默认值 | 说明 |
|---------|------|------|------|--------|------|
| 基础域名 | `space.base` | 文本 | ✅ | 空 | 例如 `develop.xiaoshiai.cn` |
| 启用TLS | `space.tlsEnabled` | 开关 | — | 关闭 | 开启后必须同时填写证书与私钥 |
| TLS证书 | `space.tlsCert` | 多行文本 | 条件必填 | 空 | PEM 格式证书 |
| TLS私钥 | `space.tlsKey` | 多行文本 | 条件必填 | 空 | PEM 格式私钥 |

校验规则：

- `base` 去除首尾空格后不能为空
- 开启 TLS 时，证书与私钥都必须填写
- 证书与私钥**只能同时填写或同时留空**，只填其中一个会报错
- 提交前会对全部字段做 `trim()`

```yaml
space:
  base: "develop.xiaoshiai.cn"
  tlsEnabled: true
  tlsCert: "-----BEGIN CERTIFICATE-----\n...\n-----END CERTIFICATE-----"
  tlsKey: "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"
```

> ⚠️ 注意: 两张卡片各自独立保存，保存魔哈Hub配置不会影响空间配置，反之亦然。

## 接口

| 接口 | 方法 | 说明 |
|------|------|------|
| `/api/iam/global-config` | `PUT` | 保存魔哈Hub展示配置 |
| `/api/moha/global-config` | `GET` / `PUT` | 读取 / 保存空间配置 |

## 权限要求

需要 **系统管理员** 角色。
