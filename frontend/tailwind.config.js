const defaultTheme = require("tailwindcss/defaultTheme");

/* 
#3D3E66
#494B83
#6264A7
#B2b5ff
#E9EAF6

#242424
#424242
#616161
#bdbdbd
#f5f5f5
#ffffff
 */

module.exports = {
	content: ["./src/**/*.{html,js,jsx}"],
	darkMode: "class",
	theme: {
		extend: {
			fontFamily: {
				sans: ["Inter var", ...defaultTheme.fontFamily.sans],
			},
			colors: {
				purple1: "#3D3E66",
				purple2: "#494B83",
				purple3: "#6264A7",
				purple4: "#B2b5ff",
				purple5: "#E9EAF6",
				gray1: "#212529",
				gray2: "#424242",
				gray3: "#616161",
				gray4: "#bdbdbd",
				gray5: "#f5f5f5",
				offwhite: "#f9fafb",
				offwhite2: "#f3f3f4",
			},
			spacing: {
				maxLogin: "31rem",
			},
		},
	},
	plugins: [],
};
