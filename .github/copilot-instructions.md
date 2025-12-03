# Rune Console – 仓库指令

## 概览
- Rune Console 是一个基于 React + TypeScript 的 mono repo，包含两个控制平面客户端：
  - **PAI（租户门户）**：位于 `src/pages/pai`，面向工作区运营人员，负责管理工作负载、实例、镜像、模板、配额、存储卷等。
  - **BOSS（平台管理门户）**：位于 `src/pages/boss`，面向平台管理员，负责集群、租户、配额、规格、系统模板、网关审核以及服务注册。
- 共享的 UI、数据钩子和工具散布在 `src/components`、`src/lib`、`src/services`、`src/context`、`src/types` 与 `src/utils` 等目录。
- 技术栈：Vite、Material UI v7、SWR、React Router v7、React Hook Form + Zod，以及基于 `react-i18next` 的多语言能力。

## 工具链与常用命令
- **Node.js 20+** 与 **pnpm 10.15**（`packageManager` 已固定）是基础环境。
- 克隆或变更依赖后务必执行 `pnpm install`。
- 常用脚本：
  - `pnpm dev`：启动 Vite 开发服，默认平台为 PAI，可用 `VITE_PLATFORM` 切换。
  - `pnpm build`：运行 tsc 类型检查并产出默认平台的生产包。
  - `pnpm build:boss`：以 `VITE_PLATFORM=boss` 构建管理端 Shell，涉及 BOSS 代码改动时必跑以发现平台特定回归。
  - `pnpm test`：执行位于 `src/**/*.test.ts(x)` 的 Vitest 测试。
  - `pnpm lint` / `pnpm lint:fix`：ESLint（含 TypeScript、import、perfectionist、unused-imports 插件）。
  - `pnpm fm:check` / `pnpm fm:fix`：Prettier 样式检查与修复。
  - `pnpm fix:all`：一次性跑 lint + format 的便捷命令。
- 推荐的提交流水：`pnpm lint && pnpm test && pnpm build`，若改动命中 BOSS 再追加 `pnpm build:boss`。

## Lint 规则速查
- 仓库使用 ESLint + `eslint-plugin-import` + `eslint-plugin-perfectionist` + `eslint-plugin-unused-imports`，`pnpm lint` 会在 CI 与 pre-commit 中跑，请提前处理本地告警。
- `perfectionist/sort-imports` 要求 import 分组后按 source 字符串升序排列，并在分组之间插入空行。分组顺序为：样式 / 副作用 / Type-only imports / 内置与外部包 / `@mui/*` / `src/routes/*` / `src/hooks/*` / `src/utils/*` / 其他 `src` 内部模块 / `src/components/*` / `src/sections/*` / `src/auth/*` / `src/types/*` / 相对路径（parent/sibling/index） / object / unknown。手动新增 import 时请直接放到对应分组位置，避免事后大规模 reorder。
- `import/newline-after-import` 需要在 import 块和正文之间保留一行空行；插入新 import 时记得保留这个空行。
- `unused-imports/no-unused-imports` 会对任何未使用的 import 报错，若变量仅用于类型占位可以改名为 `_Foo` 或直接删除。
- `perfectionist/sort-named-imports` 会根据长度排序花括号内的成员，新增命名导入时保持升序或运行 `pnpm exec eslint --fix path/to/file.tsx` 让工具处理。
- 触发 lint 报错时优先运行 `pnpm exec eslint --fix <file>`，无法自动修复再手动调整，可避免在后期投入额外时间。

## 自动化与 Git 约定
- Husky pre-commit 钩子会触发 `pnpm lint-staged`，即对已暂存的 TS/TSX 跑 ESLint，对样式块跑 stylelint；提交前务必修干净。
- 已配置 Commitizen/commitlint，可使用 `pnpm cz` 获取标准化提交模版。
- GitHub Actions 位于 `.github/workflows/`，流水线会运行 pnpm 的 lint/build/test；本地保持同样的脚本组合以确保 CI 通过。

## 目录速查
- `src/pages/pai/**`：租户端页面，通常串联 region/tenant/workspace 上下文，并依赖 `paths.pai`。
- `src/pages/boss/**`：管理端页面，挂载在 `DashboardLayout`，导航配置来自 `src/routes/navs/boss.tsx`。
- `src/pages/account/**`：账户相关页面，PAI 与 BOSS 共享。
- `src/routes/`：路由对象、懒加载入口、导航定义及 `paths.ts` 工具；新增页面需同步维护 PAI 与 BOSS 的路由树。
- `src/services/**`：基于 `Request<T>` 的类型化 API 客户端。新接口需在此声明，并通过 `src/lib/request.ts` 中的 `useFetch` / `useCacheFetch` 使用。
- `src/lib/request.ts`：自定义数据层，封装 SWR 缓存、变更、错误处理。禁止直接发 `fetch`/`axios`。
- `src/components/**`：共享 UI 组件（表格、对话框、Schema Form 等），优先扩展现有组件而非重复造轮子。
- `src/theme/**`、`src/global-config.ts`、`src/settings/**`：全局主题、运行时配置、功能开关。
- `src/locales/**`：多语言 JSON 及 Provider。新增文案必须同时更新 `langs/en` 与 `langs/cn`，并通过 `useTranslation` 取值。

## 编码规范
- 全量 TypeScript，新增文件使用 `.ts/.tsx` 并尽量定义明确类型；按严格模式思维编码，非必要不使用 `any`。
- React 组件均为函数式，副作用放在 `useEffect`，必要时 memo 化回调/值。
- 样式优先使用 MUI `sx` 与主题 token，全局 CSS 仅限 `global.css`。
- 表单统一用 `react-hook-form` + Zod 解析（参考 `src/components/hook-form`）。
- 数据请求：GET/SWR 流程使用 `useCacheFetch`，变更使用 `useFetch`；列表须刷新时调用 `refresh()` 或 `trigger` 并传 `{ reload: true }`。
- 路由跳转：使用 `paths.pai.*` / `paths.boss.*` 与 `RouterLink`，新增页面别忘了同步 `src/routes/navs`。
- 文案：禁止硬编码，所有文案都要落到 `src/locales/langs/en|cn` 并引用 key。
- Service：REST 定义集中在 `src/services/<domain>.ts`，导出类型化方法供页面/Hook 复用。
- 测试：Vitest 用例紧邻源文件（`foo.test.ts`），单独运行可用 `pnpm test -- run`。

## PR 前自检清单
1. `pnpm lint` 与 `pnpm fm:check` 无报错。
2. `pnpm test` 全绿或同步更新相关用例。
3. `pnpm build` 成功；若动到 BOSS，再跑 `pnpm build:boss`。
4. 所有新增文案已在中英文包中补齐。
5. 新增 API 已在 `src/services` 建立封装，并在调用端说明配置需求。
6. 新增页面或路由同步更新 PAI/BOSS 的 paths 与 nav。
7. 本地跑过 Husky（`pnpm lint-staged`）确保暂存文件可通过。

## 遇到疑问时
- 优先查阅本文件；若无对应指引再检索仓库。
- 复用 `src/components`、`src/context`、`src/lib` 等现有抽象，避免出现双实现。
- 倾向增量迭代而非大改，PAI 与 BOSS 共用大量基础设施，大改容易引入回归。
