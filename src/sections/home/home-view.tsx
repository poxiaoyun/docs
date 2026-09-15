import Box from '@mui/material/Box';

import { TOKENS } from './tokens';
import { HomeCtaSection } from './cta';
import { HomeFaqSection } from './faq';
import { HomeHeroSection } from './hero';
import { HomeEcosystemSection } from './ecosystem';
import { HomeResourcesSection } from './resources';
import { HomeCapabilitiesSection } from './capabilities';
import { HomeCodeShowcaseSection } from './code-showcase';

// ----------------------------------------------------------------------
// 首页区块顺序对齐门户首页：Hero → 产品 → 生态 → 开发者 → 资源 → FAQ → 行动号召。

export function HomeView() {
  return (
    <Box
      component="main"
      sx={{ bgcolor: TOKENS.bgPage, color: TOKENS.text, minHeight: '100vh', overflowX: 'hidden' }}
    >
      <HomeHeroSection />
      <HomeCapabilitiesSection />
      <HomeEcosystemSection />
      <HomeCodeShowcaseSection />
      <HomeResourcesSection />
      <HomeFaqSection />
      <HomeCtaSection />
    </Box>
  );
}
