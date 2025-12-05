# Markdown 提示框组件使用指南

在文档中，您可以使用简洁的 HTML 标签来创建不同类型的提示框。

## 基本语法

```markdown
<div data-alert="类型">

提示内容

</div>
```

**注意**：`<div>` 标签前后需要空行，内容前后也需要空行，这样 Markdown 才能正确解析。

## 支持的类型

### 1. info（信息提示 - 蓝色）

```markdown
<div data-alert="info">

这是一条信息提示。用于一般性的说明和注意事项。

</div>
```

### 2. success（成功提示 - 绿色）

```markdown
<div data-alert="success">

操作已成功完成！用于显示成功消息和正面反馈。

</div>
```

### 3. warning（警告提示 - 黄色）

```markdown
<div data-alert="warning">

请注意！这是一个警告信息，需要特别关注。

</div>
```

### 4. error（错误提示 - 红色）

```markdown
<div data-alert="error">

发生错误！用于显示错误信息和严重问题。

</div>
```

### 5. tip（技巧提示 - 青色）

```markdown
<div data-alert="tip">

这是一个小技巧，可以帮助您更好地使用功能。

</div>
```

## 自定义标题

您可以通过 `data-alert-title` 属性添加自定义标题：

```markdown
<div data-alert="warning" data-alert-title="重要提示">

这里使用了自定义标题"重要提示"，而不是默认的"警告"。

</div>
```

```markdown
<div data-alert="info" data-alert-title="安装说明">

本工具默认不安装显卡驱动。请在目标主机上自行安装符合要求的 GPU 驱动。

</div>
```

## 多段落内容

提示框内可以包含多个段落和其他 Markdown 元素：

```markdown
<div data-alert="tip" data-alert-title="最佳实践">

在使用前请注意以下几点：

1. 检查系统要求
2. 备份重要数据
3. 遵循安全规范

更多信息请参考[官方文档](/docs)。

</div>
```

## 实际示例

### 示例1：安装说明

```markdown
<div data-alert="info">

本工具默认不安装显卡驱动。由于离线环境显卡驱动和版本要求难以统一控制，安装过程不包含驱动安装。请在目标主机上自行安装符合要求的 GPU 驱动。

</div>
```

### 示例2：操作警告

```markdown
<div data-alert="warning" data-alert-title="数据安全">

删除操作不可恢复，请在执行前确认已备份重要数据。

</div>
```

### 示例3：成功反馈

```markdown
<div data-alert="success">

模型训练已完成！准确率达到 95.2%，可以开始部署了。

</div>
```

### 示例4：错误提示

```markdown
<div data-alert="error">

连接失败！请检查网络设置或联系管理员。

</div>
```

### 示例5：使用技巧

```markdown
<div data-alert="tip">

使用 Ctrl+S 可以快速保存当前编辑内容。

</div>
```

## 注意事项

1. `<div>` 标签必须单独占一行
2. 标签前后必须有空行
3. 内容前后也必须有空行，这样才能正确解析 Markdown
4. `data-alert` 属性值必须是小写（info, success, warning, error, tip）
5. 提示框内可以使用任何 Markdown 语法（列表、链接、代码等）

## 颜色方案

| 类型    | 颜色   | 边框色  | 背景色  | 用途                   |
| ------- | ------ | ------- | ------- | ---------------------- |
| info    | 蓝色   | #1890ff | #e6f7ff | 一般信息、说明         |
| success | 绿色   | #52c41a | #f6ffed | 成功消息、正面反馈     |
| warning | 黄色   | #faad14 | #fffbe6 | 警告信息、需要注意     |
| error   | 红色   | #ff4d4f | #fff2f0 | 错误信息、严重问题     |
| tip     | 青色   | #13c2c2 | #e6fffb | 使用技巧、最佳实践     |

## 代码块复制按钮

所有 fenced code block 自动显示复制按钮：

- 鼠标悬停在代码块时，右上角显示复制按钮
- 点击按钮复制代码到剪贴板
- 复制成功后显示"已复制!"提示
- 无需额外配置，自动生效

## 相关文件

- `src/components/markdown/alert-box.tsx` - 提示框组件
- `src/components/markdown/code-block.tsx` - 代码块复制按钮组件
- `src/components/markdown/markdown.tsx` - Markdown 渲染主组件
- `src/components/markdown/remark-alerts.ts` - Remark 插件（预留）
