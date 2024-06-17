/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{js,jsx,ts,tsx}'],
	theme: {
		extend: {
			textColor: {
				foreground: 'var(--foreground)', // Add your custom foreground color
			},
		},
	},
	plugins: [],
};
