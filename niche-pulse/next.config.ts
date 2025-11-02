import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    domains: ['i.ytimg.com', 'yt3.googleusercontent.com'],
  },
};

export default nextConfig;
