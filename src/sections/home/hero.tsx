import { m } from 'framer-motion';
import { Link as RouterLink } from 'react-router';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import { alpha, useTheme } from '@mui/material/styles';
import CardActionArea from '@mui/material/CardActionArea';

import { CONFIG } from 'src/global-config';

import { SvgColor } from 'src/components/svg-color';
import { varFade, MotionViewport } from 'src/components/animate';

// ----------------------------------------------------------------------

const PRODUCTS = [
  {
    title: 'Rune 智算平台',
    description: '用户操作指南，覆盖模型开发、推理、工作负载、实例、镜像、模板、配额、存储卷等能力。',
    path: '/docs/rune',
    icon: 'ic-dashboard',
    color: '#1877F2',
  },
  {
    title: '魔哈仓库',
    description: '服务 AI 开发者的社区门户，提供模型版本管理、数据集协作与活动运营模块。',
    path: '/docs/moha',
    icon: 'ic-booking',
    color: '#00A76F',
  },
  {
    title: 'Boss 运营平台',
    description: '平台管理门户，面向平台管理员，聚焦集群、租户、配额、规格、系统模板、网关审核等运营动作。',
    path: '/docs/boss',
    icon: 'ic-params',
    color: '#7635DC',
  },
];

// ----------------------------------------------------------------------

export function HomeHeroSection() {
  const theme = useTheme();

  return (
    <Box
      component="section"
      sx={{
        minHeight: 'calc(100vh - 72px)',
        display: 'flex',
        alignItems: 'center',
        py: { xs: 8, md: 12 },
        position: 'relative',
        overflow: 'hidden',
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.02)} 0%, ${alpha(theme.palette.primary.main, 0.08)} 100%)`,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `radial-gradient(circle at 20% 50%, ${alpha(theme.palette.primary.main, 0.1)} 0%, transparent 50%), 
                       radial-gradient(circle at 80% 80%, ${alpha(theme.palette.secondary.main, 0.08)} 0%, transparent 50%)`,
          pointerEvents: 'none',
        },
      }}
    >
      <Container maxWidth="lg" component={MotionViewport}>
        <Stack spacing={6} alignItems="center" textAlign="center">
          {/* 标题 */}
          <Stack spacing={3} alignItems="center">
            <m.div variants={varFade('inDown')}>
              <Typography
                variant="h1"
                sx={{
                  fontWeight: 800,
                  maxWidth: 900,
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                  mb: 2,
                }}
              >
                产品文档中心
              </Typography>
            </m.div>

            <m.div variants={varFade('inDown')}>
              <Typography variant="h5" sx={{ color: 'text.secondary', maxWidth: 600, fontWeight: 400 }}>
                连接开发、运营与社区 
              </Typography>
            </m.div>

            <m.div variants={varFade('inUp')}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 2 }}>
                <Button
                  variant="contained"
                  size="large"
                  component={RouterLink}
                  to="/docs/rune"
                  sx={{
                    px: 4,
                    py: 1.5,
                    fontSize: '1rem',
                    boxShadow: theme.customShadows.z8,
                    '&:hover': {
                      boxShadow: theme.customShadows.z16,
                    },
                  }}
                >
                  查看文档
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  component={RouterLink}
                  to="/docs/moha"
                  sx={{ px: 4, py: 1.5, fontSize: '1rem' }}
                >
                  参与贡献
                </Button>
              </Stack>
            </m.div>
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
            {PRODUCTS.map((product, index) => (
              <m.div key={product.title} variants={varFade('inUp')}>
                <Card
                  component={RouterLink}
                  to={product.path}
                  sx={{
                    height: '100%',
                    textDecoration: 'none',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '4px',
                      background: product.color,
                      transform: 'scaleX(0)',
                      transformOrigin: 'left',
                      transition: 'transform 0.3s ease',
                    },
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: theme.customShadows.z20,
                      '&::before': {
                        transform: 'scaleX(1)',
                      },
                    },
                  }}
                >
                  <CardActionArea sx={{ height: '100%', p: 0 }}>
                    <CardContent
                      sx={{
                        p: 4,
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                      }}
                    >
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Box
                          sx={{
                            width: 56,
                            height: 56,
                            borderRadius: 2,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: alpha(product.color, 0.08),
                            flexShrink: 0,
                          }}
                        >
                          <SvgColor
                            src={`${CONFIG.assetsDir}/assets/icons/navbar/${product.icon}.svg`}
                            sx={{ width: 32, height: 32, color: product.color }}
                          />
                        </Box>

                        <Typography variant="h4" sx={{ fontWeight: 600 }}>
                          {product.title}
                        </Typography>
                      </Stack>

                      <Typography variant="body2" sx={{ color: 'text.secondary', flexGrow: 1 }}>
                        {product.description}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </m.div>
            ))}
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}
