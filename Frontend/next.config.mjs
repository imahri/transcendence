/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            hostname: '24ai.tech',
          },
        ],
      },
};

export default nextConfig;
