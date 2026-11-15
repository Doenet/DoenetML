/**
 * A single row of math keys that sits on top of the device's own on-screen
 * keyboard while a math input has focus on a touch device.
 *
 * The device's keyboard already has letters and digits. What it lacks is the
 * notation — a union, an nth root, a fraction bar — which a reader otherwise
 * has to type as commands (`\cup`, `\nthroot`), several taps each. This strip
 * adds those, and only those.
 *
 * Framework-free on purpose: the same strip is mounted by the viewer on its
 * own page, and by a host page around an activity iframe
 * (`host-math-key-strip.ts`, shipped as a small script with
 * `@doenet/standalone`). A static host page — a PreTeXt book — has no React,
 * and the strip does not need it. Nothing in this file may import React or a
 * stylesheet, or the host script would carry them.
 */

import type { Translator } from "@doenet/i18n";
import {
    KeyCommand,
    OPERATOR_KEYS,
    SPECIAL_KEYS,
    SYMBOL_KEYS,
    TRIG_KEYS,
    VAR_KEYS,
} from "./keys";

/**
 * Marks an element as part of a virtual keyboard: focus moving into it does
 * not end the editing of the math input the reader was in. The tray is
 * recognized by its id; anything else that types into a math input — this
 * strip — carries this attribute. See `isInVirtualKeyboardTray`.
 */
export const VIRTUAL_KEYBOARD_PART_ATTRIBUTE = "data-doenet-virtual-keyboard";

/** One key of the strip. */
export type MathKeyStripKey = {
    /** Stable identifier, used for the CSS class and the label lookup. */
    name: MathKeyStripKeyName;
    /** What is drawn on the key. Hidden from assistive technology. */
    glyph: string;
    /** What pressing the key sends to the focused math input. */
    commands: KeyCommand[];
};

export type MathKeyStripKeyName =
    | "union"
    | "infinity"
    | "nthRoot"
    | "fraction"
    | "power"
    | "pi"
    | "intersection"
    | "leq"
    | "geq"
    | "lt"
    | "gt"
    | "neq"
    | "abs"
    | "plusMinus"
    | "moveRight";

/**
 * The scrolling keys, in the order they appear. Adding a key is one entry
 * here plus its label in `mathKeyStripLabels` (and the English catalog).
 *
 * Where the full keyboard already has the key, its commands are reused, so
 * the two keyboards type the same thing.
 */
export const MATH_KEY_STRIP_KEYS: readonly MathKeyStripKey[] = [
    {
        name: "union",
        glyph: "∪",
        commands: [{ type: "write", command: "\\cup" }],
    },
    { name: "infinity", glyph: "∞", commands: SYMBOL_KEYS.infty.commands },
    {
        // `\sqrt[]{}` with the caret in the index: type the index, move right
        // into the radicand, type it, move right again to leave the root.
        name: "nthRoot",
        glyph: "ⁿ√",
        commands: TRIG_KEYS.athRootOfB.commands,
    },
    {
        name: "fraction",
        glyph: "a⁄b",
        commands: OPERATOR_KEYS.divide.commands,
    },
    { name: "power", glyph: "xⁿ", commands: VAR_KEYS.exponent.commands },
    { name: "pi", glyph: "π", commands: VAR_KEYS.pi.commands },
    {
        name: "intersection",
        glyph: "∩",
        commands: [{ type: "write", command: "\\cap" }],
    },
    { name: "leq", glyph: "≤", commands: VAR_KEYS.leq.commands },
    { name: "geq", glyph: "≥", commands: VAR_KEYS.geq.commands },
    { name: "lt", glyph: "<", commands: VAR_KEYS.lt.commands },
    { name: "gt", glyph: ">", commands: VAR_KEYS.gt.commands },
    { name: "neq", glyph: "≠", commands: SYMBOL_KEYS.neq.commands },
    { name: "abs", glyph: "|x|", commands: VAR_KEYS.abs.commands },
    {
        name: "plusMinus",
        glyph: "±",
        commands: [{ type: "write", command: "\\pm" }],
    },
];

