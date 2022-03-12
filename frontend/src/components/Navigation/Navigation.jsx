import React from "react";
import { Link } from "react-router-dom";
import { LoginIcon, LogoutIcon, UserIcon } from "@heroicons/react/outline";

function Navigation() {
	return (
		<header className="flex justify-between items-center px-6 py-4 h-16 bg-slate-800">
			<div>Navigation</div>
			<div>
				<ul className="flex gap-5">
					<li>
						<Link to="/login">
							<div className="flex justify-center items-center">
								<LoginIcon className="h-5 w-5" /> Login
							</div>
						</Link>
					</li>
					<li>
						<Link to="/register">
							<div className="flex justify-center items-center">
								<UserIcon className="h-5 w-5" /> Register
							</div>
						</Link>
					</li>
				</ul>
			</div>
		</header>
	);
}

export default Navigation;
