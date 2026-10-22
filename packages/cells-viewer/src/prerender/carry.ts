// What a student did to a prerendered page before its live viewer
// replaced it, carried over to the live viewer. The snapshot's controls
// are the browser's own until then: text can be typed, a checkbox ticked,
// a radio button or a slider moved and a hint opened, but none of it
// reaches the core, and a button does nothing. So just before React
// replaces the snapshot (`captureSnapshot`), every control whose state
// differs from what the server rendered is noted, with the focus, the
// selection, the scroll position and the buttons pressed (recorded since
// the page began by `recordEarlyClicks`, `head-script.ts`). Once the live
// viewer has drawn, the same is done to its controls (`replay`), through
// the events a student's own input fires, so each reaches the core as it
// would have: text typed in an input the student has since left is
// committed, as leaving it commits it in the live viewer, and text in the
// input still focused stays typed and uncommitted until Enter or blur; a
// checkbox, a radio button, a slider and a hint commit at once; and a
// button pressed in the snapshot is pressed again, in order, after them.
//
// A control is found again by its component (`data-comp`, the same in
// both: one source, one seed) and its position among that component's
// controls, or as the component's own element: an input renderer puts
// `data-comp` on its `<input>` itself.

/** A control: its component, and its index among the component's
 * controls, or -1 for the component's own element. */
type Key = { comp: string; index: number };

const CONTROLS = "input, button, summary";

/** What `captureSnapshot` noted, for `replay`. */
export type Carried = {
    texts: { key: Key; value: string }[];
    /** Checkboxes and radio buttons, and whether each is now checked. */
    checks: { key: Key; checked: boolean }[];
    ranges: { key: Key; value: string }[];
    clicks: Key[];
    focus: {
        key: Key;
        start: number | null;
        end: number | null;
    } | null;
    scroll: [number, number];
};

declare global {
    interface Window {
        /** The buttons and hint summaries pressed on a prerendered page
         * before its live viewer came (`recordEarlyClicks`). */
        __cellsClicks?: Element[];
    }
}

function keyOf(el: Element): Key | null {
    const comp = el.closest("[data-comp]");
    const id = comp?.getAttribute("data-comp");
    if (!comp || id === null || id === undefined) return null;
    if (comp === el) return { comp: id, index: -1 };
    const index = [...comp.querySelectorAll(CONTROLS)].indexOf(el);
    return index < 0 ? null : { comp: id, index };
}

function find(root: Element, key: Key): HTMLElement | null {
    const comp = root.querySelector(`[data-comp="${CSS.escape(key.comp)}"]`);
    const el =
        key.index < 0 ? comp : comp?.querySelectorAll(CONTROLS)[key.index];
    return el instanceof HTMLElement ? el : null;
}

function isText(el: HTMLInputElement) {
    return el.type === "text" || el.type === "";
}

/** Note what the student changed on the snapshot in `root`. Call it while
 * the snapshot is still in the page, just before it is replaced. */
export function captureSnapshot(root: Element): Carried {
    const carried: Carried = {
        texts: [],
        checks: [],
        ranges: [],
        clicks: [],
        focus: null,
        scroll: [window.scrollX, window.scrollY],
    };
    for (const el of root.querySelectorAll("input")) {
        const key = keyOf(el);
        if (!key) continue;
        // The `default*` properties are the attributes the server wrote.
        if (
            (el.type === "checkbox" || el.type === "radio") &&
            el.checked !== el.defaultChecked
        )
            carried.checks.push({ key, checked: el.checked });
        else if (el.type === "range" && el.value !== el.defaultValue)
            carried.ranges.push({ key, value: el.value });
        else if (isText(el) && el.value !== el.defaultValue)
            carried.texts.push({ key, value: el.value });
    }
    for (const el of window.__cellsClicks ?? []) {
        const key = root.contains(el) ? keyOf(el) : null;
        if (key) carried.clicks.push(key);
    }
    const active = document.activeElement;
    if (active && active !== document.body && root.contains(active)) {
        const key = keyOf(active);
        if (key)
            carried.focus = {
                key,
                start:
                    active instanceof HTMLInputElement
                        ? active.selectionStart
                        : null,
                end:
                    active instanceof HTMLInputElement
                        ? active.selectionEnd
                        : null,
            };
    }
    return carried;
}

/** Set an input's value as typing it would, so React's `onChange` sees
 * it (setting `value` alone bypasses React's tracking of it). */
function type(el: HTMLInputElement, value: string) {
    Object.getOwnPropertyDescriptor(
        HTMLInputElement.prototype,
        "value",
    )!.set!.call(el, value);
    el.dispatchEvent(new Event("input", { bubbles: true }));
}

/** Do to the live viewer in `root` what `carried` says the student did
 * to the snapshot. */
export function replay(root: Element, carried: Carried) {
    const focused = carried.focus && find(root, carried.focus.key);
    for (const { key, value } of carried.texts) {
        const el = find(root, key);
        if (!(el instanceof HTMLInputElement)) continue;
        type(el, value);
        // An input the student typed in and left would have committed
        // when it lost the focus; the one still focused is still being
        // typed in, and commits on Enter or blur, as in the live viewer.
        if (el !== focused) {
            el.focus({ preventScroll: true });
            el.blur();
        }
    }
    for (const { key, checked } of carried.checks) {
        const el = find(root, key);
        if (el instanceof HTMLInputElement && el.checked !== checked)
            el.click();
    }
    for (const { key, value } of carried.ranges) {
        const el = find(root, key);
        if (el instanceof HTMLInputElement) type(el, value);
    }
    for (const key of carried.clicks) find(root, key)?.click();
    const f = carried.focus;
    if (f && focused) {
        focused.focus({ preventScroll: true });
        if (
            focused instanceof HTMLInputElement &&
            f.start !== null &&
            isText(focused)
        )
            focused.setSelectionRange(f.start, f.end ?? f.start);
    }
    window.scrollTo(carried.scroll[0], carried.scroll[1]);
}
