import { useEffect, useCallback, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SocketContext } from "../../appContext/socketContext";
import {
	socketDataUpdateGroupName,
	socketDataUpdateGroupIcon,
	socketDataDeleteGroup,
	hideGroupMemberDisplay,
} from "../../features/groups/groupSlice";
import {
	clearChatMessages,
	hideTextInput,
} from "../../features/messages/messageSlice";
import { toast } from "react-toastify";

export function useSendGroupData() {
	const dispatch = useDispatch();
	const socket = useContext(SocketContext);
	const {
		groupDeletedToSocket,
		updatedGroupNameToSocket,
		updatedGroupIconToSocket,
	} = useSelector((state) => state.conversations);
	const { groupId } = useSelector(
		(state) => state.conversations.activeGroupInfo
	);

	const dispatchDeletedGroupSocketData = useCallback(
		(data) => {
			dispatch(socketDataDeleteGroup(data));
		},
		[dispatch]
	);
	const dispatchUpdatedGroupNameSocketData = useCallback(
		(data) => {
			dispatch(socketDataUpdateGroupName(data));
		},
		[dispatch]
	);
	const dispatchUpdatedGroupIconSocketData = useCallback(
		(data) => {
			dispatch(socketDataUpdateGroupIcon(data));
		},
		[dispatch]
	);

	useEffect(() => {
		socket.emit("send_group_deleted", groupDeletedToSocket);
		socket.on("receive_group_deleted", (groupData) => {
			dispatchDeletedGroupSocketData(groupData);

			if (groupData._id === groupId) {
				// Clears chat + hides text input + member list with group deletion if group is currently active
				dispatch(clearChatMessages());
				dispatch(hideTextInput());
				dispatch(hideGroupMemberDisplay());
				toast.info(`${groupData.groupName} has been deleted`);
			}
		});

		return () => {
			socket.off("receive_group_deleted");
		};
	}, [
		socket,
		groupDeletedToSocket,
		dispatch,
		groupId,
		dispatchDeletedGroupSocketData,
	]);

	useEffect(() => {
		socket.emit("send_group_name_updated", updatedGroupNameToSocket);
		socket.on("receive_group_name_updated", (groupData) => {
			dispatchUpdatedGroupNameSocketData(groupData);
		});

		return () => {
			socket.off("receive_group_name_updated");
		};
	}, [socket, updatedGroupNameToSocket, dispatchUpdatedGroupNameSocketData]);

	useEffect(() => {
		socket.emit("send_group_icon_updated", updatedGroupIconToSocket);
		socket.on("receive_group_icon_updated", (groupData) => {
			dispatchUpdatedGroupIconSocketData(groupData);
		});

		return () => {
			socket.off("receive_group_icon_updated");
		};
	}, [socket, updatedGroupIconToSocket, dispatchUpdatedGroupIconSocketData]);
}
