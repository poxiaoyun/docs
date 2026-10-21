# 同步一轮的核对清单

按顺序勾，任何一项不通过都不提 PR。

## A. 写之前

- [ ] `docs` 仓库干净：`git status --short` 为空，且已在 `main` 且 `git pull --ff-only` 过
- [ ] `diff-console.mjs` 输出的「需同步」提交，**逐个读过实现**（不是只读提交标题）
- [ ] 已确认每个改动对应到具体页面（`references/mapping.md` + `grep` 验证）
- [ ] 若改动涉及菜单名/URL：`toc.ts`（两侧）、`scripts/ssg.mjs`、正文内链一并检查
- [ ] 若改动涉及新功能：判断是「补一节」还是「新开一页」，新开页要同时在两侧 `toc.ts` 加条目

## B. 页面内容

- [ ] `cn` 与 `en` 同路径成对（`comm -3` 输出为空）
- [ ] frontmatter 有 `title`；`description` 里含冒号时**整段加双引号**（否则该页线上是「Documentation not found」）
- [ ] 数字前缀只用于排序，URL 不含前缀；`index.md` 对应目录根
- [ ] 菜单名、字段名、按钮文案与当前系统一致（截图里能对上）
- [ ] 面向小白：每个操作写到「点哪里 → 看到什么 → 填什么」，概念先用一句人话解释
- [ ] 不使用 `:::` 容器语法（渲染器不支持），提示框用项目自己的 Alert 写法
- [ ] 代码块标注语言；表格里的行内 code 不要出现裸 `|`

## C. 截图（若页面有 UI 变化）

- [ ] 截图来自**当前版本**系统，不是旧图凑数
- [ ] 尺寸 1440×900，存 `public/assets/screenshots/<产品>/<页面>-<NN>.png`
- [ ] 正文用绝对路径引用：`/assets/screenshots/rune/xxx-01.png`
- [ ] 没有引用不存在的图（SSG 会拦，但先自查更快）
- [ ] 需要登录态时用 `playwright-core` + 系统 Chrome（`channel: 'chrome'`）+ `storageState` 注入 `user_session`
- [ ] 工作空间类页面用有数据的租户（`tenant=demo` 的 `ws-0k6ocx`）；`tenant=new1` 没有工作空间，会截出空页

## D. 本地校验（五条，缺一不可）

```bash
cd <docs 仓库>

env -u NODE_OPTIONS ./node_modules/.bin/tsc --noEmit
env -u NODE_OPTIONS ./node_modules/.bin/eslint "src/**/*.{ts,tsx}"
env -u NODE_OPTIONS ./node_modules/.bin/prettier --check "src/**/*.{ts,tsx}"
python3 scripts/check-docs-consistency.py | tail -3      # 期望「合计问题: 0」
env -u NODE_OPTIONS VITE_BASE_URL=/ yarn build
```

> `env -u NODE_OPTIONS` 不是可选项：WorkBuddy 注入的 fs shim 会让 `node_modules` 里的 babel 解析失败（报 `ENOENT @babel/*`）。

构建期自检（`scripts/ssg.mjs`）会拦下：站内死链、缺失图片、sitemap 与产物集合不一致、条目缺 `lastmod`、`canonical` 不自指、`hreflang` 条数不对。任一报错都要修到 0 再继续。

容器部署还要单独跑一遍（base 不同，产物不同）：

```bash
rm -rf dist-container && cp -r dist dist-container
env -u NODE_OPTIONS VITE_BASE_URL=/docs SSG_OUT=dist-container node scripts/ssg.mjs
```

## E. 提交与发布

- [ ] 分支从最新 `main` 拉出，单个 PR 只做一件事
- [ ] PR 描述里贴：锚点 → 目标提交、改了哪些页、校验结果
- [ ] `gh pr merge <n> --squash --delete-branch`（仓库只走 squash）
- [ ] `gh run watch <id>` 等 Pages 部署 success
- [ ] 线上抽查（用无头浏览器，不要只看 curl 200）：

| 检查          | 期望                                            |
| ------------- | ----------------------------------------------- |
| 4xx 资源      | 0                                               |
| `/api/*` 请求 | 0（文档站没有 IAM）                             |
| 控制台报错    | 0                                               |
| `head`        | 1 条 canonical + 3 条 hreflang + 1 条 og:locale |
| `favicon`     | `/favicon.ico`，不是空 href                     |
| 语言          | `cn` 页 `lang=zh-CN`，`/en` 页 `lang=en`        |
| sitemap       | 条数 = 页面数，`xhtml:link` = 条数 × 3          |

## F. 收尾

- [ ] `bump-anchor.mjs` 把锚点推到本轮实际同步到的 main（同一 PR 或紧随的 PR）
- [ ] `anchor.json` 与本轮文档改动一起提交，PR 描述写明新锚点
- [ ] 工作记忆追加：range、提交数、改了哪些页、跳过原因、部署 run id
- [ ] 已合并的临时分支删掉（本地 + 远端）
