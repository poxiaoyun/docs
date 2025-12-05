import type { DocsSidebarSection } from '../../toc';

// ----------------------------------------------------------------------

export const MOHA_SIDEBAR_SECTIONS: DocsSidebarSection[] = [
  {
    subheader: '魔哈仓库',
    items: [
      {
        title: '首页',
        path: '/docs/moha',
        icon: 'ic-booking',
        product: 'moha',
      },
      {
        title: '快速开始',
        path: '/docs/moha/quickstart',
        icon: 'ic-analytics',
        product: 'moha',
        children: [
          { title: '快速开始', path: '/docs/moha/quickstart/guide' },
          { title: '账号设置', path: '/docs/moha/quickstart/guide' }
        ],
      },
      {
        title: '模型广场',
        path: '/docs/moha/models',
        icon: 'ic-user',
        product: 'moha',
        children: [
          { title: '模型广场介绍', path: '/docs/moha/models/intro' },
          { title: '模型的下载', path: '/docs/moha/models/download' },
          { title: '模型的上传', path: '/docs/moha/models/upload' },
          { title: '模型卡片', path: '/docs/moha/models/card' },
          { title: '模型版本', path: '/docs/moha/models/version' }
        ],
      },
      {
        title: '数据集',
        path: '/docs/moha/datasets',
        icon: 'ic-file',
        product: 'moha',
        children: [
          { title: '数据集介绍', path: '/docs/moha/datasets/info' },
          { title: '数据集的创建', path: '/docs/moha/datasets/create' },
          { title: '数据集的上传', path: '/docs/moha/datasets/upload' },
          { title: '数据集的下载', path: '/docs/moha/datasets/download' },
          { title: '数据集卡片', path: '/docs/moha/datasets/card' },
          { title: '数据集的维护', path: '/docs/moha/datasets/maintain' },
          { title: '数据集文件规范', path: '/docs/moha/datasets/rules' },
        ],
      },
      {
        title: '应用市场',
        path: '/docs/moha/marketplace',
        icon: 'ic-label',
        product: 'moha',
        children: [
          { title: '应用市场介绍', path: '/docs/moha/marketplace/intro' },
          { title: '应用的创建', path: '/docs/moha/marketplace/create' },
          { title: '应用制品的上传', path: '/docs/moha/marketplace/upload' },
          { title: '应用部署', path: '/docs/moha/marketplace/deploy' },
          { title: '应用的维护', path: '/docs/moha/marketplace/maintain' },
          { title: '应用打包规范', path: '/docs/moha/marketplace/package' },
        ],
      },
      {
        title: '模型接入流程',
        path: '/docs/moha/model-integration',
        icon: 'ic-lock',
        product: 'moha',
        children: [
          { title: 'API 集成', path: '/docs/moha/advanced/api' },
          { title: 'CI/CD 流程', path: '/docs/moha/advanced/cicd' },
          { title: '性能优化', path: '/docs/moha/advanced/optimization' },
          { title: '社区贡献', path: '/docs/moha/advanced/contribution' },
        ],
      },
      {
        title: 'SDK 教程',
        path: '/docs/moha/sdk-tutorial',
        icon: 'ic-lock',
        product: 'moha',
        children: [
          { title: 'SDK 介绍', path: '/docs/moha/sdk/intro' },
          { title: '命令行介绍', path: '/docs/moha/sdk/usage' },
          { title: '模型加载和预处理', path: '/docs/moha/sdk/model-load' },
          { title: '模型推理pipeline', path: '/docs/moha/sdk/pipeline' },
          { title: '数据集使用指南', path: '/docs/moha/sdk/dataset' },
          { title: '模型的训练', path: '/docs/moha/sdk/model-training' },
          { title: '模型的导出', path: '/docs/moha/sdk/model-export' },
        ],
      }
    ],
  },
];
