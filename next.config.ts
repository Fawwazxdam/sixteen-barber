import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['memangkas.test', 'app.memangkas.test'],
  async rewrites() {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4002';
    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;
