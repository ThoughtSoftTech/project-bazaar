import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  trailingSlash: true,
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: 'vercel.app',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },
  // External packages configuration
  serverExternalPackages: ['@prisma/client', 'bcrypt'],
  typescript: {
    // We're turning off TypeScript errors during build temporarily
    // This helps us deploy while we fix the type issues
    // TODO: Remove this when type issues are resolved
    ignoreBuildErrors: true,
  },
  eslint: {
    // Also ignoring ESLint errors during build for now
    // TODO: Remove this when linting issues are resolved
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;