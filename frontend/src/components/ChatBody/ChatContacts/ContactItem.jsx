import { useState } from "react";
import { useDispatch } from "react-redux";
import { UserCircleIcon } from "@heroicons/react/outline";
import { updateChatGroup } from "../../../features/Messages/messageSlice";

function ContactItem() {
	const dispatch = useDispatch();

	const [active, setActive] = useState(false);
	function toggleActive() {
		setActive((prevActive) => !prevActive);
	}

	return (
		<div
			onClick={() => {
				dispatch(updateChatGroup("dummy"));
			}}
			className="flex items-center w-full h-12 pl-4 gap-2 border-l-2 border-l-sky-900 hover:bg-slate-200 dark:hover:bg-slate-800"
		>
			<UserCircleIcon className="h-7 w-7 text-sky-500 dark:text-sky-600" />
			<div className="flex items-center gap-2 dark:text-white">
				<span>Person</span>
				<span>32 mins ago</span>
			</div>
		</div>
	);
}

export default ContactItem;
