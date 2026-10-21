import type { DocsSidebarSection } from '../../toc';

// ----------------------------------------------------------------------
// 分类口径 = Boss 控制台自己的分组
// （XiaoShi-Rune-Console/src/routes/navs/boss.tsx + locales/langs/*/navbar.json）
//
// 体例（与 10.rune/toc.ts 保持一致）：
//   1. subheader = 产品里的一级分组名，取界面真源文案；不与本节任何条目重名；
//   2. 每个板块的落地索引页排在首位，标签用「…概览」与小节名区分；
//   3. 只有「组节点路径是其子项路径前缀」时才用 children 嵌套 —— 侧边栏靠路径前缀判断
//      活跃并自动展开，前缀不成立时刷新子页会让该组折叠、当前页在侧边栏里消失。
//      本分区只有「账户管理」（/boss/iam → /boss/iam/*）满足；
//      同理 智算平台（/boss/rune-admin）与平台（/boss/settings）下的子项路径互不为前缀，
//      故用 subheader 承载分类、不嵌套 children；
//   4. 智算平台下的集群信息 / 资源管理 / 运维管理是集群详情页的三级菜单
//      （getClusterNavData），加「智算平台 ·」前缀表明归属；
//   5. 路径是同级其它条目前缀的落地页要显式写 deepMatch: false
//      （/boss、/boss/iam、/boss/gateway、/boss/moha-admin、/boss/rune-admin、/boss/settings），
//      否则它会常驻高亮；
//   6. 每个 subheader 至少一个顶层条目带 product，否则布局层 filteredSections 会把整节静默滤掉；
//   7. 一级条目一律带 icon —— 模板里 depth=1 的行按「带图标」排版，漏写会让该行标题左移 34px、
//      同一个列表左右参差。图标名取自 public/assets/icons/navbar 的 27 个双色图标；
//      同一个 subheader 分段内不重复（侧边栏一屏能对比到），分段之间可以复用。
// ----------------------------------------------------------------------

