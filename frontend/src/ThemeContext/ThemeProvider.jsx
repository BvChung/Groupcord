import { useContext, useState, createContext } from "react";

const ThemeContext = createContext();
const ThemeUpdateContext = createContext();

function useTheme() {
	return useContext(ThemeContext);
}

function useThemeUpdate() {
	return useContext(ThemeUpdateContext);
}

function ThemeProvider({ children }) {
	const [darkTheme, setDarkTheme] = useState(true);

	function toggleTheme() {
		setDarkTheme((prevTheme) => !prevTheme);
	}

	return (
		<ThemeContext.ThemeProvider value={darkTheme}>
			<ThemeUpdateContext.Provider value={toggleTheme}>
				{children}
			</ThemeUpdateContext.Provider>
		</ThemeContext.ThemeProvider>
	);
}

export { ThemeProvider, useTheme, useThemeUpdate };
