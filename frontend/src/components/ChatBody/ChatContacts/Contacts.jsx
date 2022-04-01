import { useState } from "react";
import { PlusIcon, PencilAltIcon } from "@heroicons/react/outline";
import { GlobeIcon } from "@heroicons/react/solid";
import { SearchIcon } from "@heroicons/react/solid";
import ContactItem from "./ContactItem";
import { useSelector } from "react-redux";

function Contacts() {
	const [active, setActive] = useState(false);
	function toggleActive() {
		setActive((prevActive) => !prevActive);
	}

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

	const { messageGroup } = useSelector((state) => state.messages);
	const globalActive =
		messageGroup === "Global"
			? "bg-slate-200  dark:bg-slate-800 border-l-2 border-l-sky-500"
			: "border-l-2 border-l-sky-900";

	return (
		<div className="hidden md:flex flex-col w-[40%] max-w-[350px] bg-offwhite dark:bg-slate-900">
			<div className="flex items-center justify-between mb-8 px-6 py-4 pb-4 h-16 border-b-2 border-b-gray-300 shadow-sm">
				<p className="text-gray1 text-2xl font-bold dark:text-white">
					Messages
				</p>
				<button>
					<PencilAltIcon className="h-8 w-8 text-sky-500" />
				</button>
			</div>

			<div className="px-4 h-full">
				<div
					className="flex items-center justify-center gap-2 mb-6 h-14 bg-sky-500 rounded-3xl shadow-md
				active:shadow-lg hover:bg-sky-600 cursor-pointer transition-all
				dark:bg-sky-700 dark:hover:bg-sky-600"
					onClick={() => {
						console.log("new conversation");
					}}
				>
					<PlusIcon className="w-6 h-6 text-white" />
					<span className="font-medium text-white">New Message</span>
				</div>

				<div
					className="flex-grow h-full max-h-[715px] bg-transparent overflow-y-auto px-1
				rounded-lg "
				>
					<div
						className={`flex items-center w-full h-12 pl-4 gap-2 hover:bg-slate-200 ${globalActive}`}
					>
						<GlobeIcon className="h-7 w-7 text-sky-500 dark:text-sky-600" />
						<span className="dark:text-white">Global</span>
					</div>
					<ContactItem />
					<ContactItem />
					<ContactItem />
					<ContactItem />
					<ContactItem />
				</div>
			</div>
			{/* <div
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
			</div> */}
		</div>
	);
}

export default Contacts;
