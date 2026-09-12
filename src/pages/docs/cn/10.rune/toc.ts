import type { DocsSidebarSection } from '../../toc';

export const RUNE_SIDEBAR_SECTIONS: DocsSidebarSection[] = [
  {
    subheader: 'Rune 智算平台',
    items: [
      {
        title: '产品概览',
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
    ],
  },
  {
    // 顺序与标题对齐控制台真实侧边栏（src/routes/navs/rune.tsx + navbar 文案）：
    // 首页 → 应用市场 ／ 工作台（推理服务、训练与微调、开发服务、应用实例、我的模板、文件存储）
    // ／ 可观测性（指标、日志、模型评测）
    subheader: 'Rune 控制台',
    items: [
      {
        title: '控制台概览',
        path: '/rune/console',
        icon: 'ic-dashboard',
        product: 'rune',
      },
      { title: '首页', path: '/rune/console/dashboard' },
      { title: '应用市场', path: '/rune/console/app-market' },
      { title: '推理服务', path: '/rune/console/inference' },
      { title: '训练与微调', path: '/rune/console/finetune' },
      { title: '开发服务', path: '/rune/console/devenv' },
      { title: '应用实例', path: '/rune/console/app' },
      { title: '文件存储', path: '/rune/console/storage' },
      { title: '指标', path: '/rune/console/experiment' },
      { title: '日志', path: '/rune/console/logging' },
      { title: '模型评测', path: '/rune/console/evaluation' },
      { title: 'AI 诊断助手', path: '/rune/console/diagnostics' },
    ],
  },
  {
    // 对应产品中「我的模板」菜单与租户设置页签（概览 / 成员 / 配额 / 规格 / 工作空间）
    subheader: '资源与配额',
    items: [
      {
        title: '资源与配额概览',
        path: '/rune/resources',
        icon: 'ic-file',
        product: 'rune',
      },
      { title: '我的模板', path: '/rune/resources/templates' },
      { title: '配额', path: '/rune/console/quota' },
      { title: '规格', path: '/rune/console/flavor' },
      { title: '工作空间', path: '/rune/console/workspace' },
    ],
  },
  {
    // 顶部导航真实文案：模型广场 / 模型体验 / 模型对比 / API 密钥 / 调用分析
    subheader: '对话应用（ChatApp）',
    items: [
      {
        title: '概览',
        path: '/rune/chatapp',
        icon: 'ic-chat',
        product: 'rune',
      },
      { title: '模型广场', path: '/rune/chatapp/marketplace' },
      { title: '模型体验', path: '/rune/chatapp/experience' },
      { title: '模型对比', path: '/rune/chatapp/compare' },
      { title: 'API 密钥', path: '/rune/chatapp/token' },
      { title: '调用分析', path: '/rune/chatapp/usage-statistics' },
      { title: '参数调优', path: '/rune/chatapp/debug' },
    ],
  },
];
