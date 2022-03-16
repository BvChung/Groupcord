import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { UserAddIcon } from "@heroicons/react/solid";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { registerUser, resetState } from "../features/Authentication/authSlice";

function Register() {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const [form, setForm] = useState({
		name: "",
		username: "",
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
			name: form.name,
			username: form.username,
			email: form.email,
			password: form.password,
		};

		dispatch(registerUser(userData));
	}

	const { user, registerError, isSuccess, isLoading, message } = useSelector(
		(state) => state.auth
	);
	// console.log(user, isLoading, isError, isSuccess, message);

	useEffect(() => {
		if (registerError) {
			toast.error(message);
		}

		if (isSuccess || user) {
			// If user logins or registers navigate('/') to dashboard
			navigate("/dashboard");
		}

		// reset state in store
		dispatch(resetState());
	}, [user, isSuccess, message, registerError, navigate, dispatch]);

	return (
		<div
			className="flex justify-center h-screen w-screen text-gray1 
			sm:items-center dark:bg-gray-900"
		>
			<section
				className="h-max w-full pt-12
				sm:w-fit sm:p-8 sm:border-[1px] border-gray-300 rounded-md
				dark:border-offwhite"
			>
				<div className="flex items-center justify-center gap-2 mb-8">
					<UserAddIcon className="h-12 w-12 text-sky-600" />
					<p className="text-center font-bold text-xl sm:text-3xl dark:text-white">
						Create your account
					</p>
				</div>
				<form
					className="flex flex-col align-center content-center 
				h-fit w-screen px-6 sm:w-maxLogin"
					onSubmit={handleSubmit}
				>
					<div className="flex flex-col gap-4 mb-8 w-full sm:flex-row">
						<div>
							<label className="font-semibold text-sm text-gray1  dark:text-slate-300">
								Name
							</label>
							<input
								name="name"
								value={form.name}
								type="text"
								onChange={handleChange}
								required
								className="border-[1px] border-gray-300 rounded-sm w-full p-1
								focus:outline-sky-600"
							></input>
						</div>

						<div>
							<label className="font-semibold text-sm text-gray1 dark:text-slate-300">
								Username
							</label>
							<input
								name="username"
								value={form.username}
								type="text"
								onChange={handleChange}
								required
								className="border-[1px] border-gray-300 rounded-sm w-full p-1 focus:outline-sky-600"
							></input>
						</div>
					</div>

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
						type="password"
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
								<span>Creating Account</span>
							</div>
						) : (
							<div className="flex items-center justify-center gap-2">
								<span>Create Account</span>
							</div>
						)}
					</button>
				</form>
				<div className="text-center">
					<p className="dark:text-slate-300">Already have an account?</p>
					<p className="font-semibold text-sky-600 hover:text-sky-400">
						<Link to="/">Sign in</Link>
					</p>
				</div>
			</section>
		</div>
	);
}

export default Register;
