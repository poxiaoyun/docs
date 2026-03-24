import { m } from 'framer-motion';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import { alpha } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { CONFIG } from 'src/global-config';

import { SvgColor } from 'src/components/svg-color';
import { varFade, MotionViewport } from 'src/components/animate';

// ----------------------------------------------------------------------

export function HomeCapabilitiesSection() {
  return (
    <Box sx={{ bgcolor: '#000000', color: 'common.white', py: { xs: 8, md: 12 } }}>
      <Container component={MotionViewport} maxWidth="lg">
        <Stack spacing={2} sx={{ textAlign: 'center', mb: { xs: 6, md: 8 } }}>
          <m.div variants={varFade('inDown')}>
            <Typography variant="overline" sx={{ color: alpha('#ffffff', 0.5), letterSpacing: 2 }}>
              CORE PLATFORM
            </Typography>
          </m.div>
          <m.div variants={varFade('inDown')}>
            <Typography variant="h2" sx={{ fontWeight: 800 }}>一切皆为现代化 AI 服务</Typography>
          </m.div>
          <m.div variants={varFade('inDown')}>
            <Typography variant="body1" sx={{ color: alpha('#ffffff', 0.6), maxWidth: 640, mx: 'auto' }}>
              强大的基座服务协同生态管理与高效运营，提供面向未来生产的算力、模型和集群管理体验。
            </Typography>
          </m.div>
        </Stack>

        <Box
          sx={{
            display: 'grid',
            gap: { xs: 2, md: 3 },
            gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
            gridAutoRows: { xs: 'auto', md: 'minmax(240px, auto)' },
          }}
        >
          {/* Rune: Main Bento Box */}
          <Box
            component={m.div}
            variants={varFade('inUp')}
            sx={{
              gridColumn: { xs: 'span 1', md: 'span 2' },
              gridRow: { xs: 'span 1', md: 'span 2' },
              borderRadius: 3,
              p: 5,
              position: 'relative',
              overflow: 'hidden',
              bgcolor: '#0a0a0a',
              border: `1px solid ${alpha('#ffffff', 0.1)}`,
              display: 'flex',
              flexDirection: 'column',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: `radial-gradient(ellipse at bottom left, ${alpha('#1877F2', 0.15)} 0%, transparent 60%)`,
                pointerEvents: 'none',
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
                background: alpha('#1877F2', 0.1),
                mb: 4,
              }}
            >
              <SvgColor src={`${CONFIG.assetsDir}/assets/icons/navbar/ic-dashboard.svg`} sx={{ width: 24, height: 24, color: '#1877F2' }} />
            </Box>
            <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>Rune 智算平台</Typography>
            <Typography variant="h6" sx={{ color: alpha('#ffffff', 0.6), fontWeight: 400, mb: 4, maxWidth: 400 }}>
              大规模 AI 推理与工作负载调度。无缝管理实例、镜像与存储计算一体化配额资源。
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: 'auto', zIndex: 1 }}>
              {['推理托管', '工作负载调度', '镜像管理', '共享存储配置'].map((highlight) => (
                <Chip
                  key={highlight}
                  label={highlight}
                  variant="outlined"
                  sx={{ borderColor: alpha('#1877F2', 0.3), color: '#1877F2', bgcolor: alpha('#1877F2', 0.05), fontWeight: 600 }}
                />
              ))}
            </Stack>
          </Box>

          {/* Moha Box */}
          <Box
            component={m.div}
            variants={varFade('inLeft')}
            sx={{
              gridColumn: { xs: 'span 1', md: 'span 1' },
              gridRow: { xs: 'span 1', md: 'span 1' },
              borderRadius: 3,
              p: 4,
              position: 'relative',
              overflow: 'hidden',
              bgcolor: '#0a0a0a',
              border: `1px solid ${alpha('#ffffff', 0.1)}`,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                right: 0,
                width: '100%',
                height: '100%',
                background: `radial-gradient(circle at top right, ${alpha('#00A76F', 0.15)} 0%, transparent 70%)`,
                pointerEvents: 'none',
              },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Box sx={{ width: 40, height: 40, borderRadius: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'center', background: alpha('#00A76F', 0.1) }}>
                <SvgColor src={`${CONFIG.assetsDir}/assets/icons/navbar/ic-booking.svg`} sx={{ width: 20, height: 20, color: '#00A76F' }} />
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>魔哈仓库</Typography>
            </Box>
            <Typography variant="body2" sx={{ color: alpha('#ffffff', 0.6), mb: 3 }}>
              模型与数据集的社区仓库体系。实现优雅的版本流转与开源协作。
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: 'auto', zIndex: 1 }}>
              <Chip size="small" label="版本流转" variant="outlined" sx={{ borderColor: alpha('#00A76F', 0.3), color: '#00A76F' }} />
              <Chip size="small" label="社区活动" variant="outlined" sx={{ borderColor: alpha('#00A76F', 0.3), color: '#00A76F' }} />
            </Stack>
          </Box>

          {/* Boss Box */}
          <Box
            component={m.div}
            variants={varFade('inLeft')}
            sx={{
              gridColumn: { xs: 'span 1', md: 'span 1' },
              gridRow: { xs: 'span 1', md: 'span 1' },
              borderRadius: 3,
              p: 4,
              position: 'relative',
              overflow: 'hidden',
              bgcolor: '#0a0a0a',
              border: `1px solid ${alpha('#ffffff', 0.1)}`,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              '&::before': {
                content: '""',
                position: 'absolute',
                bottom: 0,
                right: 0,
                width: '100%',
                height: '100%',
                background: `radial-gradient(circle at bottom right, ${alpha('#7635DC', 0.15)} 0%, transparent 70%)`,
                pointerEvents: 'none',
              },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Box sx={{ width: 40, height: 40, borderRadius: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'center', background: alpha('#7635DC', 0.1) }}>
                <SvgColor src={`${CONFIG.assetsDir}/assets/icons/navbar/ic-params.svg`} sx={{ width: 20, height: 20, color: '#7635DC' }} />
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>Boss 运营平台</Typography>
            </Box>
            <Typography variant="body2" sx={{ color: alpha('#ffffff', 0.6), mb: 3 }}>
              专为平台管理员设计，实现跨集群治理、租户网关审核和强效策略分发。
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: 'auto', zIndex: 1 }}>
              <Chip size="small" label="集群治理" variant="outlined" sx={{ borderColor: alpha('#7635DC', 0.3), color: '#7635DC' }} />
              <Chip size="small" label="配额隔离" variant="outlined" sx={{ borderColor: alpha('#7635DC', 0.3), color: '#7635DC' }} />
            </Stack>
          </Box>

        </Box>
      </Container>
    </Box>
  );
}
