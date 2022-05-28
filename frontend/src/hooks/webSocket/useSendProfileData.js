import { useEffect, useCallback, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
	socketDataUpdateMessageUsername,
	socketDataUpdateMessageAvatar,
} from "../../reducers/messages/messageSlice";
import { socketDataUpdateMembersPersonalInfo } from "../../reducers/groups/groupSlice";
import { SocketContext } from "../../appContext/socketContext";

export function useSendProfileData() {
	const socket = useContext(SocketContext);
	const dispatch = useDispatch();

	const { updatedAvatarToSocket, updatedUsernameToSocket } = useSelector(
		(state) => state.auth
	);

	const dispatchChangeUsernameSocketData = useCallback(
		(data) => {
			dispatch(socketDataUpdateMessageUsername(data));
			dispatch(socketDataUpdateMembersPersonalInfo(data));
		},
		[dispatch]
	);
	const dispatchChangeAvatarSocketData = useCallback(
		(data) => {
			dispatch(socketDataUpdateMessageAvatar(data));
			dispatch(socketDataUpdateMembersPersonalInfo(data));
		},
		[dispatch]
	);

	useEffect(() => {
		socket.emit("send_message_username_updated", updatedUsernameToSocket);
		socket.on("receive_message_username_updated", (messageData) => {
			dispatchChangeUsernameSocketData(messageData);
		});

		return () => {
			socket.off("receive_message_username_updated");
		};
	}, [socket, updatedUsernameToSocket, dispatchChangeUsernameSocketData]);

	useEffect(() => {
		socket.emit("send_message_avatar_updated", updatedAvatarToSocket);
		socket.on("receive_message_avatar_updated", (messageData) => {
			dispatchChangeAvatarSocketData(messageData);
		});

		return () => {
			socket.off("receive_message_avatar_updated");
		};
	}, [socket, updatedAvatarToSocket, dispatchChangeAvatarSocketData]);
}
