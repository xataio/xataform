const withRoutes = require("nextjs-routes/config")();

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    scrollRestoration: true,
  },
  images: {
    dangerouslyAllowSVG: true,
    domains: ["tailwindui.com", "images.clerk.dev"],
  },
};

module.exports = withRoutes(nextConfig);
