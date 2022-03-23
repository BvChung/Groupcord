import React from "react";
import { useSelector } from "react-redux";

function ChatItem({ userId, message }) {
	const { user } = useSelector((state) => state.auth);

	const messagePosition = userId === user._id ? "" : "";
	const messageStyle =
		userId === user._id
			? "bg-sky-200 text-gray-900 rounded-l-md rounded-tr-md"
			: "bg-gray-200 text-gray-900 rounded-r-md rounded-tl-md";

	return (
		<div className={`flex items-center my-6 last:mb-0 ${messagePosition}`}>
			<div className={`max-w-[50%] h-fit p-4 break-words ${messageStyle}`}>
				{message}
			</div>
		</div>
	);
}

export default ChatItem;
