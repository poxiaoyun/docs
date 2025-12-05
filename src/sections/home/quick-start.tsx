import { m } from 'framer-motion';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

import { varFade, MotionViewport } from 'src/components/animate';

const STEPS = [
  {
    title: '准备环境',
    description: '安装 CLI、配置访问密钥并挑选合适的模板。',
    number: '01',
  },
  {
    title: '连接资源',
    description: '创建工作负载，挂载镜像与存储卷，完成配额申请。',
    number: '02',
  },
  {
    title: '观测与优化',
    description: '结合监控、日志和成本视图持续迭代推理与训练作业。',
    number: '03',
  },
];

export function HomeQuickStartSection() {
  const theme = useTheme();

  return (
    <Box
      component={MotionViewport}
      sx={{
        py: { xs: 8, md: 12 },
        position: 'relative',
        background: alpha(theme.palette.grey[500], 0.04),
      }}
    >
      <Container maxWidth="lg">
        <Stack spacing={2} sx={{ textAlign: 'center', mb: 6 }}>
          <m.div variants={varFade('inDown')}>
            <Typography variant="overline" color="text.secondary">
              快速上手
            </Typography>
          </m.div>
          <m.div variants={varFade('inDown')}>
            <Typography variant="h3">三步即可搭建完整工作流</Typography>
          </m.div>
          <m.div variants={varFade('inDown')}>
            <Typography variant="body2" color="text.secondary">
              根据角色选择对应指南，结合示例完成首个部署。
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
          {STEPS.map((step, index) => (
            <m.div key={step.title} variants={varFade('inUp')}>
              <Card
                sx={{
                  p: 4,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    top: -20,
                    right: -20,
                    width: 120,
                    height: 120,
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.08)} 0%, transparent 100%)`,
                    pointerEvents: 'none',
                  },
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: theme.customShadows.z12,
                  },
                }}
              >
                <Typography
                  variant="h1"
                  sx={{
                    fontWeight: 800,
                    fontSize: '4rem',
                    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    color: 'transparent',
                    lineHeight: 1,
                  }}
                >
                  {step.number}
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  {step.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {step.description}
                </Typography>
              </Card>
            </m.div>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
