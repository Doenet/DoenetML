import { useEffect, type RefObject } from "react";

/**
 * Matches elements that browsers put in the sequential tab order because of an
 * explicit `tabindex`. `tabindex="-1"` is focusable programmatically but not
 * tabbable, which is exactly the state we want MathJax's output left in.
 */
const TAB_STOP_SELECTOR = '[tabindex]:not([tabindex="-1"])';

/** MathJax renders into custom elements whose tag names all start with `mjx-`. */
const MATHJAX_TAG_PREFIX = "MJX-";

/**
 * Take MathJax's output inside `root` out of the tab order.
 *
 * MathJax 4 attaches its keyboard explorer to every expression it typesets,
 * which puts `tabindex="0"` on the `<mjx-container>` (and, once speech is
 * generated, on the `<mjx-speech>` node inside it). That is reasonable for math
 * in running text, but not for math inside a JSXGraph board: the board is
 * exposed to assistive technology as a single image (or as a group whose
 * accessible content is the `<shortDescription>`), so a tab stop on a label
 * lands the user on something that is not in the accessibility tree and offers
 * nothing to interact with.
 *
 * Only MathJax's own elements are touched: JSXGraph puts `tabindex` on the
 * elements it wants keyboard-navigable, and a `<mathInput>` or `<button>`
 * anchored in the board keeps its own focusable controls.
 */
function removeMathJaxTabStops(root: Element): void {
    root.querySelectorAll(TAB_STOP_SELECTOR).forEach((node) => {
        if (node.tagName.startsWith(MATHJAX_TAG_PREFIX)) {
            node.setAttribute("tabindex", "-1");
        }
    });
}

/**
 * Keep MathJax's output inside `rootRef` out of the tab order, including math
 * typeset after mount.
 *
 * A `MutationObserver` is needed rather than a one-shot pass: nothing has been
 * typeset yet when this runs, JSXGraph typesets each label when it draws or
 * re-texts it, and MathJax sets the tab stop again whenever asynchronously
 * generated speech arrives. Rewriting the attribute to `-1` re-triggers the
 * observer once, which then finds nothing left to change, so this settles
 * rather than looping.
 *
 * `rootRef` is read once, on mount, so it must be attached to an element that
 * the calling component renders unconditionally.
 */
export function useMathJaxOutOfTabOrder(
    rootRef: RefObject<Element | null>,
): void {
    useEffect(() => {
        const root = rootRef.current;
        if (!root) {
            return;
        }
        removeMathJaxTabStops(root);

        if (typeof MutationObserver === "undefined") {
            return;
        }
        const observer = new MutationObserver(() => {
            removeMathJaxTabStops(root);
        });
        observer.observe(root, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ["tabindex"],
        });
        return () => {
            observer.disconnect();
        };
    }, []);
}
