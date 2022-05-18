import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { AnnotationIcon } from "@heroicons/react/outline";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { registerUser, resetState } from "../features/authentication/authSlice";
import { Checkbox, FormControlLabel } from "@mui/material";

function Register() {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const { user, registerError, isSuccess, isLoading, message } = useSelector(
		(state) => state.auth
	);
	const [form, setForm] = useState({
		name: "",
		username: "",
		email: "",
		password: "",
	});
	const [showPassword, setShowPassword] = useState(false);

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
			name: form.name,
			username: form.username,
			email: form.email.toLowerCase(),
			password: form.password,
		};

		dispatch(registerUser(userData));
	}

	function toggleShowPassword() {
		setShowPassword((prev) => !prev);
	}

	const resetAfterRegister = useCallback(() => {
		dispatch(resetState());
	}, [dispatch]);

	useEffect(() => {
		if (registerError) {
			toast.error(message);
		}

		if (isSuccess || user) {
			// If user logins or registers navigate('/') to dashboard
			navigate("/chat");
		}

		// reset state in store
		return () => {
			resetAfterRegister();
		};
	}, [
		user,
		isSuccess,
		message,
		registerError,
		resetAfterRegister,
		navigate,
		dispatch,
	]);

	return (
		<div
			className="flex justify-center h-screen w-screen text-gray1 
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
				<p className="text-center mb-2 font-medium text-xl text-gray1 dark:text-gray-100">
					Create Account
				</p>

				<form
					className="flex flex-col align-center content-center 
				h-fit w-screen px-8 sm:w-[30rem] mb-1"
					onSubmit={handleSubmit}
				>
					<div className="mb-3">
						<div className="flex flex-col gap-4 mb-4 w-full sm:flex-row">
							<div>
								<label className="font-semibold text-sm text-gray1 dark:text-gray-100">
									Name
								</label>
								<input
									name="name"
									value={form.name}
									type="text"
									onChange={handleChange}
									required
									className="w-full border-[1px] rounded-sm p-1 focus-within:outline-sky-600 text-gray1 dark:text-white
								border-gray-300 bg-offwhite dark:focus-within:outline-sky-700  dark:border-gray-600 dark:bg-gray-800"
								></input>
							</div>

							<div>
								<label className="font-semibold text-sm text-gray1 dark:text-gray-100">
									Username
								</label>
								<input
									name="username"
									value={form.username}
									type="text"
									onChange={handleChange}
									required
									className="w-full border-[1px] rounded-sm p-1 focus-within:outline-sky-600 text-gray1 dark:text-white
								border-gray-300 bg-offwhite dark:focus-within:outline-sky-700  dark:border-gray-600 dark:bg-gray-800"
								></input>
							</div>
						</div>

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
						<div className="flex items-center text-gray1 dark:text-offwhite">
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
						aria-label="Create Account"
						className="transition-all  text-offwhite2 w-full self-center p-2 rounded-md mb-6 
							bg-sky-500 hover:bg-sky-600 dark:bg-sky-800 dark:hover:bg-sky-700"
					>
						{isLoading ? (
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
								<span>Creating Account</span>
							</div>
						) : (
							<div className="flex items-center justify-center gap-2">
								<span>Create Account</span>
							</div>
						)}
					</button>
				</form>
				<div className="flex justify-center items-center gap-2 px-8">
					<span className="dark:text-slate-300">Already have an account?</span>
					<span className="font-semibold text-sky-600 hover:text-sky-400">
						<Link to="/">Sign in</Link>
					</span>
				</div>
			</section>
		</div>
	);
}

export default Register;
