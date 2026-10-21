import { useState } from 'react';
import { m } from 'framer-motion';
import { Link as RouterLink } from 'react-router';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { useLangHref } from 'src/utils/doc-lang';

import { CONFIG } from 'src/global-config';

import { SvgColor } from 'src/components/svg-color';
import { varFade, MotionViewport } from 'src/components/animate';

import { TOKENS } from './tokens';
import { useHomeCopy } from './home-copy';
import { MicroLabel, monoLinkSx, SectionShell } from './primitives';

// ----------------------------------------------------------------------
// 门户首页底部有一块 FAQ（左说明 + 右手风琴）。
// 问答内容取自站内《常见问题 FAQ》(/reference/faq)，文案在 home-copy.json。

export function HomeFaqSection() {
  const copy = useHomeCopy();
  const langHref = useLangHref();
  const faqs = copy.faq.items;
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <Box component="section" sx={{ bgcolor: TOKENS.bgPage, color: TOKENS.text, py: { xs: 8, md: 12 } }}>
      <SectionShell component={MotionViewport} sx={{ px: { xs: 3, md: 5 } }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 1fr) minmax(0, 1.25fr)' },
          }}
        >
          {/* 左：说明 */}
          <m.div variants={varFade('inRight')}>
            <Stack
              spacing={2.5}
              sx={{
                pr: { md: 6 },
                pb: { xs: 5, md: 0 },
                borderBottom: { xs: `1px solid ${TOKENS.borderFaint}`, md: 'none' },
                borderRight: { md: `1px solid ${TOKENS.borderFaint}` },
                minHeight: { md: 420 },
              }}
            >
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '2.6rem',
                  height: '2.6rem',
                  borderRadius: TOKENS.radiusXxs,
                  border: `1px solid ${TOKENS.accent}33`,
                  bgcolor: `${TOKENS.accent}14`,
                }}
              >
                <SvgColor
                  src={`${CONFIG.assetsDir}/assets/icons/navbar/ic-chat.svg`}
                  sx={{ width: 20, height: 20, color: TOKENS.accent }}
                />
              </Box>

              <Typography
                component="h2"
                sx={{
                  fontSize: 'clamp(2rem, 3.1vw, 3rem)',
                  fontWeight: 600,
                  lineHeight: 1.07,
                  maxWidth: '22rem',
                  color: TOKENS.textStrong,
                }}
              >
                {copy.faq.title}
              </Typography>

              <Typography sx={{ color: TOKENS.textSubtle, fontSize: '.9rem', lineHeight: 1.7, maxWidth: '24rem' }}>
                {copy.faq.copy}
              </Typography>

              <Box sx={{ pt: { md: 4 } }}>
                <Box component={RouterLink} to={langHref('/reference/faq')} sx={{ ...monoLinkSx, px: '1.15rem', py: '.8rem', fontSize: '.8rem' }}>
                  {copy.faq.cta}
                  <span aria-hidden>→</span>
                </Box>
              </Box>
            </Stack>
          </m.div>

          {/* 右：问题列表 */}
          <Box sx={{ pl: { md: 6 } }}>
            {faqs.map((item, index) => {
              const isOpen = openIndex === index;
              return (
                <Box
                  key={item.q}
                  component="article"
                  sx={{
                    position: 'relative',
                    borderBottom: `1px solid ${TOKENS.borderFaint}`,
                    '&:first-of-type': { borderTop: { xs: `1px solid ${TOKENS.borderFaint}`, md: 'none' } },
                  }}
                >
                  <Box
                    component="button"
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    aria-expanded={isOpen}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      width: 1,
                      textAlign: 'left',
                      bgcolor: 'transparent',
                      border: 0,
                      color: isOpen ? TOKENS.text : TOKENS.textDefault,
                      font: 'inherit',
                      cursor: 'pointer',
                      px: '1.25rem',
                      py: '1.6rem',
                      transition: `background-color .18s ${TOKENS.easeStandard}, color .18s ${TOKENS.easeStandard}`,
                      '&:hover': { bgcolor: '#ffffff09', color: TOKENS.text },
                    }}
                  >
                    <Typography
                      component="span"
                      sx={{ fontFamily: TOKENS.fontMono, fontSize: '.65rem', color: '#ffffff5c', flexShrink: 0 }}
                    >
                      {String(index + 1).padStart(2, '0')}
                    </Typography>
                    <Typography component="span" sx={{ flexGrow: 1, fontSize: '.98rem', fontWeight: 500, lineHeight: 1.45 }}>
                      {item.q}
                    </Typography>
                    <Box
                      component="span"
                      aria-hidden
                      sx={{
                        flexShrink: 0,
                        color: isOpen ? TOKENS.accent : '#ffffff70',
                        fontSize: '1.1rem',
                        lineHeight: 1,
                        transform: isOpen ? 'rotate(0deg)' : 'rotate(45deg)',
                        transition: `transform .18s ${TOKENS.easeStandard}, color .18s ${TOKENS.easeStandard}`,
                      }}
                    >
                      +
                    </Box>
                  </Box>

                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateRows: isOpen ? '1fr' : '0fr',
                      opacity: isOpen ? 1 : 0,
                      transition: `grid-template-rows .42s ${TOKENS.easeOut}, opacity .26s ${TOKENS.easeStandard}`,
                      overflow: 'hidden',
                    }}
                  >
                    <Box sx={{ minHeight: 0, overflow: 'hidden' }}>
                      <Typography
                        sx={{
                          color: '#ffffff85',
                          fontSize: '.84rem',
                          lineHeight: 1.7,
                          maxWidth: '39rem',
                          px: '1.25rem',
                          pb: '1.75rem',
                          ml: '1.6rem',
                          transform: isOpen ? 'translateY(0)' : 'translateY(-.5rem)',
                          transition: `transform .42s ${TOKENS.easeOut}`,
                        }}
                      >
                        {item.a}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              );
            })}

            <Box sx={{ pt: 3 }}>
              <MicroLabel sx={{ color: TOKENS.textDim }}>
                {copy.faq.note}
              </MicroLabel>
            </Box>
          </Box>
        </Box>
      </SectionShell>
    </Box>
  );
}
