import Spinner from "../../../Spinner/Spinner";
import { useDispatch, useSelector } from "react-redux";
import { PlusCircleIcon } from "@heroicons/react/solid";
import { addGroupMembers } from "../../../../features/groups/groupSlice";
import DefaultAvatar from "../../../../assets/images/avatar.jpg";

export default function AddMembers({ id, userAvatar, username }) {
	const dispatch = useDispatch();
	const imageEnvPath = process.env.REACT_APP_PUBLIC_FOLDER;

	return (
		<div className="flex items-center justify-between mb-4 px-4 py-2 border-[1px] rounded-md">
			<div className="flex items-center">
				<img
					src={
						userAvatar !== "" ? `${imageEnvPath}${userAvatar}` : DefaultAvatar
					}
					className="object-fill w-10 h-10 mr-2 sm:mr-4 rounded-full"
					alt="Avatar"
				/>
				<span className="">{username}</span>
			</div>
			<div className="flex justify-center">
				<button
					onClick={() => {
						dispatch(addGroupMembers(id));
					}}
					className="bg-green-700 text-white w-fit py-[.5rem] text-sm font-bold rounded-sm "
				>
					<div className="flex items-center justify-center gap-1 px-2">
						<PlusCircleIcon className="h-5 w-5" />
						<p>Add</p>
					</div>
				</button>
			</div>
		</div>
	);
}
