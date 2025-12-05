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
    title: '环境安装指南',
    description: '介绍本地开发所需要的环境要求和步骤，支持离线在本地下载使用',
    href: '/docs/moha/environment-setup',
    icon: 'solar:download-bold',
    color: '#1890ff',
  },
  {
    title: '在Rune中运行模型',
    description: '介绍如何使用Rune实现模型的调参训练和评估',
    href: '/docs/moha/notebook-tutorial',
    icon: 'solar:file-text-bold',
    color: '#722ed1',
  },
];

const CATEGORY_CARDS: CategoryCard[] = [
  {
    title: '模型库',
    subtitle: 'Models',
    description: '模型库（Models）为社区各类模型进行托管各类模型的路径设施，方便模型型的存储、管理以及共享和发现。',
    href: '/docs/moha/models',
    color: '#7DD3FC',
  },
  {
    title: '数据集',
    subtitle: 'Datasets',
    description: '数据集（Datasets）托管了最全各种概念的丰富数据集内容，涵盖自然语言处理、计算机视觉、语音等领域。',
    href: '/docs/moha/datasets',
    color: '#93C5FD',
  },
  {
    title: '应用市场',
    subtitle: 'Marketplace',
    description: '应用市场（Marketplace）汇集了丰富的应用和服务，方便用户发现和使用各种解决方案。',
    href: '/docs/moha/marketplace',
    color: '#93C5FD',
  },
  {
    title: '大模型训练与推理',
    subtitle: '',
    description: '基于开源框架，对大语言模型（LLM）进行灵活高效调训。',
    href: '/docs/moha/llm-training',
    color: '#C4B5FD',
  },
  {
    title: '模型接入流程',
    subtitle: '',
    description: '将模型接入到Moha仓库，方便用户通过统一的接口调用。',
    href: '/docs/moha/model-integration',
    color: '#5EEAD4',
  },
  {
    title: 'SDK教程',
    subtitle: '',
    description: '为开发者提供基于Moha生态和通用文档的的接口，支持各种预训模型和框架的统一加载和使用。',
    href: '/docs/moha/sdk-tutorial',
    color: '#A5B4FC',
  }
];

// ----------------------------------------------------------------------

export function MohaHomeCards({ sx, ...other }: BoxProps) {
  return (
    <Box sx={{ py: 3, ...sx }} {...other}>
      {/* Quick Start Section */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
          快速开始
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          介绍如何快速上手，包括各种操作、环境安装、代码应用等信息
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

      {/* Community Section */}
      <Box>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
          核心功能
        </Typography>
        <Box
          sx={{
            display: 'grid',
            gap: 2,
            gridTemplateColumns: {
              xs: '1fr',
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
        transition: theme.transitions.create(['box-shadow', 'transform', 'background']),
        background: `linear-gradient(135deg, ${alpha(card.color || theme.palette.primary.main, 0.06)} 0%, ${alpha(card.color || theme.palette.primary.main, 0.02)} 100%)`,
        border: 'none',
        boxShadow: 'none',
        '&:hover': {
          boxShadow: theme.customShadows.z4,
          transform: 'translateY(-4px)',
          background: `linear-gradient(135deg, ${alpha(card.color || theme.palette.primary.main, 0.12)} 0%, ${alpha(card.color || theme.palette.primary.main, 0.04)} 100%)`,
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
