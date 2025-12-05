import type { BoxProps } from '@mui/material/Box';
import type { IconifyName } from 'src/components/iconify/register-icons';

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

const QUICK_START_CARDS: QuickStartCard[] = [
  {
    title: '平台管理入门',
    description: '了解 Boss 运营平台的核心概念，掌握平台管理的基本操作',
    href: '/docs/boss/operations',
    icon: 'solar:settings-bold',
    color: '#7635DC',
  },
  {
    title: '租户管理',
    description: '创建和管理租户，配置资源配额和访问权限',
    href: '/docs/boss/operations/tenants',
    icon: 'solar:users-group-rounded-bold',
    color: '#00A76F',
  },
];

const CATEGORY_CARDS: CategoryCard[] = [
  {
    title: '集群管理',
    subtitle: 'Clusters',
    description: '管理计算集群，包括节点管理、资源调度、集群监控等运维操作。',
    href: '/docs/boss/operations/clusters',
    color: '#7635DC',
  },
  {
    title: '租户管理',
    subtitle: 'Tenants',
    description: '创建和管理多租户环境，配置租户隔离、资源配额和访问策略。',
    href: '/docs/boss/operations/tenants',
    color: '#1877F2',
  },
  {
    title: '网关审核',
    subtitle: 'Gateway',
    description: '管理 API 网关，审核和控制服务访问，配置流量策略和安全规则。',
    href: '/docs/boss/operations/gateway',
    color: '#FF5630',
  },
  {
    title: '系统模板',
    subtitle: 'Templates',
    description: '管理系统级模板，为用户提供预配置的工作负载模板和环境配置。',
    href: '/docs/boss/templates',
    color: '#00A76F',
  },
];

// ----------------------------------------------------------------------

export function BossHomeCards({ sx, ...other }: BoxProps) {
  return (
    <Box sx={{ py: 3, ...sx }} {...other}>
      {/* Quick Start Section */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" sx={{ mb: 1, fontWeight: 600 }}>
          快速开始
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          快速了解 Boss 运营平台，开始管理您的智算资源
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
          {QUICK_START_CARDS.map((card) => (
            <QuickStartCard key={card.title} card={card} />
          ))}
        </Box>
      </Box>

      {/* Features Section */}
      <Box>
        <Typography variant="h4" sx={{ mb: 1, fontWeight: 600 }}>
          运营管理
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          平台管理员的核心功能模块
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
          {CATEGORY_CARDS.map((card) => (
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
