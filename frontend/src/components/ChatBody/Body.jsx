import { useEffect, useState, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
	createChatMessage,
	getChatMessage,
	updateChatMessage,
} from "../../features/Messages/messageSlice";
import Contacts from "./ChatContacts/Contacts";
import Chat from "./ChatContent/Chat";

function ChatBody() {
	const [openMenu, setOpenMenu] = useState(true);

	return (
		<div className="flex flex-grow">
			{openMenu && <Contacts />}
			<Chat />
		</div>
	);
}

export default ChatBody;
