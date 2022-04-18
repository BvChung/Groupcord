import { useState, useEffect, useContext, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { PlusIcon } from "@heroicons/react/outline";
import { GlobeIcon } from "@heroicons/react/solid";
import { SearchIcon } from "@heroicons/react/solid";
import ContactItem from "./GroupItem";
import ContactMenu from "./ContactMenu";
import {
	updateActiveChatGroup,
	updateGroupNameWithSocket,
	deleteGroupWithSocket,
	searchChatGroup,
} from "../../../features/conversations/conversationSlice";
import { SocketContext } from "../../../appContext/socketContext";

export default function ChatGroups({ activeGroupMenu }) {
	const dispatch = useDispatch();
	const socket = useContext(SocketContext);
	const { groups } = useSelector((state) => state.conversations);
	const { groupDeletedToSocket } = useSelector((state) => state.conversations);
	const { groupNameUpdatedToSocket } = useSelector(
		(state) => state.conversations
	);
	const [searchText, setSearchText] = useState("");

	const [open, setOpen] = useState(false);
	const handleClickOpen = () => {
		setOpen(true);
	};
	const handleClose = () => {
		setOpen(false);
	};

	const [groupActive, setGroupActive] = useState({ activeIndex: -1 });
	function toggleGroupActive(i) {
		setGroupActive({
			activeIndex: i,
		});
	}

	const showGroupsStyle = activeGroupMenu
		? "md:flex md:flex-col left-0 "
		: "-left-full lg:left-0";
	const globalActive =
		groupActive.activeIndex === -1
			? "bg-sky-100 dark:bg-slate-800 border-l-sky-400 border-l-[3px] dark:border-l-sky-500"
			: "border-l-[3px] border-l-gray4 dark:border-l-gray-600 hover:border-l-gray-400 dark:hover:border-l-gray-400";

	useEffect(() => {
		socket.emit("send_group_deleted", groupDeletedToSocket);
	}, [groupDeletedToSocket, socket]);
	useEffect(() => {
		socket.on("receive_group_name_updated", (data) => {
			dispatch(updateGroupNameWithSocket(data));
		});
	}, [socket, dispatch]);

	useEffect(() => {
		socket.emit("send_group_name_updated", groupNameUpdatedToSocket);
	}, [groupNameUpdatedToSocket, socket]);
	useEffect(() => {
		socket.on("receive_group_deleted", (data) => {
			console.log(data);
			dispatch(deleteGroupWithSocket(data));
		});
	}, [socket, dispatch]);
	return (
		<>
			<div
				className={`${showGroupsStyle} fixed lg:static transition-all z-[100] border-r-[1px] 
				border-r-gray-300 dark:border-r-dark5 w-full sm:max-w-[400px] h-full bg-offwhite sm:shadow-xl lg:shadow-md dark:bg-dark2`}
			>
				{/* border-b-2 dark:border-b-dark4 w-[40%] max-w-[350px] */}
				<div className="flex items-center justify-between mb-4 mx-4 px-2 py-4 pb-4 h-16 border-b-[1px] border-b-gray-300 dark:border-b-dark5 ">
					<p className="text-gray1 text-2xl font-bold dark:text-white">
						Messages
					</p>
				</div>

				<div className="mx-4 h-95% p-4 bg-white dark:bg-dark3 rounded-md">
					<div
						className="flex items-center justify-center gap-2 mb-6 h-14 bg-sky-500 rounded-3xl shadow-md
				active:shadow-lg hover:bg-sky-600 cursor-pointer transition-all
				dark:bg-sky-700 dark:hover:bg-sky-600"
						onClick={() => {
							handleClickOpen();
						}}
					>
						<PlusIcon className="w-6 h-6 text-white" />
						<span className="font-medium text-white">Create Group</span>
					</div>

					<div
						className="flex items-center justify-center border-[2px] border-transparent mb-4
								bg-white focus-within:border-sky-600 w-full p-[6px] rounded-3xl shadow-md"
					>
						<input
							name="searchText"
							value={searchText}
							type="text"
							placeholder="Find message"
							onChange={(e) => setSearchText(e.target.value)}
							className="outline-none bg-transparent w-11/12 px-2 placeholder:text-gray-500"
						></input>
						<SearchIcon className="w-8 h-8 text-white dark:text-gray1 bg-sky-500 rounded-full p-1" />
					</div>
					<ContactMenu open={open} handleClose={handleClose} />

					<div
						className="flex-grow h-full max-h-[630px] bg-transparent py-1 overflow-y-auto pr-4
				rounded-lg "
					>
						<div
							onClick={() => {
								toggleGroupActive(-1);
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
								.map((group, i) => {
									return (
										<ContactItem
											key={group._id}
											groupId={group._id}
											groupName={group.groupName}
											groupOwner={group.groupOwner}
											members={group.members}
											indexNumber={i}
											groupActive={groupActive}
											toggleGroupActive={toggleGroupActive}
										/>
									);
								})}
					</div>
				</div>
			</div>
		</>
	);
}
