/** @type {import('next').NextConfig} */
const nextConfig = {

    // reactStrictMode:false,
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
    reactStrictMode: false,
};

export default nextConfig;
