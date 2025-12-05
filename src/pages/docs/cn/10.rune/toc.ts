import type { DocsSidebarSection } from '../../toc';

// ----------------------------------------------------------------------

export const RUNE_SIDEBAR_SECTIONS: DocsSidebarSection[] = [
  {
    subheader: 'Rune 智算平台',
    items: [
      {
        title: '首页',
        path: '/docs/rune',
        icon: 'ic-tour',
        product: 'rune',
      },
      {
        title: '开始使用',
        path: '/docs/rune/guide',
        icon: 'ic-analytics',
        product: 'rune',
        children: [
          { title: '环境准备', path: '/docs/rune/guide/prerequisites' },
          { title: '创建工作负载', path: '/docs/rune/guide/workloads' },
          { title: '推理托管', path: '/docs/rune/guide/inference' },
        ],
      },
      {
        title: '资源管理',
        path: '/docs/rune/resources',
        icon: 'ic-file',
        product: 'rune',
        children: [
          { title: '镜像与模板', path: '/docs/rune/resources/templates' },
          { title: '配额与策略', path: '/docs/rune/resources/quotas' },
        ],
      },
    ],
  },
];
