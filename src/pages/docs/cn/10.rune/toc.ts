import type { DocsSidebarSection } from '../../toc';

// ----------------------------------------------------------------------
// 分类口径 = 控制台自己的分组
// （XiaoShi-Rune-Console/src/routes/navs/rune.tsx + locales/langs/cn/navbar.json）
// 控制台侧边栏共三组：首页（navbar.dashboard）／工作台（navbar.pai）／可观测性（navbar.observability）。
// 本分区把它们各自拆成独立分段，类别名常驻可见，不必逐级展开。
//
// 体例（与 20.boss/toc.ts 保持一致）：
//   1. subheader = 一级分组名，取产品界面真源文案；不与本节任何条目重名，
//      否则侧边栏会出现两行同样的字；
//   2. 分组的落地索引页排在组内首位，标签用「…概览」与 subheader 区分；
//   3. 只有「组节点路径是其子项路径前缀」时才用 children 嵌套 —— 侧边栏靠路径前缀
//      判断活跃并自动展开，前缀不成立时刷新子页会让该组折叠、当前页在侧边栏里消失。
//      本分区只有「开始使用」满足，控制台的三组用 subheader 承载；
//   4. 路径是同级其它条目前缀的落地页要显式写 deepMatch: false（如 /rune、/rune/console、
//      /rune/resources），否则它会常驻高亮；
//   5. 每个 subheader 至少一个顶层条目带 product，否则布局层 filteredSections 会把整节静默滤掉。
// ----------------------------------------------------------------------

export const RUNE_SIDEBAR_SECTIONS: DocsSidebarSection[] = [
  {
    subheader: 'Rune 智算平台',
    items: [
      {
        title: '产品概览',
        path: '/rune',
        icon: 'ic-tour',
        deepMatch: false,
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
    // 控制台第一组：首页（navbar.dashboard）= 首页 + 应用市场
    subheader: 'Rune 控制台',
    items: [
      {
        title: '控制台概览',
        path: '/rune/console',
        icon: 'ic-dashboard',
        deepMatch: false,
        product: 'rune',
      },
      { title: '首页', path: '/rune/console/dashboard' },
      { title: '应用市场', path: '/rune/console/app-market' },
    ],
  },
  {
    // 控制台第二组：工作台（navbar.pai）
    // 「我的模板」（navbar.instance_template）在产品里同样挂在这一组下。
    subheader: 'Rune 控制台 · 工作台',
    items: [
      { title: '推理服务', path: '/rune/console/inference', product: 'rune' },
      { title: '训练与微调', path: '/rune/console/finetune' },
      { title: '开发服务', path: '/rune/console/devenv' },
      { title: '应用实例', path: '/rune/console/app' },
      { title: '我的模板', path: '/rune/resources/templates' },
      { title: '文件存储', path: '/rune/console/storage' },
    ],
  },
  {
    // 控制台第三组：可观测性（navbar.observability）
    // AI 诊断助手在控制台里是右侧悬浮助手、不在侧边栏导航中，文档归到本组
    // （都是「出问题回头看数据」的入口）。
    subheader: 'Rune 控制台 · 可观测性',
    items: [
      { title: '指标', path: '/rune/console/experiment', product: 'rune' },
      { title: '日志', path: '/rune/console/logging' },
      { title: '模型评测', path: '/rune/console/evaluation' },
      { title: 'AI 诊断助手', path: '/rune/console/diagnostics' },
    ],
  },
  {
    // 租户侧的资源入口：模板、配额、规格（资源规格）、工作空间（对应租户设置页签）
    subheader: 'Rune 控制台 · 资源与配额',
    items: [
      {
        title: '资源与配额概览',
        path: '/rune/resources',
        icon: 'ic-file',
        deepMatch: false,
        product: 'rune',
      },
      { title: '配额', path: '/rune/console/quota' },
      { title: '规格', path: '/rune/console/flavor' },
      { title: '工作空间', path: '/rune/console/workspace' },
    ],
  },
];
