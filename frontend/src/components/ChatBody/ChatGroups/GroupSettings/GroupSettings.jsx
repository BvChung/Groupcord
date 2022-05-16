import { useState, useRef } from "react";
import Dialog from "@mui/material/Dialog";
import { useSelector, useDispatch } from "react-redux";
import {
	deleteChatGroup,
	updateChatGroupName,
	updateChatGroupIcon,
	hideGroupMemberDisplay,
} from "../../../../features/groups/groupSlice";
import {
	clearChatMessages,
	hideTextInput,
} from "../../../../features/messages/messageSlice";
import { toast } from "react-toastify";
import {
	PencilIcon,
	PencilAltIcon,
	ArrowLeftIcon,
	TrashIcon,
} from "@heroicons/react/outline";
import DefaultAvatar from "../../../../assets/images/avatar.jpg";
import { Tooltip, TextField } from "@mui/material";
import Spinner from "../../../Spinner/Spinner";

export default function GroupSettings({
	groupId,
	open,
	handleClose,
	groupIcon,
	groupName,
}) {
	const dispatch = useDispatch();
	const ref = useRef();
	const imageEnvPath = process.env.REACT_APP_PUBLIC_FOLDER;

	const { isLoading, activeGroupInfo } = useSelector(
		(state) => state?.conversations
	);
	const { darkMode } = useSelector((state) => state.theme);

	const [showChangeAvatar, setShowChangeAvatar] = useState(false);
	const [imageUpload, setImageUpload] = useState(null);
	const [editGroupName, setEditGroupName] = useState(false);
	function toggleEditGroupName() {
		setEditGroupName((prev) => !prev);
	}
	const [textInput, setTextInput] = useState({
		groupName: groupName,
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

		if (textInput.groupName === groupName) return;

		const sendGroupData = {
			groupName: textInput.groupName,
			groupId: activeGroupInfo.groupId,
		};

		dispatch(updateChatGroupName(sendGroupData));
		setEditGroupName("");
	}

	function uploadAvatarImage(e) {
		e.preventDefault();

		if (imageUpload) {
			const file = new FormData();
			file.append("image", imageUpload);

			const sendData = {
				file,
				groupId,
			};
			console.log(sendData);

			dispatch(updateChatGroupIcon(sendData));
			ref.current.value = "";
			setImageUpload(null);
		}
	}

	const bgStyle = darkMode ? "bg-dark2" : "bg-offwhite";
	const textStyle = darkMode ? "text-white" : "text-gray1";
	const iconStyle = darkMode ? "text-gray-200" : "text-gray-700";
	const titleStyle = darkMode
		? "text-white border-b-[1px] border-gray-500 "
		: "text-gray1 border-b-[1px] border-gray-300";
	const accountInfoStyle = darkMode
		? "text-white border-[1px] border-gray-500 hover:bg-slate-800 bg-menu"
		: "text-gray1 border-[1px] border-gray-300 hover:bg-gray-100 ";
	const formStyle = darkMode
		? "border-[1px] border-gray-500 bg-menu"
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

				<div className="flex justify-center items-end mb-6">
					<div className="relative rounded-full overflow-hidden">
						<label
							htmlFor="image"
							className="relative flex items-center cursor-pointer"
							onMouseEnter={() => {
								setShowChangeAvatar(true);
							}}
							onMouseLeave={() => {
								setShowChangeAvatar(false);
							}}
						>
							<img
								src={
									groupIcon !== ""
										? `${imageEnvPath}${groupIcon}`
										: DefaultAvatar
								}
								className="object-fill w-24 h-w-24"
								alt="Avatar"
							/>
							{showChangeAvatar && (
								<div className="absolute bg-gray-900 w-full h-full bg-opacity-40 z-[100]">
									<div className="z-20 absolute flex flex-col items-center justify-center top-[38%] left-[28%] text-lg text-gray-800">
										<strong className="text-white text-center text-sm uppercase">
											Change
										</strong>
										<strong className="text-white text-center text-sm uppercase">
											Icon
										</strong>
									</div>
								</div>
							)}
						</label>
					</div>

					<div className="justify-end">
						<button onClick={uploadAvatarImage}>Save</button>
					</div>
					<input
						type="file"
						id="image"
						name="image"
						className="hidden"
						ref={ref}
						accept=".png,.jpeg,.jpg,.gif"
						onChange={(e) => setImageUpload(e.target.files[0])}
					/>
				</div>
				<div className="mb-4">
					<strong>Edit Group Name</strong>
				</div>
				{!editGroupName ? (
					<Tooltip arrow describeChild title="Edit Group Name">
						<div
							className={`grid grid-cols-3 items-center py-2 sm:py-[.84rem] px-2 sm:px-4 
										w-full mb-6 cursor-pointer rounded-md ${accountInfoStyle}`}
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
				<div></div>

				<div>
					<div className="mb-4">
						<strong>Group Deletion</strong>
					</div>
					<div className="flex">
						<button
							onClick={() => {
								dispatch(deleteChatGroup(groupId));
								dispatch(clearChatMessages());
								dispatch(hideTextInput());
								dispatch(hideGroupMemberDisplay());
								toast.success(`Group ${groupName} has been deleted`);
							}}
							className="flex items-center w-1/2 justify-center gap-2 h-12 mb-6 text-white
						bg-red-800 hover:bg-red-700 dark:bg-red-800 dark:hover:bg-red-700 rounded-lg shadow-md
					 	active:shadow-lg cursor-pointer transition-all"
						>
							<TrashIcon className="h-6 w-6" />
							<span className="font-semibold">Delete Group</span>
						</button>
					</div>
				</div>

				{isLoading && <Spinner />}

				<div></div>
			</div>
		</Dialog>
	);
}
