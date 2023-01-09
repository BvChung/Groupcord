import Groups from "./ChatGroups/Groups";
import Chat from "./ChatMessages/ChatMessages";

export default function ChatBody() {
	return (
		<div className="flex flex-grow transition-transform h-full w-full">
			<Groups />
			<Chat />
		</div>
	);
}
