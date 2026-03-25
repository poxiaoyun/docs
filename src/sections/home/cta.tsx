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
        bgcolor: '#000000',
        borderTop: `1px solid ${alpha('#ffffff', 0.05)}`,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `radial-gradient(circle at 50% -20%, ${alpha(theme.palette.primary.main, 0.15)} 0%, transparent 60%)`,
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
                fontWeight: 800,
                maxWidth: 800,
                fontSize: { xs: '2rem', md: '3.5rem' },
                background: 'linear-gradient(180deg, #FFFFFF 0%, rgba(255,255,255,0.5) 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
              }}
            >
              准备好开始了吗？
            </Typography>
          </m.div>

          <m.div variants={varFade('inDown')}>
            <Typography
              variant="h5"
              sx={{
                color: alpha('#ffffff', 0.6),
                maxWidth: 600,
                fontWeight: 400,
                lineHeight: 1.6,
              }}
            >
              立即探索 Rune、Boss 及 魔哈，开启您的 AI 平台之旅
            </Typography>
          </m.div>

          <m.div variants={varFade('inUp')}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 2 }}>
              <Button
                variant="contained"
                size="large"
                component={RouterLink}
                to="/rune"
                sx={{
                  px: 5,
                  py: 2,
                  fontSize: '1.1rem',
                  bgcolor: 'common.white',
                  color: 'common.black',
                  fontWeight: 600,
                  borderRadius: 1.5,
                  '&:hover': {
                    bgcolor: alpha('#ffffff', 0.8),
                    transform: 'translateY(-2px)',
                    boxShadow: `0 8px 24px -8px ${alpha('#ffffff', 0.4)}`,
                  },
                }}
              >
                查看文档
              </Button>
              <Button
                variant="outlined"
                size="large"
                component={RouterLink}
                to="/moha"
                sx={{
                  px: 5,
                  py: 2,
                  fontSize: '1.1rem',
                  borderColor: alpha('#ffffff', 0.2),
                  color: '#ffffff',
                  fontWeight: 600,
                  borderRadius: 1.5,
                  backdropFilter: 'blur(10px)',
                  '&:hover': {
                    borderColor: '#ffffff',
                    bgcolor: alpha('#ffffff', 0.05),
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
              spacing={8}
              sx={{
                mt: 6,
                pt: 6,
                borderTop: `1px solid ${alpha('#ffffff', 0.1)}`,
              }}
            >
              <Stack spacing={1} alignItems="center">
                <Typography variant="h3" sx={{ color: 'common.white', fontWeight: 800 }}>
                  3
                </Typography>
                <Typography variant="body2" sx={{ color: alpha('#ffffff', 0.5), letterSpacing: 1, textTransform: 'uppercase' }}>
                  产品线
                </Typography>
              </Stack>

              <Stack spacing={1} alignItems="center">
                <Typography variant="h3" sx={{ color: 'common.white', fontWeight: 800 }}>
                  50+
                </Typography>
                <Typography variant="body2" sx={{ color: alpha('#ffffff', 0.5), letterSpacing: 1, textTransform: 'uppercase' }}>
                  功能模块
                </Typography>
              </Stack>

              <Stack spacing={1} alignItems="center">
                <Typography variant="h3" sx={{ color: 'common.white', fontWeight: 800 }}>
                  24/7
                </Typography>
                <Typography variant="body2" sx={{ color: alpha('#ffffff', 0.5), letterSpacing: 1, textTransform: 'uppercase' }}>
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
