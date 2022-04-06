import React from "react";
import { useSelector } from "react-redux";

function ChatItem({
	messageId,
	userId,
	username,
	message,
	timeCreated,
	dateCreated,
}) {
	const { user } = useSelector((state) => state.auth);

	const messagePosition = userId === user._id ? "justify-end" : "";
	const messageStyle =
		userId === user._id
			? "bg-sky-200 text-gray-900 rounded-l-lg rounded-tr-lg"
			: "bg-secondary2 dark:bg-secondary3 text-gray-900 rounded-r-lg rounded-tl-lg";

	const timeNow = new Date();

	const date = timeNow.toLocaleString("en-US", {
		day: "numeric",
		month: "numeric",
	});
	// console.log(typeof messageId);

	return (
		<div
			onClick={() => {
				console.log(messageId);
			}}
			className={`flex items-center my-6 first:mt-0 last:mb-0 fade ${messagePosition}`}
		>
			<div
				className={`max-w-[60%] md:max-w-[50%] h-fit p-4 break-words ${messageStyle}`}
			>
				<div className="flex gap-4 ">
					{userId !== user._id && (
						<span className="font-medium text-gray-700">{username}</span>
					)}
					{date !== dateCreated && (
						<span className="text-gray-600">{dateCreated}</span>
					)}
					<span className="text-gray-600">{timeCreated}</span>
				</div>
				<p className="text-gray-900 font-medium">{message}</p>
			</div>
		</div>
	);
}

export default ChatItem;
