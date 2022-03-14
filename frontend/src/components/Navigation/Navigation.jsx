import React from "react";
import { SunIcon, MoonIcon } from "@heroicons/react/outline";
import { BsGithub } from "react-icons/bs";
// import { useSelector } from "react-redux";
// import { useDispatch } from "react-redux";
// import { changeTheme } from "../../features/Theme/theme";

function Navigation({ darkTheme, toggleTheme }) {
	// const { darkMode } = useSelector((state) => state.theme.value);
	// const dispatch = useDispatch();

	return (
		<header
			className="flex justify-between items-center fixed w-screen px-6 py-4 h-16 
		dark:bg-slate-800"
		>
			<div>Navigation</div>
			<div className="">
				{darkTheme ? (
					<MoonIcon
						onClick={toggleTheme}
						className="text-sky-500 cursor-pointer w-10 h-10"
					/>
				) : (
					<SunIcon
						onClick={toggleTheme}
						className="text-sky-500 cursor-pointer w-10 h-10"
					/>
				)}
				<BsGithub className="sidebar-icon" />
			</div>
		</header>
	);
}

export default Navigation;
