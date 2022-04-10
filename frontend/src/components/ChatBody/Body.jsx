import { useEffect, useState, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
	createChatMessage,
	getChatMessage,
	updateChatMessage,
} from "../../features/messages/messageSlice";
import Contacts from "./ChatContacts/Contacts";
import Chat from "./ChatContent/Chat";
import { SocketContext, socket } from "../../appContext/socketContext";

function ChatBody() {
	const [openMenu, setOpenMenu] = useState(true);

	function toggleMenu() {
		setOpenMenu((prev) => !prev);
	}

	return (
		<SocketContext.Provider value={socket}>
			<div className="flex flex-grow">
				{openMenu && <Contacts />}
				<Chat toggleMenu={toggleMenu} />
			</div>
		</SocketContext.Provider>
	);
}

export default ChatBody;
