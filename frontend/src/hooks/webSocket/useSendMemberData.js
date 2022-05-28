import { useEffect, useCallback, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SocketContext } from "../../appContext/socketContext";
import {
	socketDataUpdateMembers,
	socketDataAddGroupForMember,
	socketDataRemoveGroupForMember,
	hideGroupMemberDisplay,
} from "../../reducers/groups/groupSlice";
import {
	clearChatMessages,
	hideTextInput,
} from "../../reducers/messages/messageSlice";

export function useSendMemberData() {
	const dispatch = useDispatch();
	const socket = useContext(SocketContext);
	const { user } = useSelector((state) => state.auth);
	const { addedMemberToSocket, removedMemberToSocket } = useSelector(
		(state) => state.conversations
	);
	const { groupId } = useSelector(
		(state) => state.conversations.activeGroupInfo
	);

	const dispatchAddGroupSocketData = useCallback(
		(data) => {
			dispatch(socketDataAddGroupForMember(data));
		},
		[dispatch]
	);
	const dispatchRemoveGroupSocketData = useCallback(
		(data) => {
			dispatch(socketDataRemoveGroupForMember(data));
		},
		[dispatch]
	);
	const dispatchUpdatedMembersSocketData = useCallback(
		(data) => {
			dispatch(socketDataUpdateMembers(data));
		},
		[dispatch]
	);

	useEffect(() => {
		socket.emit("send_added_group_member", addedMemberToSocket);
		socket.on("receive_added_group_member", (data) => {
			if (data.groupData._id === groupId) {
				// Updates the current active group with members/ users that can be added
				dispatchUpdatedMembersSocketData(data);
			}
			if (data.memberChanged._id === user._id) {
				// Adds group in sidebar for the new member
				dispatchAddGroupSocketData(data);
			}
		});

		return () => {
			socket.off("receive_added_group_member");
		};
	}, [
		socket,
		addedMemberToSocket,
		dispatchUpdatedMembersSocketData,
		dispatchAddGroupSocketData,
		groupId,
		user._id,
	]);

	useEffect(() => {
		socket.emit("send_removed_group_member", removedMemberToSocket);
		socket.on("receive_removed_group_member", (data) => {
			if (
				data.memberChanged._id === user._id &&
				data.groupData._id === groupId
			) {
				// Clears chat + hides text input + member list for removed user if group is currently active
				dispatch(clearChatMessages());
				dispatch(hideTextInput());
				dispatch(hideGroupMemberDisplay());
			}
			if (data.groupData._id === groupId) {
				// Updates the current active group with members/users that can be added
				dispatchUpdatedMembersSocketData(data);
			}
			if (data.memberChanged._id === user._id) {
				// Removes group if group is not active
				dispatchRemoveGroupSocketData(data);
			}
		});

		return () => {
			socket.off("receive_removed_group_member");
		};
	}, [
		socket,
		removedMemberToSocket,
		dispatch,
		dispatchUpdatedMembersSocketData,
		dispatchRemoveGroupSocketData,
		groupId,
		user._id,
	]);
}
