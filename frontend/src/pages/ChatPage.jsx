import { useState, useEffect, useContext, useCallback } from "react";
import Nav from "../components/Navigation/Nav";
import ChatBody from "../components/ChatBody/ChatBody";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser, resetState } from "../reducers/authentication/authSlice";
import { resetMessageState } from "../reducers/messages/messageSlice";
import { resetGroupState } from "../reducers/groups/groupSlice";
import { useNavigate } from "react-router-dom";
import { SocketContext } from "../appContext/socketContext";
import { MenuContext } from "../appContext/menuContext";
import { toast } from "react-toastify";

export default function ChatPage() {
	const socket = useContext(SocketContext);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const [activeGroupMenu, setActiveGroupMenu] = useState(false);
	function toggleGroupMenu() {
		setActiveGroupMenu((prevState) => !prevState);
	}
	const { user } = useSelector((state) => state.auth);

	const createUser = useCallback(
		(data) => {
			socket.emit("user_connected", data);
		},
		[socket]
	);

	useEffect(() => {
		createUser(user);
	}, [user, createUser]);

	// Logout user if invalid token is present
	const { expiredRefreshJWT } = useSelector((state) => state.auth);
	useEffect(() => {
		if (expiredRefreshJWT) {
			dispatch(logoutUser());
			dispatch(resetMessageState());
			dispatch(resetGroupState());
			dispatch(resetState());
			navigate("/");
			console.log(expiredRefreshJWT);
			toast.info("Your session has expired. Please log in again.");
		}
	}, [expiredRefreshJWT, dispatch, navigate]);

	return (
		<MenuContext.Provider
			value={{
				activeGroupMenu,
				toggleGroupMenu,
			}}
		>
			<div className="flex flex-col w-screen h-screen ">
				<Nav />
				<ChatBody />
			</div>
		</MenuContext.Provider>
	);
}
