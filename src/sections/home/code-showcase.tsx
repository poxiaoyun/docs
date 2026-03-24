import { m } from 'framer-motion';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { alpha } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { varFade, MotionViewport } from 'src/components/animate';

const CODE_SNIPPET = `# Auth with Moha Hub
moha login --token "YOUR_API_TOKEN"

# Download a model to local directory
moha download deepseek-ai/DeepSeek-V3 \\
  --local-dir ./models/deepseek-v3 \\
  --exclude "*.bin"

# Upload your model to a new repo
moha upload ./models/my-new-model \\
  your-org/My-Awesome-Model \\
  --private`;

export function HomeCodeShowcaseSection() {
  return (
    <Box
      component="section"
      sx={{
        py: { xs: 8, md: 15 },
        bgcolor: '#000000',
        color: '#ffffff',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background Glow */}
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '60vw',
          height: '60vw',
          background: `radial-gradient(circle, ${alpha('#1877F2', 0.1)} 0%, transparent 60%)`,
          pointerEvents: 'none',
        }}
      />

      <Container maxWidth="lg" component={MotionViewport} sx={{ position: 'relative', zIndex: 1 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={8} alignItems="center">
          
          <Stack spacing={4} sx={{ flex: 1, textAlign: { xs: 'center', md: 'left' } }}>
            <m.div variants={varFade('inRight')}>
              <Typography variant="overline" sx={{ color: alpha('#ffffff', 0.5), letterSpacing: 2 }}>
                DEVELOPER FIRST
              </Typography>
            </m.div>

            <m.div variants={varFade('inRight')}>
              <Typography variant="h2" sx={{ fontWeight: 800 }}>
                几行代码，连接强大算力
              </Typography>
            </m.div>

            <m.div variants={varFade('inRight')}>
              <Typography variant="body1" sx={{ color: alpha('#ffffff', 0.6), fontSize: '1.125rem' }}>
                我们为开发者提供轻量与快捷的命令行工具 (CLI)，只需几条简单的命令，即可轻松实现模型与数据集的下载、上传和版本管理，无缝集成到您的工作流中。
              </Typography>
            </m.div>
          </Stack>

          <Box component={m.div} variants={varFade('inLeft')} sx={{ flex: 1, width: '100%' }}>
            <Box
              sx={{
                borderRadius: 2,
                bgcolor: '#0d0d0d',
                border: `1px solid ${alpha('#ffffff', 0.1)}`,
                overflow: 'hidden',
                boxShadow: `0 20px 40px -10px rgba(0,0,0,0.5)`,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 1.5, borderBottom: `1px solid ${alpha('#ffffff', 0.05)}`, bgcolor: '#1a1a1a' }}>
                <Stack direction="row" spacing={1}>
                  <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#FF5F56' }} />
                  <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#FFBD2E' }} />
                  <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#27C93F' }} />
                </Stack>
                <Typography variant="caption" sx={{ color: alpha('#ffffff', 0.4), ml: 2 }}>
                  Terminal
                </Typography>
              </Box>
              <Box sx={{ p: 3, pt: 4, pb: 4, overflowX: 'auto' }}>
                <Box component="pre" sx={{ margin: 0, fontFamily: 'monospace', fontSize: '0.875rem', lineHeight: 1.6, color: '#e6e6e6' }}>
                  {CODE_SNIPPET.split('\n').map((line, index) => {
                    let coloredLine = line;
                    if (line.trim().startsWith('#')) {
                      coloredLine = `<span style="color: #8b949e">${line}</span>`;
                    } else {
                      coloredLine = line
                        .replace(/"([^"]*)"/g, "<span style='color: #a5d6ff'>\"$1\"</span>")
                        .replace(/\bmoha\b/g, "<span style='color: #27C93F'>moha</span>")
                        .replace(/\b(login|download|upload)\b/g, "<span style='color: #ff7b72'>$1</span>")
                        .replace(/--[\w-]+/g, "<span style='color: #79c0ff'>$&</span>");
                    }
                    
                    return (
                      <Box key={index} sx={{ display: 'flex' }}>
                        <Box component="span" sx={{ width: 24, flexShrink: 0, color: alpha('#ffffff', 0.2), userSelect: 'none' }}>
                          {index + 1}
                        </Box>
                        <Box component="span" dangerouslySetInnerHTML={{ __html: coloredLine || ' ' }} />
                      </Box>
                    )
                  })}
                </Box>
              </Box>
            </Box>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}