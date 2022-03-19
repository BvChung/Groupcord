import React from "react";
import { PlusIcon } from "@heroicons/react/outline";

function Contacts() {
	return (
		<div className="flex flex-col w-64">
			<button className="flex items-center gap-2 max-w-xs">
				<PlusIcon className="w-6 h-6" />
				<span>New Conversation</span>
			</button>
			<div>
				<h1>Chats</h1>
			</div>
			<div>
				<form>
					<input></input>
					<button></button>
				</form>
			</div>
		</div>
	);
}

export default Contacts;
