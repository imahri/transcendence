/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			backgroundImage: {
				"gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
				"gradient-conic":
					"conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
				greatBlue:
					"linear-gradient(90deg, rgba(189, 26, 251, 0.56) 0%, rgba(84, 174, 242, 0.53) 50%, rgba(54, 218, 240, 0.66) 100%)",
				the_great:
					"linear-gradient(90deg, rgba(203,55,55,0.95) 0%, rgba(125,70,242,1) 100%)",
				goto: "linear-gradient(90deg, rgba(255,76,0,1) 0%, rgba(194,37,97,1) 100%)",
				do: "linear-gradient(90deg, rgba(192, 80, 235, 0.44) 0%, rgba(182, 54, 240, 0.6696) 50%, rgba(63, 10, 98, 1) 100%)",
				// WelcomeImg: "url('./dist/assets/background_gradient.png')",
			},
		},
		fontFamily: {
			// Chakra: ["Chakra Petch", "sans-serif"],
			Chakra: ["ChakraPetch-Regular", "sans-serif"],
			ChakraLigh: ["ChakraPetch-Light", "sans-serif"],
			ChakraMedium: ["ChakraPetch-Medium", "sans-serif"],
			ChakraSemibold: ["ChakraPetch-SemiBold", "sans-serif"],
			ChakraBold: ["ChakraPetch-Bold", "sans-serif"],
			Mesthine: ["mesthine", "sans-serif"],
		},
		keyframes: {
			shake: {
				"0%": { transform: "translateX(0)" },
				"20%": { transform: "translateX(-10px)" },
				"40%": { transform: "translateX(10px)" },
				"60%": { transform: "translateX(-10px)" },
				"80%": { transform: "translateX(10px)" },
				"100%": { transform: "translateX(0)" },
			},
		},
		animation: {
			shake: "shake 0.9s ease-in-out",
		},
	},
	plugins: [require("tailwind-scrollbar-hide")],
};
