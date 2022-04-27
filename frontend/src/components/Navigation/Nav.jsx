import { useState, useContext } from "react";
import { MoonIcon, MenuIcon, XIcon } from "@heroicons/react/outline";
import { SunIcon } from "@heroicons/react/solid";
import { BsGithub } from "react-icons/bs";
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
							<BsGithub
								className="w-7 h-7 text-gray-700 hover:text-gray-500 dark:text-gray-200 hover:dark:text-gray-400
								transition-all"
							/>
						</a>
					</li>
				</ul>
			</div>
		</nav>
	);
}

export default Nav;
