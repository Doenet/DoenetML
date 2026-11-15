import React, { useRef } from "react";
import { useMathJaxOutOfTabOrder } from "./useMathJaxOutOfTabOrder";

/**
 * The control that opens and closes a disclosure panel: a collapsible
 * section, an `<aside>`, a `<hint>` or a `<solution>`.
 *
 * A native `<button>` is what makes it a real control: assistive technology
 * announces it as a button, Enter and Space both fire its `click` (so no key
 * handler is needed, and none may be added or a key would act twice), and it
 * is a tab stop of its own. The explicit `tabIndex={0}` is for Safari, whose
 * default settings make Tab skip a native button without a tabindex; the
 * `tabindex="0"` banner this replaces was reached by Tab there. The
 * check-work button also sets `tabIndex={0}` on its native button.
 *
 * Its state is `aria-expanded`; `aria-controls` names the panel's content
 * only while that content is rendered, the same rule as the graph controls'
 * `ControlCard`.
 *
 * A title may hold math, and MathJax 4 makes every expression it typesets a
 * tab stop. Inside a button that would be a second, nested stop on the same
 * control, so MathJax's output is kept out of the tab order here.
 *
 * Every other prop (`id`, `className`, `style`, `data-test`, `onClick`, …)
 * passes through to the button.
 */
export function DisclosureButton({
    open,
    contentId,
    children,
    ...rest
}: {
    open: boolean;
    contentId: string;
    children: React.ReactNode;
} & Omit<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    "type" | "aria-expanded" | "aria-controls"
> &
    Record<`data-${string}`, string>) {
    const ref = useRef<HTMLButtonElement>(null);
    useMathJaxOutOfTabOrder(ref);
    return (
        <button
            ref={ref}
            type="button"
            tabIndex={0}
            aria-expanded={open}
            aria-controls={open ? contentId : undefined}
            {...rest}
        >
            {children}
        </button>
    );
}
