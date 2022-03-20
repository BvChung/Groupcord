import { useState } from "react";
import { PlusIcon } from "@heroicons/react/outline";
import { SearchIcon } from "@heroicons/react/solid";
import ContactItem from "./ContactItem";

function Contacts() {
	const [input, setInput] = useState({
		text: "",
	});

	function handleChange(e) {
		const { name, value } = e.target;

		setInput((prevInput) => {
			return {
				...prevInput,
				[name]: value,
			};
		});
	}

	return (
		<div className="flex flex-col p-4 border-r-[2px] border-gray-300 w-72">
			<div
				className="flex items-center justify-center gap-2 mb-8 h-14 bg-offwhite rounded-3xl shadow-md
			active:shadow-sm hover:bg-gray-100 cursor-pointer"
				onClick={() => {
					console.log("new conversation");
				}}
			>
				{/* <button className="flex w-full justify-center items-center gap-2 ">
					<PlusIcon className="w-6 h-6 text-sky-500" />
					<span className="font-medium text-sky-500">New Conversation</span>
				</button> */}

				<PlusIcon className="w-6 h-6 text-sky-500" />
				<span className="font-medium text-sky-500">New Conversation</span>
			</div>
			<div className="mb-4 px-2">
				<h1 className="text-gray1 text-xl font-semibold">Chats</h1>
			</div>
			<div
				className="flex items-center border-[1px] border-transparent mb-8
            bg-offwhite2 focus-within:border-sky-600 w-full p-2 rounded-3xl"
			>
				<input
					name="text"
					value={input.text}
					type="text"
					placeholder="Find chat"
					onChange={handleChange}
					className="outline-none bg-transparent w-11/12 px-2 placeholder:text-gray-500"
				></input>
				<SearchIcon className="w-5 h-5 text-gray1" />
			</div>
			<div className=" flex-grow py-2 px-2 bg-offwhite2 overflow-y-auto">
				<ContactItem />
				<ContactItem />
				<ContactItem />
				<ContactItem />
				<ContactItem />
				<ContactItem />
				<ContactItem />
			</div>
		</div>
	);
}

export default Contacts;
