import { useEffect, useState, useCallback, useRef, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
	createChatMessage,
	getChatMessage,
	updateChatMessage,
} from "../../../features/messages/messageSlice";
import ChatItem from "./ChatItem";
import ChatNav from "./ChatNav";
import { PaperAirplaneIcon, PlusIcon } from "@heroicons/react/solid";
import { SocketContext } from "../../../appContext/socketContext";
import { toast } from "react-toastify";

function Chat({ toggleMenu }) {
	const socket = useContext(SocketContext);
	const dispatch = useDispatch();

	const [userMessage, setUserMessage] = useState({
		message: "",
	});
	const { user } = useSelector((state) => state.auth);
	const { groupMessages } = useSelector((state) => state.messages.messageArr);
	const { newMessageToSocket } = useSelector((state) => state.messages);
	const { deletedMessageToSocket } = useSelector((state) => state.messages);
	const { groupId } = useSelector((state) => state.conversations.groupInfo);
	const { members } = useSelector((state) => state.conversations.groupInfo);
	console.log(deletedMessageToSocket);
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

	const updateWithSocketMessage = useCallback(
		(data) => {
			dispatch(updateChatMessage(data));
		},
		[dispatch]
	);

	useEffect(() => {
		sendMessage(newMessageToSocket);
	}, [newMessageToSocket, sendMessage]);

	useEffect(() => {
		socket.on("receive_message", (data) => {
			if ("_id" in data) {
				updateWithSocketMessage(data);
			}
		});
	}, [updateWithSocketMessage, socket]);

	useEffect(() => {
		socket.emit("send_deleted_message", deletedMessageToSocket);
	}, [deletedMessageToSocket]);
	useEffect(() => {
		socket.on("receive_deleted_message", (data) => {
			console.log(data);
		});
	}, [deletedMessageToSocket]);

	// ---------------
	useEffect(() => {
		scrollToMessage();
	}, [groupMessages]);

	const [inputActive, setInputActive] = useState(false);
	function toggleInputActive() {
		setInputActive((prev) => !prev);
	}

	return (
		<div className="flex-grow bg-white dark:bg-dark3 border-l-2 dark:border-dark2 ">
			<ChatNav toggleMenu={toggleMenu} />
			<div
				className="h-[85%] max-h-[780px]  px-4 md:px-6 lg:px-12 xl:px-16 2xl:px-24 py-6 
				overflow-y-auto transition-all fade"
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

			<div className="flex h-[8%] w-full justify-center items-center px-6">
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

// ?.filter(
// 	(message, i, arr) =>
// 		i === arr.findIndex((position) => position._id === message._id)
// )?.filter((message) => message.groupId === groupId)

const ex = [
	{
		user: "6233a3e6f4cef1bba5c015c4",
		username: "GuestAccount",
		groupId: "Global",
		message: "2",
		dateCreated: "4/9",
		timeCreated: "5:30 AM",
		members: [
			{ _id: "6233a3e6f4cef1bba5c015c4", username: "GuestAccount" },
			{ _id: "6233a3e6f4cef1bba5c015c4", username: "GuestAccount" },
		],
		_id: "6252aa62c39b1b8c9981ee",
		createdAt: "2022-04-09T10:30:08.836Z",
		updatedAt: "2022-04-09T10:30:08.836Z",
		__v: 0,
	},
	{
		user: "6233a3e6f4cef1bba5c015c",
		username: "GuestAccount",
		groupId: "Global",
		message: "2",
		dateCreated: "4/9",
		timeCreated: "5:30 AM",
		members: [{ _id: "6233a3e6f4cef1bba5c015c1", username: "GuestAccount" }],
		membersId: [{ _id: "1", username: "1" }],
		_id: "6252aa62c39b1b8c9981ee7",
		createdAt: "2022-04-09T10:30:08.836Z",
		updatedAt: "2022-04-09T10:30:08.836Z",
		__v: 0,
	},
];

const one = {
	user: "6233a3e6f4cef1bba5c015c4",
	username: "GuestAccount",
	groupId: "Global",
	message: "2",
	dateCreated: "4/9",
	timeCreated: "5:30 AM",
	members: [{ _id: "6233a3e6f4cef1bba5c015c4", username: "Account" }],
	membersId: [{ _id: "2", username: "2" }],
	_id: "6252aa62c39b1b8c9981ee7b",
	createdAt: "2022-04-09T10:30:08.836Z",
	updatedAt: "2022-04-09T10:30:08.836Z",
	__v: 0,
};

const update = (obj1, obj2) => {
	const found = obj1.some((data) => data._id === obj2._id);
	console.log(found);

	if (found) {
		return obj1.map((data) => {
			if (data._id === obj2._id) {
				return {
					...data,
					members: obj2.members,
					membersId: obj2.membersId,
					createdAt: obj2.createdAt,
					updatedAt: obj2.updatedAt,
				};
			} else {
				return {
					...data,
				};
			}
		});
	} else {
		return [...obj1, obj2];
	}
};
// console.log(update(ex, one));

// const id = "6252aa62c39b1b8c9981ee7b";
// const newMembers = [
// 	{ _id: "6233a3e6f4cef1bba5c015c4", username: "GuestAccount" },
// 	{ _id: "6233a3e6f4cef1bba5c015c4", username: "GuestAccount" },
// ];

// const update = ex.map((group) => {
// 	if (group._id === id) {
// 		return {
// 			...group,
// 			members: newMembers,
// 		};
// 	} else {
// 		return {
// 			...group,
// 		};
// 	}
// });
// console.log(update);
// console.log("_id" in ex);

// const ex = [
// 	{ id: "JOCsGn7oeqrGlc_hAAAD", username: "GuestAccount" },
// 	{ id: "od5Mjy_4o7shGsYBAAAF", username: "1" },
// ];
// const u = { id: "cTNS60Aq5PU3XG3TAAAH", username: "1" };

// const out = ex.some((user) => {
// 	return user.username === u.username;

// console.log(out);
