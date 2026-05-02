import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    reactStrictMode: false,    // ← turn off Strict Mode in dev builds

  images: {
    domains: [
      "res.cloudinary.com",
      "lh3.googleusercontent.com", // ✅ Add this line
    ],
  },
};

export default nextConfig;
