import type { NextConfig } from "next";

import withBundleAnalyzer from "@next/bundle-analyzer";

const bundleAnalyzer = withBundleAnalyzer({
	enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
	/* config options here */
	reactCompiler: true,
	webpack: (config, { isServer }) => {
		if (isServer) {
			config.externals = config.externals || [];
			config.externals.push({
				canvas: "canvas",
			});
		}
		return config;
	},
	serverExternalPackages: ["pdf-parse"],
};

export default bundleAnalyzer(nextConfig);
