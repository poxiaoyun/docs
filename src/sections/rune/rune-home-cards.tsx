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

const RUNE_HOME_CONTENT = {
  cn: {
    quickStartTitle: '快速开始',
    quickStartDescription: '快速了解 Rune 智算平台，开始您的 AI 开发之旅',
    featuresTitle: '核心功能',
    featuresDescription: '探索平台的各项能力，满足您的 AI 开发需求',
    quickStartCards: [
      {
        title: '快速入门',
        description: '了解 Rune 智算平台的基本概念和核心功能，快速上手使用',
        href: '/rune/guide',
        icon: 'solar:play-circle-bold',
        color: '#1877F2',
      },
      {
        title: '环境准备',
        description: '配置开发环境、准备必要的资源和权限，开始您的第一个工作负载',
        href: '/rune/guide/prerequisites',
        icon: 'solar:settings-bold',
        color: '#00A76F',
      },
    ] satisfies QuickStartCard[],
    categoryCards: [
      {
        title: '工作负载',
        subtitle: 'Workloads',
        description: '创建和管理训练任务、推理服务等各类工作负载，支持分布式训练和弹性调度。',
        href: '/rune/guide/workloads',
        color: '#1877F2',
      },
      {
        title: '推理服务',
        subtitle: 'Inference',
        description: '部署模型推理服务，支持在线推理、批量推理，提供自动扩缩容能力。',
        href: '/rune/guide/inference',
        color: '#7635DC',
      },
      {
        title: '模板管理',
        subtitle: 'Templates',
        description: '使用预定义模板快速创建工作负载，支持自定义模板和模板共享。',
        href: '/rune/resources/templates',
        color: '#00A76F',
      },
      {
        title: '配额管理',
        subtitle: 'Quotas',
        description: '查看和管理资源配额，了解 GPU/CPU 资源使用情况和限制。',
        href: '/rune/resources/quotas',
        color: '#FFAB00',
      },
    ] satisfies CategoryCard[],
  },
  en: {
    quickStartTitle: 'Quick Start',
    quickStartDescription: 'Get familiar with Rune AI Platform and begin your AI development journey.',
    featuresTitle: 'Core Features',
    featuresDescription: 'Explore the platform capabilities that support your AI development workflow.',
    quickStartCards: [
      {
        title: 'Getting Started',
        description: 'Learn the basic concepts and core capabilities of Rune AI Platform and get productive quickly.',
        href: '/rune/guide',
        icon: 'solar:play-circle-bold',
        color: '#1877F2',
      },
      {
        title: 'Environment Setup',
        description: 'Prepare your development environment, required resources, and permissions before launching your first workload.',
        href: '/rune/guide/prerequisites',
        icon: 'solar:settings-bold',
        color: '#00A76F',
      },
    ] satisfies QuickStartCard[],
    categoryCards: [
      {
        title: 'Workloads',
        subtitle: 'Workloads',
        description: 'Create and manage training jobs, inference services, and other workloads with distributed training and elastic scheduling support.',
        href: '/rune/guide/workloads',
        color: '#1877F2',
      },
      {
        title: 'Inference Services',
        subtitle: 'Inference',
        description: 'Deploy model inference services with support for online inference, batch inference, and automatic scaling.',
        href: '/rune/guide/inference',
        color: '#7635DC',
      },
      {
        title: 'Template Management',
        subtitle: 'Templates',
        description: 'Use predefined templates to create workloads quickly, and support custom templates and template sharing.',
        href: '/rune/resources/templates',
        color: '#00A76F',
      },
      {
        title: 'Quota Management',
        subtitle: 'Quotas',
        description: 'View and manage resource quotas, including current GPU and CPU usage and platform limits.',
        href: '/rune/resources/quotas',
        color: '#FFAB00',
      },
    ] satisfies CategoryCard[],
  },
} as const;

// ----------------------------------------------------------------------

export function RuneHomeCards({ sx, ...other }: BoxProps) {
  const { i18n } = useTranslation();
  const content = i18n.language.startsWith('en') ? RUNE_HOME_CONTENT.en : RUNE_HOME_CONTENT.cn;

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
