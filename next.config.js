/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ["cdn.sportmonks.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sportmonks.com",
        pathname: "**",
      },
    ],
    unoptimized: true,
  },
}

  module.exports = nextConfig;
  