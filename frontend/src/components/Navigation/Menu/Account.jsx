import { useState, useEffect, useCallback } from "react";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import { useSelector, useDispatch } from "react-redux";
import {
	updateUser,
	resetState,
} from "../../../features/authentication/authSlice";
import { toast } from "react-toastify";

export default function FormDialog({ open, handleClose }) {
	const dispatch = useDispatch();

	const { user } = useSelector((state) => state.auth);
	const { darkMode } = useSelector((state) => state.theme);
	const { updateError, message, isSuccess } = useSelector(
		(state) => state.auth
	);
	const [formData, setFormData] = useState({
		username: user.username,
		email: user.email,
		currentPassword: "",
		newPassword: "",
		confirmNewPassword: "",
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

		if (user.username === "GuestAccount") {
			return toast.error(`Guest account information cannot be changed`);
		}
		if (formData.currentPassword !== "" && formData.newPassword === "") {
			return toast.info("Please enter new password");
		}
		if (formData.currentPassword === "" && formData.newPassword !== "") {
			return toast.info("Please enter current password");
		}
		if (
			formData.currentPassword === formData.newPassword &&
			formData.currentPassword !== "" &&
			formData.newPassword !== ""
		) {
			return toast.warn("Passwords are matching");
		}
		if (
			formData.confirmNewPassword !== formData.newPassword &&
			formData.currentPassword !== "" &&
			formData.newPassword !== ""
		) {
			return toast.warn("Passwords do not match");
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
				fullWidth={true}
				maxWidth="md"
				onClose={() => {
					handleClose();
					resetFormData();
				}}
			>
				<div
					className={`w-fit py-6 px-8 ${darkMode ? "bg-menu" : "bg-offwhite"} `}
				>
					<div
						className={`${darkMode ? "text-white" : "text-gray1"}  mb-4 p-2 `}
					>
						<h1
							className={` ${
								darkMode
									? "text-white border-b-[1px]  border-gray-500 "
									: "text-gray1 border-b-[1px]  border-gray-300"
							} text-2xl font-semibold pb-2 font-sans `}
						>
							{user.name}'s Account Information
						</h1>
					</div>

					<div className=" grid sm:grid-cols-2 sm:gap-6">
						<div>
							<TextField
								name="username"
								value={formData.username}
								onChange={handleFormData}
								margin="normal"
								id="username"
								label="Username"
								type="text"
								fullWidth
								variant="outlined"
							/>
							<TextField
								name="email"
								value={formData.email}
								onChange={handleFormData}
								margin="normal"
								id="email"
								label="Email"
								type="text"
								fullWidth
								variant="outlined"
							/>
						</div>

						<div>
							<TextField
								name="currentPassword"
								value={formData.currentPassword}
								onChange={handleFormData}
								margin="normal"
								id="currentPassword"
								label="Current Password"
								type="text"
								fullWidth
								variant="outlined"
							/>
							<TextField
								name="newPassword"
								value={formData.newPassword}
								onChange={handleFormData}
								margin="normal"
								id="newPassword"
								label="New Password"
								type="text"
								fullWidth
								variant="outlined"
							/>
							<TextField
								name="confirmNewPassword"
								value={formData.confirmNewPassword}
								onChange={handleFormData}
								margin="dense"
								id="confirmNewPassword"
								label="Confirm New Password"
								type="text"
								fullWidth
								variant="outlined"
							/>
						</div>
					</div>
					<div className="md:col-start-2 flex justify-end items-center mt-4 md:mt-5 gap-2">
						<button
							onClick={() => {
								handleClose();
								resetFormData();
							}}
							className={`transition-colors ${
								darkMode
									? "bg-menu text-white hover:bg-gray-800"
									: "bg-white text-gray1 hover:bg-gray-200 "
							}   
								p-2 text-sm w-20 font-bold rounded-md`}
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
							}  w-20 p-2 text-sm font-bold rounded-md`}
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
	/* <DialogTitle className="text-center">
					{user.name}'s information
				</DialogTitle> 
	/* <DialogContent>
					<DialogContentText>Change personal information</DialogContentText>
					<TextField
						name="username"
						value={formData.username}
						onChange={handleFormData}
						
						margin="dense"
						id="username"
						label="Username"
						type="text"
						fullWidth
						variant="outlined"
					/>
					<TextField
						name="email"
						value={formData.email}
						onChange={handleFormData}
						
						margin="dense"
						id="email"
						label="Email"
						type="text"
						fullWidth
						variant="outlined"
					/>
					<TextField
						name="currentPassword"
						value={formData.currentPassword}
						onChange={handleFormData}
						
						margin="dense"
						id="currentPassword"
						label="Current Password"
						type="text"
						fullWidth
						variant="outlined"
					/>
					<TextField
						name="newPassword"
						value={formData.newPassword}
						onChange={handleFormData}
						
						margin="dense"
						id="newPassword"
						label="New Password"
						type="text"
						fullWidth
						variant="outlined"
					/>
					<TextField
						name="confirmNewPassword"
						value={formData.confirmNewPassword}
						onChange={handleFormData}
						
						margin="dense"
						id="confirmNewPassword"
						label="Confirm New Password"
						type="text"
						fullWidth
						variant="outlined"
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
				</DialogActions> */
}
