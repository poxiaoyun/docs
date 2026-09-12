import type { BoxProps } from '@mui/material/Box';
import type { IconifyName } from 'src/components/iconify/register-icons';

import { useTranslation } from 'react-i18next';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

import { RouterLink } from 'src/routes/components';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type QuickStartCard = {
  title: string;
  description: string;
  href: string;
  icon?: IconifyName;
  color?: string;
};

type CategoryCard = {
  title: string;
  subtitle: string;
  description: string;
  href: string;
  color?: string;
};

const BOSS_HOME_CONTENT = {
  cn: {
    quickStartTitle: '快速开始',
    quickStartDescription: '快速了解 Boss 运营平台，开始管理您的智算资源',
    featuresTitle: '运营管理',
    featuresDescription: '平台管理员的核心功能模块',
    quickStartCards: [
      {
        title: '平台总览',
        description: '了解 Boss 运营平台的核心概念与管理员典型路径',
        href: '/boss',
        icon: 'solar:settings-bold',
        color: '#7635DC',
      },
      {
        title: '用户与租户',
        description: '创建平台用户与租户，管理成员关系与访问权限',
        href: '/boss/iam',
        icon: 'solar:users-group-rounded-bold',
        color: '#00A76F',
      },
    ] satisfies QuickStartCard[],
    categoryCards: [
      {
        title: '集群管理',
        subtitle: 'Clusters',
        description: '管理计算集群，包括节点管理、资源调度、集群监控等运维操作。',
        href: '/boss/rune-admin/clusters',
        color: '#7635DC',
      },
      {
        title: '租户资源管理',
        subtitle: 'Tenants',
        description: '为租户分配资源池与 GPU/CPU 配额，并管理其工作空间。',
        href: '/boss/rune-admin/tenants',
        color: '#1877F2',
      },
      {
        title: '内容审查',
        subtitle: 'Moderation',
        description: '维护审核策略与敏感词库，查看敏感命中记录。',
        href: '/boss/gateway/moderation',
        color: '#FF5630',
      },
      {
        title: '产品模板管理',
        subtitle: 'Templates',
        description: '维护用户域与系统域的产品模板，供应用市场与系统应用部署使用。',
        href: '/boss/rune-admin/templates',
        color: '#00A76F',
      },
    ] satisfies CategoryCard[],
  },
  en: {
    quickStartTitle: 'Quick Start',
    quickStartDescription: 'Get familiar with Boss Operations Platform and start managing your AI infrastructure.',
    featuresTitle: 'Operations',
    featuresDescription: 'Core modules for platform administrators.',
    quickStartCards: [
      {
        title: 'Product Overview',
        description: 'Learn the core concepts of the Boss Operations Platform and the typical administrator path.',
        href: '/boss',
        icon: 'solar:settings-bold',
        color: '#7635DC',
      },
      {
        title: 'Users & Tenants',
        description: 'Create platform users and tenants, and manage membership and access permissions.',
        href: '/boss/iam',
        icon: 'solar:users-group-rounded-bold',
        color: '#00A76F',
      },
    ] satisfies QuickStartCard[],
    categoryCards: [
      {
        title: 'Cluster Management',
        subtitle: 'Clusters',
        description: 'Manage compute clusters, including node operations, resource scheduling, and cluster monitoring.',
        href: '/boss/rune-admin/clusters',
        color: '#7635DC',
      },
      {
        title: 'Tenant Resource Management',
        subtitle: 'Tenants',
        description: 'Allocate resource pools and GPU/CPU quotas to tenants, and manage their workspaces.',
        href: '/boss/rune-admin/tenants',
        color: '#1877F2',
      },
      {
        title: 'Content Moderation',
        subtitle: 'Moderation',
        description: 'Maintain moderation policies and sensitive lexicons, and review sensitive hits.',
        href: '/boss/gateway/moderation',
        color: '#FF5630',
      },
      {
        title: 'Product Template Management',
        subtitle: 'Templates',
        description: 'Maintain user-domain and system-domain product templates used by the app market and system apps.',
        href: '/boss/rune-admin/templates',
        color: '#00A76F',
      },
    ] satisfies CategoryCard[],
  },
} as const;

