import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation/Navigation";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import "./index.css";

export default function App() {
	return (
		<>
			<BrowserRouter>
				{/* <Navigation /> */}
				<div className="">
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
