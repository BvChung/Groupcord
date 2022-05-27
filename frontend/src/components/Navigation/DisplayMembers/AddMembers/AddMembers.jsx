import { useDispatch, useSelector } from "react-redux";
import { PlusCircleIcon } from "@heroicons/react/solid";
import { addGroupMembers } from "../../../../features/groups/groupSlice";
import DefaultAvatar from "../../../../assets/images/avatar.jpg";

export default function AddMembers({ id, userAvatar, username }) {
	const dispatch = useDispatch();
	const { darkMode } = useSelector((state) => state.theme);
	const imageEnvPath = process.env.REACT_APP_PUBLIC_FOLDER;

	return (
		<div
			className={`flex items-center justify-between px-2 py-2 sm:px-4 sm:py-3 border-b-2 ${
				darkMode ? "border-dark3 bg-dark5" : "border-offwhite bg-gray-100"
			} last:border-0`}
		>
			<div className="flex items-center">
				<img
					src={
						userAvatar !== "" ? `${imageEnvPath}${userAvatar}` : DefaultAvatar
					}
					className="object-fill w-12 h-12 mr-4 rounded-full"
					alt="Avatar"
					loading="lazy"
				/>
				<span className="max-w-[140px] sm:max-w-[195px] overflow-hidden text-ellipsis">
					{username}
				</span>
			</div>
			<div className="flex justify-center">
				<button
					onClick={() => {
						dispatch(addGroupMembers(id));
					}}
					className={`${
						darkMode
							? "bg-emerald-800 hover:bg-emerald-700 active:bg-emerald-600 text-white"
							: "bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-gray-100"
					}  w-fit px-1 py-2 text-sm font-semibold rounded-full transition-all`}
					aria-label="Add Member"
				>
					<div className="flex items-center justify-center gap-1 px-2">
						<PlusCircleIcon className="h-5 w-5 hidden sm:block" />
						<p className="text-xs sm:text-sm">Add</p>
					</div>
				</button>
			</div>
		</div>
	);
}
