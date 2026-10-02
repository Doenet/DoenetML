import React, { createContext, useContext, useRef } from "react";
import { useMathJaxOutOfTabOrder } from "./useMathJaxOutOfTabOrder";
import "./clickTarget.css";

/**
 * Set to `true` around content that is already inside an interactive
 * element (a button, link, `<label>`, or select option). A click target
 * there renders as plain content, since HTML does not allow one
 * interactive element inside another.
 */
export const NoClickTargetContext = createContext(false);

/**
 * Return whether a component that is a click target may render as a
 * button here. Call it with the renderer's other hooks, before any early
 * return.
 */
export function useClickTargetAllowed(): boolean {
    return !useContext(NoClickTargetContext);
}

/**
 * A button that reads as the text, number, label, or image it wraps, for a
 * component that another component's `triggerWhenObjectsClicked` refers to.
 *
 * It is a `<span role="button">` so that a clickable phrase wraps across
 * lines with the text around it. It is a tab stop, and it is activated by a
 * click, by Enter (on key down), and by Space (on key up, without scrolling
 * the page), as a native button is. A screen reader's own activation
 * arrives as a click.
 *
 * Set `block` for content that is displayed as a block, such as an image
 * on its own line.
 */
export function ClickTargetButton({
    onClick,
    block = false,
    children,
}: {
    onClick: () => void;
    block?: boolean;
    children: React.ReactNode;
}) {
    const buttonRef = useRef<HTMLSpanElement>(null);

    // Whether Space went down on this button, so that its release activates it.
    const spacePressed = useRef(false);

    // Math inside the button must not add a tab stop of its own.
    useMathJaxOutOfTabOrder(buttonRef);

    function onKeyDown(e: React.KeyboardEvent) {
        if (e.altKey || e.ctrlKey || e.metaKey) {
            return;
        }
        if (e.key === "Enter") {
            e.preventDefault();
            if (!e.repeat) {
                onClick();
            }
        } else if (e.key === " ") {
            e.preventDefault();
            spacePressed.current = true;
        }
    }

    function onKeyUp(e: React.KeyboardEvent) {
        if (e.key === " " && spacePressed.current) {
            e.preventDefault();
            spacePressed.current = false;
            onClick();
        }
    }

    return (
        <span
            ref={buttonRef}
            role="button"
            tabIndex={0}
            className={
                block
                    ? "doenet-click-target doenet-click-target--block"
                    : "doenet-click-target"
            }
            onClick={onClick}
            onKeyDown={onKeyDown}
            onKeyUp={onKeyUp}
            onBlur={() => {
                spacePressed.current = false;
            }}
        >
            <NoClickTargetContext.Provider value={true}>
                {children}
            </NoClickTargetContext.Provider>
        </span>
    );
}
