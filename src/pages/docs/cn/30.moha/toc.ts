import type { DocsSidebarSection } from '../../toc';

export const MOHA_SIDEBAR_SECTIONS: DocsSidebarSection[] = [
  {
    subheader: '魔哈仓库',
    items: [
      {
        title: '首页',
        path: '/docs/moha',
        icon: 'ic-dashboard',
        deepMatch: false,
        product: 'moha',
      },
      {
        title: '快速开始',
        path: '/docs/moha/quickstart',
        icon: 'ic-analytics',
        product: 'moha',
        children: [
          { title: '快速开始', path: '/docs/moha/quickstart/guide' },
          { title: '账号设置', path: '/docs/moha/quickstart/account' },
          { title: '访问令牌', path: '/docs/moha/quickstart/token' }
        ],
      },
      {
        title: '首页与个人工作台',
        path: '/docs/moha/home',
        icon: 'ic-tour',
        product: 'moha',
        children: [
          { title: '首页概览', path: '/docs/moha/home/overview' },
          { title: '我创建的资源', path: '/docs/moha/home/created-by-me' },
          { title: '组织空间', path: '/docs/moha/home/organizations' },
          { title: '访问令牌与公告', path: '/docs/moha/home/token-announcements' }
        ],
      },
      {
        title: '模型仓库',
        path: '/docs/moha/models', 
        icon: 'ic-course',
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
        icon: 'ic-folder',
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
        title: '镜像仓库',
        path: '/docs/moha/images',
        icon: 'ic-product',
        product: 'moha',
        children: [
          { title: '镜像仓库', path: '/docs/moha/images' },
          { title: '镜像列表与筛选', path: '/docs/moha/images/gallery' },
        ],
      },
      {
        title: 'Space 工作空间',
        path: '/docs/moha/spaces',
        icon: 'ic-subpaths',
        product: 'moha',
        children: [
          { title: 'Space 工作空间', path: '/docs/moha/spaces' },
          { title: 'Space 列表与筛选', path: '/docs/moha/spaces/list' },
        ],
      },
      {
        title: '协作',
        path: '/docs/moha/repository',
        icon: 'ic-file',
        product: 'moha',
        children: [
          { title: '仓库详情页结构', path: '/docs/moha/repository/detail' },
          { title: '文件浏览与版本查看', path: '/docs/moha/repository/files' },
          { title: '讨论与协作', path: '/docs/moha/repository/discussion' },
          { title: '仓库设置与发布', path: '/docs/moha/repository/settings' },
        ],
      },
      {
        title: '进阶集成',
        path: '/docs/moha/advanced',
        icon: 'ic-tour',
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
        icon: 'ic-job',
        product: 'moha',
        children: [
          { title: '快速开始', path: '/docs/moha/sdk-tutorial/quick-start' },
          { title: 'SDK 概述', path: '/docs/moha/sdk-tutorial/intro' },
          { title: '安装与环境配置', path: '/docs/moha/sdk-tutorial/install' },
          { title: '认证与 Token 管理', path: '/docs/moha/sdk-tutorial/authentication' },
          { title: 'CLI 工具参考', path: '/docs/moha/sdk-tutorial/cli-reference' },
          { title: 'HubClient API', path: '/docs/moha/sdk-tutorial/hub-api' },
          { title: '上传下载与同步', path: '/docs/moha/sdk-tutorial/transfer' },
          { title: '数据加密', path: '/docs/moha/sdk-tutorial/encryption' },
          { title: '模型加载与推理', path: '/docs/moha/sdk-tutorial/transformers-datasets' },
          { title: '模型训练与导出', path: '/docs/moha/sdk-tutorial/training-export' },
          { title: '错误处理与 FAQ', path: '/docs/moha/sdk-tutorial/error-handling' },
        ],
      }
    ],
  },
];
