import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Performance optimizations
  compress: true,
  poweredByHeader: false,
  
  // Disable ESLint during build for deployment
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Force rebuild by changing config
  generateBuildId: async () => {
    return 'railway-fix-' + Date.now()
  },
  
  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Security headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          }
        ],
      },
    ]
  },

  // Experimental features
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },

  // Webpack configuration to prevent memory issues
  webpack: (config, { isServer }) => {
    // Disable cache temporarily to avoid EISDIR errors
    config.cache = false;
    
    // Reduce memory usage
    config.optimization = {
      ...config.optimization,
      moduleIds: 'deterministic',
      runtimeChunk: isServer ? undefined : 'single',
    };

    // Exclude server-only modules from client bundle
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        'argon2': false,
        '@prisma/client': false,
      };
    }

    // Fix for Windows EISDIR errors
    config.snapshot = {
      ...config.snapshot,
      managedPaths: [],
    };

    return config;
  },
};

export default nextConfig;
