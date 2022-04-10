import { useState, useContext } from "react";
import { useDispatch } from "react-redux";
import { UserGroupIcon } from "@heroicons/react/solid";
import {
	updateActiveChatGroup,
	getChatGroups,
} from "../../../features/conversations/conversationSlice";
import { DotsHorizontalIcon } from "@heroicons/react/outline";
import { SocketContext } from "../../../appContext/socketContext";

function ContactItem({
	indexNumber,
	groupId,
	groupName,
	groupOwner,
	members,
	groupActive,
	toggleGroupActive,
}) {
	const socket = useContext(SocketContext);
	const dispatch = useDispatch();
	const { activeIndex } = groupActive;

	const activeStyle =
		activeIndex === indexNumber
			? "bg-slate-200 dark:bg-slate-800 border-l-sky-800 border-l-[3px] dark:border-l-sky-500 "
			: "border-l-[3px] border-l-gray-200 dark:border-l-gray-500";

	// border-l-2 border-l-sky-200 dark:border-l-sky-900 hover:bg-slate-200 dark:hover:bg-slate-800

	const groupInfo = {
		groupId,
		groupOwner,
		members,
	};
	// console.log(groupName, members);

	return (
		<div
			onClick={() => {
				toggleGroupActive(indexNumber);
				dispatch(updateActiveChatGroup(groupInfo));
				dispatch(getChatGroups());
			}}
			className={`flex items-center justify-between w-full h-12 px-4 gap-2 
				hover:bg-slate-200 dark:hover:bg-slate-800 ${activeStyle}`}
		>
			<div className="flex gap-2">
				<UserGroupIcon className="h-7 w-7 text-sky-500 dark:text-sky-600" />
				<div className="flex items-center gap-2 dark:text-white">
					<span>{groupName}</span>
					{/* <span>32 mins ago</span> */}
				</div>
			</div>
			{activeIndex === indexNumber && (
				<button className="justify-end">
					<DotsHorizontalIcon className="w-5 h-5" />
				</button>
			)}
		</div>
	);
}

export default ContactItem;
