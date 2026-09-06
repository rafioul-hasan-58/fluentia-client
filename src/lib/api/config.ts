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
