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
				gray1: "#212529",
				gray2: "#424242",
				gray3: "#616161",
				gray4: "#D9D9D9",
				gray5: "#bdbdbd",
				gray6: "#ECECEC",
				gray7: "#f5f5f5",
				offwhite: "#f9fafb",
				offwhite2: "#f3f3f4",
				menu: "#18181b",
				dark1: "#111111",
				dark2: "#121212",
				dark3: "#1a1a1a",
				dark4: "#232323",
				dark5: "#343434",
				secondary1: "#D1CCE1",
				secondary2: "#DEDAE9",
				secondary3: "#E4E2EE",
				secondary4: "#8679B0",
				blue1: "#325C97",
				blue2: "#ABC7E3",
				blue3: "#88B0D7",
				blue4: "#6699CC",
				blue5: "#76A3D1",
				g1: "#81A4D5",
			},
			spacing: {
				maxLogin: "30rem",
			},
		},
	},
	plugins: [],
};
