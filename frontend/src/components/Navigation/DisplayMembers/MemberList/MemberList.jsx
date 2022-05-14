import { useSelector, useDispatch } from "react-redux";
import {
	removeGroupMembers,
	leaveGroup,
} from "../../../../features/groups/groupSlice";
import {
	hideTextInput,
	clearChatMessages,
} from "../../../../features/messages/messageSlice";
import { KeyIcon, MinusCircleIcon } from "@heroicons/react/solid";
import { LogoutIcon } from "@heroicons/react/outline";
import DefaultAvatar from "../../../../assets/images/avatar.jpg";
import { Tooltip } from "@mui/material";
import Spinner from "../../../Spinner/Spinner";

export default function MemberList({ id, username, userAvatar }) {
	const dispatch = useDispatch();

	const { user } = useSelector((state) => state.auth);
	const { groupOwner, groupId } = useSelector(
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
						className="bg-red-700 dark:bg-red-900 text-white w-fit py-[.5rem] text-sm font-bold rounded-sm"
					>
						<div className="flex items-center justify-center gap-1 px-2">
							<MinusCircleIcon className="h-5 w-5" />
							<p>Remove</p>
						</div>
						{/* <Spinner /> */}
					</button>
				)}
				{user._id === id && user._id !== groupOwner && id !== groupOwner && (
					<button
						onClick={() => {
							dispatch(leaveGroup({ _id: groupId }));
							dispatch(removeGroupMembers(id));
							dispatch(clearChatMessages());
							dispatch(hideTextInput());
						}}
						className="bg-red-600 dark:bg-red-800 text-white w-fit py-[.5rem] text-sm font-bold rounded-sm"
					>
						<div className="flex items-center justify-center gap-1 px-2">
							<LogoutIcon className="h-5 w-5" />
							<p>Leave Group</p>
						</div>
					</button>
				)}
			</div>
		</div>
	);
}
