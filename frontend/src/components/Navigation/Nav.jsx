import { useState } from "react";
import { SunIcon, MoonIcon, MenuIcon, XIcon } from "@heroicons/react/outline";
import { BsGithub } from "react-icons/bs";
import { useSelector, useDispatch } from "react-redux";
import { changeTheme } from "../../features/theme/themeSlice";
import Account from "./Menu/Account";
import NavMenu from "./Menu/NavMenu";
import GroupMembers from "./Menu/GroupMembers";

function Nav({ activeGroupMenu, toggleGroupMenu }) {
	const dispatch = useDispatch();
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
			className="flex items-center justify-between w-full px-6 py-4 h-14 bg-offwhite
		border-b-[1px] border-b-gray-300 border-transparent shadow-md dark:border-dark5 dark:bg-dark1"
		>
			<div>
				{activeGroupMenu ? (
					<button
						onClick={toggleGroupMenu}
						className="text-gray2 dark:text-gray-400 p-1 rounded-md lg:hidden
				border-[1px] border-transparent active:border-white transition-all "
					>
						<XIcon className="h-7 w-7" />
					</button>
				) : (
					<button
						onClick={toggleGroupMenu}
						className="text-gray2 dark:text-gray-400 p-1 rounded-md lg:hidden
				border-[1px] border-transparent active:border-white transition-all "
					>
						<MenuIcon className="h-7 w-7" />
					</button>
				)}
			</div>
			<div>
				<ul className="flex flex-row justify-center items-center gap-6">
					<GroupMembers />
					<NavMenu handleClickOpen={handleClickOpen} />
					<Account open={open} handleClose={handleClose} />

					<li>
						{darkMode ? (
							<MoonIcon
								onClick={toggleTheme}
								className="text-sky-500 cursor-pointer w-7 h-7"
							/>
						) : (
							<SunIcon
								onClick={toggleTheme}
								className="text-sky-500 cursor-pointer w-7 h-7"
							/>
						)}
					</li>
					<li>
						<a
							href="https://github.com/BvChung/react-chat-app"
							target="_blank"
							rel="noopener noreferrer"
						>
							<BsGithub
								className="w-7 h-7 cursor-pointer text-gray-900 hover:text-gray-700
							dark:text-white dark:hover:text-gray-300"
							/>
						</a>
					</li>
				</ul>
			</div>
		</nav>
	);
}

export default Nav;
