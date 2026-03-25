import type { DocsSidebarSection } from '../../toc';

export const MOHA_SIDEBAR_SECTIONS: DocsSidebarSection[] = [
  {
    subheader: '魔哈仓库',
    items: [
      {
        title: '首页',
        path: '/moha',
        icon: 'ic-dashboard',
        deepMatch: false,
        product: 'moha',
      },
      {
        title: '快速开始',
        path: '/moha/quickstart',
        icon: 'ic-analytics',
        product: 'moha',
        children: [
          { title: '快速开始', path: '/moha/quickstart/guide' },
          { title: '账号设置', path: '/moha/quickstart/account' },
          { title: '访问令牌', path: '/moha/quickstart/token' }
        ],
      },
      {
        title: '首页与个人工作台',
        path: '/moha/home',
        icon: 'ic-tour',
        product: 'moha',
        children: [
          { title: '首页概览', path: '/moha/home/overview' },
          { title: '我创建的资源', path: '/moha/home/created-by-me' },
          { title: '组织空间', path: '/moha/home/organizations' },
          { title: '访问令牌与公告', path: '/moha/home/token-announcements' }
        ],
      },
      {
        title: '模型仓库',
        path: '/moha/models', 
        icon: 'ic-course',
        product: 'moha',
        children: [
          { title: '模型广场介绍', path: '/moha/models/intro' },
          { title: '模型的下载', path: '/moha/models/download' },
          { title: '模型的上传', path: '/moha/models/upload' },
          { title: '模型卡片', path: '/moha/models/card' },
          { title: '模型版本', path: '/moha/models/version' }
        ],
      },
      {
        title: '数据集',
        path: '/moha/datasets',
        icon: 'ic-folder',
        product: 'moha',
        children: [
          { title: '数据集介绍', path: '/moha/datasets/info' },
          { title: '数据集的创建', path: '/moha/datasets/create' },
          { title: '数据集的上传', path: '/moha/datasets/upload' },
          { title: '数据集的下载', path: '/moha/datasets/download' },
          { title: '数据集卡片', path: '/moha/datasets/card' },
          { title: '数据集的维护', path: '/moha/datasets/maintain' },
          { title: '数据集文件规范', path: '/moha/datasets/rules' },
        ],
      },
      {
        title: '镜像仓库',
        path: '/moha/images',
        icon: 'ic-product',
        product: 'moha',
        children: [
          { title: '镜像仓库', path: '/moha/images' },
          { title: '镜像列表与筛选', path: '/moha/images/gallery' },
        ],
      },
      {
        title: 'Space 工作空间',
        path: '/moha/spaces',
        icon: 'ic-subpaths',
        product: 'moha',
        children: [
          { title: 'Space 工作空间', path: '/moha/spaces' },
          { title: 'Space 列表与筛选', path: '/moha/spaces/list' },
        ],
      },
      {
        title: '协作',
        path: '/moha/repository',
        icon: 'ic-file',
        product: 'moha',
        children: [
          { title: '仓库详情页结构', path: '/moha/repository/detail' },
          { title: '文件浏览与版本查看', path: '/moha/repository/files' },
          { title: '讨论与协作', path: '/moha/repository/discussion' },
          { title: '仓库设置与发布', path: '/moha/repository/settings' },
        ],
      },
      {
        title: '进阶集成',
        path: '/moha/advanced',
        icon: 'ic-tour',
        product: 'moha',
        children: [
          { title: 'API 集成', path: '/moha/advanced/api' },
          { title: 'CI/CD 流程', path: '/moha/advanced/cicd' },
          { title: '性能优化', path: '/moha/advanced/optimization' },
          { title: '社区贡献', path: '/moha/advanced/contribution' },
        ],
      },
      {
        title: 'SDK 教程',
        path: '/moha/sdk-tutorial',
        icon: 'ic-job',
        product: 'moha',
        children: [
          { title: '快速开始', path: '/moha/sdk-tutorial/quick-start' },
          { title: 'SDK 概述', path: '/moha/sdk-tutorial/intro' },
          { title: '安装与环境配置', path: '/moha/sdk-tutorial/install' },
          { title: '认证与 Token 管理', path: '/moha/sdk-tutorial/authentication' },
          { title: 'CLI 工具参考', path: '/moha/sdk-tutorial/cli-reference' },
          { title: 'HubClient API', path: '/moha/sdk-tutorial/hub-api' },
          { title: '上传下载与同步', path: '/moha/sdk-tutorial/transfer' },
          { title: '数据加密', path: '/moha/sdk-tutorial/encryption' },
          { title: '模型加载与推理', path: '/moha/sdk-tutorial/transformers-datasets' },
          { title: '模型训练与导出', path: '/moha/sdk-tutorial/training-export' },
          { title: '错误处理与 FAQ', path: '/moha/sdk-tutorial/error-handling' },
        ],
      }
    ],
  },
];
