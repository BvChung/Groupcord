import { useState, useEffect, useContext, useCallback } from "react";
import Nav from "../components/Navigation/ChatNav/ChatNav";
import ChatBody from "../components/ChatBody/Body";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser, resetState } from "../features/authentication/authSlice";
import { resetMessageState } from "../features/messages/messageSlice";
import { getChatGroups, resetGroupState } from "../features/groups/groupSlice";
import { useNavigate } from "react-router-dom";
import { SocketContext } from "../appContext/socketContext";
import { MenuContext } from "../appContext/menuContext";
import GroupModal from "../components/Modal/GroupModal";

function Chat() {
	const socket = useContext(SocketContext);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const [activeGroupMenu, setActiveGroupMenu] = useState(false);
	function toggleGroupMenu() {
		setActiveGroupMenu((prevState) => !prevState);
	}
	const [openGroupModal, setOpenGroupModal] = useState(false);
	function toggleGroupModal() {
		setOpenGroupModal((prev) => !prev);
	}
	const { user } = useSelector((state) => state.auth);

	const createUser = useCallback(
		(data) => {
			socket.emit("user_connected", data);
		},
		[socket]
	);

	const dispatchGetGroups = useCallback(() => {
		dispatch(getChatGroups());
	}, [dispatch]);

	useEffect(() => {
		// console.log("initial");
		dispatchGetGroups();
	}, [dispatchGetGroups]);
	// useEffect(() => {
	// 	console.log("initial");
	// 	dispatch(getChatGroups());
	// }, [dispatch]);
	useEffect(() => {
		createUser(user);
	}, [user, createUser]);

	// Logout user if invalid token is present
	const { expiredJSONWebToken } = useSelector((state) => state.messages);
	useEffect(() => {
		if (expiredJSONWebToken) {
			dispatch(logoutUser());
			dispatch(resetState());
			dispatch(resetMessageState());
			dispatch(resetGroupState());
			navigate("/");
		}
	}, [expiredJSONWebToken, dispatch, navigate]);

	return (
		<MenuContext.Provider
			value={{
				openGroupModal,
				setOpenGroupModal,
				toggleGroupModal,
				activeGroupMenu,
				toggleGroupMenu,
			}}
		>
			<div className="flex flex-col dark:bg-slate-900 w-screen h-screen ">
				<Nav />
				<ChatBody />
				{openGroupModal && <GroupModal />}
			</div>
		</MenuContext.Provider>
	);
}

export default Chat;
