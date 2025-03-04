/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: false,
  experimental: {
    forceSwcTransforms: false,
  },
  reactStrictMode: true,
  images: {
    domains: ['firebasestorage.googleapis.com'],
  },
  webpack: (config, { isServer }) => {
    // Add a rule to handle the undici package
    config.module.rules.push({
      test: /\.js$/,
      include: [/node_modules\/undici/],
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env'],
          plugins: ['@babel/plugin-transform-private-methods', '@babel/plugin-transform-class-properties'],
        },
      },
    });
    return config;
  },
}

module.exports = nextConfig 