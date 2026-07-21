# Rune 共享算力调度文档

本目录收敛 `rune` 共享算力调度相关的原始需求、使用方式和实现设计。

文档必须按以下顺序阅读和维护：

```text
原始需求：使用方为什么需要这项能力
  -> 使用方式：能力如何出现在界面和操作流程中
  -> 产品与技术设计：如何抽象并映射到调度后端
```

不应从 Volcano Queue、PodGroup、PriorityClass 等底层对象反推普通用户界面。

## 文档列表

- [原始需求](requirements.md)
- [使用方式和界面](usage.md)
- [产品抽象与后端设计](design.md)

## 组织原则

调度产品能力不直接暴露 Volcano、Kueue 或其他后端的底层对象作为用户主入口。文档组织遵循：

- 需求文档只描述角色、问题、业务目标和产品边界，不预设后端对象。
- 使用文档说明用户看到什么、如何操作、系统如何解释结果。
- 设计文档根据已经确认的使用方式抽象中立产品模型。
- 最后才说明中立模型如何映射到 Volcano、Kueue 或其他后端。

当前首期结论：不改变现有 Instance JSON Schema 契约。Chart 在任意资源配置位置声明 `x-resource-enum: flavors`；控制台在该 Flavor 选择器中先用 ResourcePool 筛选规格，用户最终只提交 Flavor ID；Rune 在原 values 路径注入服务端控制的 Flavor 数据，Helm Chart 自行消费和渲染。Queue 必须使用独立 schema 扩展显式声明，不能从 Flavor 路径推导。