/**
 * The key pinned at the end of the row, outside the part that scrolls: it is
 * the one pressed after nearly every other key here, so it must never be
 * scrolled out of reach.
 *
 * It is the right arrow (MathQuill's `Right`), the same as the hardware right
 * arrow and the full keyboard's arrow key, which is what readers already use:
 * at the end of an exponent, index, numerator or radicand it steps out of it
 * (from a root's index, into its radicand); anywhere else it moves the cursor
 * one place to the right.
 */
export const MATH_KEY_STRIP_MOVE_RIGHT_KEY: MathKeyStripKey = {
    name: "moveRight",
    glyph: "\u2192",
    commands: SPECIAL_KEYS.right.commands,
};

/**
 * Renders the English string the call site already supplies, without pulling
 * the catalogs into this module (the same reasoning as `keyboard-tray.tsx`).
 */
const untranslated: Translator = (key, _args, fallback) => fallback ?? key;

/**
 * The accessible names of the keys, and of the strip itself, in words. Each
 * call has its key spelled out so that `lint:i18n` can see it.
 */
export function mathKeyStripLabels(
    translate: Translator = untranslated,
): Record<MathKeyStripKeyName | "toolbar", string> {
    const t = translate;
    return {
        toolbar: t("math-key-strip", undefined, "Math keys"),
        union: t("math-key-union", undefined, "union"),
        infinity: t("math-key-infinity", undefined, "infinity"),
        nthRoot: t("math-key-nth-root", undefined, "nth root"),
        fraction: t("math-key-fraction", undefined, "fraction"),
        power: t("math-key-power", undefined, "power"),
        pi: t("math-key-pi", undefined, "pi"),
        intersection: t("math-key-intersection", undefined, "intersection"),
        leq: t("math-key-less-or-equal", undefined, "less than or equal to"),
        geq: t(
            "math-key-greater-or-equal",
            undefined,
            "greater than or equal to",
        ),
        lt: t("math-key-less", undefined, "less than"),
        gt: t("math-key-greater", undefined, "greater than"),
        neq: t("math-key-not-equal", undefined, "not equal to"),
        abs: t("math-key-absolute-value", undefined, "absolute value"),
        plusMinus: t("math-key-plus-minus", undefined, "plus or minus"),
        moveRight: t("math-key-move-right", undefined, "move right"),
    };
}

/** Key size in CSS pixels. Height is fixed; width is fitted, see below. */
export const MATH_KEY_STRIP_SIZES = {
    keyHeight: 42,
    baseKeyWidth: 36,
    minKeyWidth: 32,
    maxKeyWidth: 44,
    gap: 6,
    padding: 6,
};

/**
 * The width to give each scrolling key so that the last one in view is cut
 * about in half, which is what tells the reader the row goes on.
 *
 * `available` is the width of the scrolling part. With `k` whole keys and
 * half of the next in view, `available = (k + 0.5) * width + k * gap`. Of the
 * widths between the minimum and maximum this gives, the one closest to the
 * base width wins. When every key fits, nothing is cut and the base width is
 * kept.
 */
export function fitMathKeyWidth(
    available: number,
    count: number,
    {
        baseKeyWidth,
        minKeyWidth,
        maxKeyWidth,
        gap,
    }: Pick<
        typeof MATH_KEY_STRIP_SIZES,
        "baseKeyWidth" | "minKeyWidth" | "maxKeyWidth" | "gap"
    > = MATH_KEY_STRIP_SIZES,
): number {
    if (!(available > 0) || count <= 0) {
        return baseKeyWidth;
    }
    if (count * baseKeyWidth + (count - 1) * gap <= available) {
        return baseKeyWidth;
    }
    let best: number | null = null;
    for (let whole = 1; whole < count; whole++) {
        const width = (available - whole * gap) / (whole + 0.5);
        if (width < minKeyWidth || width > maxKeyWidth) {
            continue;
        }
        if (
            best === null ||
            Math.abs(width - baseKeyWidth) < Math.abs(best - baseKeyWidth)
        ) {
            best = width;
        }
    }
    // Narrower than one and a half minimum keys: nothing sensible fits, so
    // keep the base width and let the row scroll.
    return best === null ? baseKeyWidth : Math.floor(best * 100) / 100;
}

