import { CONFIG } from "src/global-config";

import { SvgColor } from "src/components/svg-color";




export const icon = (name: string) => (
  <SvgColor src={`${CONFIG.assetsDir}/assets/icons/navbar/${name}.svg`} />
);