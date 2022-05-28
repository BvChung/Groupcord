import * as React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
	logoutUser,
	resetState,
} from "../../../reducers/authentication/authSlice";
import { resetMessageState } from "../../../reducers/messages/messageSlice";
import { resetGroupState } from "../../../reducers/groups/groupSlice";
import PropTypes from "prop-types";
import MenuUnstyled from "@mui/base/MenuUnstyled";
import MenuItemUnstyled, {
	menuItemUnstyledClasses,
} from "@mui/base/MenuItemUnstyled";
import PopperUnstyled from "@mui/base/PopperUnstyled";
import { styled } from "@mui/system";
import Divider from "@mui/material/Divider";
import { LogoutIcon, IdentificationIcon } from "@heroicons/react/outline";
import { UserCircleIcon } from "@heroicons/react/solid";
import { Tooltip } from "@mui/material";

export default function NavMenu() {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const onLogout = (e) => {
		e.preventDefault();

		dispatch(logoutUser());
		dispatch(resetState());
		dispatch(resetMessageState());
		dispatch(resetGroupState());
		navigate("/");
	};

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
	return (
		<>
			<TriggerButton
				type="button"
				onClick={handleButtonClick}
				onKeyDown={handleButtonKeyDown}
				ref={buttonRef}
				aria-controls={isOpen ? "wrapped-menu" : undefined}
				aria-expanded={isOpen || undefined}
				aria-haspopup="menu"
				aria-label="Open account menu"
			>
				<Tooltip arrow describeChild title="My Account">
					<UserCircleIcon
						className="h-9 w-9 text-gray-600 hover:text-gray-700 dark:text-gray-200 hover:dark:text-gray-300 
										 rounded-full 
									border-[1px] border-transparent 
									hover:bg-gray-200 dark:hover:bg-dark4
									transition-all"
					/>
				</Tooltip>
			</TriggerButton>
			<MenuUnstyled
				actions={menuActions}
				open={isOpen}
				onClose={close}
				anchorEl={anchorEl}
				components={{ Root: Popper, Listbox: StyledListbox }}
				componentsProps={{ listbox: { id: "simple-menu" } }}
			>
				<MenuSection label="Account">
					<StyledMenuItem
						className="mb-1"
						onClick={() => {
							navigate("/profile");
							close();
						}}
					>
						<div className="flex items-center gap-2">
							<IdentificationIcon className="h-6 w-6" />
							<span className="font-sans">Manage account</span>
						</div>
					</StyledMenuItem>
				</MenuSection>
				<Divider />
				<MenuSection label="Page">
					<StyledMenuItem onClick={onLogout}>
						<div className="flex items-center gap-2">
							<LogoutIcon className="h-6 w-6" />
							<span className="font-sans">Logout</span>
						</div>
					</StyledMenuItem>
				</MenuSection>
			</MenuUnstyled>
		</>
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
  max-height: 400px;
  background: ${theme.palette.mode === "dark" ? "#141414" : "#fff"};
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
    background-color: ${theme.palette.mode === "dark" ? "#1f2937" : grey[100]};
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
	display: flex;
  align-items: center;
  justify-content: center;
  font-family: Inter, sans-serif;
  box-sizing: border-box;
  min-height: auto;
  min-width: auto;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 50em;
  margin: 0;
  padding: 3px;

  &:hover {
    background: ${theme.palette.mode === "dark" ? "#1a1a1a" : "#e5e7eb"};
  }
  &:active {
    border: 1px solid ${theme.palette.mode === "dark" ? "#ffffff" : "#6b7280"};
  }

  `
);

const Popper = styled(PopperUnstyled)`
	z-index: 100;
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
	color: ${theme.palette.mode === "dark" ? grey[200] : grey[800]};
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
