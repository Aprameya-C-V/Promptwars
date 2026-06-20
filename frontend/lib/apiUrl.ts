export function normalizeApiBaseUrl(value: string) {
  return value.trim().replace(/\/+$/, "");
}

export function buildApiUrl(baseUrl: string, path: string) {
  const normalizedBase = normalizeApiBaseUrl(baseUrl);
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${normalizedBase}${normalizedPath}`;
}
