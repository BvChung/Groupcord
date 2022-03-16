import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { LoginIcon } from "@heroicons/react/outline";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { loginUser, resetState } from "../features/Authentication/authSlice";

function Login() {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const [form, setForm] = useState({
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

	const { user, loginError, isSuccess, isLoading, message } = useSelector(
		(state) => state.auth
	);

	const displayError = useCallback(() => {
		if (loginError) {
			toast.error(message);
		}
	}, [message, loginError]);

	useEffect(() => {
		displayError();

		if (isSuccess || user) {
			// If user logins or registers navigate('/') to dashboard
			navigate("/dashboard");
		}

		// Reset state in store
		dispatch(resetState());
	}, [user, isSuccess, navigate, dispatch, displayError]);
	// [user, loginError, isSuccess, message, navigate, dispatch]

	return (
		<div
			className="flex justify-center h-screen w-screen  text-gray1 
			sm:items-center dark:bg-gray-900"
		>
			<section
				className="h-max w-full pt-12 
				sm:w-fit sm:p-8 sm:border-[1px] border-gray-300 rounded-md 
				dark:border-offwhite"
			>
				<div className="flex items-center justify-center gap-2 mb-8">
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
						className="w-full border-[1px] border-gray-300 mb-8 rounded-sm p-1 focus:outline-sky-600"
					></input>

					<label className="font-semibold text-sm text-gray1 dark:text-slate-300">
						Password
					</label>
					<input
						name="password"
						value={form.password}
						type="text"
						onChange={handleChange}
						required
						className="w-full border-[1px] border-gray-300 mb-10 rounded-sm p-1 focus:outline-sky-600"
					></input>
					<button
						className="transition-all bg-sky-600 hover:bg-sky-500 text-offwhite2 
							w-full self-center p-2 rounded-md mb-8"
					>
						{isLoading ? (
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
				</form>
				<div className="text-center">
					<p className="dark:text-slate-300">Don't have an account?</p>
					<p className="font-semibold text-sky-600 hover:text-sky-500">
						<Link to="/register">Register</Link>
					</p>
				</div>

				{/* <svg
					className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
				</svg> */}
			</section>
		</div>
	);
}

export default Login;
