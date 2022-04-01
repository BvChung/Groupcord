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
	updateUser,
	resetState,
} from "../../../features/Authentication/authSlice";
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
		username: user.username,
		email: user.email,
		currentPassword: "",
		newPassword: "",
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

		if (formData.currentPassword !== "" && formData.newPassword === "") {
			return toast.error("Please enter new password");
		}
		if (formData.currentPassword === "" && formData.newPassword !== "") {
			return toast.error("Please enter current password");
		}
		if (
			formData.currentPassword === formData.newPassword &&
			formData.currentPassword !== "" &&
			formData.newPassword !== ""
		) {
			return toast.error("Passwords are matching");
		}

		const sentData = {
			username: formData.username,
			email: formData.email,
			currentPassword:
				formData.currentPassword === "" ? undefined : formData.currentPassword,
			newPassword:
				formData.newPassword === "" ? undefined : formData.newPassword,
		};

		dispatch(updateUser(sentData));
	}

	function resetFormData() {
		setFormData((prevData) => {
			return {
				...prevData,
				currentPassword: "",
				newPassword: "",
			};
		});
	}

	const displayError = useCallback(() => {
		if (updateError) {
			toast.error(message);
		}
	}, [message, updateError]);

	const displaySuccess = useCallback(() => {
		if (isSuccess) {
			toast.success("Your account has been updated");

			resetFormData();
		}
	}, [isSuccess]);

	const resetAfterUpdate = useCallback(() => {
		dispatch(resetState());
	}, [dispatch]);

	useEffect(() => {
		displaySuccess();
		displayError();

		return () => {
			resetAfterUpdate();
		};
	}, [displaySuccess, displayError, resetAfterUpdate]);

	return (
		<>
			<Dialog
				open={open}
				onClose={() => {
					handleClose();
					resetFormData();
				}}
			>
				<DialogTitle className="text-center">
					{user.name}'s information
				</DialogTitle>
				<DialogContent>
					<DialogContentText>Change personal information</DialogContentText>
					<TextField
						name="username"
						value={formData.username}
						onChange={handleFormData}
						// autoFocus
						margin="dense"
						id="username"
						label="Username"
						type="text"
						fullWidth
						variant="standard"
					/>
					<TextField
						name="email"
						value={formData.email}
						onChange={handleFormData}
						// autoFocus
						margin="dense"
						id="email"
						label="Email"
						type="text"
						fullWidth
						variant="standard"
					/>
					<TextField
						name="currentPassword"
						value={formData.currentPassword}
						onChange={handleFormData}
						// autoFocus
						margin="dense"
						id="currentPassword"
						label="Current Password"
						type="text"
						fullWidth
						variant="standard"
					/>
					<TextField
						name="newPassword"
						value={formData.newPassword}
						onChange={handleFormData}
						// autoFocus
						margin="dense"
						id="newPassword"
						label="New Password"
						type="text"
						fullWidth
						variant="standard"
					/>
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
						}}
					>
						Save
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
}
