# 数字孪生

本目录描述 Rune 机房数字孪生（仓库 `rune-digital-twin`）接入平台的方案。数字孪生把 cloud 纳管的每个集群呈现为一个机房，
用台账编排机柜与整机，并用平台的节点、指标和告警点亮 3D 场景。

> 状态：**已实现于各仓 `twin` 分支，未合入 `main`**（2026-10-16；真实集群端到端、PromQL 真实语义、网关 cookie 与 `/twin/` 路径行为未验证，见[实施计划进度表](implementation-plan.md#进度)）。

## 文档列表

- [需求](requirements.md)
- [设计](design.md)：唯一权威设计，包含已确认决策、接口契约和监控查询集合
- [部署](deploy.md)：把当前系统 Chart 装进已经运行的 Rune 平台
- [实施计划](implementation-plan.md)：按仓库拆分的开发任务卡
- [节点硬件与机房环境监控研究](../../../specification/research/node-hardware-monitoring.md)：新采集端提案

## 产品功能

| 功能 | 用户价值 |
| ---- | -------- |
| 多机房 | 一个 cloud 集群对应一个机房，按机房隔离与汇总 |
| 程序化 3D | 机房、机柜、整机与部件由台账生成，无需美术模型 |
| 运行状态 | GPU、节点、网络、磁盘指标经平台 Prometheus 透传映射到指示灯 |
| 台账编排 | 管理员维护机柜、上架位置和资产字段，平台事实只读 |
| 授权与权限 | 复用平台登录，按 IAM 角色区分查看与管理，按 License 产品 `DigitalTwin` 授权 |

## 涉及仓库

| 仓库 | 改动 |
| ---- | ---- |
| `rune-digital-twin` | 服务端改为后端代理层、多机房台账、平台数据源、登录与 License 校验 |
| `iam` | bootstrap 预注册应用 `rune-digital-twin` 与两个系统角色 |
| `apiserver` | 注册 `digital-twin` 服务路由、新增产品授权查询接口、新增 License 拦截规则 |
| `license` | 签发模板新增产品 `DigitalTwin` |
| `specification` | 新采集端研究提案（不改现有契约） |
