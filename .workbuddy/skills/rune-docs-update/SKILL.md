---
name: rune-docs-update
description: 把 XiaoShi-Rune-Console 的 main 分支增量同步进 docs 文档站。当用户说「更新文档」「把 console 的改动同步到 docs」「文档该跟着代码走了」「跑一遍 rune-docs-update」「看看文档落后了多少」时使用。以 anchor.json 里记录的 commit 为基线，diff 到最新 main，按模块判定哪些改动必须落文档，中英成对修改、补截图、过双 base 构建自检，发布后把锚点推进到新的 main。
agent_created: true
---

# console → docs 增量同步

## 0. 模型：一个锚点 + 一次单向 diff

```
XiaoShi-Rune-Console:  ...──●───────●───────●───────●──▶ main
                             ▲                       ▲
                        anchor.commit            origin/main
                             └──── 本轮要评估的区间 ────┘
                                      ↓ 判定 / 改文档 / 发布
docs:  main ──●──●──●  （PR 合并后，anchor 推进到上面的 origin/main）
```

锚点的含义只有一句：**「文档已确认与产品代码一致的最后一个 console 提交」**。
它不表示「文档写完了」，也不表示「这个提交之后没改过文档」—— 只表示这段区间已经评估过、该改的改完了。

因此每次 update 的动作是固定的：读锚点 → 看区间 → 判定 → 改 → 发布 → 推锚点。
不要凭「最近好像加了什么功能」去改文档，那样既漏又重。

## 1. 定义结构

```
docs/
└── .workbuddy/skills/rune-docs-update/
    ├── SKILL.md              # 本文件：触发条件、流程、判定规则、反模式
    ├── anchor.json           # ★ 唯一状态：锚点 + 跳过记录 + 推进历史（随仓库版本化）
    ├── scripts/
    │   ├── diff-console.mjs  # 读锚点 → 拉最新 main → 输出变更清单（Markdown / JSON）
    │   └── bump-anchor.mjs   # 推进锚点，自动写 history，带祖先关系校验
    └── references/
        ├── mapping.md        # console 代码路径 → 文档页面（索引，不是结论）
        └── checklist.md      # 一轮同步的勾选清单（内容、截图、五条校验、发布后抽查）
```

设计约束：

- **一个 skill 目录只服务一件事**：它是「同步器」，不承担文档写作规范（那在仓库根的 `SKILL.md`）；
- **状态只有一处**：`anchor.json`。脚本读写它，人只读不手改；
- **脚本零依赖**：只用 Node 内置模块 + `git`，不需要 `yarn install`，离线也能跑（`--no-fetch`）。

## 2. 锚点

### 2.1 存在哪

`docs/.workbuddy/skills/rune-docs-update/anchor.json`，**跟文档一起提交进git**。

为什么不放别处：

| 方案                                 | 问题                                                           |
| ------------------------------------ | -------------------------------------------------------------- |
| git tag（如 `docs-synced-8fcfa520`） | tag 要额外的推送权限，改历史时容易丢；且看不出「为什么停在这」 |
| CI 变量 / GitHub Environment         | 换机器、换人、本地跑都读不到；不可 review                      |
| 独立的状态仓库 / wiki                | 和文档改动脱钩，PR 里看不出来                                  |
| 写进 `SKILL.md` 正文                 | 每轮都要改正文，diff 噪音大，且容易被误改成别的数字            |

放在 skill 目录里还有两个好处：PR 里 `anchor.json` 的 diff 本身就是「这一轮同步到哪」的凭据；`history` 数组天然是同步台账。

### 2.2 格式

