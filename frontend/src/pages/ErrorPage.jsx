import { useNavigate } from "react-router-dom";
import { AnnotationIcon } from "@heroicons/react/outline";

export default function ErrorPage() {
	const navigate = useNavigate();

	return (
		<div className="flex flex-col items-center justify-center w-screen h-screen bg-white dark:bg-dark2">
			<div
				onClick={() => {
					navigate("/chat");
				}}
				className="flex items-center justify-center gap-2 mb-4 sm:mb-4 cursor-pointer"
			>
				<AnnotationIcon className="h-12 w-12 text-sky-600" />
				<p className="text-center font-semibold text-2xl sm:text-3xl text-gray1 dark:text-gray-100">
					Groupcord
				</p>
			</div>
			<div className="flex items-center">
				<div className="border-r-2 pr-4 border-gray-600 dark:border-gray-400 mr-4">
					<h1 className="text-2xl sm:text-3xl text-gray-900 dark:text-white">
						<strong>404</strong>
					</h1>
				</div>
				<h2 className="text-base sm:text-lg text-gray-700 dark:text-gray-300">
					This page could not be found.
				</h2>
			</div>
		</div>
	);
}
