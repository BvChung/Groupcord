import { useSelector } from "react-redux";

function Dashboard() {
	const user = useSelector((state) => state.user.value);
	console.log(user);

	return (
		<div className="dark:bg-gray-900 w-screen h-screen">
			Dashboard
			<button className="cursor-pointer bg-indigo-900 text-white text-xs">
				Change theme
			</button>
			asadas
			<p className="text-white">asd</p>
		</div>
	);
}

export default Dashboard;
