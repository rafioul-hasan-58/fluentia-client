/**
 * Resolves the Backend API Base URL from environment variables (.env).
 * Supports:
 * - NEXT_PUBLIC_API_URL
 * - NEXT_PUBLIC_BACKEND_URL
 * - Correct normalization of trailing slashes and /api/v1 paths
 */
export const getApiBaseUrl = (): string => {
  const envUrl =
    (typeof process !== "undefined" &&
      (process.env.NEXT_PUBLIC_API_URL ||
        process.env.NEXT_PUBLIC_BACKEND_URL ||
        process.env.API_URL ||
        process.env.BACKEND_INTERNAL_URL)) ||
    "";

  if (!envUrl) {
    return "http://localhost:5000/api/v1";
  }

  const cleanUrl = envUrl.trim().replace(/\/+$/, "");

  if (cleanUrl.endsWith("/api/v1") || cleanUrl.endsWith("/api/v2")) {
    return cleanUrl;
  }

  if (cleanUrl.endsWith("/api")) {
    return `${cleanUrl}/v1`;
  }

  return `${cleanUrl}/api/v1`;
};

/**
 * Gets the backend origin without /api/v1 prefix (e.g. "http://localhost:5000")
 */
export const getBackendOrigin = (): string => {
  const apiUrl = getApiBaseUrl();
  return apiUrl.replace(/\/api\/v[0-9]+$/, "").replace(/\/api$/, "");
};

/**
 * Resolves a profile image / asset URL from the backend.
 * - Handles absolute URLs (http, https, data, blob).
 * - Prefixes relative paths (e.g. /uploads/..., uploads/..., etc.) with the backend server origin.
 */
export const resolveImageUrl = (path?: string | null): string | null => {
  if (!path || typeof path !== "string") return null;
  const trimmed = path.trim();
  if (!trimmed) return null;

  // Already absolute or embedded
  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("blob:") ||
    trimmed.startsWith("data:")
  ) {
    return trimmed;
  }

  const origin = getBackendOrigin();

  // If path is like "uploads/..." or "/uploads/..."
  if (trimmed.startsWith("/") || trimmed.startsWith("uploads/")) {
    const normalized = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
    return `${origin}${normalized}`;
  }

  // If path is a bare filename like "profileImage-12345.jpg"
  return `${origin}/uploads/${trimmed}`;
};

