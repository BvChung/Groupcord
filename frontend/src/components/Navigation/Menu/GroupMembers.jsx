import * as React from "react";
import { useEffect, useContext, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
	addGroupMembers,
	removeGroupMembers,
	updateMembersWithSocket,
	updateGroupsWithSocket,
} from "../../../features/conversations/conversationSlice";
import { resetMessagesWithGroupRemoval } from "../../../features/messages/messageSlice";
import { SocketContext } from "../../../appContext/socketContext";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import MenuUnstyled from "@mui/base/MenuUnstyled";
import MenuItemUnstyled, {
	menuItemUnstyledClasses,
} from "@mui/base/MenuItemUnstyled";
import PopperUnstyled from "@mui/base/PopperUnstyled";
import { styled } from "@mui/system";
import Divider from "@mui/material/Divider";
import {
	PlusIcon,
	XIcon,
	CheckIcon,
	LogoutIcon,
} from "@heroicons/react/outline";
import { UserIcon, KeyIcon, UserAddIcon } from "@heroicons/react/solid";
import { toast } from "react-toastify";

export default function AddMembers() {
	const [anchorEl, setAnchorEl] = React.useState(null);
	const isOpen = Boolean(anchorEl);
	const buttonRef = React.useRef(null);
	const menuActions = React.useRef(null);

	const handleButtonClick = (event) => {
		if (isOpen) {
			setAnchorEl(null);
		} else {
			setAnchorEl(event.currentTarget);
		}
	};

	const handleButtonKeyDown = (event) => {
		if (event.key === "ArrowDown" || event.key === "ArrowUp") {
			event.preventDefault();
			setAnchorEl(event.currentTarget);
			if (event.key === "ArrowUp") {
				menuActions.current?.highlightLastItem();
			}
		}
	};
	const close = () => {
		setAnchorEl(null);
		buttonRef.current.focus();
	};

	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { user } = useSelector((state) => state.auth);
	const currentAccountId = useSelector((state) => state.auth.user._id);
	const { groupId } = useSelector((state) => state.conversations.groupInfo);
	const { groupOwner } = useSelector((state) => state?.conversations.groupInfo);
	const { members } = useSelector((state) => state?.conversations.groupInfo);
	const { filteredMembers } = useSelector((state) => state?.conversations);
	const { memberUpdatedToSocket } = useSelector(
		(state) => state?.conversations
	);
	const { darkMode } = useSelector((state) => state.theme);

	// Web sockets
	const socket = useContext(SocketContext);

	const sendData = useCallback(
		(data) => {
			socket.emit("send_group_data", data);
		},
		[socket]
	);

	useEffect(() => {
		sendData(memberUpdatedToSocket);
	}, [sendData, memberUpdatedToSocket]);

	useEffect(() => {
		socket.on("receive_group_data", (data) => {
			console.log(data);
			dispatch(updateMembersWithSocket(data.groupData.members));

			if (user._id === data.memberChanged && data.action === "addMember") {
				dispatch(updateGroupsWithSocket(data));
			} else if (
				user._id === data.memberChanged &&
				data.action === "removeMember"
			) {
				dispatch(updateGroupsWithSocket(data));
				dispatch(resetMessagesWithGroupRemoval());
			}
		});
	}, [socket, dispatch, navigate, user._id]);
	return (
		<div className={groupId === "Global" ? "hidden" : ""}>
			<TriggerButton
				type="button"
				onClick={handleButtonClick}
				onKeyDown={handleButtonKeyDown}
				ref={buttonRef}
				aria-controls={isOpen ? "wrapped-menu" : undefined}
				aria-expanded={isOpen || undefined}
				aria-haspopup="menu"
				aria-label="Open group members menu"
			>
				<UserAddIcon className="h-8 w-8 text-gray2 dark:text-gray-400" />
			</TriggerButton>
			<MenuUnstyled
				actions={menuActions}
				open={isOpen}
				onClose={close}
				anchorEl={anchorEl}
				components={{ Root: Popper, Listbox: StyledListbox }}
				componentsProps={{ listbox: { id: "simple-menu" } }}
			>
				<MenuSection label="Members">
					{members?.map((member) => {
						return (
							<StyledMenuItem className="mb-1" key={member._id}>
								<div className="flex items-center justify-between pr-2">
									<div className="flex items-center gap-2">
										{groupOwner === member._id ? (
											<KeyIcon className="h-5 w-5 text-sky-500" />
										) : (
											<UserIcon
												className={`h-5 w-5  ${
													darkMode ? "text-slate-500" : "text-slate-800"
												}`}
											/>
										)}
										<span className="font-sans mr-2">{member.username}</span>
									</div>
									{currentAccountId === groupOwner &&
										groupOwner !== member._id && (
											<button
												onClick={() => {
													dispatch(removeGroupMembers(member._id));
													// close();
												}}
												className="p-[4px] text-red-800 hover:bg-red-600 hover:text-white rounded-full"
											>
												<XIcon className="h-4 w-4" />
											</button>
										)}
									{currentAccountId !== groupOwner && user._id === member._id && (
										<button
											onClick={() => {
												dispatch(removeGroupMembers(member._id));
												// close();
											}}
											className="p-[4px] text-red-800 hover:bg-red-600 hover:text-white rounded-full"
										>
											<LogoutIcon className="h-4 w-4" />
										</button>
									)}
								</div>
							</StyledMenuItem>
						);
					})}
				</MenuSection>
				{currentAccountId === groupOwner &&
					Object.keys(filteredMembers).length !== 0 && <Divider />}
				{currentAccountId === groupOwner &&
					Object.keys(filteredMembers).length !== 0 && (
						<MenuSection label="Add Users">
							{filteredMembers?.map((user) => {
								return (
									<StyledMenuItem className="mb-1" key={user._id}>
										<div className="flex items-center justify-between pr-2">
											<div className="flex items-center gap-2">
												<UserIcon
													className={`h-5 w-5  ${
														darkMode ? "text-slate-500" : "text-slate-800"
													}`}
												/>
												<span className="font-sans">{user.username}</span>
											</div>
											{
												<button
													onClick={() => {
														dispatch(addGroupMembers(user._id));
													}}
													className="p-[4px] text-green-800 hover:bg-green-600 hover:text-white rounded-full"
												>
													<CheckIcon className="h-4 w-4" />
												</button>
											}
										</div>
									</StyledMenuItem>
								);
							})}
						</MenuSection>
					)}
			</MenuUnstyled>
		</div>
	);
}

