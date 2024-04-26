import { Inter, Chakra_Petch } from "next/font/google";

import "./globals.css";

// const inter = Inter({ subsets: ["latin"] });

const chakra = Chakra_Petch({
	subsets: ["latin"],
	weight: ["300", "400", "500", "600"],
});

export const metadata = {
	title: "Transcendence",
	description: "Transcendence",
};

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<body
				suppressHydrationWarning={true}
				className={`overflow-hidden ${chakra.className}`}
			>
				{children}
			</body>
		</html>
	);
}
