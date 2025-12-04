import matter from 'gray-matter';
import rehypeSlug from 'rehype-slug';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useMemo, useState, useEffect } from 'react';
import { useLocation, Link as RouterLink } from 'react-router';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';

import { useGlobalSettingsContext } from 'src/settings/global';

import { Markdown } from 'src/components/markdown';
import { LoadingScreen } from 'src/components/loading-screen';

import { Toc } from './toc';
import { useMarkdownToc } from './use-markdown-toc';
import { type DocsSidebarItem, DOCS_SIDEBAR_SECTIONS } from './toc';

// ----------------------------------------------------------------------

const files = import.meta.glob('/src/pages/docs/**/*.md', { query: '?raw', import: 'default' });

type DocMeta = {
  title?: string;
  [key: string]: any;
};

export default function DocsViewer() {
  const { pathname, hash } = useLocation();
  const { i18n } = useTranslation();
  const [content, setContent] = useState<string>('');
  const [meta, setMeta] = useState<DocMeta>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { state } = useGlobalSettingsContext();
  const { t } = useTranslation('navbar');

  const toc = useMarkdownToc(content);

  // Calculate display title based on current language
  // Use the title as a key if it looks like one, otherwise fallback to the raw title
  const displayTitle = meta.title ? t(meta.title) : meta.title;

  useEffect(() => {
    const loadContent = async () => {
      setLoading(true);
      setError(null);
      setMeta({});
      try {
        const relativePath = normalizeDocsPath(pathname);

        // Try to find the matching file
        let filePath = '';

        // Handle root /docs -> default to 'introduction' if empty
        const targetCleanPath = relativePath || 'introduction';
        const cleanPathParts = targetCleanPath.split('/');
        // Determine the language folder (cn or en)
        // Default to 'cn' if not 'en' (assuming only two supported languages for now, or map appropriately)
        const langFolder = i18n.language === 'en' ? 'en' : 'cn';

        // Find key that matches this pattern
        // e.g. key: /src/pages/docs/cn/01.theme/01.colors.md
        // relativePath: theme/colors

        const matchesPath = (pathParts: string[]) => {
          const stripPrefix = (part: string) => part.replace(/^\d+\./, '');
          // Direct file match
          if (pathParts.length === cleanPathParts.length) {
            return pathParts.every((part, index) => stripPrefix(part) === cleanPathParts[index]);
          }

          // Folder index.md match
          if (
            pathParts.length === cleanPathParts.length + 1 &&
            pathParts[pathParts.length - 1] === 'index'
          ) {
            return pathParts
              .slice(0, -1)
              .every((part, index) => stripPrefix(part) === cleanPathParts[index]);
          }

          return false;
        };

        const foundKey = Object.keys(files).find((key) => {
          const keyRelative = key.replace('/src/pages/docs/', '').replace('.md', '');
          const keyParts = keyRelative.split('/');
          if (keyParts[0] !== langFolder) return false;
          const pathParts = keyParts.slice(1);
          return matchesPath(pathParts);
        });

        if (foundKey) {
          filePath = foundKey;
        } else {
          // Fallback: try to find in the other language (e.g. fallback to cn if en missing)
          // Optional: If strict mode is desired, throw error. Here we can try fallback.
          const fallbackLang = 'cn';
          if (langFolder !== fallbackLang) {
            const fallbackKey = Object.keys(files).find((key) => {
              const keyRelative = key.replace('/src/pages/docs/', '').replace('.md', '');
              const keyParts = keyRelative.split('/');
              if (keyParts[0] !== fallbackLang) return false;
              const pathParts = keyParts.slice(1);
              return matchesPath(pathParts);
            });
            if (fallbackKey) {
              filePath = fallbackKey;
            } else {
              // Ultimate fallback
              filePath = `/src/pages/docs/${langFolder}/${targetCleanPath}.md`;
            }
          } else {
            filePath = `/src/pages/docs/${langFolder}/${targetCleanPath}.md`;
          }
        }

        const loader = files[filePath] as () => Promise<string>;

        if (!loader) {
          throw new Error('Documentation not found');
        }

        const markdown = await loader();
        const { content: mdContent, data } = matter(markdown);

        setContent(mdContent);
        setMeta(data);
      } catch (err) {
        console.error(err);
        setError('Documentation not found.');
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, [pathname, i18n.language]);

  // Scroll to hash after content is loaded
  useEffect(() => {
    if (!loading && hash) {
      // Small timeout to ensure DOM is ready
      const timeoutId = setTimeout(() => {
        const id = hash.replace('#', '');
        const element = document.getElementById(id);
        if (element) {
          const offset = 80; // Header offset
          const bodyRect = document.body.getBoundingClientRect().top;
          const elementRect = element.getBoundingClientRect().top;
          const elementPosition = elementRect - bodyRect;
          const offsetPosition = elementPosition - offset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth',
          });
        }
      }, 100);

      return () => clearTimeout(timeoutId);
    }
    return undefined;
  }, [loading, hash]);

  const breadcrumbs = useMemo(() => buildBreadcrumbs(pathname), [pathname]);
  const productLabel = breadcrumbs.find((item) => item.productLabel)?.productLabel ?? meta.product;
  const metaInfo = [
    meta.updated ? `最近更新：${meta.updated}` : null,
    meta.author ? `作者：${meta.author}` : null,
  ]
    .filter(Boolean)
    .join(' · ');

  if (loading) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 5 }}>
        <Typography variant="h4" align="center">
          {error}
        </Typography>
      </Container>
    );
  }

  return (
    <>
      <Helmet>
        <title> {displayTitle + ' | ' + state?.title} </title>
      </Helmet>

      <Container maxWidth="xl" sx={{ py: 5 }}>
        <Stack spacing={2} sx={{ mb: 4 }}>
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={1.5}
            alignItems={{ md: 'center' }}
          >
            <Breadcrumbs aria-label="documentation breadcrumbs" sx={{ flexGrow: 1 }}>
              <Link component={RouterLink} to="/docs" color="inherit" underline="hover">
                文档首页
              </Link>
              {breadcrumbs.map((crumb, index) => {
                const isLast = index === breadcrumbs.length - 1;
                return isLast ? (
                  <Typography key={crumb.path} color="text.primary">
                    {crumb.title}
                  </Typography>
                ) : (
                  <Link
                    key={crumb.path}
                    component={RouterLink}
                    to={crumb.path}
                    underline="hover"
                    color="inherit"
                  >
                    {crumb.title}
                  </Link>
                );
              })}
            </Breadcrumbs>

            {productLabel && <Chip label={productLabel} size="small" color="primary" />}
          </Stack>

          <Stack spacing={1}>
            <Typography variant="h3" sx={{ fontWeight: 600 }}>
              {displayTitle}
            </Typography>
            {metaInfo && (
              <Typography variant="caption" color="text.secondary">
                {metaInfo}
              </Typography>
            )}
          </Stack>
        </Stack>

        <Stack direction="row" spacing={4} alignItems="flex-start">
          <Box sx={{ minWidth: 0, flexGrow: 1 }}>
            <Stack spacing={3}>
              <Markdown children={content} rehypePlugins={[rehypeSlug]} />
            </Stack>
          </Box>

          {/* Right Sidebar: Table of Contents */}
          {toc.length > 0 && (
            <Box
              component="nav"
              sx={{
                width: 200,
                flexShrink: 0,
                display: { xs: 'none', lg: 'block' }, // Hide on smaller screens
                alignSelf: 'flex-start',
                position: 'sticky',
                top: 80, // Adjust as needed
              }}
            >
              <Toc toc={toc} />
            </Box>
          )}
        </Stack>
      </Container>
    </>
  );
}

