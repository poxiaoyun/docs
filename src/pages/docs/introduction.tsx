import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { CONFIG } from 'src/global-config';

// ----------------------------------------------------------------------

export default function IntroductionPage() {
  return (
    <Container maxWidth="lg">
      <Box
        component="img"
        alt="dashboard"
        src={`${CONFIG.assetsDir}/assets/illustrations/illustration-dashboard.webp`}
        sx={{
          width: 1,
          borderRadius: 2,
          boxShadow: (theme) => theme.customShadows.z24,
          mb: 5,
        }}
      />

      <Typography variant="h3" sx={{ mb: 2 }}>
        Minimal – Client & Admin Dashboard
      </Typography>

      <Typography sx={{ color: 'text.secondary', mb: 3 }}>
        A professional React Kit that comes with plenty of ready-to-use Material-UI components that
        will help you to build more beautiful frontend pages.
      </Typography>

      <Stack spacing={2} sx={{ color: 'text.secondary' }}>
        <Box component="li">
          Built with{' '}
          <Box component="span" sx={{ color: 'warning.main', fontWeight: 'fontWeightBold' }}>
            MUI
          </Box>{' '}
          with two versions{' '}
          <Box component="span" sx={{ color: 'text.primary', fontWeight: 'fontWeightBold' }}>
            Next.js | Vite
          </Box>
          .
        </Box>
        <Box component="li">
          Includes a complete design component{' '}
          <Box component="span" sx={{ color: 'text.primary', fontWeight: 'fontWeightBold' }}>
            Figma
          </Box>{' '}
          file to extend your project development.
        </Box>
        <Box component="li">The theme is ready to change to any style you want.</Box>
      </Stack>
    </Container>
  );
}
