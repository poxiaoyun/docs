import type { TocItem } from './use-markdown-toc';

import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';

import { RUNE_SIDEBAR_SECTIONS as RUNE_SIDEBAR_SECTIONS_EN } from './en/10.rune/toc';
import { BOSS_SIDEBAR_SECTIONS as BOSS_SIDEBAR_SECTIONS_EN } from './en/20.boss/toc';
import { MOHA_SIDEBAR_SECTIONS as MOHA_SIDEBAR_SECTIONS_EN } from './en/30.moha/toc';
import { RUNE_SIDEBAR_SECTIONS as RUNE_SIDEBAR_SECTIONS_CN } from './cn/10.rune/toc';
import { BOSS_SIDEBAR_SECTIONS as BOSS_SIDEBAR_SECTIONS_CN } from './cn/20.boss/toc';
import { MOHA_SIDEBAR_SECTIONS as MOHA_SIDEBAR_SECTIONS_CN } from './cn/30.moha/toc';
import { ECOSYSTEM_SIDEBAR_SECTIONS as ECOSYSTEM_SIDEBAR_SECTIONS_EN } from './en/40.ecosystem/toc';
import { REFERENCE_SIDEBAR_SECTIONS as REFERENCE_SIDEBAR_SECTIONS_EN } from './en/50.reference/toc';
import { ECOSYSTEM_SIDEBAR_SECTIONS as ECOSYSTEM_SIDEBAR_SECTIONS_CN } from './cn/40.ecosystem/toc';
import { REFERENCE_SIDEBAR_SECTIONS as REFERENCE_SIDEBAR_SECTIONS_CN } from './cn/50.reference/toc';

// ----------------------------------------------------------------------

export type DocsSidebarItem = {
  title: string;
  path: string;
  icon?: string;
  deepMatch?: boolean;
  product?: 'rune' | 'boss' | 'moha' | 'ecosystem' | 'faq';
  children?: DocsSidebarItem[];
};

export type DocsSidebarSection = {
  subheader?: string;
  items: DocsSidebarItem[];
};

// 概览部分
const OVERVIEW_SIDEBAR_SECTIONS_CN: DocsSidebarSection[] = [
  {
    subheader: '概览',
    items: [
      {
        title: '产品概述',
        path: '/introduction',
        icon: 'ic-dashboard',
        deepMatch: true,
      },
      {
        title: '快速指南',
        path: '/guide',
        icon: 'ic-analytics',
        children: [
          { title: '快速开始', path: '/guide/quick-start' },
          { title: '平台概念', path: '/guide/architecture' },
          { title: '术语表', path: '/guide/glossary' },
        ],
      },
      {
        title: '账号与权限',
        path: '/account',
        icon: 'ic-lock',
        children: [
          { title: '认证与登录', path: '/account/auth' },
          { title: '登录', path: '/account/auth/login' },
          { title: '注册', path: '/account/auth/register' },
          { title: '重置密码', path: '/account/auth/reset-password' },
          { title: '多因素认证 (MFA)', path: '/account/auth/mfa' },
          { title: '选择/注册租户', path: '/account/auth/select-tenant' },
          { title: '角色与权限', path: '/account/auth/roles' },
          { title: '个人中心', path: '/account/iam' },
          { title: '个人信息', path: '/account/iam/profile' },
          { title: '安全设置', path: '/account/iam/security' },
          { title: 'IAM API Key（AK/SK）', path: '/account/iam/api-key' },
          { title: 'SSH Key 管理', path: '/account/iam/ssh-key' },
          { title: '租户管理', path: '/account/iam/tenant' },
          { title: '主题设置', path: '/account/iam/theme' },
        ],
      },
    ],
  },
];

const OVERVIEW_SIDEBAR_SECTIONS_EN: DocsSidebarSection[] = [
  {
    subheader: 'Overview',
    items: [
      {
        title: 'Product Overview',
        path: '/introduction',
        icon: 'ic-dashboard',
        deepMatch: true,
      },
      {
        title: 'Quick Guide',
        path: '/guide',
        icon: 'ic-analytics',
        children: [
          { title: 'Quick Start', path: '/guide/quick-start' },
          { title: 'Platform Concepts', path: '/guide/architecture' },
          { title: 'Glossary', path: '/guide/glossary' },
        ],
      },
      {
        title: 'Account & Access',
        path: '/account',
        icon: 'ic-lock',
        children: [
          { title: 'Authentication', path: '/account/auth' },
          { title: 'Login', path: '/account/auth/login' },
          { title: 'Registration', path: '/account/auth/register' },
          { title: 'Reset Password', path: '/account/auth/reset-password' },
          { title: 'Multi-Factor Authentication (MFA)', path: '/account/auth/mfa' },
          { title: 'Select / Register Tenant', path: '/account/auth/select-tenant' },
          { title: 'Roles and Permissions', path: '/account/auth/roles' },
          { title: 'Personal Center', path: '/account/iam' },
          { title: 'User Profile', path: '/account/iam/profile' },
          { title: 'Security Settings', path: '/account/iam/security' },
          { title: 'IAM API Key (AK/SK)', path: '/account/iam/api-key' },
          { title: 'SSH Key Management', path: '/account/iam/ssh-key' },
          { title: 'Tenant Management', path: '/account/iam/tenant' },
          { title: 'Theme & Preferences', path: '/account/iam/theme' },
        ],
      },
    ],
  },
];

export function getDocsSidebarSections(lang?: string): DocsSidebarSection[] {
  const isEnglish = lang === 'en';

  return [
    ...(isEnglish ? OVERVIEW_SIDEBAR_SECTIONS_EN : OVERVIEW_SIDEBAR_SECTIONS_CN),
    ...(isEnglish ? RUNE_SIDEBAR_SECTIONS_EN : RUNE_SIDEBAR_SECTIONS_CN),
    ...(isEnglish ? BOSS_SIDEBAR_SECTIONS_EN : BOSS_SIDEBAR_SECTIONS_CN),
    ...(isEnglish ? MOHA_SIDEBAR_SECTIONS_EN : MOHA_SIDEBAR_SECTIONS_CN),
    ...(isEnglish ? ECOSYSTEM_SIDEBAR_SECTIONS_EN : ECOSYSTEM_SIDEBAR_SECTIONS_CN),
    ...(isEnglish ? REFERENCE_SIDEBAR_SECTIONS_EN : REFERENCE_SIDEBAR_SECTIONS_CN),
  ];
}

// Default export keeps existing imports working in non-hook contexts.
export const DOCS_SIDEBAR_SECTIONS: DocsSidebarSection[] = getDocsSidebarSections('cn');

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
