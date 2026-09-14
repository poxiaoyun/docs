import type { DocsSidebarSection } from '../../toc';

// ----------------------------------------------------------------------
// 分类口径 = Boss 控制台自己的分组
// （XiaoShi-Rune-Console/src/routes/navs/boss.tsx + locales/langs/*/navbar.json）
//
// 体例（与 10.rune/toc.ts 保持一致）：
//   1. subheader = 产品里的一级分组名，取界面真源文案；不与本节任何条目重名 ——
//      改前「大模型网关 / Moha 仓库管理 / Rune 智算管理」三节下面的唯一条目与小节同名，
//      侧边栏会出现两行同样的字；
//   2. 每个板块的落地索引页排在首位，标签用「…概览」与小节名区分；
//   3. 只有「组节点路径是其子项路径前缀」时才用 children 嵌套 —— 侧边栏靠路径前缀判断
//      活跃并自动展开，前缀不成立时刷新子页会让该组折叠、当前页在侧边栏里消失。
//      本分区只有「账户管理」（/boss/iam → /boss/iam/*）满足；
//   4. 智算管理下的集群信息 / 资源管理 / 运维管理是集群详情页的三级菜单
//      （getClusterNavData），它们的页面在同一层目录里、路径互不为前缀，因此改用
//      subheader 承载分类，并加「Rune 智算管理 ·」前缀表明归属；
//   5. 路径是同级其它条目前缀的落地页要显式写 deepMatch: false
//      （/boss、/boss/gateway、/boss/moha-admin、/boss/rune-admin、/boss/settings），
//      否则它会常驻高亮；
//   6. 每个 subheader 至少一个顶层条目带 product，否则布局层 filteredSections 会把整节静默滤掉。
// ----------------------------------------------------------------------

