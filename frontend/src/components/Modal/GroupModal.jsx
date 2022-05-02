import { useState, useContext } from "react";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import { useSelector, useDispatch } from "react-redux";
import { createChatGroups } from "../../features/groups/groupSlice";
import { toast } from "react-toastify";
import { MenuContext } from "../../appContext/menuContext";

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
		? "bg-sky-700 text-white hover:bg-sky-800 active:bg-sky-900"
		: "bg-sky-600 text-white hover:bg-sky-500 active:bg-sky-400";
	const createButtonInactive = darkMode
		? "bg-menu text-gray-700"
		: "bg-white text-gray-300";
	const buttonStyle = darkMode
		? "bg-menu text-white hover:bg-gray-700 active:bg-gray-800"
		: "bg-white text-gray1 hover:bg-gray-200 active:bg-gray-400";

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
					className={`md:w-full py-6 px-8 ${
						darkMode ? "bg-menu" : "bg-offwhite"
					} `}
				>
					<h1
						className={` ${
							darkMode
								? "text-white border-b-[1px]  border-gray-500 "
								: "text-gray1 border-b-[1px]  border-gray-300"
						} text-2xl font-semibold pb-2 font-sans `}
					>
						Create Group
					</h1>

					<div className="mt-4">
						<TextField
							name="groupName"
							value={formData.groupName}
							onChange={handleFormData}
							margin="dense"
							id="groupName"
							label="Group name"
							type="text"
							fullWidth
							variant="outlined"
						/>
					</div>
					<div className="flex justify-end items-center mt-4 gap-2 ">
						<button
							aria-label="Exit group creation"
							onClick={() => {
								toggleGroupModal();
								resetFormData();
							}}
							className={`transition-colors ${buttonStyle}   
							p-2 text-sm w-20 font-bold rounded-md`}
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
							}  w-20 p-2 text-sm font-bold rounded-md`}
						>
							Create
						</button>
					</div>
				</div>
			</Dialog>
		</>
	);
}
