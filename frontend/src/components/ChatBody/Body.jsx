import React from "react";
import Contacts from "./ChatContacts/Contacts";
import Chat from "./ChatContent/Chat";

function ChatBody() {
	return (
		<div className="flex-grow px-6 pt-8 bg-slate-200">
			<Contacts />
			<Chat />
		</div>
	);
}

export default ChatBody;
