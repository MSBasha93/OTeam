import { resolve } from 'path';

const nextConfig = {
  webpack(config: any) {
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      '@': resolve(__dirname, 'src'),
    };
    return config;
  },
};

export default nextConfig;
