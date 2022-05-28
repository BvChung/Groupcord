import { useSelector, useDispatch } from "react-redux";
import {
	removeGroupMembers,
	leaveGroup,
	hideGroupMemberDisplay,
} from "../../../../reducers/groups/groupSlice";
import {
	hideTextInput,
	clearChatMessages,
} from "../../../../reducers/messages/messageSlice";
import { KeyIcon, MinusCircleIcon } from "@heroicons/react/solid";
import { LogoutIcon } from "@heroicons/react/outline";
import DefaultAvatar from "../../../../assets/images/avatar.jpg";
import { Tooltip } from "@mui/material";

export default function MemberList({ id, username, userAvatar, handleClose }) {
	const dispatch = useDispatch();

	const { user } = useSelector((state) => state.auth);
	const { darkMode } = useSelector((state) => state.theme);
	const { groupOwner, groupId } = useSelector(
		(state) => state.conversations.activeGroupInfo
	);
	const imageEnvPath = process.env.REACT_APP_PUBLIC_FOLDER;

	return (
		<div
			className={`flex items-center justify-between px-3 py-2 sm:px-6 sm:py-3 border-b-2 ${
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
				{id === groupOwner && (
					<Tooltip arrow describeChild title="Group Owner">
						<KeyIcon className="ml-4 h-5 w-5 text-sky-500" />
					</Tooltip>
				)}
			</div>
			<div className="flex items-center">
				{user._id === groupOwner && id !== groupOwner && (
					<button
						onClick={() => {
							dispatch(removeGroupMembers(id));
						}}
						className={`${
							darkMode
								? "bg-red-800 hover:bg-red-700 active:bg-red-600 text-white"
								: "bg-red-700 hover:bg-red-800 active:bg-red-900 text-gray-100"
						}   text-white w-fit py-[.5rem] text-sm font-bold rounded-full transition-all`}
						aria-label="Remove Member"
					>
						<div className="flex items-center justify-center gap-1 px-2">
							<MinusCircleIcon className="h-5 w-5 hidden sm:block" />
							<p className="text-xs sm:text-sm">Remove</p>
						</div>
					</button>
				)}
				{user._id === id && user._id !== groupOwner && id !== groupOwner && (
					<button
						onClick={() => {
							dispatch(leaveGroup({ _id: groupId }));
							dispatch(removeGroupMembers(id));
							dispatch(clearChatMessages());
							dispatch(hideTextInput());
							dispatch(hideGroupMemberDisplay());
							handleClose();
						}}
						className={`${
							darkMode
								? "bg-red-800 hover:bg-red-700 active:bg-red-600 text-white"
								: "bg-red-700 hover:bg-red-800 active:bg-red-900 text-gray-100"
						}   text-white w-fit py-[.5rem] text-sm font-bold rounded-full transition-all`}
						aria-label="Leave Group"
					>
						<div className="flex items-center justify-center gap-1 px-2">
							<LogoutIcon className="h-5 w-5 hidden sm:block" />
							<p className="text-xs sm:text-sm">Leave Group</p>
						</div>
					</button>
				)}
			</div>
		</div>
	);
}
