import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Ensure static files in public are served correctly
  async headers() {
    return [
      {
        source: "/sw.js",
        headers: [
          {
            key: "Content-Type",
            value: "application/javascript",
          },
          {
            key: "Service-Worker-Allowed",
            value: "/",
          },
        ],
      },
    ];
  },
  // Turbopack configuration (Next.js 16 uses Turbopack by default)
  // Empty config to silence the warning - Turbopack handles HMR better by default
  turbopack: {},
};

export default nextConfig;
