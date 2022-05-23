import { useState, useEffect, useCallback, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
	updateAccountUsername,
	updateAccountEmail,
	updateAccountPassword,
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

	function handleUsernameSubmission(e) {
		e.preventDefault();

		if (formData.username === "") return toast.error(`Enter a username.`);

		if (user.username === "GuestAccount") {
			return toast.error(`GuestAccount's information cannot be edited.`);
		}

		dispatch(updateAccountUsername({ username: formData.username }));
	}
	function handleEmailSubmission(e) {
		e.preventDefault();

		if (formData.email === "") return toast.error(`Enter an email address.`);

		if (user.username === "GuestAccount") {
			return toast.error(`GuestAccount's information cannot be edited.`);
		}

		dispatch(updateAccountEmail({ email: formData.email }));
	}
	function handlePasswordSubmission(e) {
		e.preventDefault();

		if (
			formData.currentPassword === "" ||
			formData.currentPassword === "" ||
			formData.confirmNewPassword === ""
		)
			return toast.error(`All forms must be filled out.`);

		if (user.username === "GuestAccount") {
			return toast.error(`GuestAccount's information cannot be edited.`);
		}

		if (formData.confirmNewPassword !== formData.newPassword) {
			return toast.error(
				"New and confirmation password do not match. Try again."
			);
		}

		dispatch(
			updateAccountPassword({
				currentPassword: formData.currentPassword,
				newPassword: formData.newPassword,
			})
		);
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
	// console.log(formData);

	const resetAfterUpdate = useCallback(() => {
		dispatch(resetState());
	}, [dispatch]);

	useEffect(() => {
		displaySuccess();
		displayError();

		// return () => {
		// 	resetAfterUpdate();
		// };
	}, [displaySuccess, displayError, resetAfterUpdate]);

	const iconStyle = "dark:text-gray-200 text-gray-700";
	const accountInfoStyle =
		"text-gray1 dark:text-white border-b-[1px] border-t-[1px] border-gray-300 hover:bg-gray-100 dark:border-gray-500 dark:hover:bg-slate-800 ";
	const formStyle = "border-[1px] border-gray-300 dark:border-gray-500 ";

	return (
		<div className="flex justify-center overflow-auto dark:bg-dark2 bg-white h-screen">
			<div className="w-full relative sm:max-w-4xl px-4 py-4 sm:px-8 sm:py-8 ">
				<div className="dark:text-white text-gray1 mb-6 ">
					<h1
						className="text-gray1 dark:text-white border-b-[1px] border-gray-300 dark:border-gray-500 
						text-2xl sm:text-3xl font-semibold pb-4 font-sans"
					>
						Manage Account
					</h1>
				</div>

				<EditAvatar user={user} iconStyle={iconStyle} />

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
					/>
				</div>

				{(editEmail || editPassword || editUsername) && (
					<div className="flex justify-end items-center mt-4 md:mt-5 gap-4">
						<button
							onClick={() => {
								if (editUsername) {
									resetUsernameForm();
									toggleEditUsername();
								}
								if (editEmail) {
									resetEmailForm();
									toggleEditEmail();
								}
								if (editPassword) {
									resetPasswordForm();
									toggleEditPassword();
								}
							}}
							className="bg-transparent text-gray1 hover:bg-gray-200 dark:text-white dark:hover:bg-gray-800 
							  	w-20 px-1 py-[.65rem] text-sm font-bold rounded-sm transition-all"
						>
							Cancel
						</button>
						<button
							onClick={(e) => {
								// handleSubmit(e);
								if (editUsername) {
									handleUsernameSubmission(e);
								}
								if (editEmail) {
									handleEmailSubmission(e);
								}
								if (editPassword) {
									handlePasswordSubmission(e);
								}
							}}
							className="dark:bg-sky-800 dark:text-white dark:hover:bg-sky-900 dark:active:bg-sky-800 
								bg-sky-600 text-gray-100 hover:bg-sky-700 active:bg-sky-600
							  	w-20 px-1 py-[.65rem] text-sm font-bold rounded-sm transition-all"
						>
							Save
						</button>
					</div>
				)}
			</div>
		</div>
	);
}