```json
{
  "version": 1,
  "skill": "rune-docs-update",
  "source": {
    "repo": "poxiaoyun/XiaoShi-Rune-Console",
    "remote": "git@github.com:poxiaoyun/XiaoShi-Rune-Console.git",
    "branch": "main",
    "local_path_hint": "/Volumes/datas/project/xiaoshi/rune/XiaoShi-Rune-Console"
  },
  "docs": {
    "repo": "poxiaoyun/docs",
    "branch": "main",
    "site": "https://docs.poxiaoshi.cn",
    "base_url": "/"
  },
  "anchor": {
    "commit": "8fcfa520253dd8bb8783185db8d574b3852c4c44",
    "committed_at": "2026-10-20T22:58:21+08:00",
    "subject": "Merge pull request #214 from poxiaoyun/twin"
  },
  "recorded_at": "2026-10-21T14:10:00+08:00",
  "docs_head_at_record": "d4c508e3bfaebd7013619480d9edf75ee86f3af0",
  "skip": [],
  "history": [
    {
      "anchor": "8fcfa520253dd8bb8783185db8d574b3852c4c44",
      "short": "8fcfa520",
      "range": null,
      "commits": null,
      "docs_pr": "#11",
      "note": "首轮全量对齐：272 页 cn/en 成对、74 张截图、/en 英文站 + hreflang + sitemap 546 条；此前无锚点，故 range 为空",
      "recorded_at": "2026-10-21T14:10:00+08:00"
    }
  ]
}
```

| 字段                              | 含义                                                                                                               | 谁写                      |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------ | ------------------------- |
| `anchor.commit`                   | **唯一权威的锚点**，完整 40 位 SHA。任何判断以它为准，不用分支名、不用短 SHA                                       | `bump-anchor.mjs`         |
| `anchor.committed_at` / `subject` | 冗余的可读信息，方便 review 时人眼确认「停在哪」                                                                   | `bump-anchor.mjs`         |
| `recorded_at`                     | 本次锚点记录时刻，带 +08:00 偏移                                                                                   | `bump-anchor.mjs`         |
| `docs_head_at_record`             | 记录时 docs 仓库的 HEAD（即锚点提交的父提交），用于回溯「当时的文档长什么样」                                      | `bump-anchor.mjs`         |
| `skip[]`                          | 已判定「不需要改文档」但**尚未被新锚点覆盖**的提交：`{commit, short, reason, recorded_at}`。下一轮 diff 会跳过它们 | 人工加 `--skip`，脚本维护 |
| `history[]`                       | 每次推进的记录：`{anchor, short, range, commits, docs_pr, note, recorded_at}`                                      | `bump-anchor.mjs`         |
| `source` / `docs`                 | 仓库坐标。换机器时 `local_path_hint` 可以改成本机路径，但别改 `repo`                                               | 人工（初始化时）          |

### 2.3 读写规则

- **读**：只用 `scripts/diff-console.mjs`（它自己读 `anchor.json`），不要在流程里手抄 SHA；
- **写**：只用 `scripts/bump-anchor.mjs`。手改会漏 `history`，也会漏掉祖先关系校验；
- **永远不要**把锚点写成「今天」或「最新」这种相对值 —— 它是提交 SHA，不是时间。

## 3. 执行步骤

### Step 0 · 前置（半分钟）

```bash
cd /Volumes/datas/project/xiaoshi/pxs/docs
git status --short          # 必须为空
git checkout main && git pull --ff-only

export RUNE_CONSOLE_REPO=/Volumes/datas/project/xiaoshi/rune/XiaoShi-Rune-Console
git -C "$RUNE_CONSOLE_REPO" worktree list   # 已有工作树就复用，别重复克隆
```

- 没克隆过 console：用 `--filter=blob:none` 的全历史克隆。**不要 `--depth`**，浅克隆里锚点提交可能不存在（脚本会报「锚点提交不存在，先 `git fetch --unshallow`」）。
- 后面所有构建命令都要带 `env -u NODE_OPTIONS`。

### Step 1 · 生成变更清单

```bash
node .workbuddy/skills/rune-docs-update/scripts/diff-console.mjs
# 需要机器可读：--json --out /tmp/rune-docs-diff.json
# 离线：--no-fetch（用本地已有的 origin/main）
```

