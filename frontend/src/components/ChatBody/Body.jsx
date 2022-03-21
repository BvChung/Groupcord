import React from "react";
import Contacts from "./ChatContacts/Contacts";
import Chat from "./ChatContent/Chat";

function ChatBody() {
	return (
		<div className="flex flex-grow">
			<Contacts />
			<Chat />
		</div>
	);
}

export default ChatBody;
