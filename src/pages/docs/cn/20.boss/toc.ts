import type { DocsSidebarSection } from '../../toc';

// ----------------------------------------------------------------------
// 子项标题对齐 Boss 控制台真实侧边栏（src/routes/navs/boss.tsx + locales/langs/*/navbar.json）
// 分组为文档站的归并分类，真实分组见各 section 注释
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
        product: 'boss',
      },
      {
        title: '首页',
        path: '/boss/dashboard',
        icon: 'ic-dashboard',
        product: 'boss',
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
    // 用户管理（令牌管理 / 调用日志）、安全服务（敏感词管理 / 策略管理 / 命中记录）、
    // 平台设置（网关配置 / 货币配置）
    subheader: '大模型网关',
    items: [
      {
        title: '大模型网关',
        path: '/boss/gateway',
        icon: 'ic-blog',
        product: 'boss',
        children: [
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
    ],
  },
  {
    // 真实分组：资产管理（模型库 / 数据集 / 镜像仓库 / Spaces）、数据同步（镜像站）、
    // 安全审计（审计日志）、系统设置（公告 / Banner）
    subheader: 'Moha 仓库管理',
    items: [
      {
        title: 'Moha 仓库管理',
        path: '/boss/moha-admin',
        icon: 'ic-course',
        product: 'boss',
        children: [
          { title: '模型库', path: '/boss/moha-admin/models' },
          { title: '数据集', path: '/boss/moha-admin/datasets' },
          { title: '镜像仓库', path: '/boss/moha-admin/images' },
          { title: '空间', path: '/boss/moha-admin/spaces' },
          { title: '镜像站', path: '/boss/moha-admin/mirrors' },
          { title: '审计日志', path: '/boss/moha-admin/audit' },
          { title: '公告', path: '/boss/moha-admin/announcements' },
          { title: 'Banner', path: '/boss/moha-admin/banners' },
        ],
      },
    ],
  },
  {
    // 真实分组：智算平台（集群管理 / 租户资源 / 应用模版）、
    // 集群信息 + 资源管理 + 运维管理（三级菜单见注释）
    subheader: 'Rune 智算管理',
    items: [
      {
        title: 'Rune 智算管理',
        path: '/boss/rune-admin',
        icon: 'ic-tour',
        product: 'boss',
        children: [
          { title: '集群管理', path: '/boss/rune-admin/clusters' },
          { title: '集群信息', path: '/boss/rune-admin/cluster-overview' },
          { title: '动态仪表盘', path: '/boss/rune-admin/dynamic-dashboard' },
          { title: '节点与加速卡状态', path: '/boss/rune-admin/nodes-gpu' },
          { title: '工作负载', path: '/boss/rune-admin/resources' },
          { title: '资源池', path: '/boss/rune-admin/resource-pools' },
          { title: '存储集群与运行时', path: '/boss/rune-admin/storage-runtime' },
          { title: '日志与调度器', path: '/boss/rune-admin/observability' },
          { title: '资源规格', path: '/boss/rune-admin/flavors' },
          { title: '租户配额', path: '/boss/rune-admin/tenants' },
          { title: '应用模版', path: '/boss/rune-admin/templates' },
          { title: '系统模版市场', path: '/boss/rune-admin/system-market' },
          { title: '系统应用', path: '/boss/rune-admin/systems' },
        ],
      },
    ],
  },
  {
    // 真实分组：平台（系统成员 / 平台设置 / 智算平台设置 / 魔哈Hub设置 /
    // 网关设置 / AI助手设置 / 许可证）
    subheader: '平台管理',
    items: [
      {
        title: '平台',
        path: '/boss/settings',
        icon: 'ic-params',
        product: 'boss',
        children: [
          { title: '系统成员', path: '/boss/settings/members' },
          { title: '平台设置', path: '/boss/settings/platform' },
          { title: '智算平台设置', path: '/boss/settings/rune' },
          { title: '魔哈Hub设置', path: '/boss/settings/moha' },
          { title: '网关设置', path: '/boss/settings/chatapp' },
          { title: 'AI助手设置', path: '/boss/settings/ai-assistant' },
          { title: '许可证', path: '/boss/settings/license' },
        ],
      },
    ],
  },
];
