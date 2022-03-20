import React from "react";
import Contacts from "./ChatContacts/Contacts";
import Chat from "./ChatContent/Chat";

function ChatBody() {
	return (
		<div className="flex flex-grow py-6">
			<Contacts />
			<Chat />
		</div>
	);
}

export default ChatBody;
