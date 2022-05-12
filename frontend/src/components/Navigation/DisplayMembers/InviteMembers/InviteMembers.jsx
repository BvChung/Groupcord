import React from "react";
import DefaultAvatar from "../../../../assets/images/avatar.jpg";

export default function InviteMembers({ userAvatar, username }) {
	const imageEnvPath = process.env.REACT_APP_PUBLIC_FOLDER;

	return (
		<div className="flex items-center mb-4 px-4 py-2 border-[1px] rounded-md">
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
		</div>
	);
}
