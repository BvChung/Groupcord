import { useState, useEffect, useContext, useCallback } from "react";
import Nav from "../components/Navigation/Nav";
import ChatBody from "../components/ChatBody/Body";
import { useDispatch, useSelector } from "react-redux";
import {
	getRegisteredMembers,
	getChatGroups,
} from "../features/conversations/conversationSlice";
import { SocketContext } from "../appContext/socketContext";

function Dashboard() {
	const socket = useContext(SocketContext);
	const dispatch = useDispatch();

	const [activeGroupMenu, setActiveGroupMenu] = useState(false);
	function toggleGroupMenu() {
		setActiveGroupMenu((prevState) => !prevState);
	}

	const { user } = useSelector((state) => state.auth);
	// console.log(user);

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
		<>
			<div className="flex flex-col dark:bg-slate-900 w-screen h-screen">
				<Nav
					activeGroupMenu={activeGroupMenu}
					toggleGroupMenu={toggleGroupMenu}
				/>
				<ChatBody
					activeGroupMenu={activeGroupMenu}
					toggleGroupMenu={toggleGroupMenu}
				/>
			</div>
		</>
	);
}

export default Dashboard;
