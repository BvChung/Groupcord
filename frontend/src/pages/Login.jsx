import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { LoginIcon, UserIcon } from "@heroicons/react/outline";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { loginUser, resetState } from "../features/Authentication/authSlice";

function Login() {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const { user, loginError, isSuccess, isLoading, message } = useSelector(
		(state) => state.auth
	);
	// const auth = useSelector((state) => state.auth);
	// console.log(auth);

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
	}, [user, isSuccess, navigate, resetAfterLogin, dispatch, displayError]);
	// [user, loginError, isSuccess, message, navigate, dispatch]

	return (
		<div
			className="flex justify-center h-screen w-screen first-letter:text-gray1 
			sm:items-center dark:bg-slate-900"
		>
			<section
				className="h-max w-full pt-12 
				sm:w-fit sm:p-8 sm:border-[1px] border-gray-300 rounded-md 
				dark:border-offwhite"
			>
				<div className="flex items-center justify-center gap-2 mb-6">
					<LoginIcon className="h-12 w-12 text-sky-600" />
					<p className="text-center font-bold text-xl sm:text-3xl dark:text-white">
						Sign In
					</p>
				</div>
				<form
					className="flex flex-col align-center content-center 
				h-fit w-screen px-6 sm:w-maxLogin"
					onSubmit={handleSubmit}
				>
					<label className="font-semibold text-sm text-gray1 dark:text-slate-300">
						Email
					</label>

					<input
						name="email"
						value={form.email}
						type="email"
						onChange={handleChange}
						required
						className="w-full border-[1px] border-gray-300 mb-6 rounded-sm p-1 focus:outline-sky-600"
					></input>

					<label className="font-semibold text-sm text-gray1 dark:text-slate-300">
						Password
					</label>
					<input
						name="password"
						value={form.password}
						type="password"
						onChange={handleChange}
						required
						className="w-full border-[1px] border-gray-300 mb-8 rounded-sm p-1 focus:outline-sky-600"
					></input>
					<button
						className="transition-all bg-sky-600 hover:bg-sky-500 text-offwhite2 
							w-full self-center p-2 rounded-md mb-4"
					>
						{isLoading && !form.guestAccount ? (
							<div className="flex items-center justify-center gap-2">
								<AiOutlineLoading3Quarters className="animate-spin h-6 w-6 text-white" />
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
						<span className="w-1/5 border-b  border-gray-500 dark:border-gray-400 lg:w-1/5"></span>
					</div>

					<button
						onClick={loadGuestAccount}
						className="transition-all bg-blue-600 hover:bg-blue-500 text-offwhite2 
							w-full self-center p-2 rounded-md mb-6"
					>
						{isLoading && form.guestAccount ? (
							<div className="flex items-center justify-center gap-2">
								<AiOutlineLoading3Quarters className="animate-spin h-6 w-6 text-white" />
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
			</section>
		</div>
	);
}

export default Login;
