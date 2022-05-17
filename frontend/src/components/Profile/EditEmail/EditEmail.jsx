import React from "react";
import {
	ArrowLeftIcon,
	MailIcon,
	MailOpenIcon,
} from "@heroicons/react/outline";
import { Tooltip, TextField } from "@mui/material";

export default function EditEmail({
	user,
	formData,
	handleFormData,
	resetUsernameForm,
	editUsername,
	setEditUsername,
	editEmail,
	toggleEditEmail,
	resetEmailForm,
	editPassword,
	setEditPassword,
	resetPasswordForm,
	accountInfoStyle,
	iconStyle,
	formStyle,
	returnStyle,
}) {
	return (
		<div>
			{!editEmail ? (
				<Tooltip arrow describeChild title="Edit Email">
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
							<p className="text-xs leading-6 uppercase font-medium">Email</p>
						</div>
						<div className="flex basis-64 sm:basis-96">
							<p className="text-sm sm:text-base">{user.email}</p>
						</div>
						<div className="flex justify-end">
							<MailIcon className={`h-6 w-6 sm:h-7 sm:w-7 ${iconStyle}`} />
						</div>
					</div>
				</Tooltip>
			) : (
				<div className={`flex flex-col mb-6 px-4 py-4 sm:px-6 ${formStyle}`}>
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
	);
}
