import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
	createChatMessage,
	getChatMessage,
	updateChatMessage,
} from "../../../features/Messages/messageSlice";
import { io } from "socket.io-client";
import ChatItem from "./ChatItem";
import ChatNav from "./ChatNav";
import { PaperAirplaneIcon, PlusIcon } from "@heroicons/react/solid";

const socket = io.connect("http://localhost:3001");

function Chat() {
	const dispatch = useDispatch();
	const allMessages = useSelector(
		(state) => state.messages.messageArr.allMessages
	);
	console.log(allMessages);

	const messageToSocket = useSelector((state) => state.messages.newMessage);
	// console.log(messageToSocket);

	const [userMessage, setUserMessage] = useState({
		message: "",
	});

	function handleChange(e) {
		const { value, name } = e.target;

		setUserMessage((prevMessage) => {
			return {
				...prevMessage,
				[name]: value,
			};
		});
	}

	const sendMessage = useCallback((message) => {
		socket.emit("send_message", message);
	}, []);
	const sendSocketMessage = useCallback(
		(data) => {
			dispatch(updateChatMessage(data));
		},
		[dispatch]
	);
	const loadMessages = useCallback(() => {
		dispatch(getChatMessage());
	}, [dispatch]);

	useEffect(() => {
		socket.on("receive_message", (data) => {
			console.log(data);
			sendSocketMessage(data);
			// dispatch(updateChatMessage(data));
		});
	}, [sendSocketMessage]);

	function handleSubmit(e) {
		e.preventDefault();

		dispatch(
			createChatMessage({
				message: userMessage.message,
			})
		);

		setUserMessage({
			message: "",
		});
	}

	useEffect(() => {
		if (Object.keys(messageToSocket).length !== 0) {
			sendMessage(messageToSocket);
		}
	}, [messageToSocket, sendMessage]);

	useEffect(() => {
		loadMessages();
	}, [loadMessages]);

	return (
		<div className="flex-grow bg-white dark:bg-slate-900">
			<ChatNav />
			<div className="h-[95%] max-h-[750px] px-6 overflow-y-auto">
				{allMessages &&
					allMessages.map((message) => {
						return (
							<ChatItem
								key={message._id}
								userId={message.user}
								message={message.message}
							/>
						);
					})}
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
							value={userMessage.message}
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
