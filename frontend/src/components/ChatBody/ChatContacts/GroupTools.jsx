import * as React from "react";
import { useDispatch } from "react-redux";
import { deleteChatGroup } from "../../../features/conversations/conversationSlice";
import { clearChatMessages } from "../../../features/messages/messageSlice";
import PropTypes from "prop-types";
import MenuUnstyled from "@mui/base/MenuUnstyled";
import { Tooltip } from "@mui/material";
import MenuItemUnstyled, {
	menuItemUnstyledClasses,
} from "@mui/base/MenuItemUnstyled";
import PopperUnstyled from "@mui/base/PopperUnstyled";
import { styled } from "@mui/system";
import {
	DotsVerticalIcon,
	TrashIcon,
	PencilIcon,
} from "@heroicons/react/solid";
import { toast } from "react-toastify";

export default function GroupTools({ groupId, groupName, toggleEditingName }) {
	const dispatch = useDispatch();
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
			>
				<Tooltip placement="right" arrow describeChild title="More">
					<DotsVerticalIcon className="w-5 h-5 text-gray-800 dark:text-gray-200" />
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
				<MenuSection label="Tools">
					<StyledMenuItem
						onClick={() => {
							toggleEditingName();
						}}
						className="mb-1"
					>
						<div className="flex items-center gap-4 px-2 py-1">
							<div className="text-yellow-500">
								<PencilIcon className="h-5 w-5" />
							</div>
							<div className="flex items-center">
								<span className="font-sans text-sm">Edit Name</span>
							</div>
						</div>
					</StyledMenuItem>
					<StyledMenuItem
						onClick={() => {
							dispatch(deleteChatGroup(groupId));
							dispatch(clearChatMessages());
							toast.success(`Group ${groupName} has been deleted`);
						}}
						className="mb-1"
					>
						<div className="flex items-center gap-4 px-2 py-1">
							<div className="text-gray-600 ">
								<TrashIcon className="h-5 w-5" />
							</div>
							<div className="flex items-center gap-2">
								<span className="font-sans text-sm">Delete Group</span>
							</div>
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
  font-size: 0.8rem;
  box-sizing: border-box;
  padding: 4px;
  margin: 5px 0;
  width: 180px;
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
  padding: 4px;
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
