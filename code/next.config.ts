import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.ctfassets.net",
      },
      {
        protocol: "https",
        hostname: "jnnfdgftjpixjnyhgczf.supabase.co",
      },
    ],
  },
};

export default nextConfig;
