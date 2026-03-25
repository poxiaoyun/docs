import type { DocsSidebarSection } from '../../toc';

// ----------------------------------------------------------------------

export const REFERENCE_SIDEBAR_SECTIONS: DocsSidebarSection[] = [
  {
    subheader: '参考文档',
    items: [
      {
        title: 'API 概览',
        path: '/reference/api-overview',
        icon: 'ic-file',
        product: 'faq',
      },
      {
        title: '权限设计',
        path: '/reference/permissions',
        icon: 'ic-lock',
        product: 'faq',
      },
      {
        title: '常见问题',
        path: '/reference/faq',
        icon: 'ic-chat',
        product: 'faq',
      },
    ],
  },
];
