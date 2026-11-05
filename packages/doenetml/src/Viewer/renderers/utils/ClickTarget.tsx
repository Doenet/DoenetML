import React, {
    createContext,
    useContext,
    useLayoutEffect,
    useRef,
    useState,
} from "react";
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
 * Controls that content can bring into a click target, such as a `<ref>`
 * link or an input in a `<label>`.
 */
const CONTROL_SELECTOR =
    'a[href], button, input, select, textarea, [role="button"], [contenteditable="true"]';

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
 *
 * Set `ariaDetails` to the id of the content's description. The button's
 * content is presentational to assistive technology, so an `aria-details`
 * on the content itself is not announced.
 *
 * Content that holds a control of its own, such as a `<label>` with a
 * `<ref>` in it, is shown plain instead: a control inside a button can't
 * be reached, and its clicks would also activate the button.
 */
export function ClickTargetButton({
    onClick,
    block = false,
    ariaDetails,
    children,
}: {
    onClick: () => void;
    block?: boolean;
    ariaDetails?: string;
    children: React.ReactNode;
}) {
    const buttonRef = useRef<HTMLSpanElement>(null);

    // Whether Space went down on this button, so that its release activates it.
    const spacePressed = useRef(false);

    // Math inside the button must not add a tab stop of its own.
    useMathJaxOutOfTabOrder(buttonRef);

    const [containsControl, setContainsControl] = useState(false);

    // Check again whenever the content changes, since a child can render
    // its control after this mounts.
    useLayoutEffect(() => {
        const root = buttonRef.current;
        if (!root) {
            return;
        }
        const check = () => {
            setContainsControl(root.querySelector(CONTROL_SELECTOR) !== null);
        };
        check();
        const observer = new MutationObserver(check);
        observer.observe(root, { childList: true, subtree: true });
        return () => {
            observer.disconnect();
        };
    }, []);

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

    if (containsControl) {
        return (
            <span ref={buttonRef}>
                <NoClickTargetContext.Provider value={true}>
                    {children}
                </NoClickTargetContext.Provider>
            </span>
        );
    }

    return (
        <span
            ref={buttonRef}
            role="button"
            tabIndex={0}
            aria-details={ariaDetails}
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
