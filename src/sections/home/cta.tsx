import { m } from 'framer-motion';
import { Link as RouterLink } from 'react-router';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

import { varFade, MotionViewport } from 'src/components/animate';

// ----------------------------------------------------------------------

export function HomeCtaSection() {
  const theme = useTheme();

  return (
    <Box
      component={MotionViewport}
      sx={{
        py: { xs: 10, md: 15 },
        position: 'relative',
        overflow: 'hidden',
        background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `radial-gradient(circle at 30% 50%, ${alpha(theme.palette.common.white, 0.1)} 0%, transparent 50%),
                       radial-gradient(circle at 70% 50%, ${alpha(theme.palette.primary.light, 0.2)} 0%, transparent 50%)`,
          pointerEvents: 'none',
        },
      }}
    >
      <Container maxWidth="lg">
        <Stack spacing={5} alignItems="center" textAlign="center" sx={{ position: 'relative' }}>
          <m.div variants={varFade('inDown')}>
            <Typography
              variant="h2"
              sx={{
                color: 'common.white',
                fontWeight: 800,
                maxWidth: 800,
                fontSize: { xs: '2rem', md: '3rem' },
              }}
            >
              准备好开始了吗？
            </Typography>
          </m.div>

          <m.div variants={varFade('inDown')}>
            <Typography
              variant="h5"
              sx={{
                color: alpha(theme.palette.common.white, 0.9),
                maxWidth: 600,
                fontWeight: 400,
              }}
            >
              立即探索 Rune Docs，开启您的 AI 平台之旅
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
                  px: 5,
                  py: 2,
                  fontSize: '1.1rem',
                  background: theme.palette.common.white,
                  color: theme.palette.primary.main,
                  fontWeight: 600,
                  '&:hover': {
                    background: alpha(theme.palette.common.white, 0.9),
                    transform: 'translateY(-2px)',
                    boxShadow: theme.customShadows.z20,
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
                sx={{
                  px: 5,
                  py: 2,
                  fontSize: '1.1rem',
                  borderColor: theme.palette.common.white,
                  color: theme.palette.common.white,
                  fontWeight: 600,
                  '&:hover': {
                    borderColor: theme.palette.common.white,
                    background: alpha(theme.palette.common.white, 0.1),
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                加入社区
              </Button>
            </Stack>
          </m.div>

          <m.div variants={varFade('inUp')}>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={4}
              sx={{
                mt: 4,
                pt: 4,
                borderTop: `1px solid ${alpha(theme.palette.common.white, 0.2)}`,
              }}
            >
              <Stack spacing={0.5} alignItems="center">
                <Typography variant="h3" sx={{ color: 'common.white', fontWeight: 700 }}>
                  3
                </Typography>
                <Typography variant="body2" sx={{ color: alpha(theme.palette.common.white, 0.8) }}>
                  产品线
                </Typography>
              </Stack>

              <Stack spacing={0.5} alignItems="center">
                <Typography variant="h3" sx={{ color: 'common.white', fontWeight: 700 }}>
                  50+
                </Typography>
                <Typography variant="body2" sx={{ color: alpha(theme.palette.common.white, 0.8) }}>
                  功能模块
                </Typography>
              </Stack>

              <Stack spacing={0.5} alignItems="center">
                <Typography variant="h3" sx={{ color: 'common.white', fontWeight: 700 }}>
                  24/7
                </Typography>
                <Typography variant="body2" sx={{ color: alpha(theme.palette.common.white, 0.8) }}>
                  社区支持
                </Typography>
              </Stack>
            </Stack>
          </m.div>
        </Stack>
      </Container>
    </Box>
  );
}
