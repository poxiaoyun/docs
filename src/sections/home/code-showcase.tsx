import { m } from 'framer-motion';
import { Link as RouterLink } from 'react-router';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { varFade, MotionViewport } from 'src/components/animate';

import { TOKENS } from './tokens';
import { Panel, Overline, monoLinkSx, SectionShell, SectionTitle } from './primitives';

// ----------------------------------------------------------------------
// 版式取自门户首页的产品分栏（.tf-section-split）：左列 380px 文案 + 右列代码面板。
// 文案沿用文档站原有那一版。

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

type TokenKind = 'plain' | 'string' | 'cmd' | 'sub' | 'flag' | 'comment';

/** 代码面板的语义色，取自门户 .tf-managed-api-code-panel 的语法着色 */
const CODE_COLOR: Record<TokenKind, string> = {
  comment: '#ffffff57',
  string: '#ffad70',
  cmd: '#4fd6ff',
  sub: '#a5ff68',
  flag: '#d4b4ff',
  plain: '#ffffffc2',
};

type Token = { kind: TokenKind; text: string };

function tokenizeLine(line: string): Token[] {
  if (line.trim().startsWith('#')) {
    return [{ kind: 'comment', text: line }];
  }

  const tokens: Token[] = [];
  const re = /("(?:[^"\\]|\\.)*")|(\bmoha\b)|(\b(?:login|download|upload)\b)|(--[\w-]+)/g;

  let last = 0;
  for (const match of line.matchAll(re)) {
    const index = match.index ?? 0;
    if (index > last) {
      tokens.push({ kind: 'plain', text: line.slice(last, index) });
    }
    const kind: TokenKind = match[1] ? 'string' : match[2] ? 'cmd' : match[3] ? 'sub' : 'flag';
    tokens.push({ kind, text: match[0] });
    last = index + match[0].length;
  }

  if (last < line.length) {
    tokens.push({ kind: 'plain', text: line.slice(last) });
  }

  return tokens.length ? tokens : [{ kind: 'plain', text: line || ' ' }];
}

const CODE_LINES = CODE_SNIPPET.split('\n').map(tokenizeLine);

// ----------------------------------------------------------------------

export function HomeCodeShowcaseSection() {
  return (
    <Box component="section" sx={{ bgcolor: TOKENS.bgPage, color: TOKENS.text, py: { xs: 8, md: 12 } }}>
      <SectionShell component={MotionViewport} sx={{ px: { xs: 3, md: 5 } }}>
        <Box
          sx={{
            display: 'grid',
            gap: 'clamp(2rem, 5vw, 4rem)',
            alignItems: 'center',
            gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 380px) minmax(0, 1fr)' },
          }}
        >
          <Stack spacing={3} sx={{ alignItems: { xs: 'center', md: 'flex-start' }, textAlign: { xs: 'center', md: 'left' } }}>
            <m.div variants={varFade('inRight')}>
              <Overline>Developer First</Overline>
            </m.div>

            <m.div variants={varFade('inRight')}>
              <SectionTitle
                sx={{ fontSize: 'clamp(1.9rem, 3vw, 2.8rem)', maxWidth: '16ch' }}
              >
                几行代码，连接强大算力
              </SectionTitle>
            </m.div>

            <m.div variants={varFade('inRight')}>
              <Typography sx={{ color: TOKENS.textSubtle, fontSize: '.92rem', lineHeight: 1.8 }}>
                我们为开发者提供轻量与快捷的命令行工具 (CLI)，只需几条简单的命令，即可轻松实现模型与数据集的下载、上传和版本管理，无缝集成到您的工作流中。
              </Typography>
            </m.div>

            <m.div variants={varFade('inUp')}>
              <Box
                component={RouterLink}
                to="/moha/sdk-tutorial"
                sx={{ ...monoLinkSx, px: '1.15rem', py: '.8rem', fontSize: '.82rem', mt: 1 }}
              >
                查看 SDK 教程
                <span aria-hidden>→</span>
              </Box>
            </m.div>
          </Stack>

          <m.div variants={varFade('inLeft')} style={{ width: '100%' }}>
            <Panel
              corner
              sx={{
                p: '1.2rem',
                borderRadius: '1.5rem',
                bgcolor: 'transparent',
                background: '#ffffff09',
                boxShadow: `inset 0 1px #ffffff06, ${TOKENS.shadowPanel}`,
              }}
            >
              <Box
                component="pre"
                sx={{
                  m: 0,
                  p: 'clamp(1.2rem, 2.2vw, 1.8rem)',
                  bgcolor: '#0d0e10c7',
                  border: `1px solid ${TOKENS.borderDefault}`,
                  borderRadius: '.45rem',
                  color: '#ffffffc2',
                  fontFamily: TOKENS.fontMono,
                  fontSize: 'clamp(.76rem, 1.1vw, .92rem)',
                  lineHeight: 1.65,
                  overflowX: 'auto',
                }}
              >
                {CODE_LINES.map((tokens, lineIndex) => (
                  <Box key={lineIndex} sx={{ display: 'flex', minHeight: '1.65em' }}>
                    <Box
                      component="span"
                      sx={{
                        width: '2rem',
                        flexShrink: 0,
                        color: '#ffffff33',
                        userSelect: 'none',
                        textAlign: 'right',
                        pr: '1rem',
                      }}
                    >
                      {lineIndex + 1}
                    </Box>
                    <Box component="span" sx={{ minWidth: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                      {tokens.map((token, tokenIndex) => (
                        <Box
                          key={tokenIndex}
                          component="span"
                          sx={{ color: CODE_COLOR[token.kind] }}
                        >
                          {token.text}
                        </Box>
                      ))}
                    </Box>
                  </Box>
                ))}
              </Box>
            </Panel>
          </m.div>
        </Box>
      </SectionShell>
    </Box>
  );
}
