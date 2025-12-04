import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

const STEPS = [
  {
    title: '准备环境',
    description: '安装 CLI、配置访问密钥并挑选合适的模板。',
  },
  {
    title: '连接资源',
    description: '创建工作负载，挂载镜像与存储卷，完成配额申请。',
  },
  {
    title: '观测与优化',
    description: '结合监控、日志和成本视图持续迭代推理与训练作业。',
  },
];

export function HomeQuickStartSection() {
  return (
    <Container component="section" maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
      <Stack spacing={2} sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="overline" color="text.secondary">
          快速上手
        </Typography>
        <Typography variant="h3">三步即可搭建完整工作流</Typography>
        <Typography variant="body2" color="text.secondary">
          根据角色选择对应指南，结合示例完成首个部署。
        </Typography>
      </Stack>

      <Box
        sx={{
          display: 'grid',
          gap: { xs: 2, md: 3 },
          gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
        }}
      >
        {STEPS.map((step, index) => (
          <Card
            key={step.title}
            sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}
          >
            <Typography variant="h2" color="primary.main">
              {index + 1}
            </Typography>
            <Typography variant="h5">{step.title}</Typography>
            <Typography variant="body2" color="text.secondary">
              {step.description}
            </Typography>
          </Card>
        ))}
      </Box>
    </Container>
  );
}
