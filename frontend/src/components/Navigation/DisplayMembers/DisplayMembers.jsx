import { useState, useEffect, useCallback, useContext, useRef } from "react";
import Dialog from "@mui/material/Dialog";
import { useSelector, useDispatch } from "react-redux";
import {
	updateUser,
	resetState,
	updateAccountAvatar,
} from "../../../features/authentication/authSlice";
import {
	addGroupMembers,
	removeGroupMembers,
	socketDataUpdateGroups,
	socketDataUpdateMembers,
	leaveGroup,
} from "../../../features/groups/groupSlice";
import { clearChatMessages } from "../../../features/messages/messageSlice";
import { SocketContext } from "../../../appContext/socketContext";
import MemberList from "./MemberList/MemberList";
import InviteMembers from "./InviteMembers/InviteMembers";
import { toast } from "react-toastify";
import DefaultAvatar from "../../../assets/images/avatar.jpg";
import { Tooltip } from "@mui/material";
import { XIcon, CheckIcon, LogoutIcon } from "@heroicons/react/outline";
import { UserIcon, KeyIcon, UserAddIcon } from "@heroicons/react/solid";

export default function DisplayMembers({ open, handleClose }) {
	const dispatch = useDispatch();
	const socket = useContext(SocketContext);

	const { user } = useSelector((state) => state.auth);
	const { groupId, members } = useSelector(
		(state) => state.conversations.activeGroupInfo
	);
	const {
		membersAvailableToAddToGroup,
		memberUpdatedToSocket,
		joinedMemberToSocket,
		removedMemberToSocket,
	} = useSelector((state) => state?.conversations);
	const { darkMode } = useSelector((state) => state.theme);
	const [switchMemberDisplay, setSwitchMemberDisplay] = useState(false);
	function toggleMemberDisplay() {
		setSwitchMemberDisplay((prev) => !prev);
	}

	console.log(joinedMemberToSocket);
	console.log(members);

	// Web socket data transmission

	const dispatchAddGroupMemberSocketData = useCallback(
		(data) => {
			dispatch(data);
		},
		[dispatch]
	);
	const dispatchRemoveGroupMemberSocketData = useCallback(
		(data) => {
			dispatch(data);
		},
		[dispatch]
	);

	const bgStyle = darkMode ? "bg-menu" : "bg-offwhite";
	const textStyle = darkMode ? "text-white" : "text-gray1";
	const iconStyle = darkMode ? "text-gray-200" : "text-gray-700";
	const titleStyle = darkMode
		? "text-white border-b-[1px] border-gray-500 "
		: "text-gray1 border-b-[1px] border-gray-300";
	const accountInfoStyle = darkMode
		? "text-white border-t-[1px] border-b-[1px] border-gray-500 hover:bg-slate-800 "
		: "text-gray1 border-t-[1px] border-b-[1px] border-gray-300 hover:bg-gray-100 ";
	const formStyle = darkMode
		? "border-[1px] border-gray-500 "
		: "border-[1px] border-gray-300 ";
	const returnStyle = darkMode ? "hover:bg-dark4" : "hover:bg-gray-200";

	return (
		<Dialog
			open={open}
			fullWidth={false}
			maxWidth="sm"
			onClose={() => {
				handleClose();
			}}
		>
			<div className={`w-[30rem] px-4 py-6 sm:py-6 sm:px-8 ${bgStyle} `}>
				<div className={`${textStyle} mb-2 py-2`}>
					<h1 className={`${titleStyle} text-xl font-semibold pb-2 font-sans `}>
						{switchMemberDisplay ? "Invite Members" : "Members"}
					</h1>
				</div>
				<button
					onClick={toggleMemberDisplay}
					className="mb-4 bg-sky-600 p-2 rounded-lg"
				>
					{switchMemberDisplay ? "Member List" : "Invite Members"}
				</button>

				<div>
					{!switchMemberDisplay &&
						members.map((member) => {
							return (
								<MemberList
									key={member._id}
									id={member._id}
									username={member.username}
									userAvatar={member.userAvatar}
								/>
							);
						})}
					{switchMemberDisplay &&
						membersAvailableToAddToGroup.map((member) => {
							return (
								<InviteMembers
									key={member._id}
									id={member._id}
									username={member.username}
									userAvatar={member.userAvatar}
								/>
							);
						})}
				</div>
			</div>
		</Dialog>
	);
}
