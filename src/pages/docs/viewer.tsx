import matter from 'gray-matter';
import rehypeSlug from 'rehype-slug';
import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useParams, useLocation } from 'react-router';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { alpha } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { useGlobalSettingsContext } from 'src/settings/global';

import { Markdown } from 'src/components/markdown';
import { LoadingScreen } from 'src/components/loading-screen';

import { Toc } from './toc';
import { useMarkdownToc } from './use-markdown-toc';
import { BossHomeCards } from '../../sections/boss/boss-home-cards';
import { MohaHomeCards } from '../../sections/moha/moha-home-cards';
import { RuneHomeCards } from '../../sections/rune/rune-home-cards';

// ----------------------------------------------------------------------

const files = import.meta.glob('/src/pages/docs/**/*.md', { query: '?raw', import: 'default' });

type DocMeta = {
  title?: string;
  [key: string]: any;
};

const PRODUCT_HOME_TITLES = {
  cn: {
    rune: 'Rune 智算平台',
    moha: '魔哈仓库',
    boss: 'Boss 运营平台',
  },
  en: {
    rune: 'Rune AI Platform',
    moha: 'Moha',
    boss: 'Boss Operations Platform',
  },
} as const;

export default function DocsViewer() {
  const { '*' : splat } = useParams();
  const { hash } = useLocation();
  const pathname = splat || '';
  const { i18n } = useTranslation();
  const [content, setContent] = useState<string>('');
  const [meta, setMeta] = useState<DocMeta>({});
  const [isIndex, setIsIndex] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { state } = useGlobalSettingsContext();

  const toc = useMarkdownToc(content);

  const productHome = getProductHomeType(pathname);
  const locale = i18n.language.startsWith('en') ? 'en' : 'cn';

  // Calculate display title based on current language
  const displayTitle =
    meta.title ||
    (productHome ? PRODUCT_HOME_TITLES[locale][productHome] : undefined);

  useEffect(() => {
    const loadContent = async () => {
      setLoading(true);
      setError(null);
      setMeta({});
      setIsIndex(false);

      // Product home pages render card-based content and do not require markdown files.
      if (productHome) {
        setContent('');
        setLoading(false);
        return;
      }

      try {
        const relativePath = normalizeDocsPath(pathname);

        // Try to find the matching file
        let filePath = '';
        let matchedIndex = false;

        // Handle root /docs -> default to 'introduction' if empty
        const targetCleanPath = relativePath || 'introduction';
        const cleanPathParts = targetCleanPath.split('/');
        // Determine the language folder (cn or en)
        // Default to 'cn' if not 'en' (assuming only two supported languages for now, or map appropriately)
        const langFolder = i18n.language.startsWith('en') ? 'en' : 'cn';

        // Find key that matches this pattern
        // e.g. key: /src/pages/docs/cn/01.theme/01.colors.md
        // relativePath: theme/colors

        const matchesPath = (pathParts: string[]) => {
          const stripPrefix = (part: string) => part.replace(/^\d+\./, '');
          // Direct file match
          if (pathParts.length === cleanPathParts.length) {
            return pathParts.every(
              (part, index) => stripPrefix(part) === stripPrefix(cleanPathParts[index])
            );
          }

          // Folder index.md match
          if (
            pathParts.length === cleanPathParts.length + 1 &&
            pathParts[pathParts.length - 1] === 'index'
          ) {
            const isMatch = pathParts
              .slice(0, -1)
              .every((part, index) => stripPrefix(part) === stripPrefix(cleanPathParts[index]));
            if (isMatch) matchedIndex = true;
            return isMatch;
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
          setIsIndex(matchedIndex);
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
              setIsIndex(matchedIndex);
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
  }, [pathname, i18n.language, productHome]);

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

  // Check if this is a product home page
  const isMohaHomePage = productHome === 'moha';
  const isRuneHomePage = productHome === 'rune';
  const isBossHomePage = productHome === 'boss';
  const isProductHomePage = isMohaHomePage || isRuneHomePage || isBossHomePage;

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
        <title>{displayTitle ? `${displayTitle} | ${state?.title}` : state?.title}</title>
      </Helmet>

      <Container maxWidth="xl" sx={{ py: 3, pl: { md: 1 } }}>
        <Stack direction="row" spacing={2} alignItems="flex-start">
          <Box 
            sx={{
              minWidth: 0,
              flexGrow: 1,
              color: 'text.primary',
              bgcolor: 'background.paper',
              borderRadius: 2,
              p: { xs: 2, md: 2.5 },
              border: (theme) =>
                `1px solid ${alpha(theme.palette.divider, theme.palette.mode === 'dark' ? 0.9 : 1)}`,
              boxShadow: (theme) =>
                theme.palette.mode === 'dark'
                  ? `0 16px 40px ${alpha('#000', 0.28)}`
                  : '0 0 0 1px rgba(145, 158, 171, 0.08)',
              transition: (theme) =>
                theme.transitions.create(['background-color', 'border-color', 'box-shadow']),
            }}
          >
            <Stack spacing={3}>
              {isMohaHomePage && <MohaHomeCards />}
              {isRuneHomePage && <RuneHomeCards />}
              {isBossHomePage && <BossHomeCards />}
              {!isProductHomePage && (
                <Markdown isIndex={isIndex} currentPath={pathname} children={content} rehypePlugins={[rehypeSlug]} />
              )}
            </Stack>
          </Box>

          {/* Right Sidebar: Table of Contents */}
          {!isProductHomePage && toc.length > 0 && (
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
  const clean = pathname.replace(/^\/+/, '').replace(/\/+$/, '');
  if (!clean) {
    return 'introduction';
  }
  return clean;
}

function getProductHomeType(pathname: string): 'rune' | 'moha' | 'boss' | null {
  const normalized = pathname.replace(/\/+$/, '') || '/';

  if (normalized === 'rune') return 'rune';
  if (normalized === 'moha') return 'moha';
  if (normalized === 'boss') return 'boss';

  return null;
}
