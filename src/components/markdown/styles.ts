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
   */
  '& blockquote': {
    lineHeight: 1.5,
    margin: '24px auto',
    position: 'relative',
    padding: theme.spacing(3, 3, 3, 8),
    color: theme.vars.palette.text.secondary,
    borderRadius: Number(theme.shape.borderRadius) * 2,
    backgroundColor: varAlpha(theme.vars.palette.grey['500Channel'], 0.08),
    borderLeft: `solid 8px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.08)}`,
    [theme.breakpoints.up('md')]: { width: '100%', maxWidth: 640 },
    '& p': { margin: 0, fontSize: 'inherit', fontFamily: 'inherit' },
    '&::before': {
      left: 16,
      top: -8,
      display: 'block',
      fontSize: '3em',
      content: '"\\201C"',
      position: 'absolute',
      color: theme.vars.palette.text.disabled,
    },
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
      ...theme.applyStyles('dark', {
        backgroundColor: '#111827',
        border: `1px solid ${varAlpha(theme.vars.palette.common.whiteChannel, 0.12)}`,
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
