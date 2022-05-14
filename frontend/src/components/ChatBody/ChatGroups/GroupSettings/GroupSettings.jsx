import { useState } from "react";
import Dialog from "@mui/material/Dialog";
import { useSelector, useDispatch } from "react-redux";
import {
	deleteChatGroup,
	updateChatGroupName,
} from "../../../../features/groups/groupSlice";
import {
	clearChatMessages,
	hideTextInput,
} from "../../../../features/messages/messageSlice";
import { toast } from "react-toastify";
import {
	SearchIcon,
	PencilIcon,
	PencilAltIcon,
	ArrowLeftIcon,
} from "@heroicons/react/outline";
import { Tooltip, TextField } from "@mui/material";
import Spinner from "../../../Spinner/Spinner";

export default function GroupSettings({ open, handleClose }) {
	const dispatch = useDispatch();

	const { user } = useSelector((state) => state.auth);
	const { membersAvailableToAddToGroup, isLoading, activeGroupInfo } =
		useSelector((state) => state?.conversations);
	const { darkMode } = useSelector((state) => state.theme);

	const [editGroupName, setEditGroupName] = useState(false);
	function toggleEditGroupName() {
		setEditGroupName((prev) => !prev);
	}
	const [textInput, setTextInput] = useState({
		groupName: activeGroupInfo.groupName,
	});

	function handleChange(e) {
		const { name, value } = e.target;

		setTextInput(() => {
			return {
				[name]: value,
			};
		});
	}

	function handleSubmit(e) {
		e.preventDefault();

		if (textInput.groupName === activeGroupInfo.groupName) return;

		const sendGroupData = {
			groupName: textInput.groupName,
			groupId: activeGroupInfo.groupId,
		};

		dispatch(updateChatGroupName(sendGroupData));
		setEditGroupName("");
	}

	const bgStyle = darkMode ? "bg-menu" : "bg-offwhite";
	const textStyle = darkMode ? "text-white" : "text-gray1";
	const iconStyle = darkMode ? "text-gray-200" : "text-gray-700";
	const titleStyle = darkMode
		? "text-white border-b-[1px] border-gray-500 "
		: "text-gray1 border-b-[1px] border-gray-300";
	const accountInfoStyle = darkMode
		? "text-white border-t-[1px] border-b-[1px] border-gray-500 hover:bg-slate-800 "
		: "text-gray1 border-t-[1px] border-b-[1px] border-gray-300 hover:bg-gray-100 ";
	const formStyle = darkMode
		? "border-[1px] border-gray-500 "
		: "border-[1px] border-gray-300 ";
	const returnStyle = darkMode ? "hover:bg-dark4" : "hover:bg-gray-200";

	return (
		<Dialog
			open={open}
			fullWidth={true}
			maxWidth="sm"
			onClose={() => {
				handleClose();
			}}
		>
			<div className={`w-full px-4 py-4 sm:px-8 ${bgStyle}`}>
				<div className={`${textStyle} mb-2 py-2`}>
					<h1 className={`${titleStyle} text-xl font-semibold pb-2 font-sans `}>
						Group Settings
					</h1>
				</div>

				{!editGroupName ? (
					<Tooltip arrow describeChild title="Edit Group Name">
						<div
							className={`grid grid-cols-3 items-center py-2 sm:py-[.84rem] px-2 sm:px-4 w-full mb-6 cursor-pointer
											${accountInfoStyle}`}
							onClick={() => {
								toggleEditGroupName();
							}}
						>
							<div className="flex basis-24 sm:basis-32 items-center">
								<p className="text-xs leading-6 uppercase font-medium">
									Group Name
								</p>
							</div>
							<div className="flex basis-72 sm:basis-96">
								<p className="text-sm sm:text-base">
									{activeGroupInfo.groupName}
								</p>
							</div>
							<div className="flex justify-end">
								<PencilIcon className={`h-6 w-6 sm:h-7 sm:w-7 ${iconStyle}`} />
							</div>
						</div>
					</Tooltip>
				) : (
					<div className={`flex flex-col mb-6 px-4 py-4 sm:px-6 ${formStyle}`}>
						<div className="flex items-center justify-between">
							<Tooltip arrow describeChild title="Click to go back">
								<button
									onClick={() => {
										setTextInput({
											groupName: activeGroupInfo.groupName,
										});
										toggleEditGroupName();
									}}
								>
									<ArrowLeftIcon
										className={`h-9 w-9 rounded-full p-2 ${returnStyle}`}
									/>
								</button>
							</Tooltip>
							<PencilAltIcon className={`h-6 w-6 ${iconStyle}`} />
						</div>
						<TextField
							name="groupName"
							value={textInput.groupName}
							onChange={handleChange}
							margin="normal"
							id="groupName"
							label="Group Name"
							type="text"
							fullWidth
							variant="outlined"
						/>
						<div className="md:col-start-2 flex justify-end items-center mt-4 md:mt-5 gap-4">
							<button
								onClick={(e) => {
									handleSubmit(e);
								}}
								className={`${
									darkMode
										? "bg-sky-800 text-white hover:bg-sky-900 active:bg-sky-800"
										: "bg-sky-600 text-gray-100 hover:bg-sky-700 active:bg-sky-600"
								}  w-20 px-1 py-[.65rem] text-sm font-bold rounded-md transition-all`}
							>
								Save
							</button>
						</div>
					</div>
				)}

				{isLoading && <Spinner />}

				<div></div>
			</div>
		</Dialog>
	);
}
