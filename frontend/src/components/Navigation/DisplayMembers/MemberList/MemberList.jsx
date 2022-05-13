import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
	removeGroupMembers,
	leaveGroup,
} from "../../../../features/groups/groupSlice";
import { KeyIcon } from "@heroicons/react/solid";
import DefaultAvatar from "../../../../assets/images/avatar.jpg";
import { Tooltip } from "@mui/material";

export default function MemberList({ id, username, userAvatar }) {
	const dispatch = useDispatch();

	const { user } = useSelector((state) => state.auth);
	const { groupOwner } = useSelector(
		(state) => state.conversations.activeGroupInfo
	);
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
				<span className="mr-4">{username}</span>
				{id === groupOwner && (
					<Tooltip arrow describeChild title="Group Owner">
						<KeyIcon className="h-5 w-5 text-sky-500" />
					</Tooltip>
				)}
			</div>
			<div className="flex items-center">
				{user._id === groupOwner && id !== groupOwner && (
					<button
						onClick={() => {
							dispatch(removeGroupMembers(id));
						}}
						className="bg-red-600 p-2 rounded-lg"
					>
						Remove
					</button>
				)}
				{user._id === groupOwner && id !== groupOwner && (
					<button
						onClick={() => {
							dispatch(removeGroupMembers(id));
						}}
						className="bg-red-600 p-2 rounded-lg"
					>
						Leave
					</button>
				)}
			</div>
		</div>
	);
}
