import { useState, useCallback, useEffect, useRef } from "react";
import Dialog from "@mui/material/Dialog";
import { useSelector, useDispatch } from "react-redux";
import {
	deleteChatGroup,
	updateChatGroupName,
	updateChatGroupIcon,
	hideGroupMemberDisplay,
	resetErrorState,
	resetSuccessState,
} from "../../../../features/groups/groupSlice";
import {
	clearChatMessages,
	hideTextInput,
} from "../../../../features/messages/messageSlice";
import { toast } from "react-toastify";
import { PencilIcon, TrashIcon } from "@heroicons/react/solid";
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
	const imageRef = useRef();
	const imageEnvPath = process.env.REACT_APP_PUBLIC_FOLDER;

	const { isLoading, isSuccess, isError, errorMessage } = useSelector(
		(state) => state?.conversations
	);
	const { darkMode } = useSelector((state) => state.theme);
	const [showChangeIcon, setShowChangeIcon] = useState(false);
	const [imageUpload, setImageUpload] = useState(null);
	const [editGroupName, setEditGroupName] = useState(false);
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

	function submitGroupName(e) {
		e.preventDefault();

		if (textInput.groupName === groupName) return;

		const sendGroupData = {
			groupName: textInput.groupName,
			groupId: groupId,
		};

		dispatch(updateChatGroupName(sendGroupData));
		setEditGroupName(false);
	}

	function submitGroupIcon(e) {
		e.preventDefault();

		if (imageUpload) {
			const file = new FormData();
			file.append("image", imageUpload);

			const sendData = {
				file,
				groupId,
			};

			dispatch(updateChatGroupIcon(sendData));
			imageRef.current.value = "";
			setImageUpload(null);
		}
	}

	const displaySuccess = useCallback(() => {
		if (isSuccess) {
			toast.success(`${groupName} has been updated.`);
			dispatch(resetSuccessState());
		}
	}, [isSuccess, groupName, dispatch]);

	const displayError = useCallback(() => {
		if (isError) {
			if (errorMessage === "File too large") {
				dispatch(resetErrorState());
				return toast.error(
					errorMessage + " to upload. Maximum image size is 1 MB."
				);
			} else {
				dispatch(resetErrorState());
				return toast.error(errorMessage);
			}
		}
	}, [errorMessage, isError, dispatch]);

	const resetWithUnmount = useCallback(() => {
		dispatch(resetSuccessState());
		dispatch(resetErrorState());
	}, [dispatch]);

	useEffect(() => {
		displaySuccess();
		displayError();

		return () => {
			resetWithUnmount();
		};
	}, [displaySuccess, displayError, resetWithUnmount]);

	const bgStyle = darkMode ? "bg-dark3" : "bg-offwhite";
	const textStyle = darkMode ? "text-white" : "text-gray1";
	const iconStyle = darkMode ? "text-gray-200" : "text-gray-700";
	const borderStyle = darkMode
		? "text-white border-b-[1px] border-gray-500 "
		: "text-gray1 border-b-[1px] border-gray-300";
	const groupNameStyle = darkMode
		? "text-white border-b-[1px] border-gray-500 hover:bg-gray-800 bg-menu"
		: "text-gray1 border-b-[1px] border-gray-300 hover:bg-gray-100 ";

	return (
		<Dialog
			open={open}
			fullWidth={true}
			maxWidth="sm"
			onClose={() => {
				handleClose();
			}}
		>
			<div className={`w-full p-4 sm:p-7 ${bgStyle}`}>
				<div className={`${textStyle} mb-7`}>
					<h2 className={`${borderStyle} text-xl font-bold pb-4 font-sans `}>
						Group Settings
					</h2>
				</div>

				<div className="mb-4">
					<p
						className={`font-semibold ${
							darkMode ? "text-gray-300" : "text-gray-700"
						}`}
					>
						Group Icon
					</p>
				</div>

				<div className={`flex items-center mb-7 pb-6 ${borderStyle}`}>
					{!imageUpload ? (
						<div className="relative w-fit rounded-full overflow-hidden mr-6 shadow-xl">
							<label
								htmlFor="image"
								className="relative flex items-center cursor-pointer"
								onMouseEnter={() => {
									setShowChangeIcon(true);
								}}
								onMouseLeave={() => {
									setShowChangeIcon(false);
								}}
								onClick={() => {
									if (editGroupName) {
										setEditGroupName(false);
									}
								}}
							>
								<img
									src={
										groupIcon !== ""
											? `${imageEnvPath}${groupIcon}`
											: DefaultAvatar
									}
									className="object-fill w-24 h-24"
									alt="Icon"
								/>
								{showChangeIcon && (
									<div className="absolute bg-gray-900 w-full h-full bg-opacity-40 z-[100]">
										<div className="z-20 absolute flex flex-col items-center justify-center top-[38%] left-[23%]  text-gray-800">
											<strong className="text-white text-center text-xs uppercase">
												Change
											</strong>
											<strong className="text-white text-center text-xs uppercase">
												Icon
											</strong>
										</div>
									</div>
								)}
							</label>
						</div>
					) : (
						<div className="relative rounded-full overflow-hidden mr-6">
							<label
								htmlFor="image"
								className="relative flex items-center cursor-pointer "
								onMouseEnter={() => {
									setShowChangeIcon(true);
								}}
								onMouseLeave={() => {
									setShowChangeIcon(false);
								}}
							>
								<img
									src={URL.createObjectURL(imageUpload)}
									className="object-fill w-24 h-24"
									alt="Avatar"
								/>
								{showChangeIcon && (
									<div className="absolute bg-gray-900 w-full h-full bg-opacity-40 z-[100]">
										<div className="z-20 absolute flex flex-col items-center justify-center top-[38%] left-[23%] text-lg text-gray-800">
											<strong className="text-white text-center text-xs uppercase">
												Change
											</strong>
											<strong className="text-white text-center text-xs uppercase">
												Icon
											</strong>
										</div>
									</div>
								)}
							</label>
						</div>
					)}

					<div className="flex flex-col justify-center gap-2 w-[65%] sm:w-auto">
						<label
							htmlFor="image"
							className="cursor-pointer w-fit"
							onClick={() => {
								if (editGroupName) {
									setEditGroupName(false);
								}
							}}
						>
							<div
								className={`text-white px-4 py-1 sm:px-4 sm:py-2 text-sm font-semibold rounded-sm ${
									darkMode
										? "bg-blue-700 hover:bg-blue-600 active:bg-blue-500"
										: "bg-blue-600 hover:bg-blue-700 active:bg-blue-800"
								} transition-all`}
							>
								Upload Image
							</div>
						</label>

						<p
							className={`text-sm font-medium break-words ${
								darkMode ? "text-gray-400" : "text-gray-700"
							} ${textStyle}`}
						>
							Must be JPG, PNG, or GIF and cannot exceed 1MB.
						</p>
					</div>

					<input
						type="file"
						id="image"
						name="image"
						className="hidden"
						ref={imageRef}
						accept=".png,.jpeg,.jpg,.gif"
						onChange={(e) => setImageUpload(e.target.files[0])}
					/>
				</div>

				<div className="mb-4">
					<p
						className={`font-semibold ${
							darkMode ? "text-gray-300" : "text-gray-700"
						}`}
					>
						Group Name
					</p>
				</div>

				{!editGroupName ? (
					<Tooltip arrow describeChild title="Edit Group Name">
						<div
							className={`grid grid-cols-3 items-center py-2 sm:py-4 px-2 sm:px-4 w-full mb-7 cursor-pointer ${groupNameStyle}`}
							onClick={() => {
								setEditGroupName(true);
							}}
						>
							<div className="flex basis-24 sm:basis-32 items-center">
								<p
									className={`${
										darkMode ? "text-gray-300" : "text-gray-700"
									} ${textStyle} text-xs leading-6 uppercase font-medium`}
								>
									Name
								</p>
							</div>
							<div className="flex items-center justify-center basis-72 sm:basis-96 max-w-[24rem]">
								<p className="text-sm sm:text-base overflow-x-auto pb-1">
									{groupName}
								</p>
							</div>
							<div className="flex justify-end">
								<PencilIcon className={`h-6 w-6 sm:h-7 sm:w-7 ${iconStyle}`} />
							</div>
						</div>
					</Tooltip>
				) : (
					<div className={`flex flex-col mb-6 `}>
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
					</div>
				)}

				{(editGroupName || imageUpload) && (
					<div
						className={`flex justify-end items-center mt-4 sm:mt-6 gap-4 mb-7 pb-6 ${borderStyle}`}
					>
						<button
							onClick={() => {
								if (editGroupName) {
									setTextInput({
										groupName: groupName,
									});
									setEditGroupName(false);
								}
								if (imageUpload) {
									setImageUpload(null);
								}
							}}
							aria-label="Cancel"
							className={`bg-transparent  ${
								darkMode
									? "text-white hover:bg-gray-800 active:bg-gray-900"
									: "text-gray1 hover:bg-gray-200 active:bg-gray-300"
							} 
							  	w-20 px-1 py-2 sm:py-[.65rem] text-sm font-semibold rounded-sm transition-all`}
						>
							Cancel
						</button>

						<button
							onClick={(e) => {
								if (editGroupName) {
									submitGroupName(e);
								}
								if (imageUpload) {
									submitGroupIcon(e);
								}
							}}
							aria-label="Save"
							className={`${
								darkMode
									? "bg-sky-800 text-white hover:bg-sky-700 active:bg-sky-600"
									: "bg-sky-600 text-gray-100 hover:bg-sky-700 active:bg-sky-800"
							}  w-20 px-1 py-2 sm:py-[.65rem] text-sm font-semibold rounded-sm transition-all`}
						>
							Save
						</button>
					</div>
				)}

				<button
					onClick={() => {
						dispatch(deleteChatGroup(groupId));
						dispatch(clearChatMessages());
						dispatch(hideTextInput());
						dispatch(hideGroupMemberDisplay());
						toast.success(`Group ${groupName} has been deleted`);
					}}
					aria-label="Delete Group"
					className={`flex items-center w-fit px-3 py-3 sm:px-6 sm:py-3 justify-center gap-2
							${
								darkMode
									? "bg-red-900 hover:bg-red-800 active:bg-red-700 text-white"
									: "bg-red-700 hover:bg-red-800 active:bg-red-900 text-white"
							}
						  rounded-sm shadow-md text-sm active:shadow-lg cursor-pointer transition-all`}
				>
					<TrashIcon className="h-5 w-5" />
					<span className="font-semibold">Delete Group</span>
				</button>

				{isLoading && <Spinner />}
			</div>
		</Dialog>
	);
}
