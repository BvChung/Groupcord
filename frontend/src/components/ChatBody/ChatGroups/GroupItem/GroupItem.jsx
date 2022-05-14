import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { UserGroupIcon } from "@heroicons/react/solid";
import {
	updateChatGroupName,
	getChatGroups,
	updateActiveGroup,
} from "../../../../features/groups/groupSlice";
import GroupTools from "../GroupTools";
import GroupSettings from "../GroupSettings/GroupSettings";
import { SaveIcon, XIcon, DotsVerticalIcon } from "@heroicons/react/outline";
import Tooltip from "@mui/material/Tooltip";

export default function GroupItem({
	groupId,
	groupName,
	groupOwner,
	members,
	groupIcon,
}) {
	const dispatch = useDispatch();

	const [open, setOpen] = useState(false);
	const handleClickOpen = () => {
		setOpen(true);
	};
	const handleClose = () => {
		setOpen(false);
	};
	const [newGroupName, setNewGroupName] = useState({
		groupName: "",
	});
	const [isEditingName, setIsEditingName] = useState(false);
	const { activeGroupInfo } = useSelector((state) => state.conversations);
	const { user } = useSelector((state) => state.auth);

	const sendGroupInfo = {
		groupId,
		groupName,
		groupOwner,
		members,
	};
	const activeStyle =
		activeGroupInfo.groupId === groupId
			? "bg-sky-100 dark:bg-slate-800 border-l-sky-400 border-l-[3px] dark:border-l-sky-500 "
			: "border-l-[3px] border-l-gray-300 dark:border-l-gray-600 hover:border-l-gray-400 dark:hover:border-l-gray-400";

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

		if (sendGroupData.groupName === "") return;

		const sendGroupData = {
			groupName: newGroupName.groupName,
			groupId: groupId,
		};

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
				if (groupId !== activeGroupInfo.groupId) {
					dispatch(updateActiveGroup(sendGroupInfo));
					// dispatch(getChatGroups());
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

					<div className="flex items-center justify-between gap-2">
						<Tooltip arrow describeChild title="Save">
							<button
								onClick={handleSubmit}
								className="flex items-center justify-center"
							>
								<SaveIcon
									className="h-6 w-6 p-[2px] text-sky-700 hover:bg-slate-700 
							transition-colors hover:text-sky-600 rounded-full"
								/>
							</button>
						</Tooltip>
						<Tooltip arrow describeChild title="Cancel">
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
									className="h-6 w-6 p-[2px] text-red-900 hover:bg-red-700 
							transition-colors hover:text-white rounded-full"
								/>
							</button>
						</Tooltip>
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
				activeGroupInfo.groupId === groupId && (
					<GroupTools
						groupName={groupName}
						groupId={groupId}
						toggleEditingName={toggleEditingName}
					/>
				)}
			{!isEditingName &&
				groupOwner === user._id &&
				activeGroupInfo.groupId === groupId && (
					<>
						<Tooltip placement="right" arrow describeChild title="More">
							<button onClick={handleClickOpen}>
								<DotsVerticalIcon
									className="w-8 h-8 text-gray-600 hover:text-gray-700 dark:text-gray-300 hover:dark:text-gray-400 
									p-1 rounded-full border-[1px] border-transparent active:border-gray-500 dark:active:border-white 
									hover:bg-gray-200 dark:hover:bg-dark3 transition-all"
								/>
							</button>
						</Tooltip>
						<GroupSettings open={open} handleClose={handleClose} />
					</>
				)}
		</div>
	);
}
