import React from "react";
import { ChatAlt2Icon } from "@heroicons/react/outline";

function Nav() {
	return (
		<div className="flex justify-between flex-col px-6 pt-8 max-w-xs">
			<div>
				<ChatAlt2Icon className="w-10 h-10" />
			</div>
		</div>
	);
}

export default Nav;
