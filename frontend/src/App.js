import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import "./index.css";
import { ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import Utilities from "./components/Utilities/Utilities";
import { SocketContext, socket } from "./appContext/socketContext";

export default function App() {
	const { darkMode } = useSelector((state) => state.theme);
	const { user } = useSelector((state) => state.auth);

	return (
		<SocketContext.Provider value={socket}>
			<BrowserRouter>
				<div className={darkMode ? "dark" : ""}>
					{!user && <Utilities />}
					<Routes>
						<Route path="/" element={<Login />}></Route>
						<Route path="/register" element={<Register />}></Route>
						<Route
							path="/chat"
							element={user ? <Dashboard /> : <Navigate to="/" />}
						></Route>
					</Routes>
				</div>
			</BrowserRouter>
			<ToastContainer
				position="top-center"
				limit={1}
				autoClose={1500}
				transition={Slide}
				theme={darkMode ? "dark" : "light"}
			/>
		</SocketContext.Provider>
	);
}
