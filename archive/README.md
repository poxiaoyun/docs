# archive

历史内容归档，**不参与构建**。

站点内容由 `src/pages/docs/viewer.tsx` 通过 `import.meta.glob` 从 `src/pages/docs/**` 收集，
`archive/` 在同级目录之外，因此这里的 Markdown 不会被 Vite 打进产物、也不会出现在侧边栏。

## 归档规则

- 归档内容保留**原相对路径**，置于 `archive/<YYYY-MM-DD>/` 下，便于与 `git log` 对照。
- 只归档「曾经上线、现已被替换或下线」的内容；同一批变更里被删除的文件应在这里找到副本，
  以保证删除动作可从仓库本身回溯，而不必翻 git history。

## 2026-09-12

与「docs 对齐 XiaoShi-Rune-Console main 分支最新功能」同批，共归档 124 个文件：

| 类别 | 说明 |
| --- | --- |
| 虚构内容 | 描述中不存在于产品的页面（如虚构的权限矩阵、监控栈、JWT 鉴权等） |
| 重复内容 | 与其他目录逐字节重复的副本（如 `en/10.rune/04.boss/**` 与 `en/20.boss/04.rune-admin/**`、hygon 16 个重复文件） |
| 结构下线 | 侧边栏重组后被合并或迁移的旧路径（如 `20.boss/01.operations/**`、`02.templates.md`、`02.resources/{02.quotas,03.flavors}.md`） |
| 位置迁移 | 页面被移动到新目录、且内容已重写（如 `20.boss/03.settings/dynamic-dashboard.md` → `04.rune-admin/`） |

校验：`scripts/check-docs-consistency.py` 会检查「已删除文件是否都有归档副本」，当前 124/124。