输出四块：概览（按区域的提交数/文件数/结论）、提交明细、文件清单（每行带 `需同步/待判断/不改`）、下一步。
顶部三行要先看：**锚点 → 目标、待评估提交数、结论分布**。

若 `待评估提交 = 0`：文档已对齐，直接跳到 Step 7 前停下（无需 PR，除非要顺手推锚点）。

### Step 2 · 逐提交判定

对每个「需同步 / 待判断」的提交，打开实际代码看，别只看标题：

```bash
git -C "$RUNE_CONSOLE_REPO" show --stat <sha>
git -C "$RUNE_CONSOLE_REPO" show <sha> -- <关键文件>
```

判定标准（判的是**用户可见行为**，不是代码结构）：

| 变更类型                               | 是否改文档 | 备注                             |
| -------------------------------------- | ---------- | -------------------------------- |
| 新增/删除页面、菜单项、路由            | 必须       | 页面 + 两侧 `toc.ts` 一起动      |
| 字段增删改名、默认值/单位/校验规则变化 | 必须       | 通常落在「参数说明」表           |
| 流程变化（多一步、少一步、跳转顺序变） | 必须       | 步骤编号要重排，截图重截         |
| 权限/配额/计费口径变化                 | 必须       | 涉及钱的改动宁可多写一句         |
| 纯样式、文案微调、内部重构、测试       | 不改       | 记 `--skip` 并写清理由           |
| 门户（`apps/portal`）专属改动          | 不改       | 文档站不描述门户                 |
| `packages/shared/routes` 改路径/菜单名 | 必须       | 全站链接与侧边栏都要跟，最容易漏 |
| 只有 `packages/core` 的通用交互调整    | 待判断     | 看是否改变了用户操作路径         |

**拿不准就判「改」**：多写一段的代价，远小于用户按旧文档点不到按钮。

### Step 3 · 定位页面

按 `references/mapping.md` 找到目录，再用 `grep` 确认落点：

```bash
grep -rn "批量推理" src/pages/docs/cn | head        # 页面里有这个菜单名吗
grep -rn "并发数" src/pages/docs/en | head          # 字段名在英文页怎么写
```

不要凭代码目录猜页面 —— 代码里的 `storagevolumes` 在文档里叫「文件存储」。

### Step 4 · 改文档

硬约束（违反会直接反映到线上）：

1. **中英成对**。`cn` 与 `en` 同路径，缺一边 = 线上那个语言「文档不存在」（语言由 URL 决定，没有跨语言回退）。
2. **新页要在两侧 `toc.ts` 各加一条**，`path` 不带数字前缀，`product` 与所在分区一致。
3. **frontmatter 的 `description` 含冒号必须整段加引号**，否则 YAML 解析失败、整页空白（踩过：12 个英文页同时挂掉）。
4. **改菜单名/URL** 时，同步检查 `toc.ts`、`scripts/ssg.mjs`（首页静态正文）、正文内链三处。
5. **截图重截**，不要用旧图；规格见 `references/checklist.md` C 节。

详细写法（小白口径、Alert 语法、命名规范）看仓库根 `SKILL.md`，不要在这里重复一套。

### Step 5 · 本地校验（五条）

```bash
env -u NODE_OPTIONS ./node_modules/.bin/tsc --noEmit
env -u NODE_OPTIONS ./node_modules/.bin/eslint "src/**/*.{ts,tsx}"
env -u NODE_OPTIONS ./node_modules/.bin/prettier --check "src/**/*.{ts,tsx}"
python3 scripts/check-docs-consistency.py | tail -3        # 期望「合计问题: 0」
env -u NODE_OPTIONS VITE_BASE_URL=/ yarn build             # 内含 ssg.mjs 自检
```

容器部署再多跑一遍 base=/docs 的 SSG（产物不同，别省）：

```bash
rm -rf dist-container && cp -r dist dist-container
env -u NODE_OPTIONS VITE_BASE_URL=/docs SSG_OUT=dist-container node scripts/ssg.mjs
```

