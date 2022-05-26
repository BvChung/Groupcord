import { useEffect, useState, useCallback, useRef, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
	createChatMessage,
	getChatMessage,
	resetTextInput,
} from "../../../features/messages/messageSlice";
import { resetGroupMemberDisplay } from "../../../features/groups/groupSlice";
import { SocketContext } from "../../../appContext/socketContext";
import { useSendMessageData } from "../../../hooks/webSocket/useSendMessageData";
import { useSendProfileData } from "../../../hooks/webSocket/useSendProfileData";
import ChatItem from "./ChatMessagesItem";
import { PaperAirplaneIcon } from "@heroicons/react/solid";

export default function Chat() {
	const socket = useContext(SocketContext);
	const dispatch = useDispatch();
	const messageRef = useRef(null);

	const { groupMessages } = useSelector((state) => state.messages.userMessages);
	const { loadInitialMessages, hideTextInput } = useSelector(
		(state) => state.messages
	);
	const { groupId } = useSelector(
		(state) => state.conversations.activeGroupInfo
	);

	const [userMessage, setUserMessage] = useState({
		message: "",
	});
	const [textInputActive, setTextInputActive] = useState(false);

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

	const scrollToNewMessage = () => messageRef.current.scrollIntoView();
	useEffect(() => {
		scrollToNewMessage();
	}, [groupMessages]);

	// --------------- Socket.io Websocket Transmission -------------------
	// Loading messages + joining chat room
	const loadMessages = useCallback(() => {
		dispatch(getChatMessage());
	}, [dispatch]);

	useEffect(() => {
		loadMessages();
		dispatch(resetTextInput());
		dispatch(resetGroupMemberDisplay());
		socket.emit("join_room", groupId);
	}, [groupId, socket, dispatch, loadMessages]);

	useSendMessageData();
	useSendProfileData();

	return (
		<div className="flex-grow bg-white dark:bg-dark2">
			<section
				className="h-[90%] min-h-[375px] max-height-chat pl-3 pr-2 sm:px-4 md:px-6 lg:px-12 xl:px-16 2xl:px-20 py-4 
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
								userAvatar={message.userAvatar}
								message={message.message}
								fullDate={message.fullDate}
								timeCreated={message.timeCreated}
								dateCreated={message.dateCreated}
							/>
						);
					})}
				<div ref={messageRef}></div>
			</section>

			<div className="flex h-[10%] w-full justify-center items-center px-6">
				{!hideTextInput && (
					<div
						className="flex items-center justify-end w-full max-w-5xl border-[1px] h-fit rounded-lg border-gray-300
					bg-offwhite focus-within:border-sky-500 dark:focus-within:border-sky-700 dark:border-gray-600 dark:bg-gray-800"
					>
						<form
							onFocus={() => {
								setTextInputActive(true);
							}}
							onBlur={() => {
								setTextInputActive(false);
							}}
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
									${
										textInputActive
											? "-rotate-[-180] text-sky-500 dark:text-sky-600"
											: "rotate-90 text-gray-400 "
									} transition-all`}
								/>
							</button>
						</form>
					</div>
				)}
			</div>
		</div>
	);
}
