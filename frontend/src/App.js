import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navigation from "./components/Extra/Extra";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import "./index.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// import { useSelector } from "react-redux";

export default function App() {
	// const { darkMode } = useSelector((state) => state.theme.value);
	// console.log(darkMode);
	// const dark = darkMode ? "dark" : "";

	const [darkTheme, setDarkTheme] = useState(
		JSON.parse(localStorage.getItem("theme")) || false
	);

	function toggleTheme() {
		setDarkTheme((prevTheme) => !prevTheme);
	}

	useEffect(() => {
		window.localStorage.setItem("theme", JSON.stringify(darkTheme));
		console.log("save theme");
	}, [darkTheme]);

	const darkMode = darkTheme ? "dark" : "";

	return (
		<>
			<BrowserRouter>
				<div className={darkMode}>
					<Navigation darkTheme={darkTheme} toggleTheme={toggleTheme} />
					<Routes>
						<Route path="/" element={<Login />}></Route>
						<Route path="/register" element={<Register />}></Route>
						<Route path="/dashboard" element={<Dashboard />}></Route>
					</Routes>
				</div>
			</BrowserRouter>
			<ToastContainer autoClose={2500} />
		</>
	);
}
