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
 * A native button styled to read as the text, number, label, or image it
 * wraps, for a component that another component's
 * `triggerWhenObjectsClicked` refers to. A native button gives the
 * component a tab stop, Enter and Space activation, and the button role.
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
    const buttonRef = useRef<HTMLButtonElement>(null);

    // Math inside the button must not add a tab stop of its own.
    useMathJaxOutOfTabOrder(buttonRef);

    return (
        <button
            ref={buttonRef}
            type="button"
            className={
                block
                    ? "doenet-click-target doenet-click-target--block"
                    : "doenet-click-target"
            }
            onClick={onClick}
        >
            <NoClickTargetContext.Provider value={true}>
                {children}
            </NoClickTargetContext.Provider>
        </button>
    );
}
