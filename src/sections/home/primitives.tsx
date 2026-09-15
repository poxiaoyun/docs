import type { ReactNode } from 'react';
import type { BoxProps } from '@mui/material/Box';
import type { Theme, SxProps } from '@mui/material/styles';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { TOKENS, OVERLINE_BORDER } from './tokens';

// ----------------------------------------------------------------------
// 这些组件复刻自门户首页的视觉基元（.tf-panel / .tf-terminal / .tf-button /
// .tf-overline / .tf-section-title / .tf-partner-section 的虚线分隔）。
// 文档站首页的每个区块都由它们拼装，改视觉只需要改这一处。
// ----------------------------------------------------------------------

type SxProp = SxProps<Theme> | undefined;

const mergeSx = (base: SxProps<Theme>, sx?: SxProp) =>
  [base, ...(Array.isArray(sx) ? sx : sx ? [sx] : [])] as SxProps<Theme>;

/**
 * 内容轨：门户全站用一条 1280px 宽、左右各一条 1px 竖线的容器把内容框住，
 * 竖线从页头贯穿到页脚，是那套设计里最显眼的骨架。
 */
export function SectionShell({
  sx,
  children,
  ...other
}: BoxProps & { sx?: SxProp; children: ReactNode }) {
  return (
    <Box
      sx={mergeSx(
        {
          width: `min(calc(100% - 3rem), ${TOKENS.contentMax})`,
          mx: 'auto',
          borderLeft: `1px solid ${TOKENS.borderRail}`,
          borderRight: `1px solid ${TOKENS.borderRail}`,
        },
        sx
      )}
      {...other}
    >
      {children}
    </Box>
  );
}

/** 面板：半透明渐变底 + 1px 描边 + 左上/右上两个直角角标（门户 .tf-panel）。 */
export function Panel({
  sx,
  children,
  corner = true,
  ...other
}: BoxProps & { sx?: SxProp; children: ReactNode; corner?: boolean }) {
  return (
    <Box
      sx={mergeSx(
        {
          position: 'relative',
          borderRadius: TOKENS.radiusXs,
          border: `1px solid ${TOKENS.borderSubtle}`,
          background: `linear-gradient(#ffffff13, #ffffff07), ${TOKENS.bgInset}`,
          boxShadow: TOKENS.shadowPanel,
          ...(corner && {
            '&::before, &::after': {
              content: '""',
              position: 'absolute',
              width: TOKENS.cornerSize,
              height: TOKENS.cornerSize,
              pointerEvents: 'none',
            },
            '&::before': {
              top: '-1px',
              left: '-1px',
              borderTop: `1px solid ${TOKENS.borderCorner}`,
              borderLeft: `1px solid ${TOKENS.borderCorner}`,
            },
            '&::after': {
              top: '-1px',
              right: '-1px',
              borderTop: `1px solid ${TOKENS.borderCorner}`,
              borderRight: `1px solid ${TOKENS.borderCorner}`,
            },
          }),
        },
        sx
      )}
      {...other}
    >
      {children}
    </Box>
  );
}

/** 窗口顶部标题栏：三个圆点 + 等宽字体路径。门户的终端与代码面板共用。 */
export function TerminalBar({ path, sx }: { path: string; sx?: SxProp }) {
  return (
    <Box
      sx={mergeSx(
        {
          display: 'flex',
          alignItems: 'center',
          gap: '.6rem',
          px: '1.05rem',
          py: '.72rem',
          borderBottom: `1px solid ${TOKENS.borderFaint}`,
          flexShrink: 0,
        },
        sx
      )}
    >
      {['#3a3a3d', '#3a3a3d', '#3a3a3d'].map((color, index) => (
        <Box
          key={index}
          sx={{
            width: '.62rem',
            height: '.62rem',
            borderRadius: '50%',
            bgcolor: color,
            flexShrink: 0,
          }}
        />
      ))}
      <Typography
        component="span"
        sx={{
          fontFamily: TOKENS.fontMono,
          color: '#ffffff5c',
          fontSize: '.74rem',
          ml: '1.2rem',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          textAlign: 'left',
        }}
      >
        {path}
      </Typography>
    </Box>
  );
}

