export function getPlatformName() {
  return import.meta.env.VITE_OEM_NAME ?? import.meta.env.OEM_NAME ?? '晓石云';
}
