const defaultTheme = require("tailwindcss/defaultTheme");

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
				gray7: "#EBEBEB",
				gray8: "#f5f5f5",
				offwhite: "#f9fafb",
				offwhite2: "#F5F5F5",
				offwhite3: "#f3f3f4",
				menu: "#141414",
				dark1: "#111111",
				dark2: "#121212",
				dark3: "#141414",
				dark4: "#181818",
				dark5: "#1c1c1c",
				dark6: "#343434",
			},
			spacing: {
				maxLogin: "30rem",
			},
		},
	},
	plugins: [],
};