### Step 6 · 提交、合并、发布

```bash
git checkout -b docs/sync-console-<新锚点短SHA>
git add -A && git commit   # 文档改动 + anchor.json 放同一个提交或相邻提交
gh pr create --base main --head docs/sync-console-<sha> --title "docs: 同步 console <旧短SHA>..<新短SHA>" --body "..."
gh pr merge <n> --squash --delete-branch
gh run watch <run-id> --exit-status
```

线上抽查用无头浏览器（表格见 `references/checklist.md` E 节），至少覆盖：改过的中文页、对应英文页、首页。

### Step 7 · 推进锚点

```bash
node .workbuddy/skills/rune-docs-update/scripts/bump-anchor.mjs \
  --to origin/main --pr "#12" --note "同步 #215~#217：入口作用域参数、网关计费字段"
```

脚本会：校验新锚点是 `origin/main` 的祖先、校验不回退历史、算区间提交数、清理已被覆盖的 `skip`、追加 `history`、写入 `recorded_at` 与 `docs_head_at_record`。
带 `--dry-run` 可以先看会写成什么。

推进时机有且只有两种：

| 情形                   | 做法                                                                                                                        |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| 本轮有文档改动         | `anchor.json` 放进**同一个 PR**（一次 review 说清「改了哪些页 + 承认到了哪个提交」）。若 PR 已合并，则补一个只改锚点的小 PR |
| 本轮全是「不改」的提交 | **也要提一个只改锚点的 PR**。否则下一轮 diff 还是同一批，永久空转                                                           |

### Step 8 · 收尾

- 工作记忆追加一行：`range`、提交数、改了哪些页、`skip` 理由、部署 run id；
- 删掉临时分支（本地 + 远端）；
- 若本轮发现文档结构性问题（比如某模块整块缺失），另开 issue 或任务，不要塞进同步 PR。

## 4. 刷新锚点的三种结束状态

```
① 有改动 → PR（文档 + anchor.json）→ 合并 → 部署 → 完成
② 只有 skip → PR（仅 anchor.json）→ 合并 → 完成
③ 零提交   → 什么都不做，anchor 不动
```

`skip` 与 `anchor` 的关系：`skip` 是「区间内已判定无需改文档的提交」，只在本轮有效。
锚点前进后，被新锚点覆盖的 `skip` 会被 `bump-anchor.mjs` 自动清空 —— 因为它们已经在「已评估」的范围里了。

## 5. 反模式

- **拿最新 main 的代码写文档，却不推锚点**：下一轮 diff 还是同一批，重复劳动且容易改重复。
- **手改 `anchor.json` 的 commit**：history 断档，别人无法判断哪一轮同步了什么。
- **只改 cn 不改 en**：构建不报错，线上英文页直接「文档不存在」。
- **用提交标题判断内容**：`fix(portal)` 的提交里可能夹着 `packages/shared/routes` 的实质改动（真实发生过）。
- **跳过 SSG 自检**：死链、缺图、sitemap 缺条目都不会让 `vite build` 失败，只会在线上 404。
- **把「门户」改动写进文档**：文档站只描述 rune / boss / moha / ecosystem / account，门户首页不在范围内。
- **在 docs 仓库里 `git reset --hard` 收拾残局**：会连锚点一起回退，导致下一轮重复分析。

## 6. 当前状态（2026-10-21 首次登记）

- 锚点 `8fcfa520`（2026-10-20 22:58，PR #214 合并点），对应首轮全量对齐：272 页 cn/en、`/en` 英文站、sitemap 546 条。
- 锚点之后已有 3 个待评估提交：`7ac994c0`、`d2b67255`、`82b826d0`（门户入口跳转与 `/rune?target=` 无作用域入口）。
- 跑一次 `diff-console.mjs` 就能看到它们 —— **这份状态说明只是快照，永远以脚本输出为准。**
