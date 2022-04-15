import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { UserGroupIcon } from "@heroicons/react/solid";
import {
	updateActiveChatGroup,
	updateChatGroupName,
	getChatGroups,
} from "../../../features/conversations/conversationSlice";
import GroupTools from "./GroupTools";
import { SaveIcon, XIcon } from "@heroicons/react/outline";

function ContactItem({
	indexNumber,
	groupId,
	groupName,
	groupOwner,
	members,
	groupActive,
	toggleGroupActive,
}) {
	const [newGroupName, setNewGroupName] = useState({
		groupName: "",
	});

	function handleChange(e) {
		const { name, value } = e.target;
		setNewGroupName((prev) => {
			return {
				...prev,
				[name]: value,
			};
		});
	}
	function handleSubmit(e) {
		e.preventDefault();

		const sendGroupData = {
			groupName: newGroupName.groupName,
			groupId: groupId,
		};

		if (sendGroupData.groupName === "") return;

		dispatch(updateChatGroupName(sendGroupData));
		setNewGroupName({
			groupName: "",
		});
		toggleEditingName();
	}

	const [isEditingName, setIsEditingName] = useState(false);
	const toggleEditingName = () => {
		setIsEditingName((prev) => !prev);
	};

	const dispatch = useDispatch();
	const { activeIndex } = groupActive;

	const activeStyle =
		activeIndex === indexNumber
			? "bg-slate-200 dark:bg-slate-800 border-l-sky-800 border-l-[3px] dark:border-l-sky-500 "
			: "border-l-[3px] border-l-gray-200 dark:border-l-gray-500";

	// border-l-2 border-l-sky-200 dark:border-l-sky-900 hover:bg-slate-200 dark:hover:bg-slate-800

	// const { groupDeletedToSocket } = useSelector((state) => state.conversations);
	// const { groupNameUpdatedToSocket } = useSelector(
	// 	(state) => state.conversations
	// );
	// console.log(groupDeletedToSocket);
	// console.log(groupNameUpdatedToSocket);

	const groupInfo = {
		groupId,
		groupOwner,
		members,
	};

	return (
		<div
			onClick={() => {
				toggleGroupActive(indexNumber);
				dispatch(updateActiveChatGroup(groupInfo));
				dispatch(getChatGroups());
			}}
			className={`flex items-center justify-between w-full h-12 px-3 gap-2 
				hover:bg-slate-200 dark:hover:bg-slate-800 ${activeStyle}`}
		>
			{isEditingName ? (
				<div className="flex items-center gap-[10px]">
					<UserGroupIcon className="h-7 w-7 text-sky-500 dark:text-sky-600" />
					<input
						className="text-gray1 dark:text-white bg-transparent w-[55%]
						border-b-2 border-b-slate-400 dark:border-white outline-none
						placeholder:text-gray-500 dark:placeholder:text-gray-300"
						placeholder="Enter group name"
						onChange={handleChange}
						name="groupName"
						value={newGroupName.groupName}
					></input>

					<div className="flex items-center justify-center">
						<button
							onClick={handleSubmit}
							className="flex items-center justify-center"
						>
							<SaveIcon
								className="h-8 w-8 p-[4px] text-sky-700 hover:bg-slate-700 
							transition-colors hover:text-sky-600 rounded-full"
							/>
						</button>
						<button
							onClick={() => {
								setNewGroupName({
									groupName: "",
								});
								toggleEditingName();
							}}
							className="flex items-center justify-center"
						>
							<XIcon
								className="h-8 w-8 p-[4px] text-red-900 hover:bg-red-700 
							transition-colors hover:text-white rounded-full"
							/>
						</button>
					</div>
				</div>
			) : (
				<div className="flex gap-[10px]">
					<UserGroupIcon className="h-7 w-7 text-sky-500 dark:text-sky-600" />
					<div className="flex items-center gap-2 dark:text-white">
						<span>{groupName}</span>
						{/* <span>32 mins ago</span> */}
					</div>
				</div>
			)}
			{!isEditingName && activeIndex === indexNumber && (
				<GroupTools groupId={groupId} toggleEditingName={toggleEditingName} />
			)}
		</div>
	);
}

export default ContactItem;
