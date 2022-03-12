import { useState } from "react";

function Dashboard() {
	const [theme, setTheme] = useState(false);
	function changeTheme() {
		setTheme((prevTheme) => !prevTheme);
	}
	const themeStyle = theme ? "" : "dark";
	return (
		<div className={` ${themeStyle}`}>
			Dashboard
			<button
				className="cursor-pointer bg-indigo-900 text-white text-xs"
				onClick={changeTheme}
			>
				Change theme
			</button>
			<p className="text-white">asd</p>
			{/* <Sidebar /> */}
		</div>
	);
}

export default Dashboard;
