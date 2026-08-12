import React from "react";
import { createPortal } from "react-dom";
import { OnClick } from "./keyboard";
import { ManagedKeyboard } from "./managed-keyboard";
import classNames from "classnames";
import type { Direction, Translator } from "@doenet/i18n";
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

/**
 * The id of the tray's root element. Only one tray exists per page, so an id
 * identifies it; `keyboard-tray.css` styles it by the same name.
 */
export const VIRTUAL_KEYBOARD_TRAY_ID = "virtual-keyboard-tray";

/** The tray's root element, or `null` when no tray is on the page. */
export function getVirtualKeyboardTrayElement(): HTMLElement | null {
    return document.getElementById(VIRTUAL_KEYBOARD_TRAY_ID);
}

/**
 * Whether `node` is inside the keyboard tray.
 *
 * How a math input tells a blur that hands over to the keyboard from one that
 * leaves the input for good, and how the tray tells that focus is being kept
 * inside itself rather than moving away from the input it types into.
 */
export function isInVirtualKeyboardTray(node: EventTarget | null): boolean {
    return (
        node instanceof Node &&
        (getVirtualKeyboardTrayElement()?.contains(node) ?? false)
    );
}

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
    open,
    onOpenChange,
    theme,
    translate,
    direction,
}: {
    onClick: OnClick;
    /**
     * Whether the tray is expanded. Controlled by `UniqueKeyboardTray`, which
     * also opens it when focus lands in a math input on a touch device.
     */
    open: boolean;
    onOpenChange: (open: boolean) => void;
    theme?: "dark" | "light";
    /**
     * Chrome translator for the tray's labels. Passed in rather than read from
     * React context because the tray is rendered into its own root, shared by
     * every viewer on the page — see `UniqueKeyboardTray`. Defaults to English
     * so a host that never configured a locale is unaffected.
     */
    translate?: Translator;
    /**
     * The reader's writing direction. Passed in for the same reason
     * `translate` is: this renders into its own root on `document.body` and
     * inherits nothing from the viewer that owns it.
     *
     * It governs the tray's own chrome — where the open/close tab sits, which
     * end the close button is on. The keys themselves stay left-to-right;
     * `keyboard.css` pins them, because they are notation.
     */
    direction?: Direction;
}) {
    const t = translate ?? untranslated;
    const openLabel = t("keyboard-open", undefined, "Open Keyboard");
    const closeLabel = t("keyboard-close", undefined, "Close Keyboard");

    const containerRef = React.useRef<HTMLDivElement>(null);

    /*
     * Open onto the top of the keyboard. The container below is a scroll port
     * on a screen with no room for the whole keyboard (see
     * `keyboard-tray.css`), and a closed tray keeps whatever scroll position
     * it was left at — so without this, a reader who had scrolled down to the
     * number pad would find the tray reopening onto the middle of it, with the
     * layout tabs, which are the first thing in the port, out of sight above.
     *
     * Before the paint, so the reset is never seen: the tray is still below
     * the fold at this point, since the slide-in transition has yet to run a
     * frame.
     */
    React.useLayoutEffect(() => {
        if (open && containerRef.current) {
            containerRef.current.scrollTop = 0;
        }
    }, [open]);

    return createPortal(
        <div
            id={VIRTUAL_KEYBOARD_TRAY_ID}
            data-theme={theme}
            dir={direction}
            className={classNames({ open })}
            // Decline focus for the whole tray, keys included: the events from
            // the buttons bubble to here, and cancelling the default action of
            // the pointer press is what stops focus from leaving the input the
            // reader is typing into. Without this the input blurs on every key
            // and has to be refocused, which on Android re-summons the system
            // keyboard on top of this tray (issue #1692), and which made the
            // keyboard unusable from the keyboard itself (issue #747) because
            // "which input receives keys" was tied to `document.activeElement`.
            //
            // `pointerdown` covers touch and mouse; `mousedown` is the fallback
            // for browsers that deliver no pointer events. Neither cancels the
            // subsequent `click`, so the keys themselves still work, and
            // neither affects moving focus into the tray with the Tab key.
            onPointerDown={(e) => e.preventDefault()}
            onMouseDown={(e) => e.preventDefault()}
        >
            <button
                className="open-keyboard-button"
                onClick={() => onOpenChange(!open)}
                title={open ? closeLabel : openLabel}
                aria-label={open ? closeLabel : openLabel}
            >
                <KeyboardIcon />
            </button>
            <div className="keyboard-container" ref={containerRef}>
                <button
                    className="close-keyboard-button"
                    onClick={() => onOpenChange(false)}
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
