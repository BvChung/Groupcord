import { useState, useEffect, useContext, useCallback } from "react";
import Nav from "../components/Navigation/Nav";

import ChatBody from "../components/ChatBody/Body";
import { useDispatch, useSelector } from "react-redux";
import {
	getRegisteredMembers,
	getChatGroups,
} from "../features/conversations/conversationSlice";
import { SocketContext } from "../appContext/socketContext";
import { MenuContext } from "../appContext/menuContext";
import GroupModal from "../components/Modal/GroupModal";

function Dashboard() {
	const socket = useContext(SocketContext);
	const dispatch = useDispatch();

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

	useEffect(() => {
		dispatch(getRegisteredMembers());
		dispatch(getChatGroups());
	}, [dispatch]);
	useEffect(() => {
		createUser(user);
	}, [user, createUser]);
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

export default Dashboard;
