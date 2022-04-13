import * as React from "react";
import { useEffect, useContext, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
	addGroupMembers,
	removeGroupMembers,
	updateMembersWithSocket,
	updateGroupsWithSocket,
} from "../../../features/conversations/conversationSlice";
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
	DotsVerticalIcon,
	TrashIcon,
	PencilIcon,
} from "@heroicons/react/outline";
import { UserIcon } from "@heroicons/react/solid";

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
	const { sendDataToSocket } = useSelector((state) => state?.conversations);

	// Web sockets
	const socket = useContext(SocketContext);

	const sendData = useCallback(
		(data) => {
			socket.emit("send_group_data", data);
		},
		[socket]
	);

	useEffect(() => {
		sendData(sendDataToSocket);
	}, [sendData, sendDataToSocket]);

	return (
		<div>
			<TriggerButton
				type="button"
				onClick={handleButtonClick}
				onKeyDown={handleButtonKeyDown}
				ref={buttonRef}
				aria-controls={isOpen ? "wrapped-menu" : undefined}
				aria-expanded={isOpen || undefined}
				aria-haspopup="menu"
			>
				<DotsVerticalIcon className="w-6 h-6 p-[2px] hover:bg-white rounded-full" />
			</TriggerButton>
			<MenuUnstyled
				actions={menuActions}
				open={isOpen}
				onClose={close}
				anchorEl={anchorEl}
				components={{ Root: Popper, Listbox: StyledListbox }}
				componentsProps={{ listbox: { id: "simple-menu" } }}
			>
				{/* <Divider /> */}

				<MenuSection label="Tools">
					<StyledMenuItem className="mb-1">
						<div className="flex items-center justify-between pr-2">
							<div className="flex items-center gap-2">
								<span className="font-semibold">Edit Group Name</span>
							</div>
							<button
								onClick={() => {
									console.log("clicked");
								}}
								className="p-[6px] text-green-800 hover:bg-green-600 hover:text-white rounded-full"
							>
								<PencilIcon className="h-6 w-6" />
							</button>
						</div>
					</StyledMenuItem>
					<StyledMenuItem className="mb-1">
						<div className="flex items-center justify-between pr-2">
							<div className="flex items-center gap-2">
								<span className="font-semibold">Delete Group</span>
							</div>
							<button
								onClick={() => {
									console.log("clicked");
								}}
								className="p-[6px] text-green-800 hover:bg-green-600 hover:text-white rounded-full"
							>
								<TrashIcon className="h-6 w-6" />
							</button>
						</div>
					</StyledMenuItem>
				</MenuSection>
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
	800: "#2D3843",
	900: "#1A2027",
};

const StyledListbox = styled("ul")(
	({ theme }) => `
  font-family: Inter, sans-serif;
  font-size: 0.875rem;
  box-sizing: border-box;
  padding: 4px;
  margin: 10px 0;
  min-width: 225px;
  max-height: 400px;
  background: ${theme.palette.mode === "dark" ? grey[900] : "#fff"};
  border: 1px solid ${theme.palette.mode === "dark" ? grey[800] : grey[300]};
  border-radius: 0.4em;
  color: ${theme.palette.mode === "dark" ? grey[300] : grey[900]};
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
  cursor: default;

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
    background-color: ${theme.palette.mode === "dark" ? grey[800] : grey[100]};
    color: ${theme.palette.mode === "dark" ? grey[300] : grey[900]};
  }
  `
);

const TriggerButton = styled("button")(
	({ theme }) => `
  font-family: Inter, sans-serif;
  font-size: 0.875rem;
  box-sizing: border-box;
  min-height: auto;
  min-width: auto;
  background: transparent;
  border-radius: 1em;
  margin: 0;
  padding: 2px;
  text-align: left;
  line-height: 1.5;
  color: ${theme.palette.mode === "dark" ? grey[300] : grey[500]};

  &:hover {
    background: ${theme.palette.mode === "dark" ? "" : grey[100]};
    border-color: ${theme.palette.mode === "dark" ? grey[700] : grey[400]};
  }

  `
);

const Popper = styled(PopperUnstyled)`
	z-index: 99999999;
`;

const MenuSectionRoot = styled("li")`
	list-style: none;

	& > ul {
		padding-left: 1em;
	}
`;

const MenuSectionLabel = styled("span")`
	display: block;
	padding: 10px 0 5px 10px;
	font-size: 0.75em;
	font-weight: 600;
	text-transform: uppercase;
	letter-spacing: 0.05rem;
	color: ${grey[600]};
`;

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
