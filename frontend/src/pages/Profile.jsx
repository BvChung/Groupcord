import React from "react";
import ProfileNav from "../components/Navigation/ProfileNav/ProfileNav";
import ProfileSettings from "../components/Profile/ProfileSettings";

function Profile() {
	return (
		<div className="flex flex-col dark:bg-slate-900 w-screen h-screen ">
			<ProfileNav />
			<ProfileSettings />
		</div>
	);
}

export default Profile;