const grey = {
	0: "#fff",
	100: "#E7EBF0",
	200: "#E0E3E7",
	300: "#CDD2D7",
	400: "#B2BAC2",
	500: "#A0AAB4",
	600: "#6F7E8C",
	700: "#3E5060",
	800: "#1a1a1a",
	900: "#232323",
};

const StyledListbox = styled("ul")(
	({ theme }) => `
  font-family: Inter, sans-serif;
  font-size: 0.875rem;
  box-sizing: border-box;
  padding: 4px;
  margin: 10px 0;
  min-width: 200px;
  width: fit-content;
  max-height: 400px;
  background: ${theme.palette.mode === "dark" ? "#18181b" : "#fff"};
  border: 1px solid ${theme.palette.mode === "dark" ? "#343434" : grey[300]};
  border-radius: 0.4em;
  color: ${theme.palette.mode === "dark" ? "#fff" : grey[900]};
  overflow: auto;
  outline: 0px;

  & .helper {
    padding: 10px;
  }
`
);

const StyledMenuItem = styled(MenuItemUnstyled)(
	({ theme }) => `
  list-style: none;
  padding: 8px;
  border-radius: 0.45em;
  cursor: pointer;

  &:last-of-type {
    border-bottom: none;
  }

  &.${menuItemUnstyledClasses.focusVisible} {
    background-color: ${theme.palette.mode === "dark" ? grey[800] : grey[100]};
    color: ${theme.palette.mode === "dark" ? grey[300] : grey[900]};
    outline: 0;
  }

  &.${menuItemUnstyledClasses.disabled} {
    color: ${theme.palette.mode === "dark" ? grey[700] : grey[400]};
  }

  &:hover:not(.${menuItemUnstyledClasses.disabled}) {
    background-color: ${theme.palette.mode === "dark" ? "#1f2937" : "#f3f4f6"};
    color: ${theme.palette.mode === "dark" ? "#fff" : grey[900]};
  }
  `
);

const TriggerButton = styled("button")(
	({ theme }) => `
  font-family: Inter, sans-serif;
  box-sizing: border-box;
  min-height: auto;
  min-width: auto;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 50em;
  margin: 0;
  padding: 6px;

  &:hover {
    background: ${theme.palette.mode === "dark" ? "#1a1a1a" : "#e5e7eb"};
  }
  &:active {
    border: 1px solid ${theme.palette.mode === "dark" ? "#ffffff" : "#6b7280"};
  }

  `
);

const Popper = styled(PopperUnstyled)`
	z-index: 99999999;
`;

const MenuSectionRoot = styled("li")`
	list-style: none;

	& > ul {
		padding-left: 0.5em;
		padding-right: 0.5em;
	}
`;

const MenuSectionLabel = styled("span")(
	({ theme }) => `
	display: block;
	padding: 10px 0 5px 10px;
	font-size: 0.75em;
	font-weight: 600;
	text-transform: uppercase;
	letter-spacing: 0.05rem;
	color: ${theme.palette.mode === "dark" ? "#e5e7eb" : grey[800]};
`
);

function MenuSection({ children, label }) {
	return (
		<MenuSectionRoot>
			<MenuSectionLabel>{label}</MenuSectionLabel>
			<ul>{children}</ul>
		</MenuSectionRoot>
	);
}

MenuSection.propTypes = {
	children: PropTypes.node,
	label: PropTypes.string.isRequired,
};
