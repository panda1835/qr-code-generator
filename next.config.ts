import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "quickchart.io",
        pathname: "/qr",
      },
    ],
  },
};

export default nextConfig;
