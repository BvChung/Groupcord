import { useState } from "react";
import { useDispatch } from "react-redux";
import { UserCircleIcon } from "@heroicons/react/outline";
import { updateChatGroup } from "../../../features/Messages/messageSlice";

function ContactItem({
	indexNumber,
	groupId,
	groupName,
	groupActive,
	toggleGroupActive,
}) {
	const dispatch = useDispatch();
	const { activeIndex } = groupActive;

	const activeStyle =
		activeIndex === indexNumber
			? "bg-slate-200 dark:bg-slate-800 border-l-sky-800 border-l-2 dark:border-l-sky-600 "
			: "border-l-2 border-l-gray-200 dark:border-l-gray-500";

	// border-l-2 border-l-sky-200 dark:border-l-sky-900 hover:bg-slate-200 dark:hover:bg-slate-800

	return (
		<div
			onClick={() => {
				toggleGroupActive(indexNumber);
				dispatch(updateChatGroup(groupId));
				// console.log(`groupname: ${groupName} groupId: ${groupId}`);
			}}
			className={`flex items-center w-full h-12 pl-4 gap-2 
				hover:bg-slate-200 dark:hover:bg-slate-800 ${activeStyle}`}
		>
			<UserCircleIcon className="h-7 w-7 text-sky-500 dark:text-sky-600" />
			<div className="flex items-center gap-2 dark:text-white">
				<span>{groupName}</span>
				{/* <span>32 mins ago</span> */}
			</div>
		</div>
	);
}

export default ContactItem;
