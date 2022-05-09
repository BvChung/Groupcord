import { useEffect, useState, useCallback, useRef, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
	createChatMessage,
	getChatMessage,
	socketDataAddMessage,
	socketDataRemoveDeletedMessage,
} from "../../../features/messages/messageSlice";
import ChatItem from "./ChatItem";
import { PaperAirplaneIcon } from "@heroicons/react/solid";
import { SocketContext } from "../../../appContext/socketContext";
import { toast } from "react-toastify";

export default function Chat() {
	const socket = useContext(SocketContext);
	const dispatch = useDispatch();

	const [userMessage, setUserMessage] = useState({
		message: "",
	});
	const { user } = useSelector((state) => state.auth);
	const { groupMessages } = useSelector((state) => state.messages.userMessages);
	const { newMessageToSocket, deletedMessageToSocket, loadInitialMessages } =
		useSelector((state) => state.messages);
	const { groupId, members } = useSelector(
		(state) => state.conversations.groupInfo
	);
	// console.log(user);

	const refMessage = useRef(null);
	const scrollToMessage = () => refMessage.current.scrollIntoView();
	useEffect(() => {
		scrollToMessage();
	}, [groupMessages]);

	const [textInputActive, setTextInputActive] = useState(false);
	function toggleTextInputActive() {
		setTextInputActive(true);
	}
	function toggleTextInputInactive() {
		setTextInputActive(false);
	}
	const inputActiveStyle = textInputActive
		? "-rotate-[-180] text-sky-500 dark:text-sky-600"
		: "rotate-90 text-gray-400 ";

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

		// Prevent just white spaces from being sent
		if (!userMessage.message.replaceAll(" ", "")) return;

		if (groupId !== "Global") {
			const findMember = members.find((member) => {
				return member._id === user._id;
			});
			if (!findMember) {
				return toast.error(
					"User is not authorized to send messages in this group"
				);
			}
		}
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

	// Loading messages/ joining chat room
	const loadMessages = useCallback(() => {
		dispatch(getChatMessage());
	}, [dispatch]);

	useEffect(() => {
		loadMessages();
		socket.emit("join_room", groupId);
	}, [groupId, socket, loadMessages]);

	// --------------- Socket.io
	const sendMessage = useCallback(
		(messageData) => {
			socket.emit("send_message", messageData);
		},
		[socket]
	);
	const sendDeletedMessage = useCallback(
		(messageData) => {
			socket.emit("send_deleted_message", messageData);
		},
		[socket]
	);

	useEffect(() => {
		sendMessage(newMessageToSocket);
	}, [newMessageToSocket, sendMessage]);

	useEffect(() => {
		socket.on("receive_message", (data) => {
			if ("_id" in data) {
				dispatch(socketDataAddMessage(data));
			}
		});
	}, [dispatch, socket]);

	useEffect(() => {
		sendDeletedMessage(deletedMessageToSocket);
	}, [deletedMessageToSocket, sendDeletedMessage]);

	useEffect(() => {
		socket.on("receive_deleted_message", (data) => {
			dispatch(socketDataRemoveDeletedMessage(data));
		});
	}, [deletedMessageToSocket, dispatch, socket]);

	return (
		<div className="flex-grow bg-white dark:bg-dark2">
			<section
				className="h-[90%] min-h-[375px] max-height-chat px-4 md:px-6 lg:px-12 xl:px-16 2xl:px-20 py-4 
				overflow-y-auto transition-all fade relative"
			>
				{loadInitialMessages &&
					groupMessages?.map((message) => {
						return (
							<ChatItem
								key={message._id}
								type={message.type}
								messageId={message._id}
								userId={message.user}
								username={message.username}
								message={message.message}
								fullDate={message.fullDate}
								timeCreated={message.timeCreated}
								dateCreated={message.dateCreated}
							/>
						);
					})}
				<div ref={refMessage}></div>
			</section>

			<div className="flex h-[10%] w-full justify-center items-center px-6">
				<div
					className="flex items-center justify-end w-full max-w-5xl border-[1px] h-fit rounded-lg border-gray-300
					bg-offwhite focus-within:border-sky-500 dark:focus-within:border-sky-700 dark:border-gray-600 dark:bg-gray-800"
				>
					<form
						onFocus={toggleTextInputActive}
						onBlur={toggleTextInputInactive}
						className="flex w-full"
						onSubmit={handleSubmit}
					>
						<input
							name="message"
							value={userMessage.message}
							type="text"
							autoComplete="off"
							onChange={handleChange}
							placeholder="Send a message"
							className="w-full max-w-5xl outline-none text-lg px-4 bg-transparent
									text-gray1 dark:text-white
									placeholder:text-gray-500 dark:placeholder:text-gray-600"
						></input>
						<button
							aria-label="Submit message text"
							className="float-right bg-transparent rounded-[50%] p-2"
						>
							<PaperAirplaneIcon
								className={`w-6 h-6 
									${inputActiveStyle} transition-all`}
							/>
						</button>
					</form>
				</div>
			</div>
		</div>
	);
}
