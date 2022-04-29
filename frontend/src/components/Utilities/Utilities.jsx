import { useCallback } from "react";
import { SunIcon, MoonIcon } from "@heroicons/react/outline";
import { BsGithub } from "react-icons/bs";
import { useSelector, useDispatch } from "react-redux";
import { changeTheme } from "../../features/theme/themeSlice";
import { Tooltip } from "@mui/material";

function Utilities() {
	const dispatch = useDispatch();
	const { darkMode } = useSelector((state) => state.theme);

	const toggleTheme = useCallback(() => {
		dispatch(changeTheme());
	}, [dispatch]);
	return (
		<nav
			className="absolute top-0 right-0 flex items-center w-max px-4 py-4 h-16 
			bg-white dark:bg-dark2"
		>
			<div>
				<ul className="flex flex-row justify-center items-center gap-4">
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

export default Utilities;
