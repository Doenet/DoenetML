import React from "react";
import { createPortal } from "react-dom";
import { OnClick } from "./keyboard";
import { ManagedKeyboard } from "./managed-keyboard";
import classNames from "classnames";
import type { Translator } from "@doenet/i18n";
import "./keyboard-tray.css";

/**
 * Renders the English string the call site already supplies.
 *
 * A type-only import of `@doenet/i18n` is erased at build time, so this keeps
 * the catalogs out of the keyboard bundle. `@doenet/doenetml` bundles both
 * this package's output and `@doenet/i18n`, and a runtime import here would
 * inline a second copy of the English catalogs into the result.
 */
const untranslated: Translator = (key, _args, fallback) => fallback ?? key;

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
export function KeyboardTray({
    onClick,
    theme,
    translate,
}: {
    onClick: OnClick;
    theme?: "dark" | "light";
    /**
     * Chrome translator for the tray's labels. Passed in rather than read from
     * React context because the tray is rendered into its own root, shared by
     * every viewer on the page — see `UniqueKeyboardTray`. Defaults to English
     * so a host that never configured a locale is unaffected.
     */
    translate?: Translator;
}) {
    const [open, setOpen] = React.useState(false);
    const t = translate ?? untranslated;
    const openLabel = t("keyboard-open", undefined, "Open Keyboard");
    const closeLabel = t("keyboard-close", undefined, "Close Keyboard");

    return createPortal(
        <div
            id="virtual-keyboard-tray"
            data-theme={theme}
            className={classNames({ open })}
            onMouseDown={() => {
                // The mousedown event appears to precede a blur event on a mathInput,
                // so this access event will set the accessed timestamp to be
                // just before the time of the blur if keyboard is clicked while the mathInput is focused.
                onClick([
                    { type: "accessed", command: "", timestamp: +new Date() },
                ]);
            }}
            onClick={() => {
                // If the keyboard is clicked but a key is not clicked, then we send
                // this accessed event to make sure the math input is still re-focused after the click.
                // (The click event appears to occur after the blur event on a mathInput.)
                onClick([
                    { type: "accessed", command: "", timestamp: +new Date() },
                ]);
            }}
        >
            <button
                className="open-keyboard-button"
                onClick={() => setOpen((old) => !old)}
                title={open ? closeLabel : openLabel}
                aria-label={open ? closeLabel : openLabel}
            >
                <KeyboardIcon />
            </button>
            <div className="keyboard-container">
                <button
                    className="close-keyboard-button"
                    onClick={() => setOpen(false)}
                    title={closeLabel}
                    aria-label={closeLabel}
                >
                    &times;
                </button>
                <ManagedKeyboard onClick={onClick} />
            </div>
        </div>,
        document.body,
    );
}
