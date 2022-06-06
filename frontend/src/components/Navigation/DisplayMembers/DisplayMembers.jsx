import { useState } from "react";
import Dialog from "@mui/material/Dialog";
import { useSelector, useDispatch } from "react-redux";
import { getRegisteredMembers } from "../../../reducers/groups/groupSlice";
import MemberList from "./MemberList/MemberList";
import AddMembers from "./AddMembers/AddMembers";
import { SearchIcon, UserAddIcon, UsersIcon } from "@heroicons/react/outline";
import Spinner from "../../Spinner/Spinner";

export default function DisplayMembers({ open, handleClose }) {
	const dispatch = useDispatch();

	const { user } = useSelector((state) => state.auth);
	const { groupOwner, members, groupName } = useSelector(
		(state) => state.conversations.activeGroupInfo
	);
	const { membersAvailableToAddToGroup, isLoading } = useSelector(
		(state) => state?.conversations
	);
	const { darkMode } = useSelector((state) => state.theme);
	const [switchMemberDisplay, setSwitchMemberDisplay] = useState(false);
	const [searchText, setSearchText] = useState("");

	const bgStyle = darkMode ? "bg-dark3" : "bg-offwhite";
	const inputStyle = darkMode
		? "bg-gray-800 border-gray-600 focus-within:border-sky-700"
		: "bg-gray-100 border-gray-300 focus-within:border-sky-500";
	const inputTextStyle = darkMode
		? "text-white placeholder:text-gray-400 "
		: "text-gray1 placeholder:text-gray-500";
	const titleStyle = darkMode
		? "text-white border-b-[1px] border-gray-500 "
		: "text-gray1 border-b-[1px] border-gray-300";

	return (
		<Dialog
			open={open}
			fullWidth={true}
			maxWidth="sm"
			onClose={() => {
				handleClose();
				setSwitchMemberDisplay(false);
				setSearchText("");
			}}
		>
			<div className={`w-full p-4 sm:p-7 ${bgStyle}`}>
				<div
					className={`flex items-center justify-between mb-7 pb-4 ${titleStyle} `}
				>
					<h1 className={`text-xl font-bold break-words`}>
						{switchMemberDisplay ? `Add members to ${groupName}` : "Members"}
					</h1>

					{user._id === groupOwner && (
						<>
							<button
								className={`flex justify-center items-center gap-2 text-white px-2 py-2 sm:px-4 sm:py-2 text-xs font-semibold rounded-full sm:rounded-sm ${
									darkMode
										? "bg-sky-800 hover:bg-sky-700 active:bg-sky-600"
										: "bg-sky-600 hover:bg-sky-700 active:bg-sky-800"
								} transition-all`}
								onClick={() => {
									if (switchMemberDisplay) {
										setSwitchMemberDisplay(false);
										setSearchText("");
									}
									if (!switchMemberDisplay) {
										setSwitchMemberDisplay(true);
										setSearchText("");
										dispatch(getRegisteredMembers());
									}
								}}
								aria-label="Switch member display"
							>
								{switchMemberDisplay ? (
									<UsersIcon className="h-5 w-5" />
								) : (
									<UserAddIcon className="h-5 w-5" />
								)}
								<span className="hidden sm:block">
									{switchMemberDisplay ? `Members` : "Add Members"}
								</span>
							</button>
						</>
					)}
				</div>

				<div className="flex justify-center mb-6">
					<div
						className={`flex items-center justify-center border-[1px] w-full p-[6px] rounded-lg shadow-sm ${inputStyle}`}
					>
						<input
							name="searchText"
							value={searchText}
							type="text"
							placeholder={
								switchMemberDisplay ? "Search for users" : "Search for members"
							}
							onChange={(e) => setSearchText(e.target.value)}
							className={`${inputTextStyle} outline-none bg-transparent w-11/12 pr-2`}
						></input>
						<SearchIcon
							className={`w-7 h-7 text-white rounded-full p-1 ${
								darkMode ? "bg-sky-700" : "bg-sky-600"
							}`}
						/>
					</div>
				</div>

				{isLoading && switchMemberDisplay && <Spinner />}

				<div className="max-h-[20rem] overflow-y-auto">
					{!switchMemberDisplay &&
						members
							.filter((member) => {
								return member.username
									.toLowerCase()
									.includes(searchText.toLowerCase());
							})
							.map((member) => {
								return (
									<MemberList
										key={member._id}
										id={member._id}
										username={member.username}
										userAvatar={member.userAvatar}
										handleClose={handleClose}
									/>
								);
							})}
					{switchMemberDisplay &&
						!isLoading &&
						membersAvailableToAddToGroup
							.filter((member) => {
								return member.username
									.toLowerCase()
									.includes(searchText.toLowerCase());
							})
							.map((member) => {
								return (
									<AddMembers
										key={member._id}
										id={member._id}
										username={member.username}
										userAvatar={member.userAvatar}
									/>
								);
							})}
				</div>
			</div>
		</Dialog>
	);
}
