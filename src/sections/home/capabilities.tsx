import { m } from 'framer-motion';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

import { CONFIG } from 'src/global-config';

import { SvgColor } from 'src/components/svg-color';
import { varFade, MotionViewport } from 'src/components/animate';

// ----------------------------------------------------------------------

const CAPABILITIES = [
  {
    key: 'rune',
    title: 'Rune 智算平台',
    description: '覆盖模型开发、推理、工作负载、镜像、配额与存储卷的全栈操作指引。',
    highlights: ['推理托管', '工作负载调度', '镜像/模板管理'],
    icon: 'ic-dashboard',
    color: '#1877F2',
  },
  {
    key: 'boss',
    title: 'Boss 运营平台',
    description: '面向平台管理员的治理手册，聚焦集群、租户、系统模板与网关审核。',
    highlights: ['集群/租户治理', '配额策略', '服务注册'],
    icon: 'ic-params',
    color: '#7635DC',
  },
  {
    key: 'moha',
    title: '魔哈仓库',
    description: '模型与数据集的社区仓库，沉淀版本管理、数据迭代与活动运营经验。',
    highlights: ['模型版本流转', '数据集协作', '社区活动'],
    icon: 'ic-booking',
    color: '#00A76F',
  },
];

// ----------------------------------------------------------------------

export function HomeCapabilitiesSection() {
  const theme = useTheme();

  return (
    <Container component={MotionViewport} maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
      <Stack spacing={2} sx={{ textAlign: 'center', mb: 6 }}>
        <m.div variants={varFade('inDown')}>
          <Typography variant="overline" color="text.secondary">
            产品能力一览
          </Typography>
        </m.div>
        <m.div variants={varFade('inDown')}>
          <Typography variant="h3">三大产品线 · 一套体验范式</Typography>
        </m.div>
        <m.div variants={varFade('inDown')}>
          <Typography variant="body1" color="text.secondary">
            对齐 ModelScope Docs 的卡片化信息密度，快速定位对应的任务场景。
          </Typography>
        </m.div>
      </Stack>

      <Box
        sx={{
          display: 'grid',
          gap: { xs: 2, md: 3 },
          gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
        }}
      >
        {CAPABILITIES.map((capability, index) => (
          <m.div key={capability.key} variants={varFade('inUp')}>
            <Card
              sx={{
                height: '100%',
                p: 4,
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: `linear-gradient(135deg, ${alpha(capability.color, 0.02)} 0%, transparent 100%)`,
                  pointerEvents: 'none',
                },
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: theme.customShadows.z16,
                },
              }}
            >
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 1.5,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: alpha(capability.color, 0.08),
                }}
              >
                <SvgColor
                  src={`${CONFIG.assetsDir}/assets/icons/navbar/${capability.icon}.svg`}
                  sx={{ width: 28, height: 28, color: capability.color }}
                />
              </Box>

              <Stack spacing={1.5}>
                <Typography variant="h5">{capability.title}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {capability.description}
                </Typography>
              </Stack>

              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {capability.highlights.map((highlight) => (
                  <Chip
                    key={highlight}
                    label={highlight}
                    variant="outlined"
                    size="small"
                    sx={{
                      borderColor: alpha(capability.color, 0.24),
                      color: capability.color,
                    }}
                  />
                ))}
              </Stack>
            </Card>
          </m.div>
        ))}
      </Box>
    </Container>
  );
}
