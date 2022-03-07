import React, { useState } from "react";
import Sidebar from "./components/sidebar/Sidebar";
import "./index.css";

export default function App() {
	const [theme, setTheme] = useState(false);
	function changeTheme() {
		setTheme((prevTheme) => !prevTheme);
	}
	const themeStyle = theme ? "" : "dark";

	return (
		<main className={themeStyle}>
			<button
				className="cursor-pointer bg-indigo-900 text-white"
				onClick={changeTheme}
			>
				Change theme
			</button>

			<p className="text-3xl font-bold underline">Hello world!</p>
			<Sidebar />
		</main>
	);
}
