// Bump APP_VERSION whenever bundled data, language, or docs files change.
// It is appended as ?v=<APP_VERSION> to every internal asset fetch so a new
// deploy bypasses browser and CDN caches, while unchanged deploys stay cached.
export const APP_VERSION = "2026.06.17.diseases";

export function withVersion(path) {
  const separator = path.includes("?") ? "&" : "?";
  return `${path}${separator}v=${encodeURIComponent(APP_VERSION)}`;
}