/** The part of the visual viewport the strip needs, in layout pixels. */
export type ViewportBox = {
    offsetTop: number;
    offsetLeft: number;
    width: number;
    height: number;
};

/**
 * Where to put the strip: along the bottom of the visual viewport — the part
 * of the page that is not under the device's keyboard — and as wide as it.
 *
 * Coordinates are in the layout viewport, which is what `position: fixed`
 * measures from. On iOS the layout viewport keeps its height when the
 * keyboard opens, so a strip at `bottom: 0` would sit under the keyboard.
 */
export function placeMathKeyStrip(
    viewport: ViewportBox,
    stripHeight: number,
): { top: number; left: number; width: number } {
    return {
        top: viewport.offsetTop + viewport.height - stripHeight,
        left: viewport.offsetLeft,
        width: viewport.width,
    };
}

/**
 * How far to scroll the page down so that `box` (the focused input and its
 * check button) ends at least `margin` above the strip's top edge. Never so
 * far that the box's top leaves the visible area: a box too tall for the room
 * left keeps its top in view.
 */
export function scrollToClearMathKeyStrip(
    box: { top: number; bottom: number },
    stripTop: number,
    visibleTop: number,
    margin = 8,
): number {
    const overlap = box.bottom + margin - stripTop;
    if (overlap <= 0) {
        return 0;
    }
    const roomAbove = box.top - visibleTop - margin;
    return Math.max(0, Math.min(overlap, roomAbove));
}

/**
 * The index a key press moves the toolbar's focus to, or `null` for a key the
 * toolbar does not handle. Horizontal toolbar keys of the WAI-ARIA toolbar
 * pattern; the row is notation and always runs left to right.
 */
export function nextMathKeyIndex(
    current: number,
    key: string,
    count: number,
): number | null {
    switch (key) {
        case "ArrowRight":
            return (current + 1) % count;
        case "ArrowLeft":
            return (current - 1 + count) % count;
        case "Home":
            return 0;
        case "End":
            return count - 1;
        default:
            return null;
    }
}

/**
 * Colors, light and dark. Text on keys must reach 4.5:1; the key outline,
 * and the focus ring against both the key and the strip, 3:1 (WCAG 1.4.3,
 * 1.4.11). `math-key-strip.test.ts` checks every pair.
 */
export const MATH_KEY_STRIP_COLORS = {
    light: {
        stripBackground: "#e2e8f0",
        stripBorder: "#64748b",
        keyBackground: "#ffffff",
        keyPressedBackground: "#cbd5e1",
        keyText: "#0f172a",
        keyBorder: "#64748b",
        focusRing: "#1d4ed8",
    },
    dark: {
        stripBackground: "#1e1e1e",
        stripBorder: "#8a8a8a",
        keyBackground: "#2d2d2d",
        keyPressedBackground: "#4a4a4a",
        keyText: "#ffffff",
        keyBorder: "#9ca3af",
        focusRing: "#93c5fd",
    },
} as const;

export type MathKeyStripTheme = keyof typeof MATH_KEY_STRIP_COLORS;

const STYLE_ELEMENT_ID = "doenet-math-key-strip-style";
const ROOT_CLASS = "doenet-math-key-strip";

function themeRules(theme: MathKeyStripTheme) {
    const c = MATH_KEY_STRIP_COLORS[theme];
    return `--mks-strip-bg:${c.stripBackground};--mks-strip-border:${c.stripBorder};--mks-key-bg:${c.keyBackground};--mks-key-pressed-bg:${c.keyPressedBackground};--mks-key-text:${c.keyText};--mks-key-border:${c.keyBorder};--mks-focus:${c.focusRing};`;
}

/**
 * The strip's stylesheet. Injected once per document rather than shipped as a
 * CSS file, so a host page needs nothing but the script.
 */
