import { useCallback } from "react";
import { SunIcon, MoonIcon } from "@heroicons/react/outline";
import { BsGithub } from "react-icons/bs";
import { useSelector, useDispatch } from "react-redux";
import { changeTheme } from "../../features/Theme/themeSlice";

function Utilities() {
	const dispatch = useDispatch();

	const { darkMode } = useSelector((state) => state.theme);

	const toggleTheme = useCallback(() => {
		dispatch(changeTheme());
		console.log("theme render");
	}, [dispatch]);

	return (
		<nav
			className="absolute top-0 right-0 flex items-center w-max px-6 py-4 h-18 
		dark:bg-slate-900"
		>
			<div>
				<ul className="flex flex-row justify-center items-center gap-6">
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

export default Utilities;
