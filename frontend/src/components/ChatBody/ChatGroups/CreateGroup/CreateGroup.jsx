import { useState } from "react";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import { useSelector, useDispatch } from "react-redux";
import { createChatGroups } from "../../../../reducers/groups/groupSlice";
import { toast } from "react-toastify";
import { UserGroupIcon } from "@heroicons/react/solid";

export default function GroupCreation({
	activeGroupModal,
	setActiveGroupModal,
}) {
	const dispatch = useDispatch();

	const { darkMode } = useSelector((state) => state.theme);
	const [formData, setFormData] = useState({
		groupName: "",
	});
	function handleFormData(e) {
		const { name, value } = e.target;

		setFormData((prevData) => {
			return {
				...prevData,
				[name]: value,
			};
		});
	}
	function resetFormData() {
		setFormData((prevData) => {
			return {
				...prevData,
				groupName: "",
			};
		});
	}

	function handleSubmit(e) {
		e.preventDefault();

		if (formData.groupName === "" || !formData.groupName.replaceAll(" ", ""))
			return;

		dispatch(createChatGroups(formData));
		toast.success(`${formData.groupName} has been created`);
		resetFormData();
		setActiveGroupModal(false);
	}

	const createButtonActive = darkMode
		? "bg-sky-800 text-white hover:bg-sky-700 active:bg-sky-600"
		: "bg-sky-600 text-white hover:bg-sky-700 active:bg-sky-800";
	const createButtonInactive = darkMode
		? "bg-menu text-gray-700"
		: "bg-white text-gray-300";
	const buttonStyle = darkMode
		? "bg-menu text-white hover:bg-gray-800"
		: "bg-white text-gray1 hover:bg-gray-200";
	const textStyle = darkMode ? "text-white" : "text-gray1";
	const iconStyle = darkMode ? "text-gray-200" : "text-gray-700";
	const headerStyle = darkMode
		? "border-b-[1px] border-gray-500 "
		: "border-b-[1px] border-gray-300";
	const formStyle = darkMode
		? "border-b-[1px] border-gray-600"
		: "border-b-[1px] border-gray-300";

	return (
		<>
			<Dialog
				open={activeGroupModal}
				fullWidth={true}
				maxWidth="sm"
				onClose={() => {
					setActiveGroupModal(false);
					resetFormData();
				}}
			>
				<div
					className={`md:w-full p-4 sm:p-7  ${
						darkMode ? "bg-dark3" : "bg-offwhite"
					} `}
				>
					<div
						className={`flex justify-between items-center pb-4 mb-4 ${headerStyle}`}
					>
						<h1 className={`text-xl font-bold font-sans ${textStyle}`}>
							Create Group
						</h1>
						<UserGroupIcon className={`h-7 w-7 sm:h-8 sm:w-8 ${iconStyle}`} />
					</div>

					<div className={`flex mb-4 pb-7 ${formStyle}`}>
						<TextField
							name="groupName"
							value={formData.groupName}
							onChange={handleFormData}
							margin="normal"
							id="groupName"
							label="Group name"
							type="text"
							fullWidth
							variant="outlined"
						/>
					</div>
					<div className="flex justify-end items-center gap-4">
						<button
							aria-label="Exit group creation"
							onClick={() => {
								setActiveGroupModal(false);
								resetFormData();
							}}
							className={`transition-colors ${buttonStyle}   
							px-1 py-2 sm:py-[.65rem] text-sm w-20 font-bold rounded-sm`}
						>
							Cancel
						</button>
						<button
							aria-label="Create group"
							onClick={(e) => {
								handleSubmit(e);
							}}
							className={`${
								formData.groupName !== ""
									? createButtonActive
									: createButtonInactive
							}  w-20 px-1 py-2 sm:py-[.65rem] text-sm font-semibold rounded-sm transition-all`}
						>
							Create
						</button>
					</div>
				</div>
			</Dialog>
		</>
	);
}
