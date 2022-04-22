import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { deleteChatMessage } from "../../../features/messages/messageSlice";
import { TrashIcon } from "@heroicons/react/outline";

function ChatItem({
	type,
	messageId,
	userId,
	username,
	message,
	fullDate,
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
	const currentDateFull = timeNow.toLocaleString("en-US", {
		month: "long",
		day: "numeric",
		year: "numeric",
	});

	return (
		<>
			{type !== "renderNewDay" ? (
				<div
					onMouseEnter={toggleShowIcon}
					onMouseLeave={toggleShowIcon}
					className={`flex items-center my-6 first:mt-0 last:mb-0 fade transition-all ${messagePosition}`}
				>
					<div
						className={`rounded-xl w-fit max-w-4xl h-fit p-4 break-words ${messageStyle} `}
					>
						<div className="flex gap-4 mb-1">
							<span className="flex items-center text-gray-900 dark:text-gray-200 font-semibold">
								{username}
							</span>
							{date !== dateCreated && (
								<span className="text-gray-500  dark:text-gray-400">
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
			) : (
				<div className="w-full flex items-center justify-between my-4">
					<span className="w-1/3 sm:w-[40%] xl:w-[45%] border-b-[1px] border-gray-400 dark:border-gray-500 "></span>
					<p className="font-sans text-sm font-semibold text-gray1 dark:text-gray-400">
						{currentDateFull === fullDate ? "Today" : fullDate}
					</p>
					<span className="w-1/3 sm:w-[40%] xl:w-[45%] border-b-[1px] border-gray-400 dark:border-gray-500 "></span>
				</div>
			)}
		</>
	);
}

export default ChatItem;