function stylesheet() {
    const s = MATH_KEY_STRIP_SIZES;
    // The focus ring (3px, 1px off the key) reaches 4px outside a key. The
    // scrolling part clips what overflows it, so it is padded by that much
    // (and pulled back by a negative margin, leaving the layout as it was);
    // with less, the ring of a key in that part is cut flat on three sides.
    const ringRoom = 4;
    return `
.${ROOT_CLASS}{${themeRules("light")}
position:fixed;top:0;left:0;z-index:10001;box-sizing:border-box;
display:flex;align-items:center;gap:${s.gap}px;padding:${s.padding}px;
background:var(--mks-strip-bg);border-top:1px solid var(--mks-strip-border);
color:var(--mks-key-text);font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;
--mks-key-width:${s.baseKeyWidth}px;}
.${ROOT_CLASS}[hidden]{display:none;}
.${ROOT_CLASS}[data-theme="dark"]{${themeRules("dark")}}
.${ROOT_CLASS} .mks-scroller{display:flex;gap:${s.gap}px;flex:1 1 auto;min-width:0;
overflow-x:auto;overflow-y:hidden;overscroll-behavior-x:contain;scrollbar-width:none;
padding:${ringRoom}px;margin:-${ringRoom}px;}
.${ROOT_CLASS} .mks-scroller::-webkit-scrollbar{display:none;}
.${ROOT_CLASS} .mks-pinned{flex:0 0 auto;display:flex;padding:${ringRoom}px;margin:-${ringRoom}px;}
.${ROOT_CLASS} button{-webkit-appearance:none;appearance:none;box-sizing:border-box;margin:0;
flex:0 0 auto;width:var(--mks-key-width);height:${s.keyHeight}px;padding:0;
display:flex;align-items:center;justify-content:center;
font:inherit;font-size:20px;line-height:1;white-space:nowrap;
color:var(--mks-key-text);background:var(--mks-key-bg);
border:1px solid var(--mks-key-border);border-radius:6px;cursor:pointer;
touch-action:manipulation;-webkit-tap-highlight-color:transparent;user-select:none;-webkit-user-select:none;}
.${ROOT_CLASS} button.mks-key-abs,.${ROOT_CLASS} button.mks-key-fraction,.${ROOT_CLASS} button.mks-key-nthRoot,.${ROOT_CLASS} button.mks-key-power{font-size:16px;}
.${ROOT_CLASS} button:active{background:var(--mks-key-pressed-bg);}
.${ROOT_CLASS} button:focus{outline:none;}
.${ROOT_CLASS} button:focus-visible{outline:3px solid var(--mks-focus);outline-offset:1px;}
@media (forced-colors: active){.${ROOT_CLASS}{border-top:1px solid CanvasText;}
.${ROOT_CLASS} button{border:1px solid ButtonText;}
.${ROOT_CLASS} button:focus-visible{outline:3px solid Highlight;}}
`;
}

function ensureStylesheet(doc: Document) {
    if (doc.getElementById(STYLE_ELEMENT_ID)) {
        return;
    }
    const style = doc.createElement("style");
    style.id = STYLE_ELEMENT_ID;
    style.textContent = stylesheet();
    doc.head.appendChild(style);
}

export type MathKeyStripOptions = {
    /** Called with the commands of the key that was pressed. */
    onKeys: (commands: KeyCommand[]) => void;
    translate?: Translator;
    theme?: MathKeyStripTheme;
    /**
     * The box the strip must not cover (the focused input and its check
     * button), in the layout viewport's coordinates, or `null` if unknown.
     */
    getAvoidRect?: () => { top: number; bottom: number } | null;
    /** Called when Escape is pressed with focus in the strip. */
    onEscape?: () => void;
    /**
     * An element whose height the strip sets to its own while shown, so an
     * input near the end of the page can still be scrolled clear of it. When
     * omitted, the strip appends one to the end of `<body>` while shown.
     */
    spacer?: HTMLElement | null;
    /** The document to mount into. Defaults to the global `document`. */
    document?: Document;
};

