import { Link as RouterLink } from 'react-router';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import CardActionArea from '@mui/material/CardActionArea';

// ----------------------------------------------------------------------

const PRODUCTS = [
  {
    title: '魔哈仓库',
    description: '服务 AI 开发者的社区门户，提供模型版本管理、数据集协作与活动运营模块。',
    path: '/docs/moha',
  },
  {
    title: 'Rune',
    description: '终端用户操作指南，覆盖模型开发、推理、工作负载、实例、镜像、模板、配额、存储卷等能力。',
    path: '/docs/rune',
  },
  {
    title: 'BOSS',
    description: '平台管理门户，面向平台管理员，聚焦集群、租户、配额、规格、系统模板、网关审核等运营动作。',
    path: '/docs/boss',
  },
];

// ----------------------------------------------------------------------

export function HomeHeroSection() {
  return (
    <Box
      component="section"
      sx={{
        minHeight: 'calc(100vh - 72px)',
        display: 'flex',
        alignItems: 'center',
        py: { xs: 8, md: 12 },
      }}
    >
      <Container maxWidth="lg">
        <Stack spacing={6} alignItems="center" textAlign="center">
          {/* 标题 */}
          <Stack spacing={2} alignItems="center">
            <Typography variant="h2" sx={{ fontWeight: 700, maxWidth: 800 }}>
              统一的 AI 平台文档
            </Typography>
            <Typography variant="h5" sx={{ color: 'text.secondary', maxWidth: 600, fontWeight: 400 }}>
              连接开发、运营与社区
            </Typography>
          </Stack>

          {/* 产品卡片 */}
          <Box
            sx={{
              width: '100%',
              display: 'grid',
              gap: 3,
              gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
              mt: 4,
            }}
          >
            {PRODUCTS.map((product) => (
              <Card
                key={product.title}
                component={RouterLink}
                to={product.path}
                sx={{
                  height: '100%',
                  textDecoration: 'none',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: (theme) => theme.customShadows.z16,
                  },
                }}
              >
                <CardActionArea sx={{ height: '100%', p: 0 }}>
                  <CardContent sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="h4" sx={{ mb: 2, fontWeight: 600 }}>
                      {product.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', flexGrow: 1 }}>
                      {product.description}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            ))}
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}