export const BOSS_SIDEBAR_SECTIONS: DocsSidebarSection[] = [
  {
    // 真实分组：首页（概览 / 首页）
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
    ],
  },
  {
    // 真实分组：账户管理（用户管理 / 租户管理）
    subheader: '账户管理',
    items: [
      {
        title: '账户管理',
        path: '/boss/iam',
        icon: 'ic-lock',
        deepMatch: false,
        product: 'boss',
        children: [
          { title: '用户管理', path: '/boss/iam/users' },
          { title: '租户管理', path: '/boss/iam/tenants' },
        ],
      },
    ],
  },
  {
    // 真实分组：系统管理（认证策略 / 第三方认证 / 邮件服务 / 短信服务），
    // 产品里仅当路径以 /boss/iam 开头时出现
    subheader: '系统管理',
    items: [
      {
        title: '认证策略',
        path: '/boss/iam/authentication-policy',
        icon: 'ic-lock',
        product: 'boss',
      },
      { title: '第三方认证', path: '/boss/iam/identity-providers', icon: 'ic-external' },
      { title: '邮件服务', path: '/boss/iam/email-providers', icon: 'ic-mail' },
      { title: '短信服务', path: '/boss/iam/sms-providers', icon: 'ic-chat' },
    ],
  },
  {
    // 真实分组：大模型网关（数据看板）、模型服务（渠道管理 / 模型配置）、
    // 计费与额度（费率方案 / 计费账户 / 套餐计划 / 订阅管理 / 计价异常 / 额度计划）、
    // 用户管理（API 密钥 / 调用日志）、安全服务（敏感词管理 / 策略管理 / 命中记录）、
    // 平台设置（网关配置 / 货币配置）。这些页面都平铺在 /boss/gateway 一层，
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
      { title: '数据看板', path: '/boss/gateway/operations', icon: 'ic-analytics' },
      { title: '渠道管理', path: '/boss/gateway/channels', icon: 'ic-external' },
      { title: '模型配置', path: '/boss/gateway/model-metadata', icon: 'ic-product' },
      { title: '费率方案', path: '/boss/gateway/rate-plans', icon: 'ic-invoice' },
      { title: '计费账户', path: '/boss/gateway/billing-accounts', icon: 'ic-banking' },
      { title: '套餐计划', path: '/boss/gateway/billing-plans', icon: 'ic-ecommerce' },
      { title: '订阅管理', path: '/boss/gateway/billing-subscriptions', icon: 'ic-calendar' },
      { title: '计价异常', path: '/boss/gateway/usage-events', icon: 'ic-kanban' },
      { title: '额度计划', path: '/boss/gateway/quota-plans', icon: 'ic-params' },
      { title: 'API 密钥', path: '/boss/gateway/api-keys', icon: 'ic-lock' },
      { title: '调用日志', path: '/boss/gateway/audit', icon: 'ic-file' },
      { title: '敏感词管理', path: '/boss/gateway/moderation-lexicon', icon: 'ic-label' },
      { title: '策略管理', path: '/boss/gateway/moderation-policies', icon: 'ic-job' },
      { title: '命中记录', path: '/boss/gateway/sensitive-hits', icon: 'ic-order' },
      { title: '网关配置', path: '/boss/gateway/config', icon: 'ic-menu-item' },
      { title: '货币配置', path: '/boss/gateway/currency-settings', icon: 'ic-dashboard' },
    ],
  },
  {
    // 真实分组：资产管理（模型库 / 数据集 / 镜像仓库 / 空间）
    subheader: '资产管理',
    items: [
      {
        title: '仓库概览',
        path: '/boss/moha-admin',
        icon: 'ic-course',
        deepMatch: false,
        product: 'boss',
      },
      { title: '模型库', path: '/boss/moha-admin/models', icon: 'ic-product' },
      { title: '数据集', path: '/boss/moha-admin/datasets', icon: 'ic-folder' },
      { title: '镜像仓库', path: '/boss/moha-admin/images', icon: 'ic-menu-item' },
      { title: '空间', path: '/boss/moha-admin/spaces', icon: 'ic-subpaths' },
    ],
  },
  {
    // 真实分组：数据同步（镜像站）
    subheader: '数据同步',
    items: [
      { title: '镜像站', path: '/boss/moha-admin/mirrors', icon: 'ic-external', product: 'boss' },
    ],
  },
  {
    // 真实分组：安全审计（审计日志）
    subheader: '安全审计',
    items: [{ title: '审计日志', path: '/boss/moha-admin/audit', icon: 'ic-file', product: 'boss' }],
  },
  {
    // 真实分组：系统设置（公告 / 轮播图）
    subheader: '系统设置',
    items: [
      { title: '公告', path: '/boss/moha-admin/announcements', icon: 'ic-mail', product: 'boss' },
      { title: '轮播图', path: '/boss/moha-admin/banners', icon: 'ic-blog' },
    ],
  },
  {
    // 真实分组：智算平台（集群管理 / 租户集群 / 应用）
    subheader: '智算平台',
    items: [
      {
        title: '智算管理概览',
        path: '/boss/rune-admin',
        icon: 'ic-tour',
        deepMatch: false,
        product: 'boss',
      },
      { title: '集群管理', path: '/boss/rune-admin/clusters', icon: 'ic-subpaths' },
      { title: '租户集群', path: '/boss/rune-admin/tenant-clusters', icon: 'ic-dashboard' },
      { title: '应用', path: '/boss/rune-admin/applications', icon: 'ic-label' },
    ],
  },
  {
    // 集群详情三级菜单之一：集群信息（集群看板 / 节点看板 / 加速卡看板）
    subheader: '智算平台 · 集群信息',
    items: [
      {
        title: '集群信息',
        path: '/boss/rune-admin/cluster-overview',
        icon: 'ic-tour',
        product: 'boss',
      },
      { title: '节点状态', path: '/boss/rune-admin/node-status', icon: 'ic-dashboard' },
      { title: '加速卡信息', path: '/boss/rune-admin/accelerator-status', icon: 'ic-product' },
      // 产品菜单里没有这个入口，保留为文档专页（讲集群指标 YAML 编辑器）
      { title: '动态仪表盘', path: '/boss/rune-admin/dynamic-dashboard', icon: 'ic-analytics' },
    ],
  },
  {
    // 集群详情三级菜单之二：资源管理（资源池 / 资源规格 / 租户资源）
    subheader: '智算平台 · 资源管理',
    items: [
      {
        title: '资源池',
        path: '/boss/rune-admin/resource-pools',
        icon: 'ic-folder',
        product: 'boss',
      },
      { title: '资源规格', path: '/boss/rune-admin/flavors', icon: 'ic-params' },
      { title: '租户资源', path: '/boss/rune-admin/tenants', icon: 'ic-invoice' },
    ],
  },
  {
    // 集群详情三级菜单之三：运维管理（工作负载 / 存储集群 / 系统应用 /
    // 调度视图 / 调度器管理 / 日志管理 / 告警）
    subheader: '智算平台 · 运维管理',
    items: [
      { title: '工作负载', path: '/boss/rune-admin/resources', icon: 'ic-job', product: 'boss' },
      { title: '存储集群', path: '/boss/rune-admin/storage-cluster', icon: 'ic-folder' },
      { title: '系统应用', path: '/boss/rune-admin/systems', icon: 'ic-product' },
      { title: '调度视图', path: '/boss/rune-admin/scheduling', icon: 'ic-kanban' },
      { title: '调度器管理', path: '/boss/rune-admin/schedulers', icon: 'ic-menu-item' },
      { title: '日志管理', path: '/boss/rune-admin/logs', icon: 'ic-file' },
      { title: '告警', path: '/boss/rune-admin/alerts', icon: 'ic-invoice' },
    ],
  },
  {
    // 真实分组：平台（系统成员 / 平台设置 / 智算平台设置 / 魔哈Hub设置 /
    // 网关设置 / 许可证）+「告警渠道」「数字孪生」两个只在顶部导航出现的入口
    subheader: '平台',
    items: [
      {
        title: '平台概览',
        path: '/boss/settings',
        icon: 'ic-params',
        deepMatch: false,
        product: 'boss',
      },
      { title: '系统成员', path: '/boss/settings/members', icon: 'ic-user' },
      { title: '平台设置', path: '/boss/settings/platform', icon: 'ic-menu-item' },
      { title: '智算平台设置', path: '/boss/settings/rune', icon: 'ic-tour' },
      { title: '魔哈Hub设置', path: '/boss/settings/moha', icon: 'ic-course' },
      { title: '网关设置', path: '/boss/settings/chatapp', icon: 'ic-blog' },
      { title: '许可证', path: '/boss/settings/license', icon: 'ic-lock' },
      { title: '平台审计', path: '/boss/settings/platform-audit', icon: 'ic-file' },
      { title: '告警渠道', path: '/boss/settings/alert-channels', icon: 'ic-mail' },
      { title: '数字孪生', path: '/boss/digital-twin', icon: 'ic-subpaths' },
    ],
  },
];
