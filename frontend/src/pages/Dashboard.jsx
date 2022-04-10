import Nav from "../components/Navigation/Nav";
import ChatBody from "../components/ChatBody/Body";
import { useDispatch, useSelector } from "react-redux";
import {
	getRegisteredMembers,
	getChatGroups,
} from "../features/conversations/conversationSlice";
import { getChatMessage } from "../features/messages/messageSlice";
import { useEffect } from "react";
import { Socket } from "socket.io-client";

function Dashboard() {
	const dispatch = useDispatch();
	useEffect(() => {
		// console.log("load from dashboard");
		// dispatch(getChatMessage());
		dispatch(getRegisteredMembers());
		dispatch(getChatGroups());
	}, [dispatch]);

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
