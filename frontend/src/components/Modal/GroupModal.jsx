import { useState, useContext } from "react";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import { useSelector, useDispatch } from "react-redux";
import {
	createChatGroups,
	resetState,
} from "../../features/conversations/conversationSlice";
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

		if (formData.groupName === "") return;

		dispatch(createChatGroups(formData));
		toast.info(`${formData.groupName} has been created`);
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
	return (
		<>
			<Dialog
				open={openGroupModal}
				onClose={() => {
					toggleGroupModal();
					resetFormData();
				}}
			>
				<div
					className={`w-[19rem] sm:w-96 lg:w-[30rem] p-6 ${
						darkMode ? "bg-menu" : "bg-offwhite"
					} `}
				>
					<div
						className={`text-center ${
							darkMode ? "text-white" : "text-gray1"
						} text-xl font-bold pb-2`}
					>
						Create Group
					</div>

					<TextField
						name="groupName"
						value={formData.groupName}
						onChange={handleFormData}
						margin="dense"
						id="groupName"
						label="Group name"
						type="text"
						fullWidth
						variant="standard"
					/>
					<div className="flex justify-end items-center mt-4 gap-2 ">
						<button
							onClick={() => {
								toggleGroupModal();
								resetFormData();
							}}
							className={`transition-colors ${
								darkMode
									? "bg-menu text-white hover:bg-gray-800"
									: "bg-white text-gray1 hover:bg-gray-200 "
							}   
								p-2 text-sm w-16 font-bold rounded-md`}
						>
							Cancel
						</button>
						<button
							onClick={(e) => {
								handleSubmit(e);
							}}
							className={`${
								darkMode
									? "bg-menu text-white hover:bg-gray-800 active:bg-sky-800"
									: "bg-white text-gray1 hover:bg-gray-200 active:bg-sky-400"
							}  w-16 p-2 text-sm font-bold rounded-md`}
						>
							Save
						</button>
					</div>
				</div>
			</Dialog>
		</>
	);
}

{
	/* <Dialog
				openGroupModal={openGroupModal}
				onClose={() => {
					toggleGroupModal();
					resetFormData();
				}}
			>
				<div className="w-96 p-6 bg-gray-900 dark:bg-slate-800">
					<div className="text-center text-xl font-semibold">
						Create Conversation
					</div>

					<TextField
						name="groupName"
						value={formData.groupName}
						onChange={handleFormData}
						margin="dense"
						id="groupName"
						label="Group name"
						type="text"
						fullWidth
						variant="standard"
					/>
					<DialogActions>
						<Button
							onClick={() => {
								toggleGroupModal();
								resetFormData();
							}}
						>
							Cancel
						</Button>
						<Button
							onClick={(e) => {
								handleSubmit(e);
							}}
						>
							Save
						</Button>
					</DialogActions>
				</div>
			</Dialog> */
}
