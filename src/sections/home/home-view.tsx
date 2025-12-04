import Box from '@mui/material/Box';

import { HomeHeroSection } from './hero';
import { HomeSolutionsSection } from './solutions';
import { HomeResourcesSection } from './resources';
import { HomeCommunitySection } from './community';
import { HomeQuickStartSection } from './quick-start';
import { HomeCapabilitiesSection } from './capabilities';

// ----------------------------------------------------------------------

export function HomeView() {
  return (
    <Box component="main">
      <HomeHeroSection />
      <HomeCapabilitiesSection />
      <HomeQuickStartSection />
      <HomeSolutionsSection />
      <HomeResourcesSection />
      <HomeCommunitySection />
    </Box>
  );
}
