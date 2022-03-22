import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
	createChatMessage,
	getChatMessage,
	resetState,
} from "../../../features/Messages/messageSlice";
import { io } from "socket.io-client";
import { GrSend } from "react-icons/gr";
import { PaperAirplaneIcon, PlusIcon } from "@heroicons/react/solid";
import ChatItem from "./ChatItem";
import ChatNav from "./ChatNav";

function Chat() {
	const dispatch = useDispatch();
	const value = useSelector((state) => state.messages);

	// const [socket, setSocket] = useState("");
	// useEffect(() => {
	// 	setSocket(io("ws://localhost:3001"));
	// }, []);

	const [chat, setChat] = useState({
		message: "",
	});

	function handleChange(e) {
		const { value, name } = e.target;

		setChat((prevMessage) => {
			return {
				...prevMessage,
				[name]: value,
			};
		});
	}

	function handleSubmit(e) {
		e.preventDefault();

		const userMessage = {
			message: chat.message,
		};

		// console.log(userMessage);
		dispatch(createChatMessage(userMessage));

		setChat({
			message: "",
		});
		console.log(chat);

		dispatch(resetState());

		// From redux store:messages
		console.log(value.messageArr);
	}
	// console.log(chat);

	function getMessage() {
		dispatch(getChatMessage());
		console.log(value);
	}

	const user = true;

	return (
		<div className="flex-grow bg-white dark:bg-slate-900">
			<ChatNav />
			<div className="h-[95%] max-h-[750px] px-6 overflow-y-auto">
				<ChatItem user={user} />
				<ChatItem />
				<ChatItem />
				<ChatItem user={user} />
				<ChatItem user={user} />
				<ChatItem user={user} />
				<ChatItem user={user} />
				<ChatItem />
			</div>

			<div className="w-full px-6 py-4 mt-2">
				<div
					className="flex items-center justify-end border-[2px] h-fit rounded-lg 
					bg-offwhite focus-within:border-sky-600"
				>
					<form className="flex w-full" onSubmit={handleSubmit}>
						<button className="float-left">
							<PlusIcon />
						</button>
						<input
							name="message"
							value={chat.message}
							type="text"
							onChange={handleChange}
							placeholder="Send a message"
							className="w-full outline-none text-lg px-4 bg-transparent"
						></input>
						<button className="float-right  bg-transparent rounded-[50%] p-2">
							<PaperAirplaneIcon className="w-8 h-8 text-gray-400 hover:text-sky-500 rotate-90 transition-all" />
						</button>
					</form>
				</div>
			</div>
		</div>
	);
}

export default Chat;