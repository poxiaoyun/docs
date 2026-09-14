import type { DocsSidebarSection } from '../../toc';

// ----------------------------------------------------------------------
// 聚合网关（英文 AIrouter）：由原「对话应用（ChatApp）」独立出来的顶级入口（原挂在 10.rune 下）。
// 这是文档对该子系统的统一称呼；它在界面上默认显示为「模型体验」（英文 Playground），
// 名称可由管理员在 Boss 运营平台 → 网关设置里修改。
//
// 体例（与 10.rune / 20.boss / 30.moha 的 toc 保持一致）：
//   1. subheader = 一级分组名，取产品界面真源文案；不与本节任何条目重名，
//      否则侧边栏会出现两行同样的字；
//   2. 分组的落地索引页排在组内首位，标签用「…概览」与 subheader 区分；
//   3. 只有「组节点路径是其子项路径前缀」时才用 children 嵌套 —— 侧边栏靠路径前缀
//      判断活跃并自动展开，前缀不成立时刷新子页会让该组折叠、当前页在侧边栏里消失。
//      本分区各页平铺在同一层、路径互不为前缀，故不用 children；
//   4. 路径是同级其它条目前缀的落地页要显式写 deepMatch: false（这里是 /airouter），
//      否则它会常驻高亮；
//   5. 每个 subheader 至少一个顶层条目带 product，否则布局层 filteredSections 会把整节静默滤掉；
//   6. 一级条目一律带 icon —— 模板里 depth=1 的行按「带图标」排版，漏写会让该行标题左移 34px、
//      同一个列表左右参差。图标名取自 public/assets/icons/navbar 的 27 个双色图标；
//      同一个 subheader 分段内不重复（侧边栏一屏能对比到），分段之间可以复用。
//
// 条目文案 = 该子系统顶部导航的真实文案（模型广场 / 模型体验 / 模型对比 /
// API 密钥 / 调用分析），参数配置是页内弹窗、无顶部入口，但文档有独立页，故一并列出。
// ----------------------------------------------------------------------

export const AIROUTER_SIDEBAR_SECTIONS: DocsSidebarSection[] = [
  {
    subheader: '聚合网关',
    items: [
      {
        title: '概览',
        path: '/airouter',
        icon: 'ic-tour',
        deepMatch: false,
        product: 'airouter',
      },
      { title: '模型广场', path: '/airouter/marketplace', icon: 'ic-ecommerce' },
      { title: '模型体验', path: '/airouter/experience', icon: 'ic-chat' },
      { title: '模型对比', path: '/airouter/compare', icon: 'ic-kanban' },
      { title: 'API 密钥', path: '/airouter/token', icon: 'ic-lock' },
      { title: '调用分析', path: '/airouter/usage-statistics', icon: 'ic-analytics' },
      { title: '参数配置', path: '/airouter/debug', icon: 'ic-params' },
    ],
  },
];
