/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		screens: {
			xs: { max: "360px" },
			sm: { min: "360px", max: "640px" },
			md: { min: "640px", max: "768px" },
			lg: { min: "768px", max: "1024px" },
			xl: { min: "1024px", max: "1280px" },
			"2xl": { min: "1280px" },
		},
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
			spin: {
				from: { transform: "rotate(0deg)" },
				to: { transform: "rotate(360deg)" },
			},
			pop: {
				"0%": {
					transform: "scale(0.5)",
					opacity: "0",
				},
				"100%": {
					transform: "scale(1)",
					opacity: "1",
				},
			},
			leftPadd: {
				"0%": { bottom: "5%" },
				"25%": { bottom: "20%" },
				"50%": { bottom: "25%" },
				"75%": { bottom: "20%" },
				"100%": { bottom: "5%" },
			},
			rigthPadd: {
				"0%": { top: "25%" },
				"25%": { top: "20%" },
				"50%": { top: "5%" },
				"75%": { top: "20%" },
				"100%": { top: "25%" },
			},
		},
		animation: {
			shake: "shake 0.9s ease-in-out",
			spin: "spin 1s linear infinite",
			pop: "pop 1s",
			leftPadd: "leftPadd 3s linear infinite",
			rigthPadd: "rigthPadd 3s linear infinite",
		},
	},
	plugins: [require("tailwind-scrollbar-hide")],
};
