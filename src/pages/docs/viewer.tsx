import matter from 'gray-matter';
import { useLocation } from 'react-router';
import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { CONFIG } from 'src/global-config';
import { useGlobalSettingsContext } from 'src/settings/global';

import { Markdown } from 'src/components/markdown';
import { LoadingScreen } from 'src/components/loading-screen';

// ----------------------------------------------------------------------

const files = import.meta.glob('/src/pages/docs/**/*.md', { query: '?raw', import: 'default' });

export default function DocsViewer() {
  const { pathname } = useLocation();
  const [content, setContent] = useState<string>('');
  const [meta, setMeta] = useState<{ title?: string }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { state } = useGlobalSettingsContext();

  const metadata = { title: `${state?.title}` };

  useEffect(() => {
    const loadContent = async () => {
      setLoading(true);
      setError(null);
      setMeta({});
      try {
        // Extract relative path from pathname (e.g., /docs/introduction -> introduction)
        const relativePath = pathname.replace(/^\/docs\/?/, '');

        // Try to find the matching file
        let filePath = '';

        // Handle root /docs -> introduction
        if (!relativePath) {
          // Try to find introduction file, handling potential prefixes
          const introKey = Object.keys(files).find((key) => {
            const keyRelative = key.replace('/src/pages/docs/', '').replace('.md', '');
            const keyName = keyRelative.split('/').pop() || '';
            return keyName.replace(/^\d+\./, '') === 'introduction';
          });
          filePath = introKey || '/src/pages/docs/introduction.md';
        } else {
          // The path in URL is "clean" (e.g. "theme/colors"), but file system has prefixes (e.g. "01.theme/01.colors.md")
          // We need to fuzzy match the file key from glob import
          const cleanPathParts = relativePath.split('/');

          // Find key that matches this pattern
          // e.g. key: /src/pages/docs/01.theme/01.colors.md
          // relativePath: theme/colors

          const foundKey = Object.keys(files).find((key) => {
            // Remove /src/pages/docs/ prefix and .md suffix
            const keyRelative = key.replace('/src/pages/docs/', '').replace('.md', '');
            const keyParts = keyRelative.split('/');

            if (keyParts.length !== cleanPathParts.length) return false;

            // Check each part matches ignoring the ordering prefix
            return keyParts.every((part, index) => {
              const cleanPart = part.replace(/^\d+\./, '');
              return cleanPart === cleanPathParts[index];
            });
          });

          if (foundKey) {
            filePath = foundKey;
          } else {
            // Fallback to direct match just in case
            filePath = `/src/pages/docs/${relativePath}.md`;
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
  }, [pathname]);

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
      <title>{metadata.title}</title>

      <Helmet>
        <title> {meta.title ? `${meta.title} | ${CONFIG.appName}` : CONFIG.appName} </title>
      </Helmet>

      <Container maxWidth="lg" sx={{ py: 5 }}>
        <Stack spacing={3}>
          <Markdown children={content} />
        </Stack>
      </Container>
    </>
  );
}
