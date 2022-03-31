import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import "./index.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import Utilities from "./components/Utilities/Utilities";

export default function App() {
	const { darkMode } = useSelector((state) => state.theme);
	const { user } = useSelector((state) => state.auth);

	return (
		<>
			<BrowserRouter>
				<div className={darkMode ? "dark" : ""}>
					{!user && <Utilities />}
					<Routes>
						<Route path="/" element={<Login />}></Route>
						<Route path="/register" element={<Register />}></Route>
						<Route path="/dashboard" element={<Dashboard />}></Route>
					</Routes>
				</div>
			</BrowserRouter>
			<ToastContainer autoClose={2000} theme={darkMode ? "dark" : "light"} />
		</>
	);
}
