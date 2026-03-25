import type { DocsSidebarSection } from '../../toc';

// ----------------------------------------------------------------------

export const BOSS_SIDEBAR_SECTIONS: DocsSidebarSection[] = [
  {
    subheader: 'Boss 运营平台',
    items: [
      {
        title: '首页',
        path: '/boss',
        icon: 'ic-params',
        product: 'boss',
      },
      {
        title: 'IAM 身份管理',
        path: '/boss/iam',
        icon: 'ic-lock',
        product: 'boss',
        children: [
          { title: '用户管理', path: '/boss/iam/users' },
          { title: '租户管理', path: '/boss/iam/tenants' },
        ],
      },
      {
        title: '平台治理',
        path: '/boss/operations',
        icon: 'ic-analytics',
        product: 'boss',
        children: [
          { title: '集群管理', path: '/boss/operations/clusters' },
          { title: '租户与配额', path: '/boss/operations/tenants' },
          { title: '网关审核', path: '/boss/operations/gateway' },
        ],
      },
      {
        title: '系统模板',
        path: '/boss/templates',
        icon: 'ic-file',
        product: 'boss',
      },
      {
        title: 'LLM 网关',
        path: '/boss/gateway',
        icon: 'ic-blog',
        product: 'boss',
        children: [
          { title: '渠道管理', path: '/boss/gateway/channels' },
          { title: 'API Key', path: '/boss/gateway/api-keys' },
          { title: '网关配置', path: '/boss/gateway/config' },
          { title: '内容审核', path: '/boss/gateway/moderation' },
          { title: '运营管理', path: '/boss/gateway/operations' },
          { title: '审计日志', path: '/boss/gateway/audit' },
          { title: '服务注册', path: '/boss/gateway/service-reg' },
        ],
      },
      {
        title: '系统设置',
        path: '/boss/settings',
        icon: 'ic-params',
        product: 'boss',
        children: [
          { title: '平台设置', path: '/boss/settings/platform' },
          { title: 'Rune 设置', path: '/boss/settings/rune' },
          { title: 'Moha 设置', path: '/boss/settings/moha' },
          { title: 'ChatApp 设置', path: '/boss/settings/chatapp' },
          { title: '动态仪表盘', path: '/boss/settings/dynamic-dashboard' },
          { title: '成员管理', path: '/boss/settings/members' },
          { title: '许可证管理', path: '/boss/settings/license' },
        ],
      },
      {
        title: 'Rune 智算管理',
        path: '/boss/rune-admin',
        icon: 'ic-tour',
        product: 'boss',
        children: [
          { title: '集群管理', path: '/boss/rune-admin/clusters' },
          { title: '集群总览', path: '/boss/rune-admin/cluster-overview' },
          { title: 'Kubernetes 资源浏览', path: '/boss/rune-admin/resources' },
          { title: '节点与 GPU 仪表盘', path: '/boss/rune-admin/nodes-gpu' },
          { title: '存储与运行时服务', path: '/boss/rune-admin/storage-runtime' },
          { title: '监控、日志与调度', path: '/boss/rune-admin/observability' },
          { title: '资源池管理', path: '/boss/rune-admin/resource-pools' },
          { title: '租户与配额', path: '/boss/rune-admin/tenants' },
          { title: '算力规格管理', path: '/boss/rune-admin/flavors' },
          { title: '私有镜像', path: '/boss/rune-admin/templates' },
          { title: '系统镜像市场', path: '/boss/rune-admin/system-market' },
          { title: '内置系统镜像', path: '/boss/rune-admin/systems' },
        ],
      },
      {
        title: 'Moha 管理',
        path: '/boss/moha-admin',
        icon: 'ic-course',
        product: 'boss',
        children: [
          { title: '模型管理', path: '/boss/moha-console/model' },
          { title: '模型审核', path: '/boss/moha-admin/models' },
          { title: '数据集管理', path: '/boss/moha-console/dataset' },
          { title: '数据集审核', path: '/boss/moha-admin/datasets' },
          { title: '镜像仓库', path: '/boss/moha-console/image' },
          { title: '镜像审核', path: '/boss/moha-admin/images' },
          { title: 'Space 管理', path: '/boss/moha-console/space' },
          { title: 'Space 运维', path: '/boss/moha-admin/spaces' },
          { title: '镜像源配置', path: '/boss/moha-admin/mirrors' },
          { title: '组织管理', path: '/boss/moha-console/organization' },
          { title: 'Token 访问', path: '/boss/moha-console/token' },
        ],
      },
    ],
  },
];
