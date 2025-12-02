import { useLocation } from 'react-router';
import { useState, useEffect } from 'react';

import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { Markdown } from 'src/components/markdown';
import { LoadingScreen } from 'src/components/loading-screen';

// ----------------------------------------------------------------------

const files = import.meta.glob('/src/pages/docs/**/*.md', { query: '?raw', import: 'default' });

export default function DocsViewer() {
  const { pathname } = useLocation();
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadContent = async () => {
      setLoading(true);
      setError(null);
      try {
        // Extract relative path from pathname (e.g., /docs/introduction -> introduction)
        const relativePath = pathname.replace(/^\/docs\//, '');

        // Try to find the matching file
        // 1. Try exact match with .md extension
        let filePath = `/src/pages/docs/${relativePath}.md`;

        // 2. Handle root /docs -> introduction
        if (pathname === '/docs' || pathname === '/docs/') {
          filePath = '/src/pages/docs/introduction.md';
        }

        const loader = files[filePath] as () => Promise<string>;

        if (!loader) {
          throw new Error('Documentation not found');
        }

        const markdown = await loader();
        setContent(markdown);
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
        <Typography variant="h4" align="center">{error}</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Stack spacing={3}>
        <Markdown children={content} />
      </Stack>
    </Container>
  );
}

