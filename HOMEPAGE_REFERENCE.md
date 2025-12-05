# 首页设计快速参考

## 🎯 核心组件

| 组件 | 文件 | 功能 |
|-----|------|------|
| Hero | `hero.tsx` | 首屏展示，产品卡片 |
| Capabilities | `capabilities.tsx` | 产品能力总览 |
| Quick Start | `quick-start.tsx` | 三步上手指南 |
| Solutions | `solutions.tsx` | 解决方案展示 |
| Resources | `resources.tsx` | 生态资源入口 |
| Community | `community.tsx` | 社区活动预告 |
| CTA | `cta.tsx` | 行动号召区块 |

## 🎨 品牌色系

```typescript
const BRAND_COLORS = {
  moha: '#00A76F',  // 魔哈仓库 - 绿色
  rune: '#1877F2',  // Rune - 蓝色
  boss: '#7635DC',  // BOSS - 紫色
};
```

## 📐 布局规则

### 间距
- 区块上下间距：`py: { xs: 8, md: 12 }`
- 卡片间距：`gap: { xs: 2, md: 3 }`
- 内容间距：`spacing: 2` 或 `spacing: 3`

### 响应式断点
- **xs (0px+)**: 移动端，单列
- **md (900px+)**: 桌面端，3列网格

### 网格配置
```typescript
gridTemplateColumns: { 
  xs: '1fr',              // 移动端单列
  md: 'repeat(3, 1fr)'    // 桌面端三列
}
```

## 🎬 动画变体

```typescript
// 从上淡入
<m.div variants={varFade('inDown')}>

// 从下淡入  
<m.div variants={varFade('inUp')}>

// 包裹容器
<Container component={MotionViewport}>
```

## 🖱️ 悬停效果

### 卡片上升
```typescript
'&:hover': {
  transform: 'translateY(-4px)',
  boxShadow: theme.customShadows.z16,
}
```

### 卡片右移
```typescript
'&:hover': {
  transform: 'translateX(4px)',
  boxShadow: theme.customShadows.z12,
}
```

## 🎨 渐变模式

### 背景渐变
```typescript
background: `linear-gradient(135deg, 
  ${alpha(color1, 0.02)} 0%, 
  ${alpha(color2, 0.08)} 100%)`
```

### 文字渐变
```typescript
background: `linear-gradient(135deg, 
  ${theme.palette.primary.main}, 
  ${theme.palette.secondary.main})`,
backgroundClip: 'text',
WebkitBackgroundClip: 'text',
color: 'transparent'
```

### 按钮渐变
```typescript
background: `linear-gradient(135deg, 
  ${color}, 
  ${alpha(color, 0.8)})`
```

## 🔧 常用主题值

### 阴影
- `theme.customShadows.z4` - 默认
- `theme.customShadows.z8` - 按钮
- `theme.customShadows.z12` - 悬停浅
- `theme.customShadows.z16` - 悬停中
- `theme.customShadows.z20` - 悬停深

### 圆角
- 小元素：`borderRadius: 1.5` (12px)
- 卡片：`borderRadius: 2` (16px)

### 过渡
```typescript
transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
```

## 📋 组件清单

### Hero 区块
- [ ] 渐变背景 + 径向装饰
- [ ] 大标题渐变文字
- [ ] 双 CTA 按钮
- [ ] 三个产品卡片
- [ ] 彩色顶部装饰条
- [ ] 图标容器背景

### 产品卡片
- [ ] 专属品牌色
- [ ] 图标 + 标题 + 描述
- [ ] 标签/高亮功能
- [ ] 悬停动画

### 按钮样式
- [ ] 主按钮：实心，主色
- [ ] 次按钮：边框，透明
- [ ] 渐变按钮：品牌色渐变

## 🔍 调试技巧

### 查看动画
```typescript
// 临时禁用动画
const varFade = () => ({});
```

### 查看边界
```typescript
sx={{ 
  border: '1px solid red',  // 临时边框
  ...otherStyles 
}}
```

### 测试响应式
- Chrome DevTools: Toggle device toolbar
- 测试断点: 320px, 768px, 1024px, 1440px

## 📦 依赖版本

```json
{
  "react": "^19.0.0",
  "framer-motion": "^11.15.0",
  "@mui/material": "^6.1.9",
  "vite": "^6.3.5"
}
```

## 🚀 快速命令

```bash
# 开发
yarn dev

# 类型检查
yarn tsc --noEmit

# Lint
yarn lint

# 格式化
yarn fm:check
yarn fm:write

# 构建
yarn build
```

## 📝 提交前检查

- [ ] `yarn lint` 通过
- [ ] `yarn tsc --noEmit` 通过
- [ ] `yarn build` 成功
- [ ] 移动端显示正常
- [ ] 桌面端显示正常
- [ ] 动画流畅
- [ ] 无控制台错误

## 🔗 相关文档

- [HOMEPAGE_DESIGN.md](./HOMEPAGE_DESIGN.md) - 详细设计说明
- [HOMEPAGE_VISUAL.md](./HOMEPAGE_VISUAL.md) - 视觉效果说明
- [HOMEPAGE_SUMMARY.md](./HOMEPAGE_SUMMARY.md) - 完成总结
- [copilot-instructions.md](./.github/copilot-instructions.md) - 仓库指令

## 💡 最佳实践

1. **颜色**: 使用 `alpha()` 创建半透明色
2. **间距**: 使用主题的 8px 网格系统
3. **动画**: 保持在 240-360ms 之间
4. **响应式**: 优先使用 Grid 和 Flexbox
5. **类型**: 所有组件保持类型安全
6. **可访问性**: 添加 aria-label 和语义化标签

## 🎓 学习资源

- [MUI 文档](https://mui.com/)
- [Framer Motion 文档](https://www.framer.com/motion/)
- [React Router 文档](https://reactrouter.com/)
- [Vite 文档](https://vitejs.dev/)
