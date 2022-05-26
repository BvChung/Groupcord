import { useEffect, useCallback, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
	socketDataAddMessage,
	socketDataRemoveDeletedMessage,
} from "../../features/messages/messageSlice";
import { SocketContext } from "../../appContext/socketContext";

export function useSendMessageData() {
	const socket = useContext(SocketContext);
	const dispatch = useDispatch();

	const { newMessageToSocket, deletedMessageToSocket } = useSelector(
		(state) => state.messages
	);

	const dispatchNewMessageSocketData = useCallback(
		(data) => {
			dispatch(socketDataAddMessage(data));
		},
		[dispatch]
	);
	const dispatchDeleteMessageSocketData = useCallback(
		(data) => {
			dispatch(socketDataRemoveDeletedMessage(data));
		},
		[dispatch]
	);

	useEffect(() => {
		socket.emit("send_message", newMessageToSocket);
		socket.on("receive_message", (messageData) => {
			dispatchNewMessageSocketData(messageData);
		});

		return () => {
			socket.off("receive_message");
		};
	}, [socket, newMessageToSocket, dispatchNewMessageSocketData]);

	useEffect(() => {
		socket.emit("send_deleted_message", deletedMessageToSocket);
		socket.on("receive_deleted_message", (messageData) => {
			dispatchDeleteMessageSocketData(messageData);
		});

		return () => {
			socket.off("receive_deleted_message");
		};
	}, [socket, deletedMessageToSocket, dispatchDeleteMessageSocketData]);
}
