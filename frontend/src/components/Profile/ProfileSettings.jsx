import { useState, useEffect, useCallback, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
	updateUser,
	resetState,
	resetSuccessNotifications,
} from "../../features/authentication/authSlice";
import { toast } from "react-toastify";
import EditEmail from "./EditEmail/EditEmail";
import EditAvatar from "./EditAvatar/EditAvatar";
import EditUsername from "./EditUsername/EditUsername";
import EditPassword from "./EditPassword/EditPassword";

export default function ProfileSettings() {
	const dispatch = useDispatch();
	const toastId = useRef(null);

	const { user, updateError, message, isSuccess, changedAvatar } = useSelector(
		(state) => state.auth
	);

	const [formData, setFormData] = useState({
		username: user.username,
		email: user.email,
		currentPassword: "",
		newPassword: "",
		confirmNewPassword: "",
	});

	const [editUsername, setEditUsername] = useState(false);
	const [editEmail, setEditEmail] = useState(false);
	const [editPassword, setEditPassword] = useState(false);

	function toggleEditUsername() {
		setEditUsername((prev) => !prev);
	}
	function toggleEditEmail() {
		setEditEmail((prev) => !prev);
	}
	function toggleEditPassword() {
		setEditPassword((prev) => !prev);
	}

	const resetFormData = useCallback(() => {
		setFormData({
			username: user.username,
			email: user.email,
			currentPassword: "",
			newPassword: "",
			confirmNewPassword: "",
		});
	}, [setFormData, user.username, user.email]);

	function resetUsernameForm() {
		setFormData((prevData) => {
			return {
				...prevData,
				username: user.username,
			};
		});
	}
	function resetEmailForm() {
		setFormData((prevData) => {
			return {
				...prevData,
				email: user.email,
			};
		});
	}
	function resetPasswordForm() {
		setFormData((prevData) => {
			return {
				...prevData,
				currentPassword: "",
				newPassword: "",
				confirmNewPassword: "",
			};
		});
	}

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
			return toast.error(`GuestAccount's information cannot be edited.`);
		}
		if (
			user.username === formData.username &&
			user.email === formData.email.toLowerCase() &&
			formData.currentPassword === "" &&
			formData.newPassword === ""
		)
			return;

		if (
			formData.newPassword.slice(0, 1) === " " ||
			formData.newPassword.slice(-1) === " "
		) {
			return toast.error("Password cannot begin or end with a blank space.");
		}

		if (formData.currentPassword === "" && formData.newPassword !== "") {
			return toast.info("Please enter current password.");
		}
		if (formData.currentPassword !== "" && formData.newPassword === "") {
			return toast.info("Please enter new password.");
		}
		if (
			formData.confirmNewPassword !== formData.newPassword &&
			formData.confirmNewPassword !== "" &&
			formData.newPassword !== ""
		) {
			return toast.warn("Confirmed and new passwords do not match, try again.");
		}

		const sentData = {
			username: formData.username,
			email: formData.email.toLowerCase(),
			currentPassword:
				formData.currentPassword === "" ? undefined : formData.currentPassword,
			newPassword:
				formData.newPassword === "" ? undefined : formData.newPassword,
		};

		dispatch(updateUser(sentData));
	}

	const displayError = useCallback(() => {
		if (
			updateError &&
			message === "File too large" &&
			!toast.isActive(toastId.current)
		) {
			toastId.current = toast.error(
				message + " to upload. Maximum image size is 1 MB."
			);
		}
	}, [message, updateError]);

	const displaySuccess = useCallback(() => {
		if (isSuccess) {
			toast.success("Your account has been updated.");
			resetFormData();
		}
		if (changedAvatar) {
			toast.success("Your avatar has been updated.");
			dispatch(resetSuccessNotifications());
		}
	}, [isSuccess, changedAvatar, dispatch, resetFormData]);
	console.log(formData);

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

	const iconStyle = "dark:text-gray-200 text-gray-700";
	const accountInfoStyle =
		"text-gray1 dark:text-white border-b-[1px] border-t-[1px] border-gray-300 hover:bg-gray-100 dark:border-gray-500 dark:hover:bg-slate-800 ";
	const formStyle = "border-[1px] border-gray-300 dark:border-gray-500 ";
	const returnStyle = "hover:bg-gray-200 dark:hover:bg-dark4";

	return (
		<div className="flex justify-center overflow-auto dark:bg-dark2 bg-white h-screen">
			<div className="w-full relative sm:max-w-4xl px-4 py-6 sm:py-6 sm:px-8 ">
				<div className="dark:text-white text-gray1 mb-4 py-2 ">
					<h1
						className="text-gray1 dark:text-white border-b-[1px] border-gray-300 dark:border-gray-500 
						text-3xl text-center font-medium pb-2 font-sans"
					>
						Manage Account
					</h1>
				</div>

				<EditAvatar user={user} />

				<div className="w-full">
					<EditUsername
						user={user}
						formData={formData}
						handleFormData={handleFormData}
						resetUsernameForm={resetUsernameForm}
						editUsername={editUsername}
						toggleEditUsername={toggleEditUsername}
						editEmail={editEmail}
						setEditEmail={setEditEmail}
						resetEmailForm={resetEmailForm}
						editPassword={editPassword}
						setEditPassword={setEditPassword}
						resetPasswordForm={resetPasswordForm}
						accountInfoStyle={accountInfoStyle}
						iconStyle={iconStyle}
						formStyle={formStyle}
						returnStyle={returnStyle}
					/>

					<EditEmail
						user={user}
						formData={formData}
						handleFormData={handleFormData}
						resetUsernameForm={resetUsernameForm}
						editUsername={editUsername}
						setEditUsername={setEditUsername}
						editEmail={editEmail}
						toggleEditEmail={toggleEditEmail}
						resetEmailForm={resetEmailForm}
						editPassword={editPassword}
						setEditPassword={setEditPassword}
						resetPasswordForm={resetPasswordForm}
						accountInfoStyle={accountInfoStyle}
						iconStyle={iconStyle}
						formStyle={formStyle}
						returnStyle={returnStyle}
					/>

					<EditPassword
						formData={formData}
						handleFormData={handleFormData}
						resetUsernameForm={resetUsernameForm}
						editUsername={editUsername}
						setEditUsername={setEditUsername}
						editEmail={editEmail}
						resetEmailForm={resetEmailForm}
						editPassword={editPassword}
						setEditEmail={setEditEmail}
						toggleEditPassword={toggleEditPassword}
						resetPasswordForm={resetPasswordForm}
						accountInfoStyle={accountInfoStyle}
						iconStyle={iconStyle}
						formStyle={formStyle}
						returnStyle={returnStyle}
					/>
				</div>

				{(editEmail || editPassword || editUsername) && (
					<div className="flex justify-end items-center mt-4 md:mt-5 gap-4">
						<button
							onClick={(e) => {
								handleSubmit(e);
							}}
							className="dark:bg-sky-800 dark:text-white dark:hover:bg-sky-900 dark:active:bg-sky-800 
								bg-sky-600 text-gray-100 hover:bg-sky-700 active:bg-sky-600
							  	w-20 px-1 py-[.65rem] text-sm font-bold rounded-md transition-all"
						>
							Cancel
						</button>
						<button
							onClick={(e) => {
								handleSubmit(e);
							}}
							className="dark:bg-sky-800 dark:text-white dark:hover:bg-sky-900 dark:active:bg-sky-800 
								bg-sky-600 text-gray-100 hover:bg-sky-700 active:bg-sky-600
							  	w-20 px-1 py-[.65rem] text-sm font-bold rounded-md transition-all"
						>
							Save
						</button>
					</div>
				)}
			</div>
		</div>
	);
}
