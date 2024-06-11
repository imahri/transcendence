"use client";
import {Chakra_Petch } from "next/font/google";

import "./globals.css";

const chakra = Chakra_Petch({
	subsets: ["latin"],
	weight: ["300", "400", "500", "600"],
});

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<body
				suppressHydrationWarning={true}
				className={`${chakra.className}`}
			>
				{children}
			</body>
		</html>
	);
}
