import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
	createChatMessage,
	getChatMessage,
	resetState,
} from "../../../features/ChatLog/chatLogSlice";
import { io } from "socket.io-client";
import { GrSend } from "react-icons/gr";
import { PaperAirplaneIcon, PlusIcon } from "@heroicons/react/solid";
import ChatItem from "./ChatItem";

function Chat() {
	const dispatch = useDispatch();
	const value = useSelector((state) => state.chatLog);

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
		console.log(value);
	}
	// console.log(chat);

	function getMessage() {
		dispatch(getChatMessage());
		console.log(value.chatLog);
	}

	const user = true;

	return (
		<div className="flex-grow p-6 bg-white dark:bg-slate-900">
			<div className="h-[95%] max-h-[830px] overflow-y-auto">
				<ChatItem user={user} />
				<ChatItem />
				<ChatItem />
				<ChatItem user={user} />
				<ChatItem user={user} />
				<ChatItem user={user} />
				<ChatItem user={user} />
				<ChatItem />
			</div>
			<div className=" border-[2px] h-fit rounded-lg bg-offwhite focus-within:border-sky-600">
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
			{/* <section className="w-1/3">
				<div></div>
			</section>
			<section className="w-2/3 p-6">
				<div className="h-5/6">
					<p className="">one</p>
					<p>two</p>
					<p>three</p>
					<p>four</p>
					<button onClick={getMessage}>Get message</button>
				</div>
				<div
					className="flex gap-2 items-center 
				justify-center w-full h-12 bg-slate-300"
				>
					<form className="w-full" onSubmit={handleSubmit}>
						<input
							name="message"
							value={chat.message}
							type="text"
							onChange={handleChange}
							placeholder="Enter message"
							className="w-2/3"
						></input>
						<button className="text-center w-12 h-12">Send</button>
					</form>
				</div>
			</section> */}
		</div>
	);
}

export default Chat;
