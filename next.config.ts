import os from "os";
import type { NextConfig } from "next";

const expressOrigin = (process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:5000").replace(
  /\/$/,
  "",
);

function allowedDevHosts() {
  const hosts = new Set(["127.0.0.1", "localhost"]);
  for (const addresses of Object.values(os.networkInterfaces())) {
    for (const address of addresses ?? []) {
      const ipv4 = address.family === "IPv4";
      if (ipv4 && !address.internal) {
        hosts.add(address.address);
      }
    }
  }
  return [...hosts];
}

const nextConfig: NextConfig = {
  allowedDevOrigins: allowedDevHosts(),
  async rewrites() {
    return [
      {
        source: "/api/admin/:path*",
        destination: `${expressOrigin}/api/admin/:path*`,
      },
      {
        source: "/api/resq-ai/:path*",
        destination: `${expressOrigin}/api/resq-ai/:path*`,
      },
      {
        source: "/api/emergency",
        destination: `${expressOrigin}/api/emergency`,
      },
      {
        source: "/api/first-aid",
        destination: `${expressOrigin}/api/first-aid`,
      },
    ];
  },
};

export default nextConfig;