function normalizeDocsPath(pathname: string) {
  const clean = pathname.replace(/^\/+/, '');
  if (!clean || clean === 'docs') {
    return 'introduction';
  }
  if (clean.startsWith('docs/')) {
    return clean.replace(/^docs\//, '');
  }
  return clean;
}

type BreadcrumbEntry = {
  title: string;
  path: string;
  product?: DocsSidebarItem['product'];
  productLabel?: string;
};

const PRODUCT_LABEL: Record<NonNullable<DocsSidebarItem['product']>, string> = {
  rune: 'Rune',
  boss: 'BOSS',
  moha: '魔哈广场',
  faq: 'F&Q',
};

function buildBreadcrumbs(pathname: string): BreadcrumbEntry[] {
  const normalized = pathname.startsWith('/docs')
    ? pathname.replace(/\/+$/, '') || '/docs/introduction'
    : `/docs/${pathname.replace(/^\/+/, '') || 'introduction'}`;

  for (const section of DOCS_SIDEBAR_SECTIONS) {
    for (const item of section.items) {
      const trail = findTrail(item, normalized);
      if (trail.length) {
        return trail.map((node) => ({
          title: node.title,
          path: node.path,
          product: node.product,
          productLabel: node.product ? PRODUCT_LABEL[node.product] : undefined,
        }));
      }
    }
  }

  return [];
}

function findTrail(
  item: DocsSidebarItem,
  targetPath: string,
  trail: DocsSidebarItem[] = []
): DocsSidebarItem[] {
  const cleanTarget = targetPath.replace(/\/+$/, '');
  const nextTrail = [...trail, item];
  if (item.path === cleanTarget || cleanTarget.startsWith(`${item.path}/`)) {
    if (!item.children || item.path === cleanTarget) {
      return nextTrail;
    }
  }

  if (item.children) {
    for (const child of item.children) {
      const childTrail = findTrail(child, cleanTarget, nextTrail);
      if (childTrail.length) {
        return childTrail;
      }
    }
  }

  return item.path === cleanTarget || cleanTarget.startsWith(`${item.path}/`) ? nextTrail : [];
}
