import { useState, useEffect, useCallback } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useSelector, useDispatch } from "react-redux";
import {
	createChatConversations,
	resetState,
} from "../../../features/Conversations/conversationSlice";
import { toast } from "react-toastify";

export default function FormDialog({ open, handleClose }) {
	const dispatch = useDispatch();

	const { user } = useSelector((state) => state.auth);
	const auth = useSelector((state) => state.auth);
	const { updateError, message, isSuccess } = useSelector(
		(state) => state.auth
	);

	// console.log(user);
	// console.log(auth);

	const [formData, setFormData] = useState({
		groupName: "",
		messageReceiver: "",
	});

	// console.log(formData);

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
		console.log(formData);

		dispatch(createChatConversations(formData));
	}

	function resetFormData() {
		setFormData((prevData) => {
			return {
				...prevData,
				groupName: "",
				messageReceiver: "",
			};
		});
	}

	// const displayError = useCallback(() => {
	// 	if (updateError) {
	// 		toast.error(message);
	// 	}
	// }, [message, updateError]);

	// const displaySuccess = useCallback(() => {
	// 	if (isSuccess) {
	// 		toast.success("Your account has been updated");

	// 		resetFormData();
	// 	}
	// }, [isSuccess]);

	// const resetAfterUpdate = useCallback(() => {
	// 	dispatch(resetState());
	// }, [dispatch]);

	// useEffect(() => {
	// 	displaySuccess();
	// 	displayError();

	// 	return () => {
	// 		resetAfterUpdate();
	// 	};
	// }, [displaySuccess, displayError, resetAfterUpdate]);

	return (
		<>
			<Dialog
				open={open}
				onClose={() => {
					handleClose();
					resetFormData();
				}}
			>
				<DialogTitle className="text-center">Create Conversation</DialogTitle>
				<DialogContent>
					<DialogContentText>Change personal information</DialogContentText>
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
					<TextField
						name="messageReceiver"
						value={formData.messageReceiver}
						onChange={handleFormData}
						margin="dense"
						id="messageReceiver"
						label="Receiver Name"
						type="text"
						fullWidth
						variant="standard"
					/>
					{/* <TextField
						name="invitedUser"
						value={formData.invitedUser}
						onChange={handleFormData}
						margin="dense"
						id="invitedUser"
						label="Receiver Name"
						type="text"
						fullWidth
						variant="standard"
					/> */}
				</DialogContent>
				<DialogActions>
					<Button
						onClick={() => {
							handleClose();
							resetFormData();
						}}
					>
						Cancel
					</Button>
					<Button
						onClick={(e) => {
							handleSubmit(e);
							// handleClose();
						}}
					>
						Save
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
}
