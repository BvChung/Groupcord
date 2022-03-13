import React from "react";
import { Link } from "react-router-dom";
import { SunIcon, MoonIcon } from "@heroicons/react/outline";

function Navigation({ darkTheme, toggleTheme }) {
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
			</div>
		</header>
	);
}

export default Navigation;
