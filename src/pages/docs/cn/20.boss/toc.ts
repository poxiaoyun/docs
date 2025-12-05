import type { DocsSidebarSection } from '../../toc';

// ----------------------------------------------------------------------

export const BOSS_SIDEBAR_SECTIONS: DocsSidebarSection[] = [
  {
    subheader: 'Boss 运营平台',
    items: [
      {
        title: '首页',
        path: '/docs/boss',
        icon: 'ic-params',
        product: 'boss',
      },
      {
        title: '平台治理',
        path: '/docs/boss/operations',
        icon: 'ic-analytics',
        product: 'boss',
        children: [
          { title: '集群管理', path: '/docs/boss/operations/clusters' },
          { title: '租户与配额', path: '/docs/boss/operations/tenants' },
          { title: '网关审核', path: '/docs/boss/operations/gateway' },
        ],
      },
      {
        title: '系统模板',
        path: '/docs/boss/templates',
        icon: 'ic-file',
        product: 'boss',
      },
    ],
  },
];
