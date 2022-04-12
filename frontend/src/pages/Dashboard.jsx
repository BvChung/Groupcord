import { useEffect, useContext, useCallback } from "react";
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

	const { user } = useSelector((state) => state.auth);
	console.log(user);

	useEffect(() => {
		// console.log("load from dashboard");
		// dispatch(getChatMessage());
		dispatch(getRegisteredMembers());
		dispatch(getChatGroups());
	}, [dispatch]);

	const createUser = useCallback(
		(data) => {
			socket.emit("user_connected", data);
		},
		[socket]
	);

	useEffect(() => {
		createUser(user);
	}, [user, createUser]);

	const { registeredMembers } = useSelector((state) => state.conversations);
	const { groupId } = useSelector((state) => state?.conversations.groupInfo);

	return (
		<>
			<div className="flex flex-col dark:bg-slate-900 w-screen h-screen">
				{/* <Nav /> */}
				<ChatBody />
			</div>
		</>
	);
}

export default Dashboard;