export const BOSS_SIDEBAR_SECTIONS: DocsSidebarSection[] = [
  {
    // 真实分组：概览（首页）、账户管理（用户管理 / 租户管理）
    subheader: 'Boss 运营平台',
    items: [
      {
        title: '概览',
        path: '/boss',
        icon: 'ic-params',
        deepMatch: false,
        product: 'boss',
      },
      {
        title: '首页',
        path: '/boss/dashboard',
        icon: 'ic-dashboard',
      },
      {
        title: '账户管理',
        path: '/boss/iam',
        icon: 'ic-lock',
        product: 'boss',
        children: [
          { title: '用户管理', path: '/boss/iam/users' },
          { title: '租户管理', path: '/boss/iam/tenants' },
        ],
      },
    ],
  },
  {
    // 真实分组：大模型网关（数据看板）、模型服务（渠道管理 / 模型配置）、
    // 用户管理（令牌管理 / 调用日志）、安全服务（内容审查 / 命中记录）、
    // 平台设置（网关配置 / 货币配置）。这五个分组的页面都平铺在 /boss/gateway 一层，
    // 无法用 children 表达（前缀不成立），故按产品顺序平铺在本节内。
    subheader: '大模型网关',
    items: [
      {
        title: '网关概览',
        path: '/boss/gateway',
        icon: 'ic-blog',
        deepMatch: false,
        product: 'boss',
      },
      { title: '数据看板', path: '/boss/gateway/operations' },
      { title: '渠道管理', path: '/boss/gateway/channels' },
      { title: '模型配置', path: '/boss/gateway/model-metadata' },
      { title: '令牌管理', path: '/boss/gateway/api-keys' },
      { title: '调用日志', path: '/boss/gateway/audit' },
      { title: '内容审查', path: '/boss/gateway/moderation' },
      { title: '命中记录', path: '/boss/gateway/sensitive-hits' },
      { title: '网关配置', path: '/boss/gateway/config' },
      { title: '货币配置', path: '/boss/gateway/currency-settings' },
    ],
  },
  {
    // 真实分组：资产管理（模型库 / 数据集 / 镜像仓库 / 空间）、数据同步（镜像站）、
    // 安全审计（审计日志）、系统设置（公告 / Banner）
    subheader: 'Moha 仓库管理',
    items: [
      {
        title: '仓库概览',
        path: '/boss/moha-admin',
        icon: 'ic-course',
        deepMatch: false,
        product: 'boss',
      },
      { title: '模型库', path: '/boss/moha-admin/models' },
      { title: '数据集', path: '/boss/moha-admin/datasets' },
      { title: '镜像仓库', path: '/boss/moha-admin/images' },
      { title: '空间管理', path: '/boss/moha-admin/spaces' },
      { title: '镜像站', path: '/boss/moha-admin/mirrors' },
      { title: '审计日志', path: '/boss/moha-admin/audit' },
      { title: '公告', path: '/boss/moha-admin/announcements' },
      { title: 'Banner', path: '/boss/moha-admin/banners' },
    ],
  },
  {
    // 真实分组：智算平台（集群管理 / 租户资源 / 应用模版）；租户资源在文档里与
    // 「租户配额」同页，见下一节的资源管理
    subheader: 'Rune 智算管理',
    items: [
      {
        title: '智算管理概览',
        path: '/boss/rune-admin',
        icon: 'ic-tour',
        deepMatch: false,
        product: 'boss',
      },
      { title: '集群管理', path: '/boss/rune-admin/clusters' },
      { title: '应用模版', path: '/boss/rune-admin/templates' },
      { title: '系统模版市场', path: '/boss/rune-admin/system-market' },
    ],
  },
  {
    // 集群详情三级菜单之一：集群信息（集群看板 / 节点看板 / 加速卡看板）
    subheader: 'Rune 智算管理 · 集群信息',
    items: [
      {
        title: '集群概览',
        path: '/boss/rune-admin/cluster-overview',
        product: 'boss',
      },
      { title: '动态仪表盘', path: '/boss/rune-admin/dynamic-dashboard' },
      { title: '节点与加速卡状态', path: '/boss/rune-admin/nodes-gpu' },
    ],
  },
  {
    // 集群详情三级菜单之二：资源管理（资源池 / 资源规格 / 租户配额）
    subheader: 'Rune 智算管理 · 资源管理',
    items: [
      { title: '资源池', path: '/boss/rune-admin/resource-pools', product: 'boss' },
      { title: '资源规格', path: '/boss/rune-admin/flavors' },
      { title: '租户配额', path: '/boss/rune-admin/tenants' },
    ],
  },
  {
    // 集群详情三级菜单之三：运维管理（工作负载 / 存储集群 / 系统应用 / 调度器 / 日志）
    subheader: 'Rune 智算管理 · 运维管理',
    items: [
      { title: '工作负载', path: '/boss/rune-admin/resources', product: 'boss' },
      { title: '存储集群与运行时', path: '/boss/rune-admin/storage-runtime' },
      { title: '系统应用', path: '/boss/rune-admin/systems' },
      { title: '日志与调度器', path: '/boss/rune-admin/observability' },
    ],
  },
  {
    // 真实分组：平台（系统成员 / 平台设置 / 智算平台设置 / 魔哈Hub设置 /
    // 网关设置 / AI助手设置 / 许可证）
    subheader: '平台管理',
    items: [
      {
        title: '平台概览',
        path: '/boss/settings',
        icon: 'ic-params',
        deepMatch: false,
        product: 'boss',
      },
      { title: '系统成员', path: '/boss/settings/members' },
      { title: '平台设置', path: '/boss/settings/platform' },
      { title: '智算平台设置', path: '/boss/settings/rune' },
      { title: '魔哈Hub设置', path: '/boss/settings/moha' },
      { title: '网关设置', path: '/boss/settings/chatapp' },
      { title: 'AI助手设置', path: '/boss/settings/ai-assistant' },
      { title: '许可证', path: '/boss/settings/license' },
    ],
  },
];
