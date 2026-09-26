/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      'react-native$': 'react-native-web',
    };
    config.resolve.extensions = [
      '.web.js',
      '.web.jsx',
      '.web.ts',
      '.web.tsx',
      ...config.resolve.extensions,
    ];
    return config;
  },
  async redirects() {
    return [
      {
        source: '/admin/:path*',
        destination: '/operator/dashboard',
        permanent: false,
      },
      {
        source: '/admin',
        destination: '/operator/dashboard',
        permanent: false,
      },
      {
        source: '/ivr-simulator',
        destination: '/farmer/dashboard',
        permanent: false,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://mandi-mitra-backend-l38w.onrender.com/api/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
