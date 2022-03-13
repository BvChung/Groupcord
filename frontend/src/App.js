import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation/Navigation";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import "./index.css";
import { ThemeProvider } from "./ThemeContext/ThemeProvider";

export default function App() {
	const [darkTheme, setDarkTheme] = useState(false);

	function toggleTheme() {
		setDarkTheme((prevTheme) => !prevTheme);
	}

	const darkMode = darkTheme ? "dark" : "";

	return (
		<>
			<BrowserRouter>
				<Navigation darkTheme={darkTheme} toggleTheme={toggleTheme} />
				<div className={darkMode}>
					<Routes>
						<Route path="/" element={<Dashboard />}></Route>
						<Route path="/login" element={<Login />}></Route>
						<Route path="/register" element={<Register />}></Route>
					</Routes>
				</div>
			</BrowserRouter>
		</>
	);
}
