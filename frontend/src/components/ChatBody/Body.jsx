import { useEffect, useState, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
	createChatMessage,
	getChatMessage,
	updateChatMessage,
} from "../../features/messages/messageSlice";
import ChatGroups from "./ChatContacts/ChatGroups";
import Chat from "./ChatContent/Chat";
import Sidebar from "../Sidebar/Sidebar";

function ChatBody({ activeGroupMenu, toggleGroupMenu }) {
	return (
		<div className="flex flex-grow transition-transform">
			<ChatGroups
				activeGroupMenu={activeGroupMenu}
				toggleGroupMenu={toggleGroupMenu}
			/>
			<Chat />
		</div>
	);
}

export default ChatBody;

// {
// 	createdAt: "2022-04-10T09:58:58.741Z"
// groupName: "test"
// groupOwner: "6233a3e6f4cef1bba5c015c4"
// members: (2) [{…}, {…}]
// membersId: (2) ['6233a3e6f4cef1bba5c015c4', '62466d6c627e80838c408f56']
// updatedAt: "2022-04-11T05:26:15.099Z"
// }
