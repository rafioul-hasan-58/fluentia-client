/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "**" },
    ],
  },
  async rewrites() {
    const rawBackendUrl =
      process.env.BACKEND_INTERNAL_URL ||
      process.env.NEXT_PUBLIC_API_URL ||
      "http://127.0.0.1:5000/api/v1";

    const baseUrl = rawBackendUrl.replace(/\/+$/, "");
    const destination = baseUrl.endsWith("/api/v1")
      ? `${baseUrl}/:path*`
      : `${baseUrl}/api/v1/:path*`;

    return [
      {
        source: "/api/v1/:path*",
        destination,
      },
    ];
  },
};


export default nextConfig;