// ----------------------------------------------------------------------

export function BossHomeCards({ sx, ...other }: BoxProps) {
  const { i18n } = useTranslation();
  const content = i18n.language.startsWith('en') ? BOSS_HOME_CONTENT.en : BOSS_HOME_CONTENT.cn;

  return (
    <Box sx={{ py: 3, ...sx }} {...other}>
      {/* Quick Start Section */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" sx={{ mb: 1, fontWeight: 600 }}>
          {content.quickStartTitle}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {content.quickStartDescription}
        </Typography>
        <Box
          sx={{
            display: 'grid',
            gap: 2,
            gridTemplateColumns: {
              xs: '1fr',
              md: 'repeat(2, 1fr)',
            },
          }}
        >
          {content.quickStartCards.map((card) => (
            <QuickStartCard key={card.title} card={card} />
          ))}
        </Box>
      </Box>

      {/* Features Section */}
      <Box>
        <Typography variant="h4" sx={{ mb: 1, fontWeight: 600 }}>
          {content.featuresTitle}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {content.featuresDescription}
        </Typography>
        <Box
          sx={{
            display: 'grid',
            gap: 2,
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
            },
          }}
        >
          {content.categoryCards.map((card) => (
            <CategoryCard key={card.title} card={card} />
          ))}
        </Box>
      </Box>
    </Box>
  );
}

// ----------------------------------------------------------------------

function QuickStartCard({ card }: { card: QuickStartCard }) {
  const theme = useTheme();

  return (
    <Card
      component={RouterLink}
      href={card.href}
      sx={{
        p: 3,
        height: '100%',
        display: 'flex',
        gap: 2,
        textDecoration: 'none',
        transition: theme.transitions.create(['box-shadow', 'transform']),
        '&:hover': {
          boxShadow: theme.customShadows.z8,
          transform: 'translateY(-4px)',
        },
      }}
    >
      <Box
        sx={{
          width: 48,
          height: 48,
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 1.5,
          bgcolor: alpha(card.color || theme.palette.primary.main, 0.08),
        }}
      >
        <Iconify
          icon={card.icon || 'solar:file-text-bold'}
          width={28}
          sx={{ color: card.color || theme.palette.primary.main }}
        />
      </Box>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {card.title}
          </Typography>
          <Iconify icon="eva:arrow-forward-fill" width={16} />
        </Box>
        <Typography variant="body2" color="text.secondary">
          {card.description}
        </Typography>
      </Box>
    </Card>
  );
}

// ----------------------------------------------------------------------

function CategoryCard({ card }: { card: CategoryCard }) {
  const theme = useTheme();

  return (
    <Card
      component={RouterLink}
      href={card.href}
      sx={{
        p: 3,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        textDecoration: 'none',
        transition: theme.transitions.create(['box-shadow', 'transform']),
        bgcolor: alpha(card.color || theme.palette.primary.main, 0.04),
        border: `1px solid ${alpha(card.color || theme.palette.primary.main, 0.08)}`,
        '&:hover': {
          boxShadow: theme.customShadows.z8,
          transform: 'translateY(-4px)',
          bgcolor: alpha(card.color || theme.palette.primary.main, 0.08),
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
        <Box
          sx={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            bgcolor: card.color || theme.palette.primary.main,
          }}
        />
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {card.title}
        </Typography>
      </Box>
      {card.subtitle && (
        <Typography variant="body2" color="text.disabled" sx={{ mb: 1.5 }}>
          {card.subtitle}
        </Typography>
      )}
      <Typography variant="body2" color="text.secondary" sx={{ flex: 1 }}>
        {card.description}
      </Typography>
    </Card>
  );
}
