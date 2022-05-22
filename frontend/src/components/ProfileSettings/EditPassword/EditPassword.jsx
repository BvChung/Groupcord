import { useState } from "react";
import { LockClosedIcon, LockOpenIcon } from "@heroicons/react/solid";
import { Tooltip, TextField, Checkbox, FormControlLabel } from "@mui/material";

export default function EditPassword({
	formData,
	handleFormData,
	resetUsernameForm,
	editUsername,
	setEditUsername,
	editEmail,
	resetEmailForm,
	editPassword,
	setEditEmail,
	toggleEditPassword,
	accountInfoStyle,
	iconStyle,
	formStyle,
}) {
	const [showPassword, setShowPassword] = useState(false);
	function toggleShowPasswords() {
		setShowPassword((prev) => !prev);
	}
	return (
		<>
			{!editPassword ? (
				<Tooltip arrow describeChild title="Edit Password">
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
							<p className="text-base">******</p>
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
					<div className="flex items-center justify-end">
						<LockOpenIcon className={`h-6 w-6 sm:h-7 sm:w-7 ${iconStyle}`} />
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
						<div className="flex items-center">
							<FormControlLabel
								control={<Checkbox onClick={toggleShowPasswords} />}
								label={
									<span className="text-gray1 dark:text-white text-sm font-medium font-sans">
										Show Password
									</span>
								}
							/>
						</div>
					</fieldset>
				</div>
			)}
		</>
	);
}
