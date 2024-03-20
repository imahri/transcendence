/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: 'http',
            hostname: 'localhost',
            pathname: '**',
            hostname: '24ai.tech',
          },
        ],
        unoptimized: true,

      },
};

export default nextConfig;
