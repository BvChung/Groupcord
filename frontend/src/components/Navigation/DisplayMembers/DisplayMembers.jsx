import { useState } from "react";
import Dialog from "@mui/material/Dialog";
import { useSelector, useDispatch } from "react-redux";
import { getRegisteredMembers } from "../../../features/groups/groupSlice";
import MemberList from "./MemberList/MemberList";
import AddMembers from "./AddMembers/AddMembers";
import { SearchIcon } from "@heroicons/react/outline";
import Spinner from "../../Spinner/Spinner";

export default function DisplayMembers({ open, handleClose }) {
	const dispatch = useDispatch();

	const { user } = useSelector((state) => state.auth);
	const { groupOwner, members } = useSelector(
		(state) => state.conversations.activeGroupInfo
	);
	const { membersAvailableToAddToGroup, isLoading } = useSelector(
		(state) => state?.conversations
	);
	const { darkMode } = useSelector((state) => state.theme);
	const [switchMemberDisplay, setSwitchMemberDisplay] = useState(false);
	const [searchText, setSearchText] = useState("");

	const bgStyle = darkMode ? "bg-menu" : "bg-offwhite";
	const textStyle = darkMode ? "text-white" : "text-gray1";
	const iconStyle = darkMode ? "text-gray-200" : "text-gray-700";
	const titleStyle = darkMode
		? "text-white border-b-[1px] border-gray-500 "
		: "text-gray1 border-b-[1px] border-gray-300";
	const accountInfoStyle = darkMode
		? "text-white border-t-[1px] border-b-[1px] border-gray-500 hover:bg-slate-800 "
		: "text-gray1 border-t-[1px] border-b-[1px] border-gray-300 hover:bg-gray-100 ";
	const formStyle = darkMode
		? "border-[1px] border-gray-500 "
		: "border-[1px] border-gray-300 ";
	const returnStyle = darkMode ? "hover:bg-dark4" : "hover:bg-gray-200";

	return (
		<Dialog
			open={open}
			fullWidth={false}
			maxWidth="sm"
			onClose={() => {
				setSwitchMemberDisplay(false);
				setSearchText("");
				handleClose();
			}}
		>
			<div className={`w-[30rem] px-4 py-4 sm:px-8 ${bgStyle} `}>
				<div className={`${textStyle} mb-2 py-2`}>
					<h1 className={`${titleStyle} text-xl font-semibold pb-2 font-sans `}>
						{switchMemberDisplay ? "Add Members" : "Members"}
					</h1>
				</div>
				{user._id === groupOwner && (
					<div className="grid grid-cols-2 justify-center items-center mb-2 gap-8 px-8">
						<button
							onClick={() => {
								if (switchMemberDisplay) setSwitchMemberDisplay(false);
							}}
							className="text-lg font-semibold mb-4 bg-transparent p-2 border-b-[1px] border-gray-300"
						>
							Member List
						</button>
						<button
							onClick={() => {
								if (!switchMemberDisplay) {
									setSwitchMemberDisplay(true);
									dispatch(getRegisteredMembers());
								}
							}}
							className="text-lg font-semibold mb-4 bg-transparent p-2 transition border-b-[1px] border-gray-300"
						>
							Add Members
						</button>
					</div>
				)}

				{switchMemberDisplay && (
					<div
						className="flex items-center justify-center mb-6 border-[1px] border-gray-300 dark:border-gray-600 dark:bg-gray-800 
								bg-white focus-within:border-sky-500 dark:focus-within:border-sky-700 w-full p-[6px] rounded-3xl shadow-sm"
					>
						<input
							name="searchText"
							value={searchText}
							type="text"
							placeholder="Search for members"
							onChange={(e) => setSearchText(e.target.value)}
							className="text-gray1 dark:text-white outline-none bg-transparent w-11/12 px-2 placeholder:text-gray-500 dark:placeholder:text-gray-600"
						></input>
						<SearchIcon className="w-7 h-7 text-white bg-sky-500 dark:bg-sky-700 rounded-full p-1" />
					</div>
				)}

				{isLoading && switchMemberDisplay && <Spinner />}

				<div>
					{!switchMemberDisplay &&
						members.map((member) => {
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
