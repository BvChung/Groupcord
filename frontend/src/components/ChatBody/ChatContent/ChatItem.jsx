import React from "react";

function ChatItem({ user, sender }) {
	const messagePosition = user ? "justify-end" : "";
	const messageStyle = user
		? "bg-sky-200 text-gray-900 rounded-l-md rounded-tr-md"
		: "bg-gray-200 text-gray-900 rounded-r-md rounded-tl-md";

	return (
		<div className={`flex items-center mb-8 ${messagePosition}`}>
			<div className={`max-w-[75%] h-fit p-4 ${messageStyle}`}>
				If you're visiting this page, you're likely here because you're
				searching for a random sentence. Sometimes a random word just isn't
				enough, and that is where the random sentence generator comes into play.
			</div>
		</div>
	);
}

export default ChatItem;
