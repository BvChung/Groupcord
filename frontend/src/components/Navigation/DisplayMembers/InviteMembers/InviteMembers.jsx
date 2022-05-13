import React from "react";
import { useDispatch } from "react-redux";
import { addGroupMembers } from "../../../../features/groups/groupSlice";
import DefaultAvatar from "../../../../assets/images/avatar.jpg";

export default function InviteMembers({ id, userAvatar, username }) {
	const dispatch = useDispatch();
	const imageEnvPath = process.env.REACT_APP_PUBLIC_FOLDER;

	return (
		<div className="grid grid-cols-2 items-center mb-4 px-4 py-2 border-[1px] rounded-md">
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
					className="p-2 bg-blue4 rounded-lg w-[75%]"
				>
					Invite
				</button>
			</div>
		</div>
	);
}
