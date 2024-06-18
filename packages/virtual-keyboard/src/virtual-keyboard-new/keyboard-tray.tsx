import React from "react";
import ReactDOM from "react-dom";
import { OnClick } from "./keyboard";
import { ManagedKeyboard } from "./managed-keyboard";
import classNames from "classnames";
import "./keyboard-tray.css";

const KeyboardIcon = () => (
    <svg
        stroke="currentColor"
        fill="currentColor"
        strokeWidth="0"
        viewBox="0 0 576 512"
        aria-hidden="true"
        focusable="false"
        height="1em"
        width="1em"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path d="M528 448H48c-26.51 0-48-21.49-48-48V112c0-26.51 21.49-48 48-48h480c26.51 0 48 21.49 48 48v288c0 26.51-21.49 48-48 48zM128 180v-40c0-6.627-5.373-12-12-12H76c-6.627 0-12 5.373-12 12v40c0 6.627 5.373 12 12 12h40c6.627 0 12-5.373 12-12zm96 0v-40c0-6.627-5.373-12-12-12h-40c-6.627 0-12 5.373-12 12v40c0 6.627 5.373 12 12 12h40c6.627 0 12-5.373 12-12zm96 0v-40c0-6.627-5.373-12-12-12h-40c-6.627 0-12 5.373-12 12v40c0 6.627 5.373 12 12 12h40c6.627 0 12-5.373 12-12zm96 0v-40c0-6.627-5.373-12-12-12h-40c-6.627 0-12 5.373-12 12v40c0 6.627 5.373 12 12 12h40c6.627 0 12-5.373 12-12zm96 0v-40c0-6.627-5.373-12-12-12h-40c-6.627 0-12 5.373-12 12v40c0 6.627 5.373 12 12 12h40c6.627 0 12-5.373 12-12zm-336 96v-40c0-6.627-5.373-12-12-12h-40c-6.627 0-12 5.373-12 12v40c0 6.627 5.373 12 12 12h40c6.627 0 12-5.373 12-12zm96 0v-40c0-6.627-5.373-12-12-12h-40c-6.627 0-12 5.373-12 12v40c0 6.627 5.373 12 12 12h40c6.627 0 12-5.373 12-12zm96 0v-40c0-6.627-5.373-12-12-12h-40c-6.627 0-12 5.373-12 12v40c0 6.627 5.373 12 12 12h40c6.627 0 12-5.373 12-12zm96 0v-40c0-6.627-5.373-12-12-12h-40c-6.627 0-12 5.373-12 12v40c0 6.627 5.373 12 12 12h40c6.627 0 12-5.373 12-12zm-336 96v-40c0-6.627-5.373-12-12-12H76c-6.627 0-12 5.373-12 12v40c0 6.627 5.373 12 12 12h40c6.627 0 12-5.373 12-12zm288 0v-40c0-6.627-5.373-12-12-12H172c-6.627 0-12 5.373-12 12v40c0 6.627 5.373 12 12 12h232c6.627 0 12-5.373 12-12zm96 0v-40c0-6.627-5.373-12-12-12h-40c-6.627 0-12 5.373-12 12v40c0 6.627 5.373 12 12 12h40c6.627 0 12-5.373 12-12z"></path>
    </svg>
);

/**
 * An expandable keyboard tray.
 */
export function KeyboardTray({ onClick }: { onClick: OnClick }) {
    const [open, setOpen] = React.useState(false);

    return ReactDOM.createPortal(
        <div
            id="virtual-keyboard-tray"
            className={classNames({ open })}
            onMouseDown={() => {
                // The mousedown event appears to precede a blur event on a mathInput,
                // so this access event will set the accessed timestamp to be
                // just before the time of the blur if keyboard is clicked while the mathInput is focused.
                onClick({
                    commands: [{ type: "accessed", command: "" }],
                    timestamp: +new Date(),
                });
            }}
            onClick={() => {
                // If the keyboard is clicked but a key is not clicked, then we send
                // this accessed event to make sure the math input is still re-focused after the click.
                // (The click event appears to occur after the blur event on a mathInput.)
                onClick({
                    commands: [{ type: "accessed", command: "" }],
                    timestamp: +new Date(),
                });
            }}
        >
            <button
                className="open-keyboard-button"
                onClick={() => setOpen((old) => !old)}
                title={open ? "Close Keyboard" : "Open Keyboard"}
            >
                <KeyboardIcon />
            </button>
            <div className="keyboard-container">
                <button
                    className="close-keyboard-button"
                    onClick={() => setOpen(false)}
                    title="Close Keyboard"
                >
                    &times;
                </button>
                <ManagedKeyboard onClick={onClick} />
            </div>
        </div>,
        document.body,
    );
}
