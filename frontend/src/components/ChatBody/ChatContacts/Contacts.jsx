import { useState } from "react";
import { PlusIcon, PencilAltIcon } from "@heroicons/react/outline";
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
		<div className="flex flex-col p-6 w-[50%] max-w-[400px] bg-offwhite dark:bg-slate-900">
			{/* <div
				className="flex items-center justify-center gap-2 mb-6 h-14 bg-sky-500 rounded-3xl shadow-md
				active:shadow-lg hover:bg-sky-600 cursor-pointer transition-all"
				onClick={() => {
					console.log("new conversation");
				}}
			>
				<PlusIcon className="w-6 h-6 text-white" />
				<span className="font-medium text-white">New Message</span>
			</div> */}
			<div className="flex items-center justify-between mb-8 px-2 pb-4 border-b-2 border-b-gray-300 shadow-sm">
				<p className="text-gray1 text-2xl font-bold dark:text-white">
					Messages
				</p>
				<button>
					<PencilAltIcon className="h-8 w-8 text-sky-500" />
				</button>
			</div>

			<div
				className="flex items-center border-[2px] border-transparent mb-10
            bg-white focus-within:border-sky-600 w-full p-2 rounded-3xl shadow-md"
			>
				<input
					name="text"
					value={input.text}
					type="text"
					placeholder="Find message"
					onChange={handleChange}
					className="outline-none bg-transparent w-11/12 px-2 placeholder:text-gray-500"
				></input>
				<SearchIcon className="w-5 h-5 text-gray1" />
			</div>
			<div
				className="flex-grow max-h-[715px] py-4 px-4 bg-white overflow-y-auto
				rounded-lg"
			>
				<ContactItem />
				<ContactItem />
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
