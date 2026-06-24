import React from "react";
import {
    MenuProvider,
    Menu,
    MenuItem,
    MenuButton,
    MenuButtonArrow,
} from "@ariakit/react";
import "./dropdown.css";

export type DropdownProps = {
    /** The trigger element. Receives toggle props via render prop or wraps a Button. */
    children: React.ReactNode;
};

export function Dropdown({ children }: DropdownProps) {
    return <MenuProvider>{children}</MenuProvider>;
}

export type DropdownToggleProps =
    React.ButtonHTMLAttributes<HTMLButtonElement> & {
        split?: boolean;
        size?: "sm" | "md";
    };

export const DropdownToggle = React.forwardRef<
    HTMLButtonElement,
    DropdownToggleProps
>(({ split, size = "md", className = "", children, ...props }, _ref) => {
    const classes = [
        "ui-button",
        "ui-button--secondary",
        size === "sm" ? "ui-button--sm" : "",
        "ui-dropdown-toggle",
        className,
    ]
        .filter(Boolean)
        .join(" ");
    return (
        <MenuButton className={classes} {...props}>
            {children}
            <MenuButtonArrow className="ui-dropdown-arrow" />
        </MenuButton>
    );
});
DropdownToggle.displayName = "DropdownToggle";

export type DropdownMenuProps = {
    children: React.ReactNode;
};

export function DropdownMenu({ children }: DropdownMenuProps) {
    return (
        <Menu gutter={4} className="ui-dropdown-menu">
            {children}
        </Menu>
    );
}

export type DropdownItemProps = React.HTMLAttributes<HTMLElement> & {
    active?: boolean;
};

export function DropdownItem({
    active,
    className = "",
    ...props
}: DropdownItemProps) {
    const classes = [
        "ui-dropdown-item",
        active ? "ui-dropdown-item--active" : "",
        className,
    ]
        .filter(Boolean)
        .join(" ");
    return <MenuItem className={classes} {...props} />;
}

Dropdown.Toggle = DropdownToggle;
Dropdown.Menu = DropdownMenu;
Dropdown.Item = DropdownItem;
