"use client";
import { Inter, Chakra_Petch } from "next/font/google";

import "./globals.css";
import { RecoilRoot } from "recoil";

// const inter = Inter({ subsets: ["latin"] });

const chakra = Chakra_Petch({
	subsets: ["latin"],
	weight: ["300", "400", "500", "600"],
});

export default function RootLayout({ children }) {
	return (
		<RecoilRoot>
			<html lang="en">
				<body
					suppressHydrationWarning={true}
					className={`scrollbar-hide ${chakra.className}`}
				>
					{children}
				</body>
			</html>
		</RecoilRoot>
	);
}
