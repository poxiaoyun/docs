import Box from '@mui/material/Box';

import { HomeCtaSection } from './cta';
import { HomeHeroSection } from './hero';
import { HomeEcosystemSection } from './ecosystem';
import { HomeResourcesSection } from './resources';
import { HomeCapabilitiesSection } from './capabilities';
import { HomeCodeShowcaseSection } from './code-showcase';

// ----------------------------------------------------------------------

export function HomeView() {
  return (
    <Box component="main" sx={{ bgcolor: '#000000', color: 'common.white', minHeight: '100vh' }}>
      <HomeHeroSection />
      <HomeCapabilitiesSection />
      <HomeCodeShowcaseSection />
      <HomeEcosystemSection />
      <HomeResourcesSection />
      
      {/* 
        Wrap the CTA Section with a parent that applies the dark mode inverse if CTA itself forces light,
        Otherwise, if HomeCtaSection handles its own styles, it can just be rendered here.
        Using a dark background color explicitly for CTA section context if needed.
      */}
      <Box sx={{ bgcolor: '#0a0a0a', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <HomeCtaSection />
      </Box>
    </Box>
  );
}
