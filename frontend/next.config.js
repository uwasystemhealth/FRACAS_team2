/** @type {import('next').NextConfig} */
const nextConfig = {
  // hack
  // # https://github.com/vercel/next.js/issues/36774
  // # Hot reload dont work when you use docker #36774
  webpackDevMiddleware: (config) => {
    config.watchOptions = {
      poll: 800,
      aggregateTimeout: 300,
    };
    return config;
  },
  // end hack
};

module.exports = nextConfig;
