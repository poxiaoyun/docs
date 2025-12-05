import type { TocItem } from './use-markdown-toc';

import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';

// ----------------------------------------------------------------------

export type DocsSidebarItem = {
  title: string;
  path: string;
  icon?: string;
  deepMatch?: boolean;
  product?: 'rune' | 'boss' | 'moha' | 'faq';
  children?: DocsSidebarItem[];
};

export type DocsSidebarSection = {
  subheader?: string;
  items: DocsSidebarItem[];
};

export const DOCS_SIDEBAR_SECTIONS: DocsSidebarSection[] = [
  {
    subheader: '概览',
    items: [
      {
        title: '平台总览',
        path: '/docs/introduction',
        icon: 'ic-dashboard',
        deepMatch: true,
      },
    ],
  },
  {
    subheader: 'Rune',
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
        title: '资源管理',
        path: '/docs/rune/resources',
        icon: 'ic-file',
        product: 'rune',
        children: [
          { title: '镜像与模板', path: '/docs/rune/resources/templates' },
          { title: '配额与策略', path: '/docs/rune/resources/quotas' },
        ],
      },
    ],
  },
  {
    subheader: 'BOSS',
    items: [
      {
        title: '首页',
        path: '/docs/boss',
        icon: 'ic-params',
        product: 'boss',
      },
      {
        title: '平台治理',
        path: '/docs/boss/operations',
        icon: 'ic-analytics',
        product: 'boss',
        children: [
          { title: '集群管理', path: '/docs/boss/operations/clusters' },
          { title: '租户与配额', path: '/docs/boss/operations/tenants' },
          { title: '网关审核', path: '/docs/boss/operations/gateway' },
        ],
      },
      {
        title: '系统模板',
        path: '/docs/boss/templates',
        icon: 'ic-file',
        product: 'boss',
      },
    ],
  },
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
          { title: '新手指南', path: '/docs/moha/quickstart/guide' },
          { title: '账户设置', path: '/docs/moha/quickstart/account' },
          { title: '权限管理', path: '/docs/moha/quickstart/permissions' },
        ],
      },
      {
        title: '模型库',
        path: '/docs/moha/models',
        icon: 'ic-user',
        product: 'moha',
        children: [
          { title: '模型创建', path: '/docs/moha/models/create' },
          { title: '版本管理', path: '/docs/moha/models/versions' },
          { title: '模型审核', path: '/docs/moha/models/review' },
          { title: '模型卡片', path: '/docs/moha/models/card' },
        ],
      },
      {
        title: '数据集',
        path: '/docs/moha/datasets',
        icon: 'ic-file',
        product: 'moha',
        children: [
          { title: '数据集创建', path: '/docs/moha/datasets/create' },
          { title: '数据治理', path: '/docs/moha/datasets/governance' },
          { title: '数据标注', path: '/docs/moha/datasets/annotation' },
          { title: '数据安全', path: '/docs/moha/datasets/security' },
        ],
      },
      {
        title: 'Notebook',
        path: '/docs/moha/notebook',
        icon: 'ic-label',
        product: 'moha',
        children: [
          { title: '环境配置', path: '/docs/moha/notebook/environment' },
          { title: '资源管理', path: '/docs/moha/notebook/resources' },
          { title: '协作开发', path: '/docs/moha/notebook/collaboration' },
          { title: '持久化存储', path: '/docs/moha/notebook/storage' },
        ],
      },
      {
        title: '高阶使用',
        path: '/docs/moha/advanced',
        icon: 'ic-lock',
        product: 'moha',
        children: [
          { title: 'API 集成', path: '/docs/moha/advanced/api' },
          { title: 'CI/CD 流程', path: '/docs/moha/advanced/cicd' },
          { title: '性能优化', path: '/docs/moha/advanced/optimization' },
          { title: '社区贡献', path: '/docs/moha/advanced/contribution' },
        ],
      },
    ],
  },
  {
    subheader: 'F&Q / 故障排查',
    items: [
      {
        title: '常见问题与故障排查',
        path: '/docs/faq',
        icon: 'ic-mail',
        product: 'faq',
        children: [
          { title: '常见问题', path: '/docs/faq/troubleshooting', icon: 'ic-mail' },
          { title: '状态监控', path: '/docs/faq/status', icon: 'ic-chat' },
        ],
      },
    ],
  },
];

// ----------------------------------------------------------------------

type Props = {
  toc: TocItem[];
};

export function Toc({ toc }: Props) {
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const handleScroll = () => {
      // Simple active state detection based on scroll position
      // Find the last header that is above the viewport center
      let currentId = '';
      const offset = 100;

      for (const item of toc) {
        const element = document.getElementById(item.id);
        if (element && window.scrollY + offset >= element.offsetTop) {
          currentId = item.id;
        }
      }

      if (currentId) {
        setActiveId(currentId);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [toc]);

  if (!toc.length) return null;

  return (
    <Box
      component="nav"
      sx={{
        position: 'sticky',
        top: 80, // Adjust based on header height
        width: '100%',
        maxHeight: 'calc(100vh - 100px)',
        overflowY: 'auto',
        pl: 2,
      }}
    >
      <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
        {toc.map((item) => (
          <Box component="li" key={item.id} sx={{ mb: 1 }}>
            <Link
              href={`#${item.id}`}
              color="inherit"
              underline="none"
              sx={{
                display: 'block',
                fontSize: '0.875rem',
                color: activeId === item.id ? 'primary.main' : 'text.secondary',
                fontWeight: activeId === item.id ? 'fontWeightBold' : 'fontWeightMedium',
                pl: (item.level - 1) * 2,
                borderLeft: (theme) =>
                  `2px solid ${activeId === item.id ? theme.palette.primary.main : 'transparent'}`,
                ml: -2,
                paddingLeft: (theme) =>
                  `calc(${theme.spacing((item.level - 1) * 2)} + ${theme.spacing(2)} - 2px)`,
                '&:hover': {
                  color: 'primary.main',
                },
              }}
              onClick={(e) => {
                e.preventDefault();
                const element = document.getElementById(item.id);
                if (element) {
                  const offset = 80; // Header offset
                  const bodyRect = document.body.getBoundingClientRect().top;
                  const elementRect = element.getBoundingClientRect().top;
                  const elementPosition = elementRect - bodyRect;
                  const offsetPosition = elementPosition - offset;

                  window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth',
                  });
                  window.history.pushState(null, '', `#${item.id}`);
                }
              }}
            >
              {item.title}
            </Link>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
