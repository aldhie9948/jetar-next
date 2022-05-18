module.exports = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback.net = 'empty';
    }

    return config;
  },
};
