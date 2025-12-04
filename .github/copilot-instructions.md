# Rune Docs – 仓库指令

## 概览
Rune Docs 基于 React + TypeScript + Vite 搭建，囊括三大产品线与一套维护文档：
- **Rune（用户门户）**：覆盖模型开发、推理、工作负载、实例、镜像、模板、配额、存储卷等终端用户能力。
- **BOSS（平台管理门户）**：面向平台管理员，聚焦集群、租户、配额、规格、系统模板、网关审核、服务注册等运营动作。
- **魔哈广场（Moha）**：服务 AI 模型开发者，包含模型版本管理、数据集管理与社区互动模块。
- **维护文档（F&Q）**：聚合常见问题、操作指引与系统使用说明，辅助用户快速定位答案。

## 顶部栏布局
- 首页：呈现类似 ModelScope Docs 的多模块落地页（价值主张、核心能力、快速上手、资源入口），支持立即使用/查看文档等 CTA。
- 魔哈广场：聚合社区内容与场景化教程，首页需突出“模型版本”“数据集”“社区活动”等常用子栏目。
- Rune：终端用户操作指南，导航结构应与 `src/pages/docs/**/Rune` 目录保持一致，并提供面包屑辅助定位。
- BOSS：平台管理者文档，页面遵循“概述 → 操作步骤 → 常见问题”结构，便于快速获取配置流程。
- F&Q：FAQ 与故障排查入口，问题按主题归类并提供一键展开的锚点列表。
- 版本：提供稳定版、预览版与历史版本说明，每项展示发布日期和当前支持状态，切换后保留所在页面上下文。
- 语言切换：提供中文/英文切换，使用 `i18next` 维持 URL 结构一致，切换后定位到对应语言的同一文档。
- 关于我们：位于最右侧，包含团队介绍、商务合作、社区渠道链接及最新公告入口。

## 网站布局
- 首页：单页布局按 Hero → 能力总览 → 快速上手 → 解决方案/案例 → 生态资源 → 社区/活动 顺序排布，卡片与区块样式参考 ModelScope Docs 的留白与层级。
- 文档页：三栏布局（左侧目录、中心正文、右侧锚点），顶部保留产品标签及面包屑。滚动时右侧锚点保持固定，目录支持折叠/展开。
- 资源区块：公共区块使用 `src/sections` 下的复用组件，强调图标 + 描述的卡片化呈现；移动端切换为单列。
- 底部：包含版权、文档责任人、更新时间、反馈入口及外部链接。新增模块需保持色彩与栅格一致性。

## 文档主体内容
- 左侧边栏：数据源来自 `src/pages/docs/toc.tsx`，目录深度建议控制在三级，标题必须与 Markdown Frontmatter 中的 `title` 保持一致。
- 正文区域：Markdown 通过 `react-markdown` 渲染，推荐结构为“概述 → 前置条件 → 操作步骤 → 示例 → 常见问题”。代码块使用 fenced code 并在头部指明语言（如 `ts`、`bash`），以启用高亮。
- 右侧栏：自动生成 h2-h4 锚点，标题层级不得跳级；对超长文档提供“返回顶部”按钮。
- 相关资源：每篇文档尾部附带同产品线的推荐阅读列表与反馈渠道（Issue、飞书群等）。
- 元信息：Frontmatter 支持 `title`、`description`、`updated`、`author`、`tags`，缺失信息需在 PR 中说明原因。

## 自动化与 Git 约定
- Node.js 版本要求 `>=20`，包管理器固定为 `yarn@1.22.22`，禁止混用 npm/pnpm 以免 lock 文件冲突。
- 首次安装执行 `yarn install`，本地开发运行 `yarn dev`，发布前必须通过 `yarn build` 验证编译。
- 代码提交前需执行 `yarn lint`、`yarn fm:check`、`yarn tsc --noEmit`；若修改 UI，建议同时运行 `yarn start` 进行预览验证。
- Git 分支命名采用 `feature/<scope>-<desc>`、`fix/<scope>-<desc>`、`docs/<scope>-<desc>`，提交信息遵循 Conventional Commits，例如 `feat: add boss quota guide`。
- 新增静态资源需保留源文件与版权说明，图像统一压缩为 WebP 或优化后的 SVG。
- CI/发布失败时禁止强制合并，需先修复并附上验证截图或日志。

