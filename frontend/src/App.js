import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Chat from "./pages/Chat";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import "./index.css";
import { ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import Utilities from "./components/Utilities/Utilities";
import { SocketContext, socket } from "./appContext/socketContext";
import { ThemeProvider, createTheme } from "@mui/material/styles";

export default function App() {
	const { darkMode } = useSelector((state) => state.theme);
	const { user } = useSelector((state) => state.auth);
	const materialUITheme = createTheme({
		palette: {
			mode: darkMode ? "dark" : "light",
		},
	});

	return (
		<ThemeProvider theme={materialUITheme}>
			<SocketContext.Provider value={socket}>
				<BrowserRouter>
					<div className={darkMode ? "dark" : ""}>
						{!user && <Utilities />}
						<Routes>
							<Route path="/" element={<Login />}></Route>
							<Route path="/register" element={<Register />}></Route>
							<Route
								path="/chat"
								element={user ? <Chat /> : <Navigate to="/" />}
							></Route>
							<Route path="/profile" element={<Profile />}></Route>
						</Routes>
					</div>
				</BrowserRouter>
				<ToastContainer
					limit={1}
					autoClose={1250}
					transition={Slide}
					theme={darkMode ? "dark" : "light"}
				/>
			</SocketContext.Provider>
		</ThemeProvider>
	);
}
