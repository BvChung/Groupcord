import { useState, useContext } from "react";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import { useSelector, useDispatch } from "react-redux";
import { createChatGroups } from "../../features/groups/groupSlice";
import { toast } from "react-toastify";
import { MenuContext } from "../../appContext/menuContext";
import { UserGroupIcon } from "@heroicons/react/solid";

export default function ContactMenu() {
	const dispatch = useDispatch();
	const { toggleGroupModal, openGroupModal } = useContext(MenuContext);

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
	function handleSubmit(e) {
		e.preventDefault();

		if (formData.groupName === "" || !formData) return;

		dispatch(createChatGroups(formData));
		toast.success(`${formData.groupName} has been created`);
		toggleGroupModal();
	}
	function resetFormData() {
		setFormData((prevData) => {
			return {
				...prevData,
				groupName: "",
			};
		});
	}

	const createButtonActive = darkMode
		? "bg-sky-800 hover:bg-sky-700 active:bg-sky-600"
		: "bg-sky-600 hover:bg-sky-700 active:bg-sky-800";
	const createButtonInactive = darkMode
		? "bg-menu text-gray-700"
		: "bg-white text-gray-300";
	const buttonStyle = darkMode
		? "bg-menu text-white hover:bg-gray-800"
		: "bg-white text-gray1 hover:bg-gray-200";
	const textStyle = darkMode ? "text-white" : "text-gray1";
	const headerStyle = darkMode
		? "border-b-[1px] border-gray-500 "
		: "border-b-[1px] border-gray-300";
	const formStyle = darkMode
		? "border-b-[1px] border-gray-600"
		: "border-b-[1px] border-gray-300";

	return (
		<>
			<Dialog
				open={openGroupModal}
				fullWidth={true}
				maxWidth="sm"
				onClose={() => {
					toggleGroupModal();
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
						<UserGroupIcon className="h-7 w-7 sm:h-8 sm:w-8" />
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
								toggleGroupModal();
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
