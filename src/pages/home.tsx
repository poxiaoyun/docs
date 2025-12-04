import { CONFIG } from 'src/global-config';
import { SimpleLayout } from 'src/layouts/simple';

import { HomeView } from 'src/sections/home';

// ----------------------------------------------------------------------

const metadata = { title: `Rune Docs · 首页 | ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title>{metadata.title}</title>
      <SimpleLayout>
        <HomeView />
      </SimpleLayout>
    </>
  );
}
