import './code-highlight-block.css';

import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import { useId, useMemo, Children, isValidElement } from 'react';
import { mergeClasses, isExternalLink } from 'minimal-shared/utils';

import Link from '@mui/material/Link';

import { RouterLink } from 'src/routes/components';

import { Image } from '../image';
import { AlertBox } from './alert-box';
import { MarkdownRoot } from './styles';
import { CodeBlock } from './code-block';
import { markdownClasses } from './classes';
import { remarkAlerts } from './remark-alerts';
import { MermaidBlock } from './mermaid-block';
import { htmlToMarkdown, isMarkdownContent } from './html-to-markdown';

// ----------------------------------------------------------------------

type ReactMarkdownProps = React.ComponentProps<typeof ReactMarkdown>;

export type MarkdownProps = React.ComponentProps<typeof MarkdownRoot> & ReactMarkdownProps;

export function Markdown({
  sx,
  children,
  className,
  components,
  rehypePlugins,
  remarkPlugins,
  ...other
}: MarkdownProps) {
  const content = useMemo(() => {
    const cleanedContent = String(children).trim();

    return isMarkdownContent(cleanedContent) ? cleanedContent : htmlToMarkdown(cleanedContent);
  }, [children]);

  const allRehypePlugins = useMemo(
    () => [...defaultRehypePlugins, ...(rehypePlugins ?? [])],
    [rehypePlugins]
  );

  const allRemarkPlugins = useMemo(
    () => [...defaultRemarkPlugins, ...(remarkPlugins ?? [])],
    [remarkPlugins]
  );

  return (
    <MarkdownRoot className={mergeClasses([markdownClasses.root, className])} sx={sx}>
      <ReactMarkdown
        components={{ ...defaultComponents, ...components }}
        rehypePlugins={allRehypePlugins}
        remarkPlugins={allRemarkPlugins}
        /* base64-encoded images
         * https://github.com/remarkjs/react-markdown/issues/774
         * urlTransform={(value: string) => value}
         */
        {...other}
      >
        {content}
      </ReactMarkdown>
    </MarkdownRoot>
  );
}

const APP_BASE_PATH = import.meta.env.BASE_URL.replace(/\/$/, '');

function resolveAssetPath(url?: string) {
  if (!url) return url;
  if (url.startsWith('/assets/')) {
    return `${APP_BASE_PATH}${url}`;
  }
  return url;
}

/** **************************************
 * @rehypePlugins
 *************************************** */
const defaultRehypePlugins: NonNullable<ReactMarkdownProps['rehypePlugins']> = [
  rehypeRaw,
  rehypeHighlight,
];

/** **************************************
 * @remarkPlugins
 *************************************** */
const defaultRemarkPlugins: NonNullable<ReactMarkdownProps['remarkPlugins']> = [
  remarkAlerts,
  [remarkGfm, { singleTilde: false }],
];

/** **************************************
 * @components
 * Note: node is passed by react-markdown, but we intentionally omit or rename it
 * (e.g., node: _n) to prevent rendering it as [object Object] in the DOM.
 *************************************** */
const defaultComponents: NonNullable<ReactMarkdownProps['components']> = {
  div: ({ node, children, ...props }: any) => {
    const alertType = props['data-alert'];
    const alertTitle = props['data-alert-title'];
    
    if (alertType) {
      return (
        <AlertBox type={alertType} title={alertTitle || undefined}>
          {children}
        </AlertBox>
      );
    }
    
    return <div {...props}>{children}</div>;
  },
  img: ({ node: _n, onLoad: _o, ...other }: any) => (
    <Image
      className={markdownClasses.content.image}
      visibleByDefault
      sx={{ borderRadius: 2 }}
      slotProps={{
        img: {
          sx: {
            maxWidth: '100%',
            width: 'auto',
            height: 'auto',
            objectFit: 'contain',
          },
        },
      }}
      {...other}
      src={resolveAssetPath(other.src)}
    />
  ),
  a: ({ href = '', children, node: _n, ...other }: any) => {
    const linkProps = isExternalLink(href)
      ? { target: '_blank', rel: 'noopener noreferrer' }
      : { component: RouterLink };

    return (
      <Link {...linkProps} href={href} className={markdownClasses.content.link} {...other}>
        {children}
      </Link>
    );
  },
  pre: ({ children }: any) => {
    // Skip CodeBlock wrapper for mermaid diagrams
    const child = Children.only(children);
    if (isValidElement(child) && (child.props as any)?.className?.includes('language-mermaid')) {
      const text = (child.props as any)?.children;
      const chart = Array.isArray(text) ? text.join('') : String(text ?? '');
      return <MermaidBlock chart={chart} />;
    }
    return <CodeBlock>{children}</CodeBlock>;
  },
  code: ({ className = '', children, node: _n, ...other }: any) => {
    const { isBlock, ...rest } = other;
    const hasLanguage = /language-\w+/.test(className);

    // Render mermaid diagrams
    if (className.includes('language-mermaid') && isBlock) {
      const chart = Array.isArray(children) ? children.join('') : String(children ?? '');
      return <MermaidBlock chart={chart} />;
    }

    let appliedClass = className;

    if (!hasLanguage) {
      appliedClass = isBlock ? 'language-text' : markdownClasses.content.codeInline;
    }

    return (
      <code className={appliedClass} {...rest}>
        {children}
      </code>
    );
  },
  input: ({ type, node: _n, ...other }: any) =>
    type === 'checkbox' ? (
      <CustomCheckbox className={markdownClasses.content.checkbox} {...other} />
    ) : (
      <input type={type} {...other} />
    ),
};

function CustomCheckbox(props: React.ComponentProps<'input'>) {
  const uniqueId = useId();
  return <input type="checkbox" id={uniqueId} {...props} />;
}
