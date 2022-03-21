import { useState } from "react";
import { UserCircleIcon } from "@heroicons/react/outline";

function ContactItem() {
	const [active, setActive] = useState(false);
	function toggleActive() {
		setActive((prevActive) => !prevActive);
	}

	return (
		<div className="flex items-center gap-4 h-20 mb-4 border-[1px] border-slate-800">
			<UserCircleIcon className="h-10 w-10 text-gray-500" />
			<div>
				<p>Person</p>
				<p>32 mins ago</p>
			</div>
		</div>
	);
}

export default ContactItem;
