import { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { updateAccountAvatar } from "../../../features/authentication/authSlice";
import DefaultAvatar from "../../../assets/images/avatar.jpg";
import { CameraIcon } from "@heroicons/react/solid";

export default function EditAvatar({ user, iconStyle }) {
	const ref = useRef();
	const dispatch = useDispatch();
	const imageEnvPath = process.env.REACT_APP_PUBLIC_FOLDER;
	const [imageUpload, setImageUpload] = useState(null);
	const [showChangeAvatar, setShowChangeAvatar] = useState(false);

	function uploadAvatarImage(e) {
		e.preventDefault();

		if (imageUpload) {
			const file = new FormData();
			file.append("image", imageUpload);

			dispatch(updateAccountAvatar(file));
			ref.current.value = "";
			setImageUpload(null);
		}
	}

	return (
		<div className="flex mb-6 px-2 sm:px-4">
			<div className="flex items-center w-[150.66px] sm:w-[266.66px]">
				<p className="text-xs leading-6 uppercase font-medium text-gray1 dark:text-white">
					Avatar
				</p>
			</div>
			<div className="flex items-center">
				{!imageUpload ? (
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
								<div className="absolute bg-gray-900 w-full h-full bg-opacity-40 z-[100]">
									<div className="z-20 absolute flex flex-col items-center justify-center top-[38%] left-[28%] text-lg text-gray-800">
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
					<div className="relative rounded-full overflow-hidden mr-4 sm:mr-10">
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
								className="object-fill w-36 h-36"
								alt="Avatar"
							/>
							{showChangeAvatar && (
								<div className="absolute bg-gray-900 w-full h-full bg-opacity-40 z-[100]">
									<div className="z-20 absolute flex flex-col items-center justify-center top-[38%] left-[28%] text-lg text-gray-800">
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

				{imageUpload && (
					<div className="flex items-center gap-4">
						<button
							onClick={() => {
								setImageUpload(null);
							}}
							className="bg-transparent text-gray1 hover:bg-gray-200 dark:text-white dark:hover:bg-gray-800 w-16 px-1 py-[.65rem] text-xs font-bold rounded-sm"
						>
							Cancel
						</button>
						<button
							onClick={uploadAvatarImage}
							className="bg-blue-600 dark:bg-blue-700 text-white w-16 px-1 py-[.65rem] text-xs font-bold rounded-sm"
						>
							Save
						</button>
					</div>
				)}

				<input
					type="file"
					id="image"
					name="image"
					className="hidden"
					ref={ref}
					accept=".png,.jpeg,.jpg,.gif"
					onChange={(e) => {
						setImageUpload(e.target.files[0]);
					}}
				/>
			</div>
		</div>
	);
}
