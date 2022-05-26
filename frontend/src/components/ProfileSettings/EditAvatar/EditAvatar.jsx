import { useState } from "react";
import DefaultAvatar from "../../../assets/images/avatar.jpg";

export default function EditAvatar({
	user,
	imageUpload,
	setImageUpload,
	imageRef,
	editUsername,
	setEditUsername,
	resetUsernameForm,
	editEmail,
	setEditEmail,
	resetEmailForm,
	editPassword,
	setEditPassword,
	resetPasswordForm,
}) {
	const imageEnvPath = process.env.REACT_APP_PUBLIC_FOLDER;
	const [showChangeAvatar, setShowChangeAvatar] = useState(false);

	return (
		<div className="grid grid-cols-1 sm:grid-cols-3 h-fit mb-8 px-2 sm:px-4">
			<div className="flex items-center w-[150.66px] sm:w-[309.33px] mb-2 sm:mb-0">
				<p className="text-gray-700 dark:text-gray-300 text-xs leading-6 uppercase font-medium">
					Avatar
				</p>
			</div>
			<div className="flex items-center mb-2 sm:mb-0">
				{!imageUpload ? (
					<div className="relative w-fit rounded-full overflow-hidden shadow-xl">
						<label
							htmlFor="image"
							className="relative flex items-center cursor-pointer"
							onMouseEnter={() => {
								setShowChangeAvatar(true);
							}}
							onMouseLeave={() => {
								setShowChangeAvatar(false);
							}}
							onClick={() => {
								if (editUsername) {
									setEditUsername(false);
									resetUsernameForm();
								}
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
							<img
								src={
									user.userAvatar !== ""
										? `${imageEnvPath}${user.userAvatar}`
										: DefaultAvatar
								}
								className="object-fill w-32 h-32"
								alt="Avatar"
							/>
							{showChangeAvatar && (
								<div className="absolute bg-gray-900 w-full h-full bg-opacity-40 z-[100]">
									<div className="z-20 absolute flex flex-col items-center justify-center top-[38%] left-[27%] text-lg text-gray-800">
										<strong className="text-white text-center text-sm uppercase">
											Change
										</strong>
										<strong className="text-white text-center text-sm uppercase">
											Avatar
										</strong>
									</div>
								</div>
							)}
						</label>
					</div>
				) : (
					<div className="relative rounded-full overflow-hidden shadow-xl">
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
								src={URL.createObjectURL(imageUpload)}
								className="object-fill w-32 h-32"
								alt="Avatar"
							/>
							{showChangeAvatar && (
								<div className="absolute bg-gray-900 w-full h-full bg-opacity-40 z-[100]">
									<div className="z-20 absolute flex flex-col items-center justify-center top-[38%] left-[27%] text-lg text-gray-800">
										<strong className="text-white text-center text-sm uppercase">
											Change
										</strong>
										<strong className="text-white text-center text-sm uppercase">
											Avatar
										</strong>
									</div>
								</div>
							)}
						</label>
					</div>
				)}

				<input
					type="file"
					id="image"
					name="image"
					className="hidden"
					ref={imageRef}
					accept=".png,.jpeg,.jpg,.gif"
					onChange={(e) => {
						setImageUpload(e.target.files[0]);
					}}
				/>
			</div>

			<div className="flex flex-col justify-center gap-2  sm:w-auto">
				<label htmlFor="image" className="cursor-pointer w-fit">
					<div
						className="text-white px-4 py-1 sm:px-4 sm:py-2 text-sm font-semibold rounded-sm 
									dark:bg-blue-700 dark:hover:bg-blue-600 dark:active:bg-blue-500
									bg-blue-600 hover:bg-blue-700 active:bg-blue-800
							 transition-all"
					>
						Upload Image
					</div>
				</label>

				<p
					className="text-sm font-medium break-words 
							dark:text-gray-400 text-gray-700"
				>
					Must be JPG, PNG, or GIF and cannot exceed 1MB.
				</p>
			</div>
		</div>
	);
}
