/** @type {import('next').NextConfig} */
const nextConfig = {
	// reactStrictMode:false,
	images: {
		remotePatterns: [
			{
				protocol: "http",
				hostname: "10.12.5.7",
				pathname: "**",
				hostname: "24ai.tech",
			},
		],
		unoptimized: true,
	},
	reactStrictMode: false,
};

export default nextConfig;
