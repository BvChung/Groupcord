import React from "react";
import { ChatIcon } from "@heroicons/react/solid";
import { MenuIcon } from "@heroicons/react/outline";

export default function Sidebar({ toggleMenu }) {
	return (
		<div
			className="fixed flex flex-col lg:hidden gap-5 items-center top-0 left-0 h-screen
				 w-12 dark:bg-gray-900 shadow-xl 
			"
		>
			<button
				onClick={toggleMenu}
				className="dark:text-gray-500 p-1 rounded-md mt-4
				border-[1px] border-transparent active:border-white transition-all "
			>
				<MenuIcon className="h-7 w-7" />
			</button>
			<button
				className="flex items-center justify-center dark:text-blue1 p-1 w-full h-14
				border-[1px] border-transparent hover:bg-g1 hover:bg-opacity-80 active:border-white transition-all "
			>
				<ChatIcon className="h-8 w-8" />
			</button>
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
