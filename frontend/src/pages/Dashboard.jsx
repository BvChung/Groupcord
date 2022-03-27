import Nav from "../components/Navigation/Nav";
import ChatBody from "../components/ChatBody/Body";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect } from "react";

function Dashboard() {
	const navigate = useNavigate();
	const { user } = useSelector((state) => state.auth);

	useEffect(() => {
		if (!user) {
			navigate("/");
		}
	});

	return (
		<div className="flex dark:bg-slate-900 w-screen h-screen">
			{/* <Nav /> */}
			<ChatBody />
		</div>
	);
}

export default Dashboard;
