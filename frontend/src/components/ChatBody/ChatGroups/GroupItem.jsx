import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { UserGroupIcon } from "@heroicons/react/solid";
import {
	updateChatGroupName,
	getChatGroups,
	updateActiveGroup,
} from "../../../features/groups/groupSlice";
import GroupTools from "./GroupTools";
import { SaveIcon, XIcon } from "@heroicons/react/outline";

export default function GroupItem({ groupId, groupName, groupOwner, members }) {
	const dispatch = useDispatch();

	const [newGroupName, setNewGroupName] = useState({
		groupName: "",
	});
	const [isEditingName, setIsEditingName] = useState(false);
	const { groupInfo } = useSelector((state) => state.conversations);
	const { user } = useSelector((state) => state.auth);

	const sendGroupInfo = {
		groupId,
		groupOwner,
		members,
	};
	const activeStyle =
		groupInfo.groupId === groupId
			? "bg-sky-100 dark:bg-slate-800 border-l-sky-400 border-l-[3px] dark:border-l-sky-500 "
			: "border-l-[3px] border-l-gray-200 dark:border-l-gray-600 hover:border-l-gray-400 dark:hover:border-l-gray-400";

	const groupOwnerStyle =
		groupOwner === user._id
			? "text-sky-500 dark:text-sky-600"
			: "text-gray-500 dark:text-gray-600";

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
	function toggleEditingName() {
		setIsEditingName((prev) => !prev);
	}
	return (
		<div
			onClick={() => {
				// Prevent rerendering by clicking the group that is already active
				if (groupId !== groupInfo.groupId) {
					dispatch(updateActiveGroup(sendGroupInfo));
					dispatch(getChatGroups());
				}
			}}
			className={`flex items-center justify-between w-full h-12 px-3 gap-2 cursor-pointer
				${activeStyle}`}
		>
			{isEditingName ? (
				<div className="flex items-center gap-4">
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
				<div className="flex gap-4">
					<UserGroupIcon className={`h-7 w-7 ${groupOwnerStyle}`} />
					<div className="flex items-center gap-2 text-gray1 dark:text-white">
						<span>{groupName}</span>
					</div>
				</div>
			)}
			{!isEditingName &&
				groupOwner === user._id &&
				groupInfo.groupId === groupId && (
					<GroupTools
						groupName={groupName}
						groupId={groupId}
						toggleEditingName={toggleEditingName}
					/>
				)}
		</div>
	);
}
