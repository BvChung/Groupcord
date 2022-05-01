import { useState, useContext } from "react";
import { MoonIcon, MenuIcon, XIcon } from "@heroicons/react/outline";
import { SunIcon } from "@heroicons/react/solid";
import { useSelector, useDispatch } from "react-redux";
import { changeTheme } from "../../features/theme/themeSlice";
import Account from "./Menu/Account";
import NavMenu from "./Menu/NavMenu";
import GroupMembers from "./Menu/GroupMembers";
import { MenuContext } from "../../appContext/menuContext";
import { Tooltip } from "@mui/material";

function Nav() {
	const dispatch = useDispatch();
	const { activeGroupMenu, toggleGroupMenu } = useContext(MenuContext);
	const { darkMode } = useSelector((state) => state.theme);

	const [open, setOpen] = useState(false);
	const handleClickOpen = () => {
		setOpen(true);
	};
	const handleClose = () => {
		setOpen(false);
	};

	function toggleTheme() {
		dispatch(changeTheme());
	}
	return (
		<nav
			className="flex items-center justify-between w-full px-4 py-2 h-14 bg-offwhite
		border-b-[1px] border-b-gray-300 border-transparent shadow-md dark:border-dark5 dark:bg-dark1"
		>
			<div>
				{activeGroupMenu ? (
					<button
						aria-label="Close Menu"
						onClick={toggleGroupMenu}
						className="text-gray2 dark:text-gray-400 p-[6px] rounded-full lg:hidden
						border-[1px] border-transparent active:border-gray-500 dark:active:border-white 
						hover:bg-gray-200 dark:hover:bg-dark3
						transition-all "
					>
						<XIcon className="h-7 w-7" />
					</button>
				) : (
					<button
						aria-label="Open Menu"
						onClick={toggleGroupMenu}
						className="text-gray2 dark:text-gray-400 p-[6px] rounded-full lg:hidden
						border-[1px] border-transparent active:border-gray-500 dark:active:border-white 
						hover:bg-gray-200 dark:hover:bg-dark3
						transition-all "
					>
						<MenuIcon className="h-7 w-7" />
					</button>
				)}
			</div>
			<div>
				<ul className="flex flex-row justify-center items-center gap-2">
					<li>
						<GroupMembers />
					</li>
					<li>
						<NavMenu handleClickOpen={handleClickOpen} />
						<Account open={open} handleClose={handleClose} />
					</li>
					<Tooltip
						arrow
						describeChild
						title={darkMode ? "Light Mode" : "Dark Mode"}
					>
						<li>
							{darkMode ? (
								<SunIcon
									aria-label="Turn on dark mode"
									onClick={toggleTheme}
									className="h-11 w-11 text-gray-600 hover:text-gray-700 dark:text-gray-300 hover:dark:text-gray-400 p-[6px] rounded-full 
									border-[1px] border-transparent active:border-gray-500 dark:active:border-white 
									hover:bg-gray-200 dark:hover:bg-dark3
									transition-all "
								/>
							) : (
								<MoonIcon
									aria-label="Turn on light mode"
									onClick={toggleTheme}
									className="h-11 w-11 text-gray-600 hover:text-gray-700 dark:text-gray-200 hover:dark:text-gray-400 p-[6px] rounded-full
									border-[1px] border-transparent active:border-gray-500 dark:active:border-white 
									hover:bg-gray-200 dark:hover:bg-dark3
									transition-all "
								/>
							)}
						</li>
					</Tooltip>
					<li className="w-fit p-2">
						<a
							id="Github"
							aria-label="Link to Github Repository"
							href="https://github.com/BvChung/react-chat-app"
							target="_blank"
							rel="noopener noreferrer"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="w-8 h-8 fill-gray-700 hover:fill-gray-500 dark:fill-gray-200 hover:dark:fill-gray-400
								transition-all"
								viewBox="0 0 512 512"
							>
								<title>Logo Github</title>
								<path d="M256 32C132.3 32 32 134.9 32 261.7c0 101.5 64.2 187.5 153.2 217.9a17.56 17.56 0 003.8.4c8.3 0 11.5-6.1 11.5-11.4 0-5.5-.2-19.9-.3-39.1a102.4 102.4 0 01-22.6 2.7c-43.1 0-52.9-33.5-52.9-33.5-10.2-26.5-24.9-33.6-24.9-33.6-19.5-13.7-.1-14.1 1.4-14.1h.1c22.5 2 34.3 23.8 34.3 23.8 11.2 19.6 26.2 25.1 39.6 25.1a63 63 0 0025.6-6c2-14.8 7.8-24.9 14.2-30.7-49.7-5.8-102-25.5-102-113.5 0-25.1 8.7-45.6 23-61.6-2.3-5.8-10-29.2 2.2-60.8a18.64 18.64 0 015-.5c8.1 0 26.4 3.1 56.6 24.1a208.21 208.21 0 01112.2 0c30.2-21 48.5-24.1 56.6-24.1a18.64 18.64 0 015 .5c12.2 31.6 4.5 55 2.2 60.8 14.3 16.1 23 36.6 23 61.6 0 88.2-52.4 107.6-102.3 113.3 8 7.1 15.2 21.1 15.2 42.5 0 30.7-.3 55.5-.3 63 0 5.4 3.1 11.5 11.4 11.5a19.35 19.35 0 004-.4C415.9 449.2 480 363.1 480 261.7 480 134.9 379.7 32 256 32z" />
							</svg>
						</a>
					</li>
				</ul>
			</div>
		</nav>
	);
}

export default Nav;
