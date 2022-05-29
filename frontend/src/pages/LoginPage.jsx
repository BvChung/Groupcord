import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { UserIcon, AnnotationIcon } from "@heroicons/react/outline";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
	loginUser,
	resetJWT,
	resetErrorState,
} from "../reducers/authentication/authSlice";
import { Checkbox, FormControlLabel } from "@mui/material";

export default function LoginPage() {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const [form, setForm] = useState({
		guestAccount: false,
		email: "",
		password: "",
	});
	const [showPassword, setShowPassword] = useState(false);
	const { user, isError, isLoading, errorMessage, loggedIn } = useSelector(
		(state) => state.auth
	);

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
			email: form.email.toLowerCase(),
			password: form.password,
		};

		dispatch(loginUser(userData));
	}
	function loadGuestAccount() {
		setForm(() => {
			return {
				guestAccount: true,
				email: process.env.REACT_APP_GUEST_EMAIL,
				password: process.env.REACT_APP_GUEST_PASSWORD,
			};
		});
	}
	function toggleShowPassword() {
		setShowPassword((prev) => !prev);
	}

	const resetAfterLogin = useCallback(() => {
		dispatch(resetErrorState());
	}, [dispatch]);

	useEffect(() => {
		if (loggedIn || user) {
			// Reset JWT when user reopens closed app but w/ an expired refresh token
			// User is logged out => expiredRefreshToken = true => login => expiredRefreshToken = false
			dispatch(resetJWT());

			navigate("/chat");
		}

		return () => {
			resetAfterLogin();
		};
	}, [user, loggedIn, dispatch, navigate, resetAfterLogin]);

	useEffect(() => {
		if (isError) {
			toast.error(errorMessage);
			dispatch(resetErrorState());
		}
	}, [isError, errorMessage, dispatch]);

	return (
		<div
			className="flex justify-center h-screen w-screen first-letter:text-gray1 
			sm:items-center bg-white dark:bg-dark2"
		>
			<section
				className="h-max w-full mt-14 dark:bg-dark3
				sm:w-fit sm:px-4 sm:py-8 sm:border-[1px] border-gray-300 rounded-md 
				dark:border-dark6"
			>
				<div className="flex items-center justify-center gap-2 mb-2 sm:mb-4">
					<AnnotationIcon className="h-10 w-10 text-sky-600" />
					<p className="text-center font-semibold text-xl sm:text-2xl text-gray1 dark:text-gray-100">
						Groupcord
					</p>
				</div>
				<p className="text-center mb-1 font-medium text-xl text-gray1 dark:text-gray-100">
					Sign In
				</p>
				<form
					className="flex flex-col align-center content-center 
				h-fit w-screen px-8 sm:w-[30rem]"
					onSubmit={handleSubmit}
				>
					<div className="mb-2">
						<label className="font-semibold text-sm text-gray1 dark:text-gray-100">
							Email
						</label>

						<input
							name="email"
							value={form.email}
							type="email"
							onChange={handleChange}
							required
							className="w-full border-[1px] mb-4 rounded-sm p-1 focus-within:outline-sky-600 text-gray1 dark:text-white
						border-gray-300 bg-offwhite dark:focus-within:outline-sky-700  dark:border-gray-600 dark:bg-gray-800"
						></input>

						<label className="font-semibold text-sm text-gray1 dark:text-gray-100">
							Password
						</label>
						<input
							name="password"
							value={form.password}
							type={showPassword ? "text" : "password"}
							onChange={handleChange}
							required
							className="w-full border-[1px] rounded-sm p-1 focus-within:outline-sky-600 text-gray1 dark:text-white
						border-gray-300 bg-offwhite dark:focus-within:outline-sky-700  dark:border-gray-600 dark:bg-gray-800"
						></input>

						<div className="flex items-center mt-[2px] text-gray1 dark:text-offwhite">
							<FormControlLabel
								control={<Checkbox onClick={toggleShowPassword} />}
								label={
									<span className="text-gray1 dark:text-white text-sm font-medium font-sans">
										Show Password
									</span>
								}
							/>
						</div>
					</div>
					<button
						aria-label="Sign In"
						className="transition-all text-offwhite2 w-full self-center p-2 rounded-md mb-4 
							bg-sky-500 hover:bg-sky-600 dark:bg-sky-800 dark:hover:bg-sky-700"
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
						<span className="w-1/5 border-b border-gray-400 dark:border-gray-500 lg:w-1/5"></span>
						<span className="text-xs text-center text-gray-600 uppercase dark:text-gray-300">
							<strong>Login With Guest Account</strong>
						</span>
						<span className="w-1/5 border-b border-gray-400 dark:border-gray-500 lg:w-1/5"></span>
					</div>

					<button
						aria-label="Sign in with guest account"
						onClick={loadGuestAccount}
						className="transition-all bg-blue-600 hover:bg-blue-700 text-offwhite2 
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
				<div className="flex justify-center items-center gap-2 px-8">
					<span className="dark:text-slate-300">New to GroupCord?</span>
					<span className="font-semibold text-sky-600 hover:text-sky-500">
						<Link to="/register">Register</Link>
					</span>
				</div>
			</section>
		</div>
	);
}
