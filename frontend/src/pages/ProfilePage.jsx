import { useEffect } from "react";
import Nav from "../components/Navigation/Nav";
import ProfileSettings from "../components/ProfileSettings/ProfileSettings";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser, resetState } from "../features/authentication/authSlice";
import { resetMessageState } from "../features/messages/messageSlice";
import { resetGroupState } from "../features/groups/groupSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

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
			toast.info("Your session has expired. Please log in again.");
		}
	}, [expiredRefreshJWT, dispatch, navigate]);

	return (
		<div className="flex flex-col w-screen h-screen">
			<Nav />
			<ProfileSettings />
		</div>
	);
}
