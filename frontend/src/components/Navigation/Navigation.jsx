import { useEffect, useCallback } from "react";
import { SunIcon, MoonIcon } from "@heroicons/react/outline";
import { BsGithub } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout, reset } from "../../features/Authentication/authSlice";

// import { changeTheme } from "../../features/Theme/theme";

function Navigation({ darkTheme, toggleTheme }) {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const { user } = useSelector((state) => state.auth);
	// console.log(user, isLoading, isError, isSuccess, message);

	const onLogout = () => {
		dispatch(logout());
		dispatch(reset());

		changePage();
	};

	const changePage = useCallback(() => {
		navigate("/");
	}, [navigate]);

	return (
		<header
			className="flex justify-end items-center fixed w-screen px-6 py-4 h-30 
		dark:bg-slate-900"
		>
			<div>
				<ul className="flex flex-row justify-center items-center gap-6">
					{user ? (
						<li>
							<button
								onClick={onLogout}
								className="p-2 rounded-xl bg-slate-700"
							>
								Logout
							</button>
						</li>
					) : (
						""
					)}
					<li>
						{darkTheme ? (
							<MoonIcon
								onClick={toggleTheme}
								className="text-sky-500 cursor-pointer w-8 h-8"
							/>
						) : (
							<SunIcon
								onClick={toggleTheme}
								className="text-sky-500 cursor-pointer w-8 h-8"
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
								className="w-8 h-8 cursor-pointer text-gray-900 hover:text-gray-700
							dark:text-white dark:hover:text-gray-300"
							/>
						</a>
					</li>
				</ul>
			</div>
		</header>
	);
}

export default Navigation;
