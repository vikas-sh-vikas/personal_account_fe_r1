import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    reactStrictMode: false,    // ← turn off Strict Mode in dev builds

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
  },
};

export default nextConfig;
