# console 代码路径 → 文档页面

先跑 `scripts/diff-console.mjs` 拿到「哪些文件变了」，再用这张表定位「该改哪一页」。
表是**索引，不是结论** —— 落点最后必须用 `grep` 在页面里搜到菜单名/字段名才算确认。

## 1. 粗粒度：应用 → 文档分区

| console 路径                               | 文档目录（cn/en 同构）                       | 说明                                    |
| ------------------------------------------ | -------------------------------------------- | --------------------------------------- |
| `apps/console/src/pages/rune/**`           | `src/pages/docs/{cn,en}/10.rune/03.console/` | 智算平台控制台主体                      |
| `apps/console/src/pages/chatapp/**`        | `10.rune/03.console/`（模型体验 / 应用市场） | 对话应用                                |
| `apps/console/src/pages/moha/**`           | `30.moha/`                                   | 魔哈仓库                                |
| `apps/boss/src/pages/boss/gateway/**`      | `20.boss/02.gateway/`                        | AI 网关与计费                           |
| `apps/boss/src/pages/boss/iam/**`          | `20.boss/01.iam/`                            | BOSS 侧账号与权限                       |
| `apps/boss/src/pages/boss/settings/**`     | `20.boss/03.settings/`                       | 平台设置                                |
| `apps/boss/src/pages/boss/rune/**`         | `20.boss/04.rune-admin/`                     | 智算平台运营面                          |
| `apps/boss/src/pages/boss/moha/**`         | `20.boss/05.moha-admin/`                     | 魔哈运营面                              |
| `apps/boss/src/pages/boss/digital-twin/**` | `20.boss/digital-twin.md`                    | 数字孪生                                |
| `apps/boss/src/pages/boss/home/**`         | `20.boss/dashboard.md`                       | 运营总览                                |
| `apps/iam/src/pages/account/**`            | `05.account/`（账号中心）+ `20.boss/01.iam/` | 同一个功能的两套入口，两边都要看        |
| `apps/iam/src/pages/auth/**`               | `05.account/`（登录 / 注册）                 |                                         |
| `apps/portal/**`                           | —                                            | 门户首页，文档站不描述，通常不改        |
| `packages/shared/src/routes/**`            | 全站：`toc.ts`、`toc.tsx`、各页 URL          | 路径/导航变了，文档的链接与目录全部要跟 |
| `packages/shared/src/locales/**`           | 全站菜单名 + `guide/glossary`                | 文案变了，文档里的菜单名要一起改        |

## 2. 细粒度：控制台页面

| console 页面                                    | 文档文件                                | 文档标题                                       |
| ----------------------------------------------- | --------------------------------------- | ---------------------------------------------- |
| `rune/home`                                     | `10.rune/03.console/dashboard.md`       | 首页                                           |
| `rune/instances`、`rune/inferences`             | `inference.md` / `flavor.md`            | 推理服务 / 规格                                |
| `rune/tunes`                                    | `finetune.md`                           | 训练与微调                                     |
| `rune/batch`                                    | `batch-inference.md`                    | 批量推理                                       |
| `rune/evaluations`                              | `evaluation.md`                         | 模型评测                                       |
| `rune/experiments`                              | `experiment.md`                         | 指标                                           |
| `rune/storagevolumes`                           | `storage.md`                            | 文件存储                                       |
| `rune/applications`、`rune/application-catalog` | `app-market.md` / `app.md`              | 应用市场 / 应用实例                            |
| `rune/tenant`                                   | `tenant-clusters.md`                    | 租户集群                                       |
| `rune/instance-presets`                         | 暂无独立页（「我的预设」）              | 需要时新增                                     |
| `rune/ims`                                      | `30.moha/04.images/` 或本区新增         | 镜像                                           |
| `pages/rune/entry.tsx`                          | `02.guide/` 入门 + `tenant-clusters.md` | 进站跳转、租户/集群选择、`?target=` 作用域入口 |

## 3. 共享层的影响面

`packages/shared/src/routes/**` 是**最容易漏**的一块：它同时决定

1. `paths.ts` 里的 URL 段 → 文档里的站内链接、URL 标题、sitemap；
2. `navs/{boss,rune,tenant}` 里的菜单树 → 文档侧边栏的 `toc.ts` 条目与顺序；
3. `console-scope.ts` / `tenant-selection.ts` 里的跳转规则 → 「进入控制台」这类流程页。

改这三处任意一处，必须同步检查：

```bash
# ① 文档里还在用旧路径的页面
grep -rn "/rune/console/" src/pages/docs/cn | head

# ② 侧边栏条目（两侧都要）
grep -rn "旧菜单名" src/pages/docs/{cn,en}/*/toc.ts src/pages/docs/toc.tsx

# ③ SSG 里写死的首页入口
grep -n "HOME_\|/rune/" scripts/ssg.mjs | head
```

## 4. 定位配方（比查表更可靠）

```bash
# 页面里的菜单名 / 按钮文案 → 找页面
grep -rn "批量推理" src/pages/docs/cn | head

# 代码里的字段名 → 找文档里是否写过
grep -rn "并发数" src/pages/docs/en | head

# 反查：这个文档页对应哪个代码目录
grep -rln "应用市场" /path/to/XiaoShi-Rune-Console/apps/console/src | head
```

## 5. 页面存在性检查

新增或改名页面后，`cn` 与 `en` 必须**同路径成对**存在：

```bash
comm -3 \
  <(cd src/pages/docs/cn && find . -name '*.md' | sed 's#^\./##' | sort) \
  <(cd src/pages/docs/en && find . -name '*.md' | sed 's#^\./##' | sort)
```

输出为空才算对齐。任何一边多出来的文件，线上就是「文档不存在」。
