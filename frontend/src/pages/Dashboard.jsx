import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
	createChatMessage,
	resetState,
} from "../features/ChatLog/chatLogSlice";
import { io } from "socket.io-client";

function Dashboard() {
	const dispatch = useDispatch();
	const value = useSelector((state) => state.chatLog);
	// console.log(value);

	const [socket, setSocket] = useState("");
	useEffect(() => {
		setSocket(io("ws://localhost:3001"));
	}, []);

	const [input, setInput] = useState({
		text: "",
	});

	function handleChange(e) {
		const { value, name } = e.target;

		setInput((prevMessage) => {
			return {
				...prevMessage,
				[name]: value,
			};
		});
	}

	function handleSubmit(e) {
		e.preventDefault();

		const userText = {
			text: input.text,
		};

		console.log(userText);

		dispatch(createChatMessage(userText));

		setInput((prevMessage) => {
			return {
				...prevMessage,
				text: "",
			};
		});
	}
	// console.log(input);

	return (
		<div className="flex dark:bg-slate-900 w-screen h-screen">
			<section className="w-1/3">
				<div></div>
			</section>
			<section className="w-2/3 p-6">
				<div className="h-5/6">
					<p className="">one</p>
					<p>two</p>
					<p>three</p>
					<p>four</p>
				</div>
				<div
					className="flex gap-2 items-center 
				justify-center w-full h-12 bg-slate-300"
				>
					<form className="w-full" onSubmit={handleSubmit}>
						<input
							name="text"
							value={input.message}
							type="text"
							onChange={handleChange}
							placeholder="Enter message"
							className="w-2/3"
						></input>
						<button className="text-center w-12 h-12">Send</button>
					</form>
				</div>
			</section>
		</div>
	);
}

export default Dashboard;
