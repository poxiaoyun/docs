import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

const SOLUTIONS = [
  {
    title: '行业模板 & 方案库',
    description: '按领域拆分的模板（如城市治理、能源、金融）可一键复制，自带配额、镜像与合规校验。',
    tags: ['城市治理', '能源', '金融'],
  },
  {
    title: '推理加速与弹性调度',
    description: '结合 GPU/CPU 混部策略与自动扩缩容，支撑高并发推理与低延时场景。',
    tags: ['GPU 管理', '弹性策略'],
  },
  {
    title: '数据治理与版本流转',
    description: '魔哈广场串联模型版本与数据集演进，支持一键回滚以及版本影响范围追踪。',
    tags: ['数据血缘', '版本追踪'],
  },
];

export function HomeSolutionsSection() {
  return (
    <Container component="section" maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
      <Stack spacing={2} sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="overline" color="text.secondary">
          解决方案 / 案例库
        </Typography>
        <Typography variant="h3">面向场景的实战路径</Typography>
        <Typography variant="body2" color="text.secondary">
          结合模板、自动化脚本与指标视图，复用经过验证的最佳实践。
        </Typography>
      </Stack>

      <Box
        sx={{
          display: 'grid',
          gap: { xs: 2, md: 3 },
          gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
        }}
      >
        {SOLUTIONS.map((solution) => (
          <Card
            key={solution.title}
            sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}
          >
            <Typography variant="h5">{solution.title}</Typography>
            <Typography variant="body2" color="text.secondary">
              {solution.description}
            </Typography>

            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {solution.tags.map((tag) => (
                <Chip key={tag} label={tag} size="small" color="secondary" variant="outlined" />
              ))}
            </Stack>
          </Card>
        ))}
      </Box>
    </Container>
  );
}
