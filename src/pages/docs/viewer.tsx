import matter from 'gray-matter';
import rehypeSlug from 'rehype-slug';
import { useLocation } from 'react-router';
import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
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

  // Check if this is a product home page
  const isMohaHomePage = pathname === '/docs/moha' || pathname === '/docs/moha/';
  const isRuneHomePage = pathname === '/docs/rune' || pathname === '/docs/rune/';
  const isBossHomePage = pathname === '/docs/boss' || pathname === '/docs/boss/';
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
        <title> {displayTitle + ' | ' + state?.title} </title>
      </Helmet>

      <Container maxWidth="xl" sx={{ py: 3, pl: { md: 1 } }}>
        <Stack direction="row" spacing={2} alignItems="flex-start">
          <Box 
            sx={{ 
              minWidth: 0, 
              flexGrow: 1,
              bgcolor: 'grey.100',
              borderRadius: 2,
              p: { xs: 2, md: 2.5 },
              boxShadow: '0 0 0 1px rgba(145, 158, 171, 0.08)',
            }}
          >
            <Stack spacing={3}>
              {isMohaHomePage && <MohaHomeCards />}
              {isRuneHomePage && <RuneHomeCards />}
              {isBossHomePage && <BossHomeCards />}
              {!isProductHomePage && (
                <Markdown children={content} rehypePlugins={[rehypeSlug]} />
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
  const clean = pathname.replace(/^\/+/, '');
  if (!clean || clean === 'docs') {
    return 'introduction';
  }
  if (clean.startsWith('docs/')) {
    return clean.replace(/^docs\//, '');
  }
  return clean;
}
