import { useState } from "react";

function Register() {
	const [form, setForm] = useState({
		firstName: "",
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
		console.log(form);
	}

	return (
		<main className="flex items-center justify-center h-screen w-screen">
			<div className="h-max border-2 border-gray-400 p-5">
				<p className="text-center text-2xl font-semibold mb-10">
					Create your account
				</p>
				<form
					className="flex flex-col align-center content-center 
				h-fit  w-maxLogin"
					onSubmit={handleSubmit}
				>
					<div className="flex justify-between mb-8">
						<div>
							<label className="font-semibold ">First Name</label>
							<input
								name="firstName"
								value={form.firstName}
								type="text"
								onChange={handleChange}
								required
								className="border-[1px] border-gray-400  rounded-sm"
							></input>
						</div>

						<div>
							<label className="font-semibold">Username</label>
							<input
								name="username"
								value={form.username}
								type="text"
								onChange={handleChange}
								required
								className="border-[1px] border-gray-400 rounded-sm"
							></input>
						</div>
					</div>

					<label className="font-semibold">Email</label>
					<input
						name="email"
						value={form.email}
						type="email"
						className="font-semibold"
						onChange={handleChange}
						required
						className="border-[1px] border-gray-400 mb-8 rounded-sm"
					></input>

					<label className="font-semibold">Password</label>
					<input
						name="password"
						value={form.password}
						type="text"
						onChange={handleChange}
						required
						className="border-[1px] border-gray-400 mb-8 rounded-sm"
					></input>
					<button className="bg-purple2 text-offwhite2 w-full self-center">
						Sign up
					</button>
				</form>
			</div>
		</main>
	);
}

export default Register;
