import { useEffect, useState, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
	createChatMessage,
	getChatMessage,
	updateChatMessage,
} from "../../../features/Messages/messageSlice";
import { io } from "socket.io-client";
import ChatItem from "./ChatItem";
import ChatNav from "./ChatNav";
import Menu from "./Menu";
import { PaperAirplaneIcon, PlusIcon } from "@heroicons/react/solid";
import { nanoid } from "nanoid";

const socket = io.connect("http://localhost:3001");

function Chat() {
	const dispatch = useDispatch();
	const allMessages = useSelector(
		(state) => state?.messages?.messageArr?.allMessages
	);
	const { groupMessages } = useSelector((state) => state?.messages?.messageArr);
	// console.log(groupMessages);

	const messageToSocket = useSelector((state) => state?.messages?.newMessage);
	const { groupId } = useSelector((state) => state?.conversations.groupInfo);

	const [userMessage, setUserMessage] = useState({
		message: "",
	});

	const refMessage = useRef(null);
	const scrollToMessage = () => refMessage.current.scrollIntoView();

	function handleChange(e) {
		const { value, name } = e.target;

		setUserMessage((prevMessage) => {
			return {
				...prevMessage,
				[name]: value,
			};
		});
	}
	function handleSubmit(e) {
		e.preventDefault();

		dispatch(
			createChatMessage({
				message: userMessage.message,
				groupId: groupId,
			})
		);

		setUserMessage({
			message: "",
		});
	}

	const sendMessage = useCallback((message) => {
		socket.emit("send_message", message);
	}, []);

	const updateWithSocketMessage = useCallback(
		(data) => {
			dispatch(updateChatMessage(data));
		},
		[dispatch]
	);

	const loadMessages = useCallback(() => {
		dispatch(getChatMessage());
	}, [dispatch]);

	useEffect(() => {
		loadMessages();
	}, [groupId, loadMessages]);

	useEffect(() => {
		scrollToMessage();
	}, [allMessages]);

	useEffect(() => {
		if (Object.keys(messageToSocket).length !== 0) {
			// console.log("send to socket");
			sendMessage(messageToSocket);
		}
	}, [messageToSocket, sendMessage]);

	useEffect(() => {
		socket.on("receive_message", (data) => {
			updateWithSocketMessage(data);
		});
	}, [updateWithSocketMessage]);

	const [inputActive, setInputActive] = useState(false);
	function toggleInputActive() {
		setInputActive((prev) => !prev);
	}

	return (
		<div className="flex-grow bg-white dark:bg-dark3 border-l-2 dark:border-dark2 ">
			<ChatNav />
			<div
				className="h-[85%] px-4 md:px-6 lg:px-12 xl:px-16 2xl:px-24 py-6 
				overflow-y-auto transition-all fade"
			>
				{groupMessages
					?.filter(
						(message, i, arr) =>
							i === arr.findIndex((position) => position._id === message._id)
					)
					?.map((message) => {
						return (
							<ChatItem
								key={message._id}
								messageId={message._id}
								userId={message.user}
								username={message.username}
								message={message.message}
								timeCreated={message.timeCreated}
								dateCreated={message.dateCreated}
							/>
						);
					})}
				<div ref={refMessage}></div>
			</div>

			<div className="flex w-full justify-center items-center px-6">
				<div
					className="flex items-center justify-end w-full max-w-5xl border-[2px] h-fit rounded-lg 
					bg-offwhite focus-within:border-sky-600"
				>
					<form
						onFocus={toggleInputActive}
						className="flex w-full"
						onSubmit={handleSubmit}
					>
						<button className="float-left">
							<PlusIcon />
						</button>
						<input
							name="message"
							value={userMessage.message}
							type="text"
							onChange={handleChange}
							placeholder="Send a message"
							className="w-full max-w-5xl outline-none text-lg px-4 bg-transparent"
						></input>
						<button className="float-right bg-transparent rounded-[50%] p-2">
							<PaperAirplaneIcon className="w-6 h-6 text-gray-400 hover:transition-all hover:-rotate-[-180] hover:text-sky-500 rotate-90 transition-all" />
						</button>
					</form>
				</div>
			</div>
		</div>
	);
}

export default Chat;
