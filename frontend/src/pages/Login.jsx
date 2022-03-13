import { useState } from "react";
import { Link } from "react-router-dom";
import { LoginIcon } from "@heroicons/react/outline";

function Login() {
	const [form, setForm] = useState({
		loginCredentials: "",
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
		console.log(form);
	}

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
						name="loginCredentials"
						value={form.loginCredentials}
						type="text"
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
						Sign In
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
