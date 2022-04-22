import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { deleteChatMessage } from "../../../features/messages/messageSlice";
import { TrashIcon } from "@heroicons/react/outline";

function ChatItem({
	messageId,
	userId,
	username,
	message,
	timeCreated,
	dateCreated,
}) {
	const [showIcon, setShowIcon] = useState(false);
	function toggleShowIcon() {
		setShowIcon((prev) => !prev);
	}
	const showStyle = showIcon ? "" : "hidden";
	const dispatch = useDispatch();
	const { user } = useSelector((state) => state.auth);

	const messagePosition = userId === user._id ? "justify-end" : "";
	const messageStyle =
		userId === user._id
			? "bg-sky-200 dark:bg-sky-800 "
			: "bg-gray-200 dark:bg-gray-700";

	const timeNow = new Date();

	const date = timeNow.toLocaleString("en-US", {
		day: "numeric",
		month: "numeric",
	});

	return (
		<div
			onMouseEnter={toggleShowIcon}
			onMouseLeave={toggleShowIcon}
			className={`flex items-center my-6 first:mt-0 last:mb-0 fade transition-all ${messagePosition}`}
		>
			<div
				className={`rounded-xl w-fit max-w-4xl h-fit p-4 break-words ${messageStyle} `}
			>
				<div className="flex gap-4 mb-1">
					<span className="text-gray-900 dark:text-gray-300 font-semibold">
						{username}
					</span>
					{date !== dateCreated && (
						<span className="text-gray-500 dark:text-gray-400">
							{dateCreated}
						</span>
					)}
					<span className="text-gray-500 dark:text-gray-400">
						{timeCreated}
					</span>
				</div>
				<div className="flex items-center justify-between">
					<p className="text-gray1 dark:text-gray-200 text-base font-normal">
						{message}
					</p>
					{userId === user._id && (
						<button
							onClick={() => {
								dispatch(deleteChatMessage(messageId));
							}}
							className="transition-all"
						>
							<TrashIcon className={`h-5 w-5 ${showStyle}`} />
						</button>
					)}
				</div>
			</div>
		</div>
	);
}

export default ChatItem;
