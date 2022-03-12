import React from "react";
import { ChatAltIcon } from "@heroicons/react/outline";
import { UserCircleIcon } from "@heroicons/react/outline";

export default function Sidebar() {
	return (
		<div className="flex gap-5">
			<div
				className="fixed top-0 left-0 h-screen flex 
			flex-col w-16 dark:bg-gray-900 shadow-lg 
			"
			>
				<div className="mt-14">
					<SidebarIcon icon={<UserCircleIcon className="h-8 w-8" />} />
					<SidebarIcon icon={<ChatAltIcon className="h-8 w-8" />} />
				</div>
			</div>
			<div
				className="fixed top-0 left-16 h-screen flex 
			flex-col dark:bg-gray1 shadow-lg w-64"
			>
				<div className="mt-14 flex flex-col ">
					<h1 className="text-white">Chat</h1>
				</div>
			</div>
		</div>
	);
}

const SidebarIcon = ({ icon }) => {
	return (
		<div
			onClick={() => {
				console.log("clicked");
			}}
			className="sidebar-icon"
		>
			{icon}
		</div>
	);
};
