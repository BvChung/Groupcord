export default function DateLabel({ fullDate }) {
	const currentTime = new Date();
	const usersTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

	const currentDateFull = currentTime.toLocaleString("en-US", {
		timeZone: usersTimeZone,
		month: "long",
		day: "numeric",
		year: "numeric",
	});

	return (
		<div className="w-full flex items-center justify-between my-10 first:mt-0">
			<span className="w-1/3 sm:w-[40%] xl:w-[43%] border-b-[1px] border-gray-400 dark:border-gray-500 "></span>
			<p className="font-sans text-xs font-semibold text-gray1 dark:text-gray-400">
				{currentDateFull === fullDate ? "Today" : fullDate}
			</p>
			<span className="w-1/3 sm:w-[40%] xl:w-[43%] border-b-[1px] border-gray-400 dark:border-gray-500 "></span>
		</div>
	);
}