export type MathKeyStrip = {
    /** The strip's root element (`role="toolbar"`). */
    element: HTMLElement;
    show(): void;
    hide(): void;
    readonly shown: boolean;
    /** Whether `node` is inside the strip. */
    contains(node: unknown): boolean;
    setTheme(theme: MathKeyStripTheme | undefined): void;
    setTranslate(translate: Translator | undefined): void;
    /** Moves focus to the strip's tab stop (the key last focused). */
    focus(): void;
    /** Re-place the strip and re-check that it covers nothing. */
    update(): void;
    destroy(): void;
};

function prefersReducedMotion(win: Window) {
    return (
        typeof win.matchMedia === "function" &&
        win.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
}

/**
 * Builds a strip, hidden, at the end of `<body>`. Show it while a math input
 * has focus and the device's own keyboard is in play.
 */
export function createMathKeyStrip(options: MathKeyStripOptions): MathKeyStrip {
    const doc = options.document ?? document;
    const win = doc.defaultView ?? window;
    ensureStylesheet(doc);

    let translate = options.translate;
    let shown = false;
    let destroyed = false;
    let ownSpacer: HTMLElement | null = null;
    let focusIndex = 0;

    const root = doc.createElement("div");
    root.className = ROOT_CLASS;
    root.setAttribute(VIRTUAL_KEYBOARD_PART_ATTRIBUTE, "");
    root.setAttribute("role", "toolbar");
    // Notation: the row reads left to right whatever the page's direction,
    // as the keys of the full keyboard do.
    root.dir = "ltr";
    root.hidden = true;
    if (options.theme) {
        root.setAttribute("data-theme", options.theme);
    }

    // Decline focus for the whole strip, as the tray does (issue #1692):
    // cancelling the default action of the pointer press keeps focus, and so
    // the device's keyboard, in the math input. Neither cancels the `click`
    // that presses the key, nor a finger panning the row (that would take
    // `touch-action` or a cancelled `touchstart`), nor moving into the strip
    // with the Tab key.
    root.addEventListener("pointerdown", (e) => e.preventDefault());
    root.addEventListener("mousedown", (e) => e.preventDefault());

    const scroller = doc.createElement("div");
    scroller.className = "mks-scroller";
    const pinned = doc.createElement("div");
    pinned.className = "mks-pinned";
    root.append(scroller, pinned);

    const allKeys = [...MATH_KEY_STRIP_KEYS, MATH_KEY_STRIP_MOVE_RIGHT_KEY];
    const buttons = allKeys.map((key, index) => {
        const button = doc.createElement("button");
        button.type = "button";
        button.className = `mks-key-${key.name}`;
        button.tabIndex = index === 0 ? 0 : -1;
        const glyph = doc.createElement("span");
        glyph.setAttribute("aria-hidden", "true");
        glyph.textContent = key.glyph;
        button.append(glyph);
        button.addEventListener("click", () => {
            options.onKeys(key.commands);
        });
        button.addEventListener("focus", () => {
            setFocusIndex(index);
        });
        (key === MATH_KEY_STRIP_MOVE_RIGHT_KEY ? pinned : scroller).append(
            button,
        );
        return button;
    });

    function applyLabels() {
        const labels = mathKeyStripLabels(translate);
        root.setAttribute("aria-label", labels.toolbar);
        allKeys.forEach((key, i) => {
            buttons[i].setAttribute("aria-label", labels[key.name]);
        });
    }
    applyLabels();

    function setFocusIndex(index: number) {
        focusIndex = index;
        buttons.forEach((b, i) => {
            b.tabIndex = i === index ? 0 : -1;
        });
    }

    root.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            if (options.onEscape) {
                e.preventDefault();
                options.onEscape();
            }
            return;
        }
        const next = nextMathKeyIndex(focusIndex, e.key, buttons.length);
        if (next === null) {
            return;
        }
        e.preventDefault();
        setFocusIndex(next);
        const button = buttons[next];
        button.focus({ preventScroll: true });
        button.scrollIntoView({
            block: "nearest",
            inline: "nearest",
            behavior: prefersReducedMotion(win) ? "auto" : "smooth",
        });
    });

    doc.body.appendChild(root);

    function fitKeys() {
        const available = scroller.clientWidth;
        const width = fitMathKeyWidth(available, MATH_KEY_STRIP_KEYS.length);
        root.style.setProperty("--mks-key-width", `${width}px`);
        // The pinned key keeps the base width whatever the scrolling keys do.
        buttons[buttons.length - 1].style.width =
            `${MATH_KEY_STRIP_SIZES.baseKeyWidth}px`;
    }

    function place() {
        const vv = win.visualViewport;
        const height = root.offsetHeight;
        let top: number;
        if (vv) {
            const box = placeMathKeyStrip(vv, height);
            top = box.top;
            root.style.width = `${box.width}px`;
            root.style.transform = `translate(${box.left}px, ${box.top}px)`;
        } else {
            top = win.innerHeight - height;
            root.style.width = "100%";
            root.style.transform = `translateY(${top}px)`;
        }
        return { top, visibleTop: vv ? vv.offsetTop : 0 };
    }

    function reserveSpace(height: number) {
        const spacer =
            options.spacer ??
            (ownSpacer ??= (() => {
                const div = doc.createElement("div");
                div.setAttribute("aria-hidden", "true");
                div.className = "doenet-math-key-strip-spacer";
                doc.body.appendChild(div);
                return div;
            })());
        spacer.style.height = height > 0 ? `${height}px` : "";
    }

    function update() {
        if (!shown || destroyed) {
            return;
        }
        // Place first: that sets the strip's width. Before it is set (the
        // first show), the scrolling part does not yet have the width it
        // ends up with, and the keys were fitted to the wrong one. Fitting
        // changes no heights, so `top` stays right.
        const { top, visibleTop } = place();
        fitKeys();
        const avoid = options.getAvoidRect?.();
        if (avoid) {
            const delta = scrollToClearMathKeyStrip(avoid, top, visibleTop);
            if (delta > 0) {
                win.scrollBy({ top: delta, behavior: "auto" });
            }
        }
    }

    // The keyboard opening and closing, pinch zoom and scrolling all move the
    // visual viewport; each needs the strip re-placed.
    let frame = 0;
    function scheduleUpdate() {
        if (frame) {
            return;
        }
        frame = win.requestAnimationFrame(() => {
            frame = 0;
            update();
        });
    }
    function placeOnly() {
        if (shown) {
            place();
        }
    }
    const vv = win.visualViewport;
    vv?.addEventListener("resize", scheduleUpdate);
    // Scrolling only moves the strip: re-checking the input on every scroll
    // frame would fight the reader scrolling the page themselves.
    vv?.addEventListener("scroll", placeOnly);
    win.addEventListener("resize", scheduleUpdate);

    return {
        element: root,
        get shown() {
            return shown;
        },
        show() {
            if (shown || destroyed) {
                return;
            }
            shown = true;
            root.hidden = false;
            reserveSpace(root.offsetHeight);
            update();
        },
        hide() {
            if (!shown) {
                return;
            }
            shown = false;
            root.hidden = true;
            reserveSpace(0);
        },
        contains(node: unknown) {
            return node instanceof win.Node && root.contains(node);
        },
        setTheme(theme) {
            if (theme) {
                root.setAttribute("data-theme", theme);
            } else {
                root.removeAttribute("data-theme");
            }
        },
        setTranslate(next) {
            translate = next;
            applyLabels();
        },
        focus() {
            buttons[focusIndex].focus({ preventScroll: true });
        },
        update,
        destroy() {
            destroyed = true;
            if (frame) {
                win.cancelAnimationFrame(frame);
            }
            vv?.removeEventListener("resize", scheduleUpdate);
            vv?.removeEventListener("scroll", placeOnly);
            win.removeEventListener("resize", scheduleUpdate);
            if (options.spacer) {
                options.spacer.style.height = "";
            }
            ownSpacer?.remove();
            root.remove();
        },
    };
}
