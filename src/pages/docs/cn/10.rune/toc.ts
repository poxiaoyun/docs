import type { DocsSidebarSection } from '../../toc';

export const RUNE_SIDEBAR_SECTIONS: DocsSidebarSection[] = [
  {
    subheader: 'Rune 智算平台',
    items: [
      {
        title: '首页',
        path: '/rune',
        icon: 'ic-tour',
        product: 'rune',
      },
      {
        title: '开始使用',
        path: '/rune/guide',
        icon: 'ic-analytics',
        product: 'rune',
        children: [
          { title: '环境准备', path: '/rune/guide/prerequisites' },
          { title: '创建工作负载', path: '/rune/guide/workloads' },
          { title: '推理托管', path: '/rune/guide/inference' },
        ],
      },
      {
        title: '控制台',
        path: '/rune/console',
        icon: 'ic-dashboard',
        product: 'rune',
        children: [
          { title: '仪表盘', path: '/rune/console/dashboard' },
          { title: '工作空间', path: '/rune/console/workspace' },
          { title: '开发环境', path: '/rune/console/devenv' },
          { title: '模型微调', path: '/rune/console/finetune' },
          { title: '实验管理', path: '/rune/console/experiment' },
          { title: '在线推理', path: '/rune/console/inference' },
          { title: '应用服务', path: '/rune/console/app' },
          { title: '应用市场', path: '/rune/console/app-market' },
          { title: '模型评测', path: '/rune/console/evaluation' },
          { title: '运行记录', path: '/rune/console/logging' },
          { title: '存储挂载', path: '/rune/console/storage' },
          { title: '配额管理', path: '/rune/console/quota' },
          { title: '算力规格', path: '/rune/console/flavor' },
        ],
      },

      {
        title: '对话应用 (ChatApp)',
        path: '/rune/chatapp',
        icon: 'ic-chat',
        product: 'rune',
        children: [
          { title: '模型体验', path: '/rune/chatapp/experience' },
          { title: '多模型对比', path: '/rune/chatapp/compare' },
          { title: '参数调试', path: '/rune/chatapp/debug' },
          { title: 'Token 计算', path: '/rune/chatapp/token' },
        ],
      },
      {
        title: '资源管理',
        path: '/rune/resources',
        icon: 'ic-file',
        product: 'rune',
        children: [
          { title: '实例模板与复用', path: '/rune/resources/templates' },
          { title: '配额与策略', path: '/rune/resources/quotas' },
          { title: '算力规格', path: '/rune/resources/flavors' },
        ],
      },
    ],
  },
];
