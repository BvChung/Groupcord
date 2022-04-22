import { useEffect, useState, useCallback, useRef, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
	createChatMessage,
	getChatMessage,
	updateChatMessage,
	updateDeletedMessageWithSocket,
} from "../../../features/messages/messageSlice";
import ChatItem from "./ChatItem";
import ChatNav from "./ChatNav";
import { PaperAirplaneIcon, PlusIcon } from "@heroicons/react/solid";
import { SocketContext } from "../../../appContext/socketContext";
import { toast } from "react-toastify";
import { nanoid } from "@reduxjs/toolkit";

export default function Chat() {
	const socket = useContext(SocketContext);
	const dispatch = useDispatch();

	const [userMessage, setUserMessage] = useState({
		message: "",
	});
	const { user } = useSelector((state) => state.auth);
	const { groupMessages } = useSelector((state) => state.messages.userMessages);
	console.log(groupMessages);
	const { newMessageToSocket } = useSelector((state) => state.messages);
	const { deletedMessageToSocket } = useSelector((state) => state.messages);
	const { groupId } = useSelector((state) => state.conversations.groupInfo);
	const { members } = useSelector((state) => state.conversations.groupInfo);
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

	// const updateWithSocketMessage = useCallback(
	// 	(data) => {
	// 		dispatch(updateChatMessage(data));
	// 	},
	// 	[dispatch]
	// );

	useEffect(() => {
		sendMessage(newMessageToSocket);
	}, [newMessageToSocket, sendMessage]);

	useEffect(() => {
		socket.on("receive_message", (data) => {
			if ("_id" in data) {
				dispatch(updateChatMessage(data));
			}
		});
	}, [dispatch, socket]);

	useEffect(() => {
		socket.emit("send_deleted_message", deletedMessageToSocket);
	}, [deletedMessageToSocket, socket]);
	useEffect(() => {
		socket.on("receive_deleted_message", (data) => {
			dispatch(updateDeletedMessageWithSocket(data));
		});
	}, [deletedMessageToSocket, dispatch, socket]);

	useEffect(() => {
		scrollToMessage();
	}, [groupMessages]);

	const [inputActive, setInputActive] = useState(false);
	function toggleActive() {
		setInputActive(true);
	}
	function toggleInactive() {
		setInputActive(false);
	}
	const inputActiveStyle = inputActive
		? "-rotate-[-180] text-sky-500 dark:text-sky-600"
		: "rotate-90 text-gray-400 ";

	return (
		<>
			<div className="flex-grow bg-white dark:bg-dark2">
				<div
					className="h-[90%] min-h-[375px] max-height-chat px-4 md:px-6 lg:px-12 xl:px-16 2xl:px-20 py-4 
				overflow-y-auto transition-all fade relative"
				>
					{groupMessages?.map((message) => {
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
				</div>

				<div className="flex h-[10%] w-full justify-center items-center px-6">
					<div
						className="flex items-center justify-end w-full max-w-5xl border-[1px] h-fit rounded-lg border-gray-300
					bg-offwhite focus-within:border-sky-500 dark:focus-within:border-sky-700 dark:border-gray-600 dark:bg-gray-800"
					>
						<form
							onFocus={toggleActive}
							onBlur={toggleInactive}
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
								className="w-full max-w-5xl outline-none text-lg px-4 bg-transparent
									text-gray1 dark:text-white
									placeholder:text-gray-500 dark:placeholder:text-gray-600"
							></input>
							<button className="float-right bg-transparent rounded-[50%] p-2">
								<PaperAirplaneIcon
									className={`w-6 h-6 
									${inputActiveStyle} transition-all`}
								/>
							</button>
						</form>
					</div>
				</div>
			</div>
		</>
	);
}

const data = [
	{
		notes: "Game was played",
		time: "2017-10-04T20:24:30+00:00",
		dateCreated: "4/15",
		sport: "hockey",
		owner: "steve",
		players: "10",
		game_id: 1,
	},
	{
		notes: "Game was played",
		time: "2017-10-04T12:35:30+00:00",
		dateCreated: "4/15",
		sport: "lacrosse",
		owner: "steve",
		players: "6",
		game_id: 2,
	},
	{
		notes: "Game was played",
		time: "2017-10-14T20:32:30+00:00",
		dateCreated: "4/16",
		sport: "hockey",
		owner: "steve",
		players: "4",
		game_id: 3,
	},
	{
		notes: "Game was played",
		time: "2017-10-04T10:12:30+00:00",
		dateCreated: "4/17",
		sport: "hockey",
		owner: "henry",
		players: "10",
		game_id: 4,
	},
];

const add = {
	a: 1,
	b: 2,
	c: 3,
};
const total = Object.values(add).reduce((t, value) => t + value, 0);
// console.log(total); // 6

const a = {
	a: [1, 2, { one: "1" }],
	b: [2],
	c: [3],
};
const t = Object.values(a).reduce(
	(t, value) => t.concat([...value, { type: "date" }]),
	[]
);
// console.log(t); // 6

function showMessageDateHistory(data) {
	if (Object.keys(data).length !== 0) {
		let day;
		data.forEach((el, i) => {
			if (day !== el.dateCreated) {
				data.splice(i, 0, {
					_id: nanoid(),
					newDay: el.dateCreated,
					user: "",
					username: "",
					message: "",
					timeCreated: "",
					dateCreated: "",
				});
				day = el.dateCreated;
			}
		});
	}
}
// function showMessageDateHistory(data) {
// 	if (Object.keys(data).length !== 0) {
// 		let day;
// 		for (const [i, value] of data.entries()) {
// 			if (day !== value.dateCreated) {
// 				data.splice(i, 0, {
// 					_id: nanoid(),
// 					newDay: value.dateCreated,
// 					user: "",
// 					username: "",
// 					message: "",
// 					timeCreated: "",
// 					dateCreated: "",
// 				});
// 				day = value.dateCreated;
// 			}
// 		}
// 		return data;
// 	}
// }

// let day;
// for (const [i, value] of data.entries()) {
// 	if (day !== value.dateCreated) {
// 		data.splice(i, 0, {
// 			_id: nanoid(),
// 			newDay: value.dateCreated,
// 			user: "",
// 			username: "",
// 			message: "",
// 			timeCreated: "",
// 			dateCreated: "",
// 		});
// 		day = value.dateCreated;
// 	}
// }
// console.log(data);

// if (el.dateCreated === day) {
// 	day = el.dateCreated;
// } else {
// 	data.splice(i + 1, 0, "new");
// 	day = el.dateCreated;
// }

// const groups = data.reduce((groups, game) => {
// 	const date = game.time.split("T")[0];
// 	if (!groups[date]) {
// 		groups[date] = [];
// 	}
// 	groups[date].push(game);
// 	return groups;
// }, {});

// this gives an object with dates as keys
// console.log(groups);

// ?.filter(
// 	(message, i, arr) =>
// 		i === arr.findIndex((position) => position._id === message._id)
// )?.filter((message) => message.groupId === groupId)

{
	/* <div className="flex-grow bg-white dark:bg-dark2">
				<div
					className="h-[90%] min-h-[375px] max-h-[800px] px-4 md:px-6 lg:px-12 xl:px-16 2xl:px-24 py-6 
				overflow-y-auto transition-all fade relative"
				>
					{groupMessages?.map((message) => {
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

				<div className="flex h-[10%] w-full justify-center items-center px-6 pb-2">
					<div
						className="flex items-center justify-end w-full max-w-5xl border-[1px] h-fit rounded-lg border-gray-300
					bg-offwhite focus-within:border-sky-500 dark:focus-within:border-sky-700 dark:border-gray-600 dark:bg-gray-800"
					>
						<form
							onFocus={toggleActive}
							onBlur={toggleInactive}
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
								className="w-full max-w-5xl outline-none text-lg px-4 bg-transparent
									text-gray1 dark:text-white
									placeholder:text-gray-500 dark:placeholder:text-gray-600"
							></input>
							<button className="float-right bg-transparent rounded-[50%] p-2">
								<PaperAirplaneIcon
									className={`w-6 h-6 
									${inputActiveStyle} transition-all`}
								/>
							</button>
						</form>
					</div>
				</div>
			</div> */
}
