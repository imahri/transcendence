/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: 'http',
            hostname: 'localhost',
            pathname: '**',
          },
        ],
        unoptimized: true,
      },
};

export default nextConfig;
