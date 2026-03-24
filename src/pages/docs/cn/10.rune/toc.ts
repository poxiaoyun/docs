import type { DocsSidebarSection } from '../../toc';

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
        title: '控制台',
        path: '/docs/rune/console',
        icon: 'ic-dashboard',
        product: 'rune',
        children: [
          { title: '仪表盘', path: '/docs/rune/console/dashboard' },
          { title: '工作空间', path: '/docs/rune/console/workspace' },
          { title: '开发环境', path: '/docs/rune/console/devenv' },
          { title: '模型微调', path: '/docs/rune/console/finetune' },
          { title: '实验管理', path: '/docs/rune/console/experiment' },
          { title: '在线推理', path: '/docs/rune/console/inference' },
          { title: '应用服务', path: '/docs/rune/console/app' },
          { title: '应用市场', path: '/docs/rune/console/app-market' },
          { title: '模型评测', path: '/docs/rune/console/evaluation' },
          { title: '运行记录', path: '/docs/rune/console/logging' },
          { title: '存储挂载', path: '/docs/rune/console/storage' },
          { title: '配额管理', path: '/docs/rune/console/quota' },
          { title: '算力规格', path: '/docs/rune/console/flavor' },
        ],
      },

      {
        title: '对话应用 (ChatApp)',
        path: '/docs/rune/chatapp',
        icon: 'ic-chat',
        product: 'rune',
        children: [
          { title: '模型体验', path: '/docs/rune/chatapp/experience' },
          { title: '多模型对比', path: '/docs/rune/chatapp/compare' },
          { title: '参数调试', path: '/docs/rune/chatapp/debug' },
          { title: 'Token 计算', path: '/docs/rune/chatapp/token' },
        ],
      },
      {
        title: '资源管理',
        path: '/docs/rune/resources',
        icon: 'ic-file',
        product: 'rune',
        children: [
          { title: '实例模板与复用', path: '/docs/rune/resources/templates' },
          { title: '配额与策略', path: '/docs/rune/resources/quotas' },
          { title: '算力规格', path: '/docs/rune/resources/flavors' },
        ],
      },
    ],
  },
];
