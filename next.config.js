// const { withContentlayer } = require("next-contentlayer");

const nextTranslate = require('next-translate-plugin')

/** @type {import('next').NextConfig} */
const domains = [
  "demo.dev.datopian.com",
  "api.dev.cloud.portaljs",
  "blob.datopian.com",
];
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  images: {
    domains,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  publicRuntimeConfig: {
    DOMAINS: domains, // Make domains accessible at runtime
  },
  async redirects() {
    return [
      {
        source: "/search",
        destination: "/cerca",
        permanent: true,
      },
      {
        source: "/organizations",
        destination: "/entitats",
        permanent: true,
      },
      {
        source: "/groups",
        destination: "/ambits",
        permanent: true,
      },
      {
        source: "/groups/:groupName",
        destination: "/ambits/:groupName",
        permanent: true,
      },
      {
        source: "/col-lectius",
        destination: "/collectius",
        permanent: true,
      },
      {
        source: "/col-lectius/:groupName",
        destination: "/collectius/:groupName",
        permanent: true,
      },
      {
        source: "/about",
        destination: "/que-es",
        permanent: true,
      },
    ];
  },
};

module.exports = nextTranslate(nextConfig);
