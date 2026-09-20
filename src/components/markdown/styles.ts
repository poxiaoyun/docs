import { varAlpha } from 'minimal-shared/utils';

import { styled } from '@mui/material/styles';

import { markdownClasses } from './classes';

// ----------------------------------------------------------------------

const MARGIN = '0.75em';

export const MarkdownRoot = styled('div')(({ theme }) => ({
  fontFamily: theme.typography.fontFamily,
  color: theme.vars.palette.text.primary,
  minWidth: 0,
  '> * + *': {
    marginTop: 0,
    marginBottom: MARGIN,
  },
  /**
   * @Heading & paragraph
   */
  h1: { ...theme.typography.h3, marginTop: 40, marginBottom: 8, color: theme.vars.palette.text.primary },
  h2: { ...theme.typography.h4, marginTop: 40, marginBottom: 8, color: theme.vars.palette.text.primary },
  h3: { ...theme.typography.h5, marginTop: 24, marginBottom: 8, color: theme.vars.palette.text.primary },
  h4: { ...theme.typography.h6, marginTop: 24, marginBottom: 8, color: theme.vars.palette.text.primary },
  h5: { ...theme.typography.subtitle1, marginTop: 24, marginBottom: 8, color: theme.vars.palette.text.primary },
  h6: { ...theme.typography.subtitle2, marginTop: 24, marginBottom: 8, color: theme.vars.palette.text.primary },
  p: { ...theme.typography.body1, marginBottom: '1.25rem', color: theme.vars.palette.text.primary },
  strong: { color: theme.vars.palette.text.primary, fontWeight: theme.typography.fontWeightSemiBold },
  li: { color: theme.vars.palette.text.primary },

  /**
   * @First Child
   */
  '& > *:first-of-type': {
    marginTop: 0,
  },

  /**
   * @Hr divider
   */
  hr: {
    flexShrink: 0,
    borderWidth: 0,
    margin: '2em 0',
    msFlexNegative: 0,
    WebkitFlexShrink: 0,
    borderStyle: 'solid',
    borderBottomWidth: 'thin',
    borderColor: theme.vars.palette.divider,
  },
  /**
   * @Image
   */
  [`& .${markdownClasses.content.image}`]: {
    maxWidth: '100%',
    height: 'auto',
    margin: 'auto auto 1.25em',
    borderRadius: Number(theme.shape.borderRadius) * 2,
    display: 'inline-block',
    border: `1px solid ${theme.vars.palette.divider}`,
    backgroundColor: theme.vars.palette.background.neutral,
  },
  /**
   * @List
   */
  '& ul': {
    listStyleType: 'disc',
  },
  '& ul, & ol': {
    paddingLeft: 16,
    '& > li': {
      lineHeight: 1.5,
      '& > p': {
        margin: 0,
        display: 'inline-block',
      },
    },
  },
  /**
   * @Blockquote
   *
   * 视觉语言与 AlertBox（:::tip 等）一致：左侧色条 + 浅灰底。
   * 三个刻意不做的点，改动前都踩过：
   * 1. 不设 maxWidth。引用块必须和正文、表格同宽、同左边缘；一旦限宽 640 再配
   *    `margin: 24px auto`，在宽屏上会缩成居中的窄卡片，左右都不对齐、还提前折行。
   * 2. 不用 3em 的 `::before` 引号。它撑出 64px 左内边距，且引号浮在首行上方
   *    （top: -8 配 3em 字号），看着像残留字符而不是设计元素。
   * 3. `& p` 必须显式 `color: 'inherit'`。正文的 `p { color: text.primary }` 会盖掉
   *    这里的 text.secondary，不写这一条则引用文字仍是主色，灰色底失去意义。
   */
  '& blockquote': {
    position: 'relative',
    margin: '20px 0',
    lineHeight: 1.7,
    padding: theme.spacing(1.5, 2.5),
    color: theme.vars.palette.text.secondary,
    borderRadius: Number(theme.shape.borderRadius),
    backgroundColor: varAlpha(theme.vars.palette.grey['500Channel'], 0.08),
    borderLeft: `3px solid ${varAlpha(theme.vars.palette.grey['500Channel'], 0.32)}`,
    '& p': { margin: 0, color: 'inherit', fontSize: 'inherit', fontFamily: 'inherit' },
    '& p + p': { marginTop: '0.75em' },
    // 纯黑底上 0.08 的灰几乎看不见，引用块会退化成「一段普通正文 + 一根细线」。
    ...theme.applyStyles('dark', {
      backgroundColor: varAlpha(theme.vars.palette.grey['500Channel'], 0.14),
      borderLeft: `3px solid ${varAlpha(theme.vars.palette.grey['500Channel'], 0.5)}`,
    }),
  },
  /**
   * @Code inline
   */
  [`& .${markdownClasses.content.codeInline}`]: {
    padding: theme.spacing(0.25, 0.5),
    color: theme.vars.palette.text.primary,
    fontSize: theme.typography.body2.fontSize,
    borderRadius: Number(theme.shape.borderRadius) / 2,
    backgroundColor: varAlpha(theme.vars.palette.grey['500Channel'], 0.2),
    // 同上：纯黑底要抬到 0.28 才看得出「这是个代码片」。
    ...theme.applyStyles('dark', {
      backgroundColor: varAlpha(theme.vars.palette.grey['500Channel'], 0.28),
    }),
  },
  /**
   * @Link
   */
  [`& .${markdownClasses.content.link}`]: {
    wordBreak: 'break-word',
  },
  /**
   * @Code block
   */
  [`& .${markdownClasses.content.codeBlock}`]: {
    position: 'relative',
    '& pre': {
      overflowX: 'auto',
      padding: theme.spacing(3),
      color: theme.vars.palette.common.white,
      borderRadius: theme.shape.borderRadius,
      fontFamily: "'JetBrainsMono', monospace",
      backgroundColor: theme.vars.palette.grey[900],
      border: `1px solid ${varAlpha(theme.vars.palette.common.blackChannel, 0.18)}`,
      '& code': { fontSize: theme.typography.body2.fontSize },
      /**
       * 暗色底色。
       *
       * 旧的 `#111827` 是 slate 调（偏蓝），配原来的 grey[900] 页面还协调；换成纯黑
       * 底之后它就成了明度差最大的一块，整页最显眼的东西变成代码块而不是正文。
       * 改成 `#0E1218` —— 贴合 `background.paper` `#0B0E12` 的冷调，只比文档框亮一档，
       * 再靠 0.18 的白描边把它从底色里拎出来。
       *
       * 语法高亮色（`code-highlight-block.css`）是固定的一套 Tomorrow Night，不随主题走，
       * 在 `#0E1218` 与在 `#111827` 上的可读性一致，不用跟着改。
       */
      ...theme.applyStyles('dark', {
        backgroundColor: '#0E1218',
        border: `1px solid ${varAlpha(theme.vars.palette.common.whiteChannel, 0.18)}`,
      }),
    },
  },
  /**
   * @Table
   */
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: theme.typography.body2.fontSize,
    border: `1px solid ${theme.vars.palette.divider}`,
    overflow: 'hidden',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.vars.palette.background.paper,
    marginBottom: '1.5rem',
    display: 'block',
    overflowX: 'auto',
    whiteSpace: 'nowrap',
    'th, td': {
      padding: theme.spacing(1),
      border: `1px solid ${theme.vars.palette.divider}`,
      color: theme.vars.palette.text.primary,
      backgroundClip: 'padding-box',
    },
    thead: {
      backgroundColor: theme.vars.palette.background.neutral,
    },
    th: {
      fontWeight: theme.typography.fontWeightSemiBold,
      color: theme.vars.palette.text.primary,
    },
    'tbody tr:nth-of-type(odd)': {
      backgroundColor: theme.vars.palette.background.neutral,
    },
    'tbody tr:hover': {
      backgroundColor: varAlpha(theme.vars.palette.grey['500Channel'], 0.08),
      ...theme.applyStyles('dark', {
        backgroundColor: varAlpha(theme.vars.palette.grey['500Channel'], 0.18),
      }),
    },
  },
  /**
   * @Checkbox
   */
  [`& .${markdownClasses.content.checkbox}`]: {
    cursor: 'pointer',
    position: 'relative',
    '&:before': {
      content: '""',
      top: -2,
      left: -2,
      width: 17,
      height: 17,
      borderRadius: 3,
      position: 'absolute',
      backgroundColor: theme.vars.palette.grey[300],
      ...theme.applyStyles('dark', {
        backgroundColor: theme.vars.palette.grey[700],
      }),
    },
    '&:checked': {
      '&:before': {
        backgroundColor: theme.vars.palette.primary.main,
      },
      '&:after': {
        top: 1,
        left: 5,
        width: 4,
        height: 9,
        content: '""',
        position: 'absolute',
        borderStyle: 'solid',
        transform: 'rotate(45deg)',
        borderWidth: '0 2px 2px 0',
        borderColor: theme.vars.palette.common.white,
      },
    },
  },
}));
