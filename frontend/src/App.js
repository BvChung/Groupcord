import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navigation from "./components/Extra/Extra";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import "./index.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";

export default function App() {
	const { darkMode } = useSelector((state) => state.theme);

	return (
		<>
			<BrowserRouter>
				<div className={darkMode ? "dark" : ""}>
					<Navigation />
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
