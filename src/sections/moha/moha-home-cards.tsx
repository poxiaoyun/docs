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

const MOHA_HOME_CONTENT = {
  cn: {
    quickStartTitle: '快速开始',
    quickStartDescription: '介绍如何快速上手，包括各种操作、环境安装、代码应用等信息',
    featuresTitle: '核心功能',
    quickStartCards: [
      {
        title: '快速开始',
        description: '注册登录、准备本地环境，用命令行登录后上传第一个模型或数据集。',
        href: '/moha/quickstart',
        icon: 'solar:download-bold',
        color: '#1890ff',
      },
      {
        title: '在空间里跑起来',
        description: '在空间里直接写代码调用模型，支持发布、停止与重新发布。',
        href: '/moha/spaces',
        icon: 'solar:file-text-bold',
        color: '#722ed1',
      },
    ] satisfies QuickStartCard[],
    categoryCards: [
      {
        title: '模型库',
        subtitle: 'Models',
        description: '模型库（Models）为社区各类模型进行托管各类模型的路径设施，方便模型型的存储、管理以及共享和发现。',
        href: '/moha/models',
        color: '#7dd4fcff',
      },
      {
        title: '数据集',
        subtitle: 'Datasets',
        description: '数据集（Datasets）托管了最全各种概念的丰富数据集内容，涵盖自然语言处理、计算机视觉、语音等领域。',
        href: '/moha/datasets',
        color: '#93C5FD',
      },
      {
        title: '镜像仓库',
        subtitle: 'Images',
        description: '托管容器镜像，支持命令行推送、打标签与按框架筛选，供空间和推理直接引用。',
        href: '/moha/images',
        color: '#93C5FD',
      },
      {
        title: '协作',
        subtitle: 'Repositories',
        description: '像用 Git 一样浏览仓库文件、看版本差异、发起讨论，并按需打快照。',
        href: '/moha/repository',
        color: '#5EEAD4',
      },
      {
        title: '高阶使用',
        subtitle: 'Advanced',
        description: '命令行之外的玩法：开放 API、CI/CD 集成、下载加速，以及怎么参与共建。',
        href: '/moha/advanced',
        color: '#6EE7B7',
      },
      {
        title: 'SDK教程',
        subtitle: '',
        description: '为开发者提供基于Moha生态和通用文档的的接口，支持各种预训模型和框架的统一加载和使用。',
        href: '/moha/sdk-tutorial',
        color: '#A5B4FC',
      },
    ] satisfies CategoryCard[],
  },
  en: {
    quickStartTitle: 'Quick Start',
    quickStartDescription: 'Get started quickly with setup, core workflows, and code integration guidance.',
    featuresTitle: 'Core Features',
    quickStartCards: [
      {
        title: 'Quick Start',
        description: 'Sign in, prepare your local environment, then upload your first model or dataset with the CLI.',
        href: '/moha/quickstart',
        icon: 'solar:download-bold',
        color: '#1890ff',
      },
      {
        title: 'Run it in a Space',
        description: 'Write code against models directly in a space, then publish, stop and republish it.',
        href: '/moha/spaces',
        icon: 'solar:file-text-bold',
        color: '#722ed1',
      },
    ] satisfies QuickStartCard[],
    categoryCards: [
      {
        title: 'Model Hub',
        subtitle: 'Models',
        description: 'The Models section hosts community models and makes them easier to store, manage, share, and discover.',
        href: '/moha/models',
        color: '#7dd4fcff',
      },
      {
        title: 'Datasets',
        subtitle: 'Datasets',
        description: 'The Datasets section hosts a broad collection of datasets across NLP, computer vision, speech, and more.',
        href: '/moha/datasets',
        color: '#93C5FD',
      },
      {
        title: 'Image Registry',
        subtitle: 'Images',
        description: 'Host container images with CLI push, tagging and framework filters, ready to be referenced by spaces and inference.',
        href: '/moha/images',
        color: '#93C5FD',
      },
      {
        title: 'Collaboration',
        subtitle: 'Repositories',
        description: 'Browse repository files like Git, inspect version diffs, start discussions and take snapshots when needed.',
        href: '/moha/repository',
        color: '#5EEAD4',
      },
      {
        title: 'Advanced Usage',
        subtitle: 'Advanced',
        description: 'Beyond the CLI: open API access, CI/CD integration, faster downloads and how to contribute.',
        href: '/moha/advanced',
        color: '#6EE7B7',
      },
      {
        title: 'SDK Tutorial',
        subtitle: '',
        description: 'Provide developers with Moha SDK guidance and common APIs for loading and using pretrained models across frameworks.',
        href: '/moha/sdk-tutorial',
        color: '#A5B4FC',
      },
    ] satisfies CategoryCard[],
  },
} as const;

// ----------------------------------------------------------------------

export function MohaHomeCards({ sx, ...other }: BoxProps) {
  const { i18n } = useTranslation();
  const content = i18n.language.startsWith('en') ? MOHA_HOME_CONTENT.en : MOHA_HOME_CONTENT.cn;

  return (
    <Box sx={{ py: 3, ...sx }} {...other}>
      {/* Quick Start Section */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
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

      {/* Community Section */}
      <Box>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
          {content.featuresTitle}
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
