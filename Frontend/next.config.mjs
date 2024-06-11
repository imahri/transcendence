/** @type {import('next').NextConfig} */

const { MY_HOSTNAME } = process.env;

const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "http",
				hostname: MY_HOSTNAME || "localhost",
				pathname: "**",
			},
		],
		unoptimized: true,
	},
	reactStrictMode: false,
};

export default nextConfig;