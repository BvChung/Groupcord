import { useSelector, useDispatch } from "react-redux";
import { deleteChatMessage } from "../../../../features/messages/messageSlice";
import { TrashIcon } from "@heroicons/react/solid";
import Tooltip from "@mui/material/Tooltip";
import DefaultAvatar from "../../../../assets/images/avatar.jpg";

export default function ChatItem({
	type,
	messageId,
	userId,
	username,
	userAvatar,
	message,
	fullDate,
	timeCreated,
	dateCreated,
}) {
	const dispatch = useDispatch();
	const { user } = useSelector((state) => state.auth);
	const imageEnvPath = process.env.REACT_APP_PUBLIC_FOLDER;

	const messagePosition = userId === user._id ? "justify-end" : "";
	const messageStyle =
		userId === user._id
			? "bg-sky-200 dark:bg-sky-900 "
			: "bg-gray-200 dark:bg-gray-700 ";

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
			{/* Render Message or render new date label if type present */}
			{type !== "newDateLabel" ? (
				<div
					className={`flex items-center my-7 first:mt-0 last:mb-0 fade transition-all ${messagePosition}`}
				>
					{userId !== user._id && (
						<img
							src={
								userAvatar !== ""
									? `${imageEnvPath}${userAvatar}`
									: DefaultAvatar
							}
							className="object-fill w-12 h-12 sm:w-14 sm:h-14 mr-3 sm:mr-4 rounded-full"
							alt="Avatar"
							loading="lazy"
						/>
					)}
					<div
						className={`rounded-lg w-fit max-w-4xl h-fit p-3 sm:p-4 break-words ${messageStyle} `}
					>
						<div className="flex items-center justify-between gap-4 mb-[6px]">
							<div className="flex items-center gap-4">
								<span className="flex items-center text-gray-900 dark:text-gray-100 font-semibold">
									{username}
								</span>
								{date !== dateCreated && (
									<span className="text-gray-600 text-sm leading-6  dark:text-gray-300">
										{dateCreated}
									</span>
								)}
								{date === dateCreated && (
									<span className="text-gray-600 text-sm leading-6 dark:text-gray-300">
										{timeCreated}
									</span>
								)}
							</div>
							{userId === user._id && (
								<Tooltip arrow describeChild title="Delete Message">
									<button
										onClick={() => {
											dispatch(deleteChatMessage(messageId));
										}}
										className={`transition-all`}
										aria-label="Delete Message"
									>
										<TrashIcon className="h-5 w-5 text-gray-600 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-slate-600" />
									</button>
								</Tooltip>
							)}
						</div>
						<div className="flex items-center justify-between">
							<p className="text-gray1 dark:text-gray-100 ">{message}</p>
						</div>
					</div>
					{userId === user._id && (
						<img
							src={
								userAvatar !== ""
									? `${imageEnvPath}${userAvatar}`
									: DefaultAvatar
							}
							className="object-fill w-14 h-14 ml-3 sm:ml-4 rounded-full"
							alt="Avatar"
							loading="lazy"
						/>
					)}
				</div>
			) : (
				<div className="w-full flex items-center justify-between my-4">
					<span className="w-1/3 sm:w-[40%] xl:w-[43%] border-b-[1px] border-gray-400 dark:border-gray-500 "></span>
					<p className="font-sans text-sm font-semibold text-gray1 dark:text-gray-400">
						{currentDateFull === fullDate ? "Today" : fullDate}
					</p>
					<span className="w-1/3 sm:w-[40%] xl:w-[43%] border-b-[1px] border-gray-400 dark:border-gray-500 "></span>
				</div>
			)}
		</>
	);
}
