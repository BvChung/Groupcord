import { useState, useEffect, useCallback, useContext } from "react";
import { Link } from "react-router-dom";
import { LoginIcon, UserIcon } from "@heroicons/react/outline";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { loginUser, resetState } from "../features/authentication/authSlice";
import { SocketContext } from "../appContext/socketContext";

function Login() {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const socket = useContext(SocketContext);

	const { user, loginError, isSuccess, isLoading, message } = useSelector(
		(state) => state.auth
	);

	const [form, setForm] = useState({
		guestAccount: false,
		email: "",
		password: "",
	});

	function handleChange(event) {
		const { name, value } = event.target;
		setForm((prevFormData) => {
			return {
				...prevFormData,
				[name]: value,
			};
		});
	}
	function handleSubmit(e) {
		e.preventDefault();

		const userData = {
			email: form.email,
			password: form.password,
		};

		dispatch(loginUser(userData));
	}

	function loadGuestAccount() {
		setForm(() => {
			return {
				guestAccount: true,
				email: "guest@gmail.com",
				password: "guest",
			};
		});
	}

	const displayError = useCallback(() => {
		if (loginError) {
			toast.error(message);
		}
	}, [message, loginError]);

	const resetAfterLogin = useCallback(() => {
		dispatch(resetState());
	}, [dispatch]);

	useEffect(() => {
		displayError();

		if (isSuccess || user) {
			// If user logins or registers navigate('/') to dashboard
			navigate("/chat");
		}

		// Reset state in store
		return () => {
			resetAfterLogin();
		};
	}, [
		user,
		isSuccess,
		socket,
		navigate,
		resetAfterLogin,
		dispatch,
		displayError,
	]);
	// [user, loginError, isSuccess, message, navigate, dispatch]

	return (
		<div
			className="flex justify-center h-screen w-screen first-letter:text-gray1 
			sm:items-center bg-white dark:bg-dark2"
		>
			<main
				className="h-max w-full mt-14
				sm:w-fit sm:px-4 sm:py-6 sm:border-[1px] border-gray-300 rounded-md 
				dark:border-dark5"
			>
				<div className="flex items-center justify-center gap-2 mb-2 sm:mb-6">
					<LoginIcon className="h-10 w-10 text-sky-600" />
					<p className="text-center font-bold text-xl sm:text-2xl text-gray1 dark:text-gray-100">
						Sign In
					</p>
				</div>
				<form
					className="flex flex-col align-center content-center 
				h-fit w-screen px-8 sm:w-maxLogin"
					onSubmit={handleSubmit}
				>
					<label className="font-semibold text-sm text-gray1 dark:text-gray-100">
						Email
					</label>

					<input
						name="email"
						value={form.email}
						type="email"
						onChange={handleChange}
						required
						className="w-full border-[1px] mb-6 rounded-sm p-1 focus-within:outline-sky-600 text-gray1 dark:text-white
						border-gray-300 bg-offwhite dark:focus-within:outline-sky-700  dark:border-gray-600 dark:bg-gray-800"
					></input>

					<label className="font-semibold text-sm text-gray1 dark:text-gray-100">
						Password
					</label>
					<input
						name="password"
						value={form.password}
						type="password"
						onChange={handleChange}
						required
						className="w-full border-[1px] mb-8 rounded-sm p-1 focus-within:outline-sky-600 text-gray1 dark:text-white
						border-gray-300 bg-offwhite dark:focus-within:outline-sky-700  dark:border-gray-600 dark:bg-gray-800"
					></input>
					<button
						aria-label="Sign In"
						className="transition-all bg-sky-600 hover:bg-sky-500 text-offwhite2 
							w-full self-center p-2 rounded-md mb-4 dark:bg-sky-700 dark:hover:bg-sky-600"
					>
						{isLoading && !form.guestAccount ? (
							<div className="flex items-center justify-center gap-2">
								<svg
									className="animate-spin h-6 w-6 -ml-1 mr-1 text-white"
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
								>
									<circle
										className="opacity-25"
										cx="12"
										cy="12"
										r="10"
										stroke="currentColor"
										strokeWidth="4"
									></circle>
									<path
										className="opacity-75"
										fill="currentColor"
										d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
									></path>
								</svg>
								<span>Signing In</span>
							</div>
						) : (
							<div className="flex items-center justify-center gap-2">
								<span>Sign In</span>
							</div>
						)}
					</button>

					<div className="flex items-center justify-between mb-4">
						<span className="w-1/5 border-b border-gray-500 dark:border-slate-300 lg:w-1/5"></span>
						<span className="text-xs text-center text-gray1  uppercase dark:text-slate-300">
							Login With Guest Account
						</span>
						<span className="w-1/5 border-b border-gray-500 dark:border-gray-400 lg:w-1/5"></span>
					</div>

					<button
						aria-label="Sign in with guest account"
						onClick={loadGuestAccount}
						className="transition-all bg-blue-600 hover:bg-blue-500 text-offwhite2 
							w-full self-center p-2 rounded-md mb-6 dark:bg-blue-700 dark:hover:bg-blue-600"
					>
						{isLoading && form.guestAccount ? (
							<div className="flex items-center justify-center gap-2">
								<svg
									className="animate-spin h-6 w-6 -ml-1 mr-1 text-white"
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
								>
									<circle
										className="opacity-25"
										cx="12"
										cy="12"
										r="10"
										stroke="currentColor"
										strokeWidth="4"
									></circle>
									<path
										className="opacity-75"
										fill="currentColor"
										d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
									></path>
								</svg>
								<span>Signing in as Guest</span>
							</div>
						) : (
							<div className="flex items-center justify-center gap-2">
								<UserIcon className="h-5 w-5" /> <span>Guest Account</span>
							</div>
						)}
					</button>
				</form>
				<div className="text-center">
					<p className="dark:text-slate-300">Don't have an account?</p>
					<p className="font-semibold text-sky-600 hover:text-sky-500">
						<Link to="/register">Register</Link>
					</p>
				</div>
			</main>
		</div>
	);
}

export default Login;
