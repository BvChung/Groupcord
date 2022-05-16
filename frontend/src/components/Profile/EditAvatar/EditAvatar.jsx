import { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { updateAccountAvatar } from "../../../features/authentication/authSlice";
import DefaultAvatar from "../../../assets/images/avatar.jpg";

export default function EditAvatar({ user }) {
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
		<div className="flex mb-6">
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
				<div className="relative rounded-full overflow-hidden">
					{/* <img
                src={URL.createObjectURL(imageUpload)}
                className="object-fill w-36 h-36"
                alt="Preview"
            ></img> */}
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
			<div className="flex items-center gap-4">
				<div className="">
					<button
						onClick={() => {
							setImageUpload(null);
						}}
					>
						Cancel
					</button>
				</div>
				<div className="">
					<button
						onClick={uploadAvatarImage}
						className="bg-blue-600 text-white px-3 py-1"
					>
						Save
					</button>
				</div>
			</div>
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
	);
}
