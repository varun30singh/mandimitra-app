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
        destination: '/farmer/dashboard',
        permanent: false,
      },
      {
        source: '/admin',
        destination: '/farmer/dashboard',
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
        destination: 'http://localhost:4000/api/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
