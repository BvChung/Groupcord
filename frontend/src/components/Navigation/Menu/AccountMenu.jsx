import { useState, useEffect, useCallback, useRef } from "react";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import { useSelector, useDispatch } from "react-redux";
import {
	updateUser,
	resetState,
	updateAccountAvatar,
} from "../../../features/authentication/authSlice";
import {
	PencilAltIcon,
	PencilIcon,
	ArrowLeftIcon,
	MailIcon,
	PlusIcon,
	MailOpenIcon,
	LockClosedIcon,
	LockOpenIcon,
} from "@heroicons/react/outline";
import { PhotographIcon } from "@heroicons/react/solid";
import { toast } from "react-toastify";
import { Tooltip, Checkbox, FormControlLabel } from "@mui/material";
import DefaultAvatar from "../../../assets/images/avatar.jpg";

export default function AccountMenu({ open, handleClose }) {
	const dispatch = useDispatch();
	const ref = useRef();
	const imageEnvPath = process.env.REACT_APP_PUBLIC_FOLDER;

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
	const [imageUpload, setImageUpload] = useState(null);
	const [editUsername, setEditUsername] = useState(false);
	const [editEmail, setEditEmail] = useState(false);
	const [editPassword, setEditPassword] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [showChangeAvatar, setShowChangeAvatar] = useState(false);

	function toggleEditUsername() {
		setEditUsername((prev) => !prev);
	}
	function toggleEditEmail() {
		setEditEmail((prev) => !prev);
	}
	function toggleEditPassword() {
		setEditPassword((prev) => !prev);
	}
	function cancelEditingAccountInfo() {
		setEditUsername(false);
		setEditEmail(false);
		setEditPassword(false);
	}
	function toggleShowPasswords() {
		setShowPassword((prev) => !prev);
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

	function uploadAvatarImage(e) {
		e.preventDefault();

		if (imageUpload) {
			const data = new FormData();
			data.append("image", imageUpload);

			dispatch(updateAccountAvatar(data));
			ref.current.value = "";
			setImageUpload(null);
		}
	}

	const displayError = useCallback(() => {
		if (updateError) {
			if (message === "File too large") {
				toast.error(message + " to upload. Maximum image size is 1 MB.");
			} else {
				toast.error(message);
			}
		}
	}, [message, updateError]);

	const displaySuccess = useCallback(() => {
		if (isSuccess) {
			toast.success("Your account has been updated");
			resetFormData();
		}
	}, [isSuccess, resetFormData]);

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

	const bgStyle = darkMode ? "bg-menu" : "bg-offwhite";
	const textStyle = darkMode ? "text-white" : "text-gray1";
	const iconStyle = darkMode ? "text-gray-200" : "text-gray-700";
	const titleStyle = darkMode
		? "text-white border-b-[1px] border-gray-500 "
		: "text-gray1 border-b-[1px] border-gray-300";
	const accountInfoStyle = darkMode
		? "text-white border-t-[1px] border-b-[1px] border-gray-500 hover:bg-slate-800 "
		: "text-gray1 border-t-[1px] border-b-[1px] border-gray-300 hover:bg-gray-100 ";
	const formStyle = darkMode
		? "border-[1px] border-gray-500 "
		: "border-[1px] border-gray-300 ";
	const returnStyle = darkMode ? "hover:bg-dark4" : "hover:bg-gray-200";

	return (
		<Dialog
			open={open}
			fullWidth={true}
			maxWidth="sm"
			onClose={() => {
				handleClose();
				resetFormData();
				cancelEditingAccountInfo();
			}}
		>
			<div className={`w-full px-4 py-6 sm:py-6 sm:px-8 ${bgStyle} `}>
				<div className={`${textStyle} mb-6 py-2`}>
					<h1 className={`${titleStyle} text-xl font-semibold pb-2 font-sans `}>
						Manage Account
					</h1>
				</div>

				{/* <div className="w-fit">
					<label
						htmlFor="image"
						className="flex items-center gap-2 cursor-pointer bg-slate-600 py-2 px-3 rounded-md"
					>
						<PlusIcon className="h-5 w-5" />
						<span>Choose a image</span>
					</label>
					<input
						type="file"
						id="image"
						name="image"
						className="hidden"
						ref={ref}
						accept=".png,.jpeg,.jpg"
						onChange={(e) => setImageUpload(e.target.files[0])}
					/>
				</div> */}
				<div className="flex items-end">
					<div className="relative rounded-full overflow-hidden">
						<label
							htmlFor="image"
							className="relative flex items-center cursor-pointer"
							onMouseEnter={() => {
								setShowChangeAvatar(true);
							}}
							onMouseLeave={() => {
								setShowChangeAvatar(false);
							}}
						>
							<img
								src={
									user.userAvatar !== ""
										? `${imageEnvPath}${user.userAvatar}`
										: DefaultAvatar
								}
								className="object-fill w-36 h-36"
								alt="Avatar"
							/>
							{showChangeAvatar && (
								<div className="absolute bg-gray-800 w-full h-full bg-opacity-30 z-[100]">
									<p className="z-20 absolute flex items-center justify-center top-[34%]  text-lg text-gray-800">
										<strong className="text-white text-center text-lg uppercase">
											Change Avatar
										</strong>
									</p>
								</div>
							)}
						</label>
					</div>

					<div className="justify-end">
						<button onClick={uploadAvatarImage}>Save</button>
					</div>
					<input
						type="file"
						id="image"
						name="image"
						className="hidden"
						ref={ref}
						accept=".png,.jpeg,.jpg,.gif"
						onChange={(e) => setImageUpload(e.target.files[0])}
					/>
				</div>

				<div className="">
					<div>
						{!editUsername ? (
							<Tooltip
								arrow
								describeChild
								placement="right"
								title="Edit Username"
							>
								<div
									className={`grid grid-cols-3 items-center py-2 sm:py-[.84rem] px-2 sm:px-4 w-full mb-6 cursor-pointer
											${accountInfoStyle}`}
									onClick={() => {
										toggleEditUsername();
										if (editEmail) {
											setEditEmail(false);
											resetEmailForm();
										}
										if (editPassword) {
											setEditPassword(false);
											resetPasswordForm();
										}
									}}
								>
									<div className="flex basis-24 sm:basis-32 items-center">
										<p className="text-xs leading-6 uppercase font-medium">
											Username
										</p>
									</div>
									<div className="flex basis-72 sm:basis-96">
										<p className="text-sm sm:text-base">{user.username}</p>
									</div>
									<div className="flex justify-end">
										<PencilIcon
											className={`h-6 w-6 sm:h-7 sm:w-7 ${iconStyle}`}
										/>
									</div>
								</div>
							</Tooltip>
						) : (
							<div
								className={`flex flex-col mb-6 px-4 py-4 sm:px-6 ${formStyle}`}
							>
								<div className="flex items-center justify-between">
									<Tooltip arrow describeChild title="Click to go back">
										<button
											onClick={() => {
												resetUsernameForm();
												toggleEditUsername();
											}}
										>
											<ArrowLeftIcon
												className={`h-9 w-9 rounded-full p-2 ${returnStyle}`}
											/>
										</button>
									</Tooltip>
									<PencilAltIcon className={`h-6 w-6 ${iconStyle}`} />
								</div>
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
							</div>
						)}

						{!editEmail ? (
							<Tooltip arrow describeChild placement="right" title="Edit Email">
								<div
									className={`grid grid-cols-3 mb-6 items-center px-2 py-2 sm:py-[.81rem] sm:px-4 w-full cursor-pointer
											${accountInfoStyle}`}
									onClick={() => {
										toggleEditEmail();
										if (editUsername) {
											setEditUsername(false);
											resetUsernameForm();
										}
										if (editPassword) {
											setEditPassword(false);
											resetPasswordForm();
										}
									}}
								>
									<div className="flex basis-24 sm:basis-32 items-center">
										<p className="text-xs leading-6 uppercase font-medium">
											Email
										</p>
									</div>
									<div className="flex basis-64 sm:basis-96">
										<p className="text-sm sm:text-base">{user.email}</p>
									</div>
									<div className="flex justify-end">
										<MailIcon
											className={`h-6 w-6 sm:h-7 sm:w-7 ${iconStyle}`}
										/>
									</div>
								</div>
							</Tooltip>
						) : (
							<div
								className={`flex flex-col mb-6 px-4 py-4 sm:px-6 ${formStyle}`}
							>
								<div className="flex items-center justify-between">
									<Tooltip arrow describeChild title="Click to go back">
										<button
											onClick={() => {
												resetEmailForm();
												toggleEditEmail();
											}}
										>
											<ArrowLeftIcon
												className={`h-9 w-9 rounded-full p-2 ${returnStyle}`}
											/>
										</button>
									</Tooltip>
									<MailOpenIcon className={`h-6 w-6 ${iconStyle}`} />
								</div>
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
						)}
					</div>

					<div>
						{!editPassword ? (
							<Tooltip
								arrow
								describeChild
								placement="right"
								title="Edit Password"
							>
								<div
									className={`grid grid-cols-3 items-center px-2 py-2 sm:px-4 sm:py-[.81rem] w-full cursor-pointer
											${accountInfoStyle}`}
									onClick={() => {
										toggleEditPassword();
										if (editUsername) {
											setEditUsername(false);
											resetUsernameForm();
										}
										if (editEmail) {
											setEditEmail(false);
											resetEmailForm();
										}
									}}
								>
									<div className="flex items-center">
										<p className="text-xs leading-6 uppercase font-medium">
											Password
										</p>
									</div>
									<div className="flex basis-96">
										<p className="text-base"></p>
									</div>
									<div className="flex justify-end">
										<LockClosedIcon
											className={`h-6 w-6 sm:h-7 sm:w-7 ${iconStyle}`}
										/>
									</div>
								</div>
							</Tooltip>
						) : (
							<div className={`flex flex-col px-4 py-4 sm:px-6 ${formStyle}`}>
								<div className="flex items-center justify-between">
									<Tooltip arrow describeChild title="Click to go back">
										<button
											onClick={() => {
												resetPasswordForm();
												toggleEditPassword();
											}}
											className=""
										>
											<ArrowLeftIcon
												className={`h-9 w-9 rounded-full p-2 ${returnStyle}`}
											/>
										</button>
									</Tooltip>
									<LockOpenIcon className={`h-6 w-6 ${iconStyle}`} />
								</div>
								<fieldset className="flex-col">
									<TextField
										name="currentPassword"
										value={formData.currentPassword}
										onChange={handleFormData}
										margin="normal"
										id="currentPassword"
										label="Verify Current Password"
										type={showPassword ? "text" : "password"}
										fullWidth
										variant="outlined"
										className="bg-transparent"
									/>
									<TextField
										name="newPassword"
										value={formData.newPassword}
										onChange={handleFormData}
										margin="normal"
										id="newPassword"
										label="New Password"
										type={showPassword ? "text" : "password"}
										fullWidth
										variant="outlined"
									/>
									<TextField
										name="confirmNewPassword"
										value={formData.confirmNewPassword}
										onChange={handleFormData}
										margin="normal"
										id="confirmNewPassword"
										label="Confirm New Password"
										type={showPassword ? "text" : "password"}
										fullWidth
										variant="outlined"
									/>
									<div className="pl-[.1rem] mt-1">
										<FormControlLabel
											control={<Checkbox onClick={toggleShowPasswords} />}
											label="Show password"
										/>
									</div>
								</fieldset>
							</div>
						)}
					</div>
				</div>

				{(editEmail || editPassword || editUsername) && (
					<div className="md:col-start-2 flex justify-end items-center mt-4 md:mt-5 gap-4">
						<button
							onClick={(e) => {
								handleSubmit(e);
							}}
							className={`${
								darkMode
									? "bg-sky-800 text-white hover:bg-sky-900 active:bg-sky-800"
									: "bg-sky-600 text-gray-100 hover:bg-sky-700 active:bg-sky-600"
							}  w-20 px-1 py-[.65rem] text-sm font-bold rounded-md`}
						>
							Save
						</button>
					</div>
				)}
			</div>
		</Dialog>
	);
}
