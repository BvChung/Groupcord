import { useCallback } from "react";
import { SunIcon, MoonIcon } from "@heroicons/react/outline";
import { BsGithub } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
	logoutUser,
	resetState,
	resetUser,
} from "../../../features/Authentication/authSlice";
import { changeTheme } from "../../../features/Theme/themeSlice";

function ChatNav() {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const { user } = useSelector((state) => state.auth);
	const { darkMode } = useSelector((state) => state.theme);

	const onLogout = () => {
		dispatch(logoutUser());
		dispatch(resetState());
		dispatch(resetUser());

		changePage();
	};

	const changePage = useCallback(() => {
		navigate("/");
	}, [navigate]);

	function toggleTheme() {
		dispatch(changeTheme());
	}
	return (
		<nav
			className="flex items-center justify-end w-full px-6 py-4 mb-2  h-16 
		border-b-2 border-gray-200 dark:bg-slate-900"
		>
			<div>
				<ul className="flex flex-row justify-center items-center gap-6">
					{user ? (
						<li>
							<button
								onClick={onLogout}
								className="text-sm p-2 rounded-lg bg-slate-700"
							>
								Logout
							</button>
						</li>
					) : (
						""
					)}
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
