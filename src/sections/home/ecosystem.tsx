import { m } from 'framer-motion';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { varFade, MotionViewport } from 'src/components/animate';

import { TOKENS } from './tokens';
import { Marquee, MicroLabel, DashDivider, SectionShell } from './primitives';

// ----------------------------------------------------------------------
// 版式取自门户首页的合作伙伴带：全宽出血、上下各一条虚线渐变分隔、
// 中间一条无缝滚动的等宽字标长廊。这里滚动的是文档站自己的开源生态清单。

const FRAMEWORKS = [
  'PyTorch',
  'TensorFlow',
  'vLLM',
  'HuggingFace',
  'Ollama',
  'DeepSpeed',
  'Triton',
  'Ray',
  'Kubernetes',
  'Docker',
  'ONNX',
];

export function HomeEcosystemSection() {
  return (
    <Box component="section" sx={{ bgcolor: TOKENS.bgPage, color: TOKENS.text, py: { xs: 7, md: 10 } }}>
      <Box
        component={MotionViewport}
        sx={{
          position: 'relative',
          left: '50%',
          width: '100vw',
          transform: 'translateX(-50%)',
          overflow: 'hidden',
        }}
      >
        <SectionShell sx={{ px: { xs: 3, md: 5 } }}>
          <DashDivider />
        </SectionShell>

        <Stack
          component={m.div}
          variants={varFade('inUp')}
          spacing={{ xs: 2, md: 3 }}
          alignItems="center"
          textAlign="center"
          sx={{ px: { xs: 3, md: 5 }, py: { xs: 5, md: 7 } }}
        >
          <MicroLabel>Powering the next generation of AI</MicroLabel>
          <Typography
            component="h3"
            sx={{
              fontWeight: 600,
              lineHeight: 1.25,
              fontSize: 'clamp(1.4rem, 2.6vw, 2.1rem)',
              maxWidth: '34rem',
              color: TOKENS.textStrong,
            }}
          >
            Seamlessly integrates with <br />
            your favorite open-source tools
          </Typography>
        </Stack>

        <Marquee duration={60} sx={{ py: { xs: 2, md: 3 } }}>
          {FRAMEWORKS.map((fw) => (
            <Typography
              key={fw}
              component="span"
              sx={{
                fontFamily: TOKENS.fontMono,
                fontSize: 'clamp(.84rem, 1vw, .98rem)',
                fontWeight: 600,
                lineHeight: 1,
                whiteSpace: 'nowrap',
                color: '#ffffffba',
                transition: `color .3s ${TOKENS.easeStandard}`,
                '&:hover': { color: TOKENS.text },
              }}
            >
              {fw}
            </Typography>
          ))}
        </Marquee>

        <SectionShell sx={{ px: { xs: 3, md: 5 } }}>
          <DashDivider />
        </SectionShell>
      </Box>
    </Box>
  );
}
