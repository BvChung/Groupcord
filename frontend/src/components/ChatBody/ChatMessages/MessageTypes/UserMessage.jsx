import { useSelector, useDispatch } from "react-redux";
import { deleteChatMessage } from "../../../../reducers/messages/messageSlice";
import { TrashIcon } from "@heroicons/react/solid";
import Tooltip from "@mui/material/Tooltip";
import DefaultAvatar from "../../../../assets/images/avatar.jpg";
import { authRole } from "../../../../accessRoles/roles";

export default function ChatItem({
	messageId,
	userId,
	username,
	userAvatar,
	message,
	createdAt,
}) {
	const dispatch = useDispatch();
	const { user } = useSelector((state) => state.auth);
	const adminAccess = user.authenticationRole === authRole["Admin"];

	const currentDate = new Date().toDateString();
	const messageCreationDate = new Date(createdAt).toDateString();
	const usersTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
	const displayTimeCreated = new Date(createdAt).toLocaleString("en-US", {
		timeZone: usersTimeZone,
		hour: "numeric",
		minute: "numeric",
	});
	const displayDateCreated = new Date(createdAt).toLocaleString("en-US", {
		timeZone: usersTimeZone,
		day: "numeric",
		month: "numeric",
	});

	const messagePosition = userId === user._id ? "justify-end" : "";
	const messageStyle =
		userId === user._id
			? "bg-sky-200 dark:bg-sky-900 "
			: "bg-gray-200 dark:bg-gray-700 ";
	return (
		<div
			className={`flex items-center my-7 first:mt-0 last:mb-0 fade transition-all ${messagePosition}`}
		>
			{userId !== user._id && (
				<img
					src={userAvatar !== "" ? userAvatar : DefaultAvatar}
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
						{messageCreationDate !== currentDate && (
							<span className="text-gray-600 text-sm leading-6  dark:text-gray-300">
								{displayDateCreated}
							</span>
						)}
						{messageCreationDate === currentDate && (
							<span className="text-gray-600 text-sm leading-6 dark:text-gray-300">
								{displayTimeCreated}
							</span>
						)}
					</div>
					{(userId === user._id || adminAccess) && (
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
					src={userAvatar !== "" ? userAvatar : DefaultAvatar}
					className="object-fill w-12 h-12 sm:w-14 sm:h-14 ml-3 sm:ml-4 rounded-full"
					alt="Avatar"
					loading="lazy"
				/>
			)}
		</div>
	);
}
