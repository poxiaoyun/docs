import type { DocsSidebarSection } from '../../toc';

// ----------------------------------------------------------------------

export const REFERENCE_SIDEBAR_SECTIONS: DocsSidebarSection[] = [
  {
    subheader: '参考文档',
    items: [
      {
        title: '参考文档',
        path: '/reference',
        icon: 'ic-file',
        product: 'faq',
      },
      {
        title: 'API 概览',
        path: '/reference/api-overview',
        icon: 'ic-external',
        product: 'faq',
      },
      {
        title: '权限设计',
        path: '/reference/permissions',
        icon: 'ic-lock',
        product: 'faq',
      },
      {
        title: '构建与环境',
        path: '/reference/build-and-env',
        icon: 'ic-params',
        product: 'faq',
      },
      {
        title: '常见问题 FAQ',
        path: '/reference/faq',
        icon: 'ic-chat',
        product: 'faq',
      },
    ],
  },
];
