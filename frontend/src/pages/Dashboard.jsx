import Nav from "../components/Navigation/Nav";
import ChatBody from "../components/ChatBody/Body";
import { useDispatch, useSelector } from "react-redux";
import { getAvailableMembers } from "../features/Conversations/conversationSlice";
import { useEffect } from "react";

function Dashboard() {
	const dispatch = useDispatch();
	useEffect(() => {
		dispatch(getAvailableMembers());
	}, [dispatch]);

	const { registeredMembers } = useSelector((state) => state.conversations);
	console.log(registeredMembers);

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
