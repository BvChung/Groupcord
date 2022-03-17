import { useEffect, useState } from "react";
import { io } from "socket.io-client";

function Dashboard() {
	const [socket, setSocket] = useState("");
	useEffect(() => {
		setSocket(io("ws://localhost:3001"));
	}, []);

	// socket.emit("hello from client");
	// console.log(socket);

	const [input, setInput] = useState({
		message: "",
	});

	function handleChange(e) {
		const { value, name } = e.target;

		setInput((prevMessage) => {
			return {
				...prevMessage,
				[name]: value,
			};
		});
	}

	function handleSubmit(e) {
		e.preventDefault();
		console.log(input);
	}
	console.log(input);

	return (
		<div
			className="dark:bg-gray-900
		pt-16 w-screen h-screen"
		>
			<form onSubmit={handleSubmit}>
				<input
					name="message"
					value={input.message}
					type="text"
					onChange={handleChange}
					placeholder="Enter message"
				></input>
				<button>Send message</button>
			</form>
		</div>
	);
}

export default Dashboard;
