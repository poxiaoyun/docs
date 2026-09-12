---
title: 货币配置
updated: '2026-09-12'
description: '配置模型价格的展示币种与人民币兑美元汇率。'
tags:
  - boss
  - gateway
---

## 功能简介

币种设置决定网关在展示价格与费用时使用的货币，以及人民币兑美元（CNY → USD）的换算汇率。模型元数据中的价格统一以 CNY / 1M Tokens 存储，展示时按本页配置换算。

本页对应 BOSS 控制台「大模型网关 → 平台设置 → **货币配置**」（菜单文案取自 `navbar.currency_settings`）。

## 进入路径

BOSS 控制台 → 大模型网关 → 平台设置 → **货币配置**

前端真实路由：`/gateway/currency-settings`

## 配置项

| 配置项 | 字段 | 类型 | 默认值 | 说明 |
|--------|------|------|--------|------|
| 货币显示模式 | `displayCurrency` | 选择 | `CNY` | 可选 `CNY` / `USD` |
| 美元汇率 | `cnyToUsdRate` | 文本 | `0.14` | 人民币兑美元汇率，精确到小数点后 2 位 |

> 💡 提示: 汇率的展示文案为「美元汇率」，字段名是 `cnyToUsdRate`。后端使用定点整数换算，避免浮点误差。

保存成功后提示「货币设置已保存」，并重新拉取配置。

## 与其他模块的关系

- 模型费用在 [模型元数据](/boss/gateway/model-metadata) 中维护
- [调用日志](/boss/gateway/audit) 里的费用列与 [运营概览](/boss/gateway/operations) 的 Token / 费用指标都按本页的币种设置换算展示

## 权限要求

需要 **系统管理员** 角色。
