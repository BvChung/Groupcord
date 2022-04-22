import { useState, useEffect, useContext, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ChatAlt2Icon } from "@heroicons/react/outline";
import { SearchIcon, GlobeIcon } from "@heroicons/react/solid";
import ContactItem from "./GroupItem";
import {
	updateActiveChatGroup,
	updateGroupNameWithSocket,
	deleteGroupWithSocket,
} from "../../../features/conversations/conversationSlice";
import { SocketContext } from "../../../appContext/socketContext";
import { MenuContext } from "../../../appContext/menuContext";
import { toast } from "react-toastify";

export default function ChatGroups() {
	const dispatch = useDispatch();
	const socket = useContext(SocketContext);
	const { setOpenGroupModal, activeGroupMenu } = useContext(MenuContext);
	const { groups } = useSelector((state) => state.conversations);
	const { groupInfo } = useSelector((state) => state.conversations);
	const { groupDeletedToSocket } = useSelector((state) => state.conversations);
	const { groupNameUpdatedToSocket } = useSelector(
		(state) => state.conversations
	);
	const [searchText, setSearchText] = useState("");

	const showGroupsStyle = activeGroupMenu
		? "lg:flex lg:flex-col left-0 "
		: "-left-full lg:left-0";
	const globalActive =
		groupInfo.groupId === "Global"
			? "bg-sky-100 dark:bg-slate-800 border-l-sky-400 border-l-[3px] dark:border-l-sky-500"
			: "border-l-[3px] border-l-gray4 dark:border-l-gray-600 hover:border-l-gray-400 dark:hover:border-l-gray-400";

	const receiveDeletedGroup = useCallback(() => {
		socket.on("receive_group_deleted", (data) => {
			dispatch(deleteGroupWithSocket(data));
			toast.info(`${data.groupName} has been deleted`);
		});
	}, [socket, dispatch]);
	const receiveUpdatedGroupName = useCallback(() => {
		socket.on("receive_group_name_updated", (data) => {
			dispatch(updateGroupNameWithSocket(data));
		});
	}, [socket, dispatch]);

	useEffect(() => {
		socket.emit("send_group_deleted", groupDeletedToSocket);
	}, [groupDeletedToSocket, socket]);
	useEffect(() => {
		socket.emit("send_group_name_updated", groupNameUpdatedToSocket);
	}, [groupNameUpdatedToSocket, socket]);

	useEffect(() => {
		receiveDeletedGroup();
	}, [receiveDeletedGroup]);

	useEffect(() => {
		receiveUpdatedGroupName();
	}, [receiveUpdatedGroupName]);

	// useEffect(() => {
	// 	socket.on("receive_group_deleted", (data) => {
	// 		dispatch(deleteGroupWithSocket(data));
	// 		toast.info(`${data.groupName} has been deleted`);
	// 	});
	// }, [socket, dispatch]);

	// useEffect(() => {
	// 	socket.on("receive_group_name_updated", (data) => {
	// 		console.log(data);
	// 		dispatch(updateGroupNameWithSocket(data));
	// 	});
	// }, [socket, dispatch]);

	return (
		<>
			<div
				className={`${showGroupsStyle} absolute height lg:static transition-all z-[50] border-r-[1px] 
				border-r-gray-300 dark:border-r-dark5 w-full sm:max-w-[400px] bg-offwhite sm:shadow-xl lg:shadow-md dark:bg-dark2 `}
			>
				<div className="flex items-center justify-between mb-4 mx-4 px-2 py-4 pb-4 h-16 border-b-[1px] border-b-gray-300 dark:border-b-dark5 ">
					<p className="text-gray1 text-2xl font-bold dark:text-white">
						Messages
					</p>
				</div>

				<div className="flex flex-col items-center justify-center mx-6 mb-6">
					<button
						className="flex items-center w-full justify-center gap-2 h-12 mb-6 
						bg-sky-500 hover:bg-sky-600 dark:bg-sky-800 dark:hover:bg-sky-700 rounded-lg shadow-md
					 	active:shadow-lg cursor-pointer transition-all"
						onClick={() => {
							setOpenGroupModal(true);
						}}
					>
						<ChatAlt2Icon className="w-6 h-6 text-white" />
						<span className="font-medium text-white">Create New Group</span>
					</button>

					<div
						className="flex items-center justify-center border-[1px] border-gray-300 dark:border-gray-600 dark:bg-gray-800 
								bg-white focus-within:border-sky-500 dark:focus-within:border-sky-700 w-full p-[6px] rounded-3xl shadow-sm"
					>
						<input
							name="searchText"
							value={searchText}
							type="text"
							placeholder="Search messages"
							onChange={(e) => setSearchText(e.target.value)}
							className="text-gray1 dark:text-white outline-none bg-transparent w-11/12 px-2 placeholder:text-gray-500 dark:placeholder:text-gray-600"
						></input>
						<SearchIcon className="w-7 h-7 text-white bg-sky-500 dark:bg-sky-700 rounded-full p-1" />
					</div>
				</div>

				<div className="mx-6 h-auto p-4 bg-white dark:bg-dark3 rounded-md">
					<div
						className="h-auto max-height bg-transparent py-1 pr-2
						rounded-lg overflow-y-auto"
					>
						<div
							onClick={() => {
								dispatch(
									updateActiveChatGroup({
										groupId: "Global",
										groupOwner: "",
										members: [],
									})
								);
							}}
							className={`flex items-center w-full h-12 px-3 gap-4 cursor-pointer
							 ${globalActive}`}
						>
							<GlobeIcon className="h-7 w-7 text-sky-500 dark:text-sky-600" />
							<span className="dark:text-white">Global</span>
						</div>
						{Object.keys(groups).length !== 0 &&
							groups
								.filter((group) => {
									return group.groupName
										.toLowerCase()
										.includes(searchText.toLowerCase());
								})
								.map((group) => {
									return (
										<ContactItem
											key={group._id}
											groupId={group._id}
											groupName={group.groupName}
											groupOwner={group.groupOwner}
											members={group.members}
										/>
									);
								})}
					</div>
				</div>
			</div>
		</>
	);
}
