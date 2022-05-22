import { useEffect } from "react";
import Nav from "../components/Navigation/Nav";
import ProfileSettings from "../components/ProfileSettings/ProfileSettings";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser, resetState } from "../features/authentication/authSlice";
import { resetMessageState } from "../features/messages/messageSlice";
import { resetGroupState } from "../features/groups/groupSlice";
import { useNavigate } from "react-router-dom";

export default function ProfilePage() {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	// Logout user if invalid token is present
	const { expiredRefreshJWT } = useSelector((state) => state.auth);
	useEffect(() => {
		if (expiredRefreshJWT) {
			dispatch(logoutUser());
			dispatch(resetMessageState());
			dispatch(resetGroupState());
			dispatch(resetState());
			navigate("/");
		}
	}, [expiredRefreshJWT, dispatch, navigate]);

	return (
		<div className="flex flex-col dark:bg-slate-900 w-screen h-screen ">
			<Nav />
			<ProfileSettings />
		</div>
	);
}
