import { useState } from 'react';
import { m } from 'framer-motion';
import { Link as RouterLink } from 'react-router';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { CONFIG } from 'src/global-config';

import { SvgColor } from 'src/components/svg-color';
import { varFade, MotionViewport } from 'src/components/animate';

import { TOKENS } from './tokens';
import { MicroLabel, monoLinkSx, SectionShell } from './primitives';

// ----------------------------------------------------------------------
// 门户首页底部有一块 FAQ（左说明 + 右手风琴），文档站原先没有，这里补上。
// 问答内容取自站内《常见问题 FAQ》(/reference/faq)，只做取舍不改口径。

const FAQS = [
  {
    q: '忘记密码怎么办？',
    a: '在登录页点「忘记密码？」，填写账号绑定的邮箱后点「发送」；平台会把重置密码链接发到邮箱，从邮件里点链接即可设置新密码。',
  },
  {
    q: '登录后被要求选租户，租户列表却是空的？',
    a: '说明你还没加入任何租户。可以在租户选择页注册新租户，或请管理员把你加进某个租户。',
  },
  {
    q: '创建推理服务时，「规格」卡片没有可选项？',
    a: '当前工作空间的配额不足，或没有可用算力。联系租户管理员调整配额，或先停掉其他不用的实例。',
  },
  {
    q: '实例状态一直是「已安装」？',
    a: '正在拉取镜像或加载模型。进入实例详情的「事件」页，确认镜像拉取是否成功。',
  },
  {
    q: '调用接口返回 401 或 429？',
    a: '401 是密钥错误或过期：检查请求头是否为 Bearer 你的密钥，必要时重新创建；429 是触发限速：在「API 密钥」里调大 RPM / TPM，或降低调用频率。',
  },
  {
    q: '页面提示 403？',
    a: '当前角色确实没有该操作权限。对照权限说明找出需要的角色，联系租户管理员调整后重试。',
  },
];

export function HomeFaqSection() {
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
                常见问题
              </Typography>

              <Typography sx={{ color: TOKENS.textSubtle, fontSize: '.9rem', lineHeight: 1.7, maxWidth: '24rem' }}>
                按主题整理「现象 → 原因 → 怎么办」，每一条都给你能直接照做的下一步。
              </Typography>

              <Box sx={{ pt: { md: 4 } }}>
                <Box component={RouterLink} to="/reference/faq" sx={{ ...monoLinkSx, px: '1.15rem', py: '.8rem', fontSize: '.8rem' }}>
                  查看完整 FAQ
                  <span aria-hidden>→</span>
                </Box>
              </Box>
            </Stack>
          </m.div>

          {/* 右：问题列表 */}
          <Box sx={{ pl: { md: 6 } }}>
            {FAQS.map((item, index) => {
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
                还有别的问题？到「参考文档」里按主题查
              </MicroLabel>
            </Box>
          </Box>
        </Box>
      </SectionShell>
    </Box>
  );
}
