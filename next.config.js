module.exports = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback.net = 'empty';
      config.resolve.fallback.fs = false;
    }

    return config;
  },
};
