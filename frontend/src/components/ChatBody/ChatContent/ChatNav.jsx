import { useState } from "react";
import { SunIcon, MoonIcon, MenuIcon } from "@heroicons/react/outline";
import { BsGithub } from "react-icons/bs";
import { useSelector, useDispatch } from "react-redux";
import { changeTheme } from "../../../features/Theme/themeSlice";
import AccountMenu from "./AccountMenu";
import Menu from "./Menu";
import AddMembers from "./AddMembers";

function ChatNav({ toggleMenu }) {
	const dispatch = useDispatch();
	const { darkMode } = useSelector((state) => state.theme);
	const { groupId } = useSelector((state) => state.conversations.groupInfo);

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
			className="flex items-center justify-end w-full px-6 py-4 h-16 
		border-b-2 dark:border-dark2 dark:bg-dark3"
		>
			<div>
				<ul className="flex flex-row justify-center items-center gap-6">
					<button onClick={toggleMenu}>
						<MenuIcon className="h-8 w-8" />
					</button>
					{groupId !== "Global" && <AddMembers />}
					<Menu handleClickOpen={handleClickOpen} />
					<AccountMenu open={open} handleClose={handleClose} />

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

export default ChatNav;
