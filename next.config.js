const withRoutes = require("nextjs-routes/config")();

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // https://github.com/atlassian/react-beautiful-dnd/issues/2407
  experimental: {
    scrollRestoration: true,
  },
  images: {
    dangerouslyAllowSVG: true,
    domains: ["tailwindui.com", "images.clerk.dev"],
  },
};

module.exports = withRoutes(nextConfig);
