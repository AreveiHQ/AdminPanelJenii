/** @type {import('next').NextConfig} */
const nextConfig = {eslint: {
        ignoreDuringBuilds: true,
    },
    images: {
      remotePatterns: [
        {
          protocol: "https",
          hostname: "res.cloudinary.com",
        },
        {
          protocol: "https",
          hostname: "ui-avatars.com",
        },
        {
          protocol: "https",
          hostname: "cdn.bio.link",
        },
        {
          protocol: "https",
          hostname: "jenii.s3.eu-north-1.amazonaws.com",
        },
      ],
    },experimental: {
      optimizePackageImports: ['@mantine/core', '@mantine/hooks'],
    }, 
   };

export default nextConfig;