/** 终端窗口（门户 .tf-terminal）：深色玻璃 + 柔和投影。 */
export function Terminal({
  path,
  sx,
  children,
  ...other
}: BoxProps & { path: string; sx?: SxProp; children: ReactNode }) {
  return (
    <Box
      sx={mergeSx(
        {
          borderRadius: TOKENS.radiusXs,
          border: `1px solid ${TOKENS.borderFaint}`,
          background: `linear-gradient(#ffffff0f, #ffffff05), ${TOKENS.bgInsetSoft}`,
          boxShadow: TOKENS.shadowTerminal,
          overflow: 'hidden',
        },
        sx
      )}
      {...other}
    >
      <TerminalBar path={path} />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '.58rem',
          px: '1.35rem',
          py: '1.28rem',
          fontFamily: TOKENS.fontMono,
          color: '#ffffff6b',
          fontSize: '.86rem',
          lineHeight: 1.6,
          // 终端里的文本一律左对齐。hero 是居中排版，text-align 会被继承下来，
          // 长命令折行后续行会跟着居中，看着就不像终端了。
          textAlign: 'left',
        }}
      >
        {children}
      </Box>
    </Box>
  );
}

/** 页头小标签：渐变描边胶囊 + 前置三角（门户 .tf-overline）。 */
export function Overline({ children, sx }: { children: ReactNode; sx?: SxProp }) {
  return (
    <Box
      component="span"
      sx={mergeSx(
        {
          display: 'inline-flex',
          alignItems: 'center',
          gap: '.55rem',
          px: '1.05rem',
          py: '.56rem',
          borderRadius: TOKENS.radiusPill,
          border: '1px solid transparent',
          background: `linear-gradient(#0b0b0d, #0b0b0d) padding-box, ${OVERLINE_BORDER} border-box`,
          color: '#ffffffd6',
          fontSize: '.82rem',
          fontWeight: 700,
          lineHeight: 1.4,
          boxShadow: `0 0 36px ${TOKENS.accent}1f`,
          '&::before': {
            content: '""',
            width: '.62rem',
            height: '.62rem',
            flexShrink: 0,
            background: '#ffffff',
            clipPath: 'polygon(15% 0, 100% 50%, 15% 100%)',
            boxShadow: '0 0 18px #ffffff6b',
          },
        },
        sx
      )}
    >
      {children}
    </Box>
  );
}

/** 等宽大写小标（门户 .tf-runtime-label）。 */
export function MicroLabel({ children, sx }: { children: ReactNode; sx?: SxProp }) {
  return (
    <Typography
      sx={mergeSx(
        {
          fontFamily: TOKENS.fontMono,
          fontSize: '.7rem',
          fontWeight: 600,
          letterSpacing: '.18em',
          textTransform: 'uppercase',
          color: '#ffffff6b',
          lineHeight: 1.2,
        },
        sx
      )}
    >
      {children}
    </Typography>
  );
}

/** 区块标题（门户 .tf-section-title / .tf-section-copy）。 */
export function SectionTitle({ children, sx }: { children: ReactNode; sx?: SxProp }) {
  return (
    <Typography
      component="h2"
      sx={mergeSx(
        {
          color: TOKENS.text,
          fontSize: 'clamp(2.35rem, 4vw, 3.55rem)',
          fontWeight: 650,
          lineHeight: 1.04,
          letterSpacing: 0,
        },
        sx
      )}
    >
      {children}
    </Typography>
  );
}

export function SectionCopy({ children, sx }: { children: ReactNode; sx?: SxProp }) {
  return (
    <Typography
      sx={mergeSx(
        {
          color: TOKENS.textMuted,
          fontSize: '1rem',
          lineHeight: 1.8,
          maxWidth: '44rem',
        },
        sx
      )}
    >
      {children}
    </Typography>
  );
}

/** 区块头：小标 + 大标题 + 描述。 */
export function SectionHead({
  label,
  title,
  copy,
  align = 'left',
  sx,
}: {
  label?: ReactNode;
  title: ReactNode;
  copy?: ReactNode;
  align?: 'left' | 'center';
  sx?: SxProp;
}) {
  const centered = align === 'center';
  return (
    <Stack
      spacing={{ xs: 1.5, md: 2 }}
      alignItems={centered ? 'center' : 'flex-start'}
      sx={mergeSx({ textAlign: centered ? 'center' : 'left' }, sx)}
    >
      {label ? <MicroLabel>{label}</MicroLabel> : null}
      <SectionTitle>{title}</SectionTitle>
      {copy ? <SectionCopy sx={{ mx: centered ? 'auto' : 0 }}>{copy}</SectionCopy> : null}
    </Stack>
  );
}

/** 虚线渐变分隔（门户 .tf-partner-section 的上下边）。 */
export function DashDivider({ sx }: { sx?: SxProp }) {
  return (
    <Box
      sx={mergeSx(
        {
          height: '1px',
          opacity: 0.72,
          backgroundImage: `linear-gradient(90deg, #0000, ${TOKENS.borderSubtle} 12%, ${TOKENS.borderSubtle} 88%, #0000),
            repeating-linear-gradient(90deg, #ffffff24 0, #ffffff24 2px, #0000 2px, #0000 8px)`,
        },
        sx
      )}
    />
  );
}

