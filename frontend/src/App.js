import { Routes, Route } from "react-router-dom";
import ChatPage from "./pages/ChatPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
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
		<SocketContext.Provider value={socket}>
			<ThemeProvider theme={materialUITheme}>
				<div className={darkMode ? "dark" : ""}>
					{!user && <Utilities />}
					<Routes>
						<Route path="/" element={<LoginPage />} />
						<Route path="/register" element={<RegisterPage />} />
						<Route path="/chat" element={<ChatPage />} />
						<Route path="/profile" element={<ProfilePage />} />
					</Routes>
				</div>

				<ToastContainer
					limit={1}
					autoClose={1250}
					transition={Slide}
					theme={darkMode ? "dark" : "light"}
				/>
			</ThemeProvider>
		</SocketContext.Provider>
	);
}
