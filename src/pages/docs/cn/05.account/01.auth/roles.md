---
title: '角色与权限'
updated: '2026-09-12'
description: 角色串、前端权限字符串派生规则，以及权限判定（can / hasRole）。
---

## 功能简介

平台的访问控制基于角色（RBAC）。前端在登录后拉取当前用户的角色列表，再据此在本地派生出一组权限字符串，用于控制菜单与操作按钮的显示。真正的安全控制仍由后端 API 保障。

## 角色数据

角色通过 `GET /api/iam/current/roles` 获取，返回类型为 `CurrentRole`，即 `UserRole[]`：

| 字段 | 说明 |
|------|------|
| `name` | 用户名 |
| `tenant` | 该角色所属租户（可选） |
| `workspace` | 该角色所属工作空间（可选） |
| `cluster` | 集群标识（可选） |
| `roles` | 角色串数组 |
| `description` | 描述（可选） |

代码中明确出现的角色串枚举为（`src/types/tenant.ts:18-22`）：

| 角色串 | 含义 |
|--------|------|
| `admin` | 管理员 |
| `developer` | 开发者 |
| `member` | 成员 |

## 权限字符串的派生

> ⚠️ 注意: 代码中**没有** `/permissions` 接口，前端用 `generatePermissionsFromRoles` 从角色列表**在本地模拟生成**权限字符串（`src/auth/authz/context.tsx:32-85`，注释写明「后端暂无 /permissions API 时使用」）。后端真实的权限契约本文档暂未确认。

派生规则（按角色串与作用域）：

| 条件 | 生成的权限字符串 |
|------|------------------|
| `admin` 且无 `tenant`、无 `workspace` | `*:*` |
| `admin` 且有 `tenant`、无 `workspace` | `workspace:*`、`member:*`、`quota:*`、`instance:*`、`image:*`、`template:*`、`volume:*` |
| `developer` 且有 `tenant` | `workspace:list`、`workspace:get`、`instance:*`、`image:list`、`image:get`、`template:list`、`template:get` |
| `member` 且有 `tenant` | `workspace:list`、`workspace:get`、`instance:list`、`instance:get`、`image:list`、`image:get` |

最终结果会去重。可见：

- 无租户/工作空间作用域的 `admin` 被前端视为系统管理员（等价于拥有全部权限）
- 租户内的 `admin` 拥有该租户内工作空间/成员/配额/实例/镜像/模板/存储卷的权限
- `developer` 拥有实例的完整权限，其余资源以查看为主
- `member` 为只读类权限

## 权限判定

权限上下文提供以下方法（`src/auth/authz/types.ts`）：

| 方法 | 说明 |
|------|------|
| `can(action, resource, service?)` | 判断单个权限 |
| `canAll(checks)` | 全部满足（AND） |
| `canAny(checks)` | 任一满足（OR） |
| `hasRole(role, scope?)` | 判断是否拥有某角色，`scope` 可指定 `{ tenant, workspace }` |
| `refresh()` | 重新拉取角色 |

`can` 的匹配逻辑（`context.tsx:153-167`）：

1. 若权限列表含 `*:*` → 通过
2. 若含 `${resource}:*` → 通过
3. 否则要求精确匹配 `${resource}:${action}`，或带服务前缀的 `${service}:${resource}:${action}`

`PermissionCheck` 结构为 `{ action, resource, service? }`。

`hasRole` 的逻辑（`context.tsx:182-200`）：若存在无租户/无工作空间作用域的 `admin`，则对任意角色查询都返回真；否则要求角色串匹配，且当传入 `scope.tenant` / `scope.workspace` 时作用域一致。

> ⚠️ 注意: `can` 不支持 `a/b` 这种多 action 写法，也不支持 `service:*` 这类带服务前缀的通配符；相关权限表达式示例在本页不再列举。

## 前端落地方式

- `usePermission()`：编程式判断，返回 `{ can, canAll, canAny, hasRole, refresh, loading }`
- `Authorized` 组件与 `permission-guard.tsx`：用于包裹需要权限控制的 UI 元素
- 角色变更后，需刷新或重新登录才会重新拉取角色

> ⚠️ 注意: 各菜单项/按钮所需的具体权限、后端如何校验权限、以及角色分配由谁执行，代码中未形成完整清单，本文档暂未确认。