## 目录速查
- `src/pages/docs/<lang>`：Markdown 源文件，使用两位数字前缀控制排序（如 `01.introduction.md`）。
- `src/pages/docs/toc.tsx`：目录树与路由配置，新增文档时同步维护多语言版本。
- `src/layouts/docs`：文档页骨架组件，负责侧边栏、锚点栏及滚动联动逻辑。
- `src/sections`：首页与主题模块的 UI 片段，新增区块需放在此处以复用。
- `src/locales`：国际化词条，新增文案时补全中英文并维护 `langs` 目录。
- `public/assets/icons/navbar`：顶部导航图标，命名使用 `kebab-case`，引入前压缩优化。

## 编码规范
- TypeScript：启用严格模式，禁止 `any` 与未类型化的函数参数；公共类型放在 `src/types`，通用工具移至 `src/utils`。
- 组件与样式：基于 MUI + Emotion，所有颜色、字号来自 `src/theme`，禁止在组件内硬编码；布局按 8px 引导线统一。
- 交互与动效：滚动显隐使用 `framer-motion` 封装的 `MotionViewport` 等组件，动画时长控制在 240ms-360ms 内，避免频繁重排。
- 响应式：桌面端内容宽度不超过 1200px，平板/移动端开启导航折叠，确保侧边栏可滑出；优先使用 MUI Breakpoints。
- 国际化：所有可见字符串使用 `useLocales` 提供的 `t` 方法，key 命名遵循 `namespace.scope.action`；缺失翻译需在 PR 中列出待补清单。
- Markdown：列表、表格、代码块遵循 Markdown Lint 常见规则；图片引用使用相对路径并包含替代文本；表格列数超过 4 时考虑拆分章节。
- 可访问性：按钮、链接提供 `aria-label`；装饰性图片标记 `role="presentation"` 或添加描述，保持对比度符合 WCAG AA。

## PR 前自检清单
- [ ] `yarn lint`、`yarn fm:check`、`yarn tsc --noEmit`、`yarn build` 均已通过，必要时附上日志。
- [ ] Markdown/目录已同步更新，且完成所需的多语言补充或标记 TODO。
- [ ] UI 改动提供桌面与移动端截图/录屏，并与 ModelScope 风格对齐。
- [ ] 新增依赖或脚本已在 PR 描述中说明用途与影响。
- [ ] 关键页面更新已同步 head 元信息（title、description、og 标签）。
- [ ] 设计/产品评审反馈已落实并在 PR 中记录。

## 遇到疑问时
- 优先查阅本文件；若未覆盖，请检索仓库内 README、`src/pages/docs` 示例或联系文档维护人。
- 首页模块与视觉风格可参考 https://www.modelscope.cn/docs/home，新增布局需先评审再实现，并及时回写本文件。

## 最近历史变更
- 顶部导航精简为仅保留 `首页`、`魔哈广场`、`Rune`、`BOSS` 四个产品项，去除版本切换和 F&Q/About 入口，并在相同组件中先行展示云平台名；版本信息由具体文档页内部控制。
- 文档页 header 及 sidebar 现已保证遵循共享布局（`docs/layout.tsx`）并根据 pathname 过滤出当前产品内容，`DOCS_SIDEBAR_SECTIONS`/`DocsTopNavLinks` 调整了数据源与展示逻辑。
- OEM 平台名称由 `src/utils/platform-name.ts` 的 helper 提供 `VITE_OEM_NAME`，默认 `晓石云`；顶部栏中该名称使用 `Typography` 以 `2rem` 字号强调并适配设计高亮。
*** End Patch
