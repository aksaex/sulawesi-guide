import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com', // Izinkan domain Cloudinary
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com', // Izinkan Unsplash (untuk placeholder tadi)
      }
    ],
  },
};

export default nextConfig;