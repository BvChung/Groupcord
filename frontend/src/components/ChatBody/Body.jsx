import ChatGroups from "./ChatContacts/ChatGroups";
import Chat from "./ChatContent/Chat";

function ChatBody() {
	return (
		<div className="flex flex-grow transition-transform h-full w-full">
			<ChatGroups />
			<Chat />
		</div>
	);
}

export default ChatBody;
