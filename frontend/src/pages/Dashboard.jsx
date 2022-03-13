import { useState } from "react";

function Dashboard() {
	return (
		<div className="dark:bg-gray-900 w-screen h-screen">
			Dashboard
			<button className="cursor-pointer bg-indigo-900 text-white text-xs">
				Change theme
			</button>
			<p className="text-white">asd</p>
			{/* <Sidebar /> */}
		</div>
	);
}

export default Dashboard;
