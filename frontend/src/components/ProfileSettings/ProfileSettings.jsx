import { useState, useEffect, useCallback, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
	updateAccountUsername,
	updateAccountEmail,
	updateAccountPassword,
	updateAccountAvatar,
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
	const imageRef = useRef();

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
	const [imageUpload, setImageUpload] = useState(null);

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

	function handledAvatarSubmission(e) {
		e.preventDefault();

		if (imageUpload) {
			const file = new FormData();
			file.append("image", imageUpload);

			dispatch(updateAccountAvatar(file));
			imageRef.current.value = "";
			setImageUpload(null);
		}
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
		<div className="flex justify-center overflow-auto dark:bg-dark2 bg-white w-full h-screen">
			<div className="w-full sm:max-w-6xl px-4 py-3 sm:px-8 sm:py-8 ">
				<div className="dark:text-white text-gray1 mb-6 ">
					<h1
						className="text-gray1 dark:text-white border-b-[1px] border-gray-300 dark:border-gray-500 
						text-xl sm:text-2xl font-semibold pb-4 font-sans"
					>
						Manage Account
					</h1>
				</div>

				<EditAvatar
					user={user}
					iconStyle={iconStyle}
					imageUpload={imageUpload}
					setImageUpload={setImageUpload}
					imageRef={imageRef}
					editUsername={editUsername}
					setEditUsername={setEditUsername}
					resetUsernameForm={resetUsernameForm}
					editEmail={editEmail}
					setEditEmail={setEditEmail}
					resetEmailForm={resetEmailForm}
					editPassword={editPassword}
					setEditPassword={setEditPassword}
					resetPasswordForm={resetPasswordForm}
				/>

				<EditUsername
					user={user}
					formData={formData}
					handleFormData={handleFormData}
					editUsername={editUsername}
					setEditUsername={setEditUsername}
					resetUsernameForm={resetUsernameForm}
					editEmail={editEmail}
					setEditEmail={setEditEmail}
					resetEmailForm={resetEmailForm}
					editPassword={editPassword}
					setEditPassword={setEditPassword}
					resetPasswordForm={resetPasswordForm}
					imageUpload={imageUpload}
					setImageUpload={setImageUpload}
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
					setEditEmail={setEditEmail}
					resetEmailForm={resetEmailForm}
					editPassword={editPassword}
					setEditPassword={setEditPassword}
					resetPasswordForm={resetPasswordForm}
					imageUpload={imageUpload}
					setImageUpload={setImageUpload}
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
					setEditEmail={setEditEmail}
					editPassword={editPassword}
					setEditPassword={setEditPassword}
					resetPasswordForm={resetPasswordForm}
					imageUpload={imageUpload}
					setImageUpload={setImageUpload}
					accountInfoStyle={accountInfoStyle}
					iconStyle={iconStyle}
					formStyle={formStyle}
				/>

				{(editEmail || editPassword || editUsername || imageUpload) && (
					<div className="flex justify-end items-center my-3 md:my-5 gap-4">
						<button
							onClick={() => {
								if (editUsername) {
									resetUsernameForm();
									setEditUsername(false);
								}
								if (editEmail) {
									resetEmailForm();
									setEditEmail(false);
								}
								if (editPassword) {
									resetPasswordForm();
									setEditPassword(false);
								}
								if (imageUpload) {
									setImageUpload(null);
								}
							}}
							className="bg-transparent text-gray1 hover:bg-gray-200 active:bg-gray-300 dark:text-white dark:hover:bg-gray-800 dark:active:bg-gray-900
							  	w-20 px-1 py-[.65rem] text-sm font-bold rounded-sm transition-all"
							aria-label="Cancel"
						>
							Cancel
						</button>
						<button
							onClick={(e) => {
								if (editUsername) {
									handleUsernameSubmission(e);
								}
								if (editEmail) {
									handleEmailSubmission(e);
								}
								if (editPassword) {
									handlePasswordSubmission(e);
								}
								if (imageUpload) {
									handledAvatarSubmission(e);
								}
							}}
							className="dark:bg-sky-800 dark:text-white dark:hover:bg-sky-700 dark:active:bg-sky-600 
								bg-sky-600 text-gray-100 hover:bg-sky-700 active:bg-sky-800
							  	w-20 px-1 py-2 sm:py-[.65rem] text-sm font-bold rounded-sm transition-all"
							aria-label="Save"
						>
							Save
						</button>
					</div>
				)}
			</div>
		</div>
	);
}
