import type { NextConfig } from "next";

const expressOrigin = (process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000").replace(
  /\/$/,
  "",
);

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/admin/:path*",
        destination: `${expressOrigin}/api/admin/:path*`,
      },
    ];
  },
};

export default nextConfig;
