import { m } from 'framer-motion';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

import { varFade, MotionViewport } from 'src/components/animate';

const SOLUTIONS = [
  {
    title: '行业模板 & 方案库',
    description: '按领域拆分的模板（如城市治理、能源、金融）可一键复制，自带配额、镜像与合规校验。',
    tags: ['城市治理', '能源', '金融'],
    gradient: ['#00A76F', '#00C853'],
  },
  {
    title: '推理加速与弹性调度',
    description: '结合 GPU/CPU 混部策略与自动扩缩容，支撑高并发推理与低延时场景。',
    tags: ['GPU 管理', '弹性策略'],
    gradient: ['#1877F2', '#2196F3'],
  },
  {
    title: '数据治理与版本流转',
    description: '魔哈仓库串联模型版本与数据集演进，支持一键回滚以及版本影响范围追踪。',
    tags: ['数据血缘', '版本追踪'],
    gradient: ['#7635DC', '#9C27B0'],
  },
];

export function HomeSolutionsSection() {
  const theme = useTheme();

  return (
    <Container component={MotionViewport} maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
      <Stack spacing={2} sx={{ textAlign: 'center', mb: 6 }}>
        <m.div variants={varFade('inDown')}>
          <Typography variant="overline" color="text.secondary">
            解决方案 / 案例库
          </Typography>
        </m.div>
        <m.div variants={varFade('inDown')}>
          <Typography variant="h3">面向场景的实战路径</Typography>
        </m.div>
        <m.div variants={varFade('inDown')}>
          <Typography variant="body2" color="text.secondary">
            结合模板、自动化脚本与指标视图，复用经过验证的最佳实践。
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
        {SOLUTIONS.map((solution, index) => (
          <m.div key={solution.title} variants={varFade('inUp')}>
            <Card
              sx={{
                p: 4,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  background: `linear-gradient(135deg, ${alpha(solution.gradient[0], 0.03)} 0%, ${alpha(solution.gradient[1], 0.06)} 100%)`,
                  pointerEvents: 'none',
                },
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: theme.customShadows.z16,
                },
              }}
            >
              <Typography variant="h5" sx={{ fontWeight: 600, position: 'relative' }}>
                {solution.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ position: 'relative' }}>
                {solution.description}
              </Typography>

              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ position: 'relative' }}>
                {solution.tags.map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    size="small"
                    sx={{
                      background: `linear-gradient(135deg, ${alpha(solution.gradient[0], 0.1)}, ${alpha(solution.gradient[1], 0.1)})`,
                      color: solution.gradient[0],
                      border: `1px solid ${alpha(solution.gradient[0], 0.24)}`,
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
