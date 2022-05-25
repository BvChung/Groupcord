import { PencilAltIcon, PencilIcon } from "@heroicons/react/solid";
import { Tooltip, TextField } from "@mui/material";

export default function EditUsername({
	user,
	formData,
	handleFormData,
	editUsername,
	setEditUsername,
	editEmail,
	resetEmailForm,
	editPassword,
	setEditEmail,
	setEditPassword,
	resetPasswordForm,
	imageUpload,
	setImageUpload,
	accountInfoStyle,
	iconStyle,
	formStyle,
}) {
	return (
		<>
			{!editUsername ? (
				<Tooltip arrow describeChild title="Edit Username">
					<div
						className={`grid grid-cols-3 items-center py-2 sm:py-[.84rem] px-2 sm:px-4 w-full mb-8 cursor-pointer
                        ${accountInfoStyle}`}
						onClick={() => {
							setEditUsername(true);
							if (editEmail) {
								setEditEmail(false);
								resetEmailForm();
							}
							if (editPassword) {
								setEditPassword(false);
								resetPasswordForm();
							}
							if (imageUpload) {
								setImageUpload(null);
							}
						}}
					>
						<div className="flex basis-24 sm:basis-32 items-center">
							<p className="text-gray-700 dark:text-gray-300 text-xs leading-6 uppercase font-medium">
								Username
							</p>
						</div>
						<div className="flex basis-72 sm:basis-96">
							<p className="text-sm sm:text-base">{user.username}</p>
						</div>
						<div className="flex justify-end">
							<PencilIcon className={`h-6 w-6 sm:h-7 sm:w-7 ${iconStyle}`} />
						</div>
					</div>
				</Tooltip>
			) : (
				<div className={`flex flex-col mb-6 px-4 py-4 sm:px-6 ${formStyle}`}>
					<div className="flex items-center justify-end">
						<PencilAltIcon className={`h-6 w-6 sm:h-7 sm:w-7 ${iconStyle}`} />
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
		</>
	);
}
