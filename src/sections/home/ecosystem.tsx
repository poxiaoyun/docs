import { m } from 'framer-motion';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { alpha } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { varFade, MotionViewport } from 'src/components/animate';

const FRAMEWORKS = [
  'PyTorch', 'TensorFlow', 'vLLM', 'HuggingFace', 'Ollama', 
  'DeepSpeed', 'Triton', 'Ray', 'Kubernetes', 'Docker', 'ONNX'
];

export function HomeEcosystemSection() {
  return (
    <Box
      component="section"
      sx={{
        py: { xs: 8, md: 12 },
        position: 'relative',
        overflow: 'hidden',
        bgcolor: '#000000',
        color: '#ffffff',
        borderTop: `1px solid ${alpha('#ffffff', 0.05)}`,
        borderBottom: `1px solid ${alpha('#ffffff', 0.05)}`,
      }}
    >
      <Container maxWidth="lg" component={MotionViewport}>
        <Stack spacing={4} alignItems="center" textAlign="center" mb={6}>
          <m.div variants={varFade('inUp')}>
            <Typography variant="overline" sx={{ color: alpha('#ffffff', 0.5), letterSpacing: 2 }}>
              POWERING THE NEXT GENERATION OF AI
            </Typography>
          </m.div>
          <m.div variants={varFade('inUp')}>
            <Typography variant="h3" sx={{ fontWeight: 700 }}>
              Seamlessly integrates with <br />
              your favorite open-source tools
            </Typography>
          </m.div>
        </Stack>
      </Container>
      
      {/* Marquee Animation */}
      <Box sx={{ position: 'relative', width: '100%', overflow: 'hidden' }}>
        {/* Gradients for fade out at edges */}
        <Box sx={{
          position: 'absolute', top: 0, bottom: 0, left: 0, width: { xs: '60px', md: '150px' },
          background: 'linear-gradient(to right, #000000 0%, transparent 100%)', zIndex: 2
        }} />
        <Box sx={{
          position: 'absolute', top: 0, bottom: 0, right: 0, width: { xs: '60px', md: '150px' },
          background: 'linear-gradient(to left, #000000 0%, transparent 100%)', zIndex: 2
        }} />

        <Box
          component={m.div}
          animate={{ x: [0, -1500] }} // Arbitrary pixel value, but we just need a smooth loop block
          transition={{
            repeat: Infinity,
            ease: "linear",
            duration: 25
          }}
          sx={{
            display: 'flex',
            gap: 8,
            width: 'max-content',
            px: 4,
          }}
        >
          {/* Double array for infinite seamless scroll */}
          {[...FRAMEWORKS, ...FRAMEWORKS, ...FRAMEWORKS].map((fw, index) => (
            <Typography 
              key={`${fw}-${index}`} 
              variant="h5" 
              sx={{ 
                color: alpha('#ffffff', 0.3),
                fontWeight: 800,
                whiteSpace: 'nowrap',
                transition: 'color 0.3s',
                '&:hover': { color: '#ffffff' }
              }}
            >
              {fw}
            </Typography>
          ))}
        </Box>
      </Box>
    </Box>
  );
}