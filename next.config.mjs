/** @type {import('next').NextConfig} */
const nextConfig = {
  // ✅ REQUIRED in Next.js 16 if webpack config exists
  turbopack: {},

  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        path: false,
        os: false,
      };
    }
    return config;
  },
};

export default nextConfig;
