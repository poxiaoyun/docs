import type { DocsSidebarSection } from '../../toc';

// ----------------------------------------------------------------------

export const ECOSYSTEM_SIDEBAR_SECTIONS: DocsSidebarSection[] = [
  {
    subheader: '生态文档',
    items: [
      {
        title: '首页',
        path: '/docs/ecosystem',
        icon: 'ic-dashboard',
        product: 'ecosystem',
      },
      {
        title: '华为（昇腾 Ascend）',
        path: '/docs/ecosystem/huawei',
        icon: 'ic-file',
        product: 'ecosystem',
        children: [
          { title: '驱动与运行时', path: '/docs/ecosystem/huawei/driver-runtime' },
          { title: '镜像与环境', path: '/docs/ecosystem/huawei/images-env' },
          { title: '适配与调优', path: '/docs/ecosystem/huawei/porting-tuning' },
          { title: '排障与 FAQ', path: '/docs/ecosystem/huawei/troubleshooting' },
        ],
      },
      {
        title: '海光（DCU）',
        path: '/docs/ecosystem/hygon',
        icon: 'ic-file',
        product: 'ecosystem',
        children: [
          { title: '驱动与运行时', path: '/docs/ecosystem/hygon/driver-runtime' },
          { title: '镜像与环境', path: '/docs/ecosystem/hygon/images-env' },
          { title: '适配与调优', path: '/docs/ecosystem/hygon/porting-tuning' },
          { title: '排障与 FAQ', path: '/docs/ecosystem/hygon/troubleshooting' },
        ],
      },
      {
        title: '其他开源社区',
        path: '/docs/ecosystem/open-source',
        icon: 'ic-course',
        product: 'ecosystem',
        children: [
          { title: '容器与编排', path: '/docs/ecosystem/open-source/container-orchestration' },
          { title: '框架与推理生态', path: '/docs/ecosystem/open-source/framework-inference' },
          { title: '可观测与运维', path: '/docs/ecosystem/open-source/observability-ops' },
          { title: '制品与安全', path: '/docs/ecosystem/open-source/artifacts-security' },
          { title: 'FAQ', path: '/docs/ecosystem/open-source/faq' },
        ],
      },
    ],
  },
];
