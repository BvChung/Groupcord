import { useState, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useSendGroupData } from "../../../hooks/webSocket/useSendGroupData";
import { useSendMemberData } from "../../../hooks/webSocket/useSendMemberData";
import { ChatAlt2Icon } from "@heroicons/react/outline";
import { SearchIcon, GlobeIcon } from "@heroicons/react/solid";
import GroupItem from "./GroupItem/GroupItem";
import { updateActiveGroup } from "../../../features/groups/groupSlice";
import CreateGroupModal from "./CreateGroup/CreateGroupModal";
import { MenuContext } from "../../../appContext/menuContext";
import Spinner from "../../Spinner/Spinner";

export default function Groups() {
	const dispatch = useDispatch();
	const { activeGroupMenu } = useContext(MenuContext);
	const { groups, loadInitialGroups, isLoading } = useSelector(
		(state) => state.conversations
	);
	const { groupId } = useSelector(
		(state) => state.conversations.activeGroupInfo
	);
	const [searchText, setSearchText] = useState("");
	const [activeGroupModal, setActiveGroupModal] = useState(false);

	const showGroupsStyle = activeGroupMenu
		? "lg:flex lg:flex-col left-0 "
		: "-left-full lg:left-0";
	const globalActive =
		groupId === "Global"
			? "bg-sky-100 dark:bg-slate-800 border-l-sky-500 border-l-[3px] dark:border-l-sky-500"
			: "border-l-[3px] border-l-gray4 dark:border-l-gray-600 hover:border-l-gray-400 dark:hover:border-l-gray-400";

	// Websocket data transmission -------------------------------
	useSendGroupData();
	useSendMemberData();

	return (
		<div
			className={`${showGroupsStyle} absolute height lg:static transition-all z-[50] border-r-[1px] 
				border-r-gray-300 dark:border-r-dark6 w-full sm:max-w-[400px] bg-white sm:shadow-xl lg:shadow-md dark:bg-dark3`}
		>
			<div className="flex items-center justify-between mb-4 mx-4 px-2 py-4 pb-4 h-16 border-b-[1px] border-b-gray-300 dark:border-b-dark6 ">
				<p className="text-gray1 text-2xl font-bold dark:text-white">
					Group Messages
				</p>
			</div>

			<div className="flex flex-col items-center justify-center mx-6 mb-6">
				<button
					className="flex items-center w-full justify-center gap-2 h-12 mb-6 
						bg-sky-600 hover:bg-sky-700 active:bg-sky-800 dark:bg-sky-800 dark:hover:bg-sky-700 dark:active:bg-sky-600 rounded-md shadow-md
					 	active:shadow-lg cursor-pointer transition-all"
					onClick={() => {
						setActiveGroupModal(true);
					}}
				>
					<ChatAlt2Icon className="w-6 h-6 text-white" />
					<span className="font-medium text-gray-100">Create New Group</span>
				</button>

				<div
					className="flex items-center justify-center border-[1px] border-gray-300 dark:border-gray-600 dark:bg-gray-800 
								bg-offwhite focus-within:border-sky-500 dark:focus-within:border-sky-700 w-full p-[6px] rounded-full shadow-sm"
				>
					<input
						name="searchText"
						value={searchText}
						type="text"
						placeholder="Search for group chat"
						onChange={(e) => setSearchText(e.target.value)}
						className="text-gray1 dark:text-white outline-none bg-transparent w-11/12 px-2 placeholder:text-gray-500 dark:placeholder:text-gray-600"
					></input>
					<SearchIcon className="w-7 h-7 text-white bg-sky-600 dark:bg-sky-700 rounded-full p-1" />
				</div>
			</div>

			<CreateGroupModal
				activeGroupModal={activeGroupModal}
				setActiveGroupModal={setActiveGroupModal}
			/>

			<div className="mx-6 h-auto py-4 px-5 bg-offwhite dark:bg-dark5 rounded-md shadow-md">
				{!isLoading ? (
					<div
						className="h-auto max-height bg-transparent py-1 pr-1
						rounded-lg overflow-y-auto"
					>
						<div
							onClick={() => {
								dispatch(
									updateActiveGroup({
										groupId: "Global",
										groupName: "",
										groupOwner: "",
										members: [],
									})
								);
							}}
							className={`flex items-center w-full h-16 px-3 gap-4 cursor-pointer
							 ${globalActive}`}
						>
							<div className="rounded-full overflow-hidden">
								<GlobeIcon className="h-12 w-12 text-sky-600 dark:text-sky-700" />
							</div>
							<span className="text-gray1 dark:text-white">Global</span>
						</div>

						{loadInitialGroups &&
							groups
								.filter((group) => {
									return group.groupName
										.toLowerCase()
										.includes(searchText.toLowerCase());
								})
								.map((group) => {
									return (
										<GroupItem
											key={group._id}
											groupId={group._id}
											groupName={group.groupName}
											groupOwner={group.groupOwner}
											members={group.members}
											groupIcon={group.groupIcon}
										/>
									);
								})}
					</div>
				) : (
					<Spinner mt={3} />
				)}
			</div>
		</div>
	);
}