/**
 * 无缝跑马灯：内容渲染两遍 + translateX(-50%)，用同一条 CSS 动画循环。
 * 门户的合作伙伴墙与生态长廊都是这个形态。
 */
export function Marquee({
  duration = 60,
  gap = 'clamp(3rem, 5.2vw, 5.25rem)',
  fade = 'clamp(5rem, 12vw, 12rem)',
  sx,
  children,
}: {
  duration?: number;
  gap?: string;
  fade?: string;
  sx?: SxProp;
  children: ReactNode;
}) {
  return (
    <Box
      sx={mergeSx(
        {
          position: 'relative',
          overflow: 'hidden',
          width: '100%',
          maskImage: `linear-gradient(90deg, #0000 0, #000 ${fade} calc(100% - ${fade}), #0000 100%)`,
          WebkitMaskImage: `linear-gradient(90deg, #0000 0, #000 ${fade} calc(100% - ${fade}), #0000 100%)`,
        },
        sx
      )}
    >
      <Box
        sx={{
          display: 'flex',
          width: 'max-content',
          animation: `home-marquee-scroll ${duration}s linear infinite`,
          '@keyframes home-marquee-scroll': {
            from: { transform: 'translateX(0)' },
            to: { transform: 'translateX(-50%)' },
          },
          '@media (prefers-reduced-motion: reduce)': { animation: 'none' },
        }}
      >
        {/*
          两份内容 + translateX(-50%) 才无缝：每组自己带上尾部间距，
          容器总宽正好等于两个组宽之和，位移一半就是刚好走过一组。
          分成两个容器而不是直接 {children}{children} —— 后者会让同一批 key 重复。
        */}
        {[0, 1].map((copy) => (
          <Box key={copy} sx={{ display: 'flex', alignItems: 'center', gap, pr: gap, flexShrink: 0 }}>
            {children}
          </Box>
        ))}
      </Box>
    </Box>
  );
}

/**
 * 按钮样式工厂（门户 .tf-button / .tf-button-primary / .tf-button-secondary）。
 * 不做组件封装是为了让各区块仍能直接用 MUI Button 的 component/to 多态。
 */
// 返回类型交给 TS 推断（而不是标成 SxProps）：SxProps 允许数组形式，
// 而带 component 的多态 Box/Button 对 sx 的类型收窄成「非数组的样式对象」，
// 标了 SxProps 反而传不进去。推断出的对象字面量类型两边都兼容。
export const buttonSx = (tone: 'primary' | 'secondary' = 'primary') => ({
  borderRadius: TOKENS.radiusXxs,
  border: '1px solid',
  px: '1.5rem',
  py: '.75rem',
  fontSize: '.875rem',
  fontWeight: 600,
  lineHeight: 1.25,
  textTransform: 'none',
  whiteSpace: 'nowrap',
  transition: `border-color .4s ${TOKENS.easeStandard}, background-color .4s ${TOKENS.easeStandard}, color .4s ${TOKENS.easeStandard}, transform .4s ${TOKENS.easeStandard}`,
  ...(tone === 'primary'
    ? {
        color: TOKENS.textInverse,
        bgcolor: '#ffffff',
        borderColor: '#ffffffe6',
        '&:hover': { bgcolor: '#dcdce0', borderColor: '#ffffffe6', transform: 'scale(.98)' },
      }
    : {
        color: TOKENS.text,
        bgcolor: '#ffffff0b',
        borderColor: TOKENS.borderDefault,
        '&:hover': {
          bgcolor: TOKENS.borderFaint,
          borderColor: TOKENS.borderStrong,
          transform: 'scale(.98)',
        },
      }),
});

/** 等宽小字链接（门户 .tf-managed-api-primary-link / .tf-home-pricing-note a）。 */
export const monoLinkSx = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '.85rem',
  px: '1.45rem',
  py: '1rem',
  border: `1px solid ${TOKENS.borderStrong}`,
  borderRadius: TOKENS.radiusXxs,
  color: '#ffffffeb',
  fontFamily: TOKENS.fontMono,
  fontSize: '.88rem',
  fontWeight: 600,
  textDecoration: 'none',
  width: 'fit-content',
  transition: `border-color .4s ${TOKENS.easeStandard}, background-color .4s ${TOKENS.easeStandard}, color .4s ${TOKENS.easeStandard}`,
  '&:hover': { color: TOKENS.text, bgcolor: TOKENS.borderFaint, borderColor: '#fff9' },
};
