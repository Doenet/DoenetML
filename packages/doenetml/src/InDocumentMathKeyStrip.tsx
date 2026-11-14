import React from "react";
import {
    createMathKeyStrip,
    type KeyCommand,
    type MathKeyStrip,
} from "@doenet/virtual-keyboard";
import {
    hasCoarsePrimaryPointer,
    subscribeToPrimaryPointerType,
} from "@doenet/utils";
import type { Translator } from "@doenet/i18n";

/**
 * The box a keyboard along the bottom of the screen must leave clear for the
 * focused math input: the field and, beside it, its check button.
 *
 * `owner` is what a math input registers as focused — the MathQuill field.
 * Its `.mathInputWrapper` sits in the input's row with the check button and
 * the description (see `mathInput.tsx`); a field anywhere else (in a graph)
 * is used alone.
 */
export function focusedMathInputBox(owner: HTMLElement): {
    top: number;
    bottom: number;
} {
    const row = owner.closest(".mathInputWrapper")?.parentElement ?? owner;
    const rect = row.getBoundingClientRect();
    return { top: rect.top, bottom: rect.bottom };
}

function useHasCoarsePrimaryPointer(): boolean {
    return React.useSyncExternalStore(
        subscribeToPrimaryPointerType,
        hasCoarsePrimaryPointer,
        () => false,
    );
}

/**
 * The math key strip for a viewer on the page it is rendered in (not in an
 * iframe — that is drawn by the embedding page, `host-math-key-strip.ts`).
 *
 * Shown on a touch device while one of this viewer's math inputs has focus,
 * or focus is in the strip itself, and the device's own keyboard is in play
 * for it — the same condition under which a math input lets the device raise
 * its keyboard (`mathInput.tsx`). With a Doenet keyboard on the page, that is
 * only once the reader has closed the tray.
 */
export function InDocumentMathKeyStrip({
    ownerRef,
    deviceKeyboardInPlay,
    onKeys,
    theme,
    translate,
    spacerRef,
}: {
    /** The focused math input of this viewer, as `FocusedMathInputContext`. */
    ownerRef: React.RefObject<HTMLElement | null>;
    deviceKeyboardInPlay: boolean;
    onKeys: (commands: KeyCommand[]) => void;
    theme?: "dark" | "light";
    translate?: Translator;
    /** Kept the strip's height while it is shown; see `MathKeyStripOptions`. */
    spacerRef: React.RefObject<HTMLElement | null>;
}) {
    const coarsePointer = useHasCoarsePrimaryPointer();
    const stripRef = React.useRef<MathKeyStrip | null>(null);
    const onKeysRef = React.useRef(onKeys);
    onKeysRef.current = onKeys;

    React.useEffect(() => {
        const strip = createMathKeyStrip({
            onKeys: (commands) => onKeysRef.current(commands),
            spacer: spacerRef.current,
            getAvoidRect() {
                const owner = ownerRef.current;
                return owner ? focusedMathInputBox(owner) : null;
            },
            onEscape() {
                // Back to the input the keys were typing into.
                ownerRef.current?.querySelector("textarea")?.focus();
            },
        });
        stripRef.current = strip;
        return () => {
            stripRef.current = null;
            strip.destroy();
        };
    }, []);

    React.useEffect(() => {
        stripRef.current?.setTheme(theme);
    }, [theme]);

    React.useEffect(() => {
        stripRef.current?.setTranslate(translate);
    }, [translate]);

    React.useEffect(() => {
        let pending: ReturnType<typeof setTimeout> | undefined;

        function sync() {
            const strip = stripRef.current;
            if (!strip) {
                return;
            }
            const active = document.activeElement;
            const owner = ownerRef.current;
            // `ownerRef` stays set while focus is in the strip: the math input
            // keeps its claim on the keys (see `isInVirtualKeyboardTray`).
            const editing =
                owner !== null &&
                active instanceof Node &&
                (owner.contains(active) || strip.contains(active));
            if (coarsePointer && deviceKeyboardInPlay && editing) {
                strip.show();
            } else {
                strip.hide();
            }
        }

        function scheduleSync() {
            // Focus passes through `<body>` between two elements; read
            // `document.activeElement` once it has landed.
            clearTimeout(pending);
            pending = setTimeout(sync, 0);
        }

        sync();
        document.addEventListener("focusin", scheduleSync);
        document.addEventListener("focusout", scheduleSync);
        return () => {
            clearTimeout(pending);
            document.removeEventListener("focusin", scheduleSync);
            document.removeEventListener("focusout", scheduleSync);
        };
    }, [coarsePointer, deviceKeyboardInPlay]);

    React.useEffect(() => {
        // The strip lives at the end of `<body>`, so in document order it is
        // nowhere near the input it types into, and it hides as soon as focus
        // leaves that input — a reader with a hardware keyboard (a tablet
        // with a keyboard case) could never Tab to it. So the Tab order is
        // bridged: input → strip → whatever follows the input; Shift+Tab from
        // the strip goes back to the input.
        function onKeyDown(event: KeyboardEvent) {
            const strip = stripRef.current;
            const owner = ownerRef.current;
            if (
                event.key !== "Tab" ||
                event.altKey ||
                event.ctrlKey ||
                event.metaKey ||
                !strip?.shown ||
                !owner
            ) {
                return;
            }
            const active = document.activeElement;
            if (owner.contains(active)) {
                // MathQuill handles Tab itself inside an exponent, root or
                // fraction (it moves to the next part) and cancels it then; only
                // a Tab it let through leaves the input.
                if (!event.shiftKey && !event.defaultPrevented) {
                    event.preventDefault();
                    strip.focus();
                }
                return;
            }
            if (!strip.contains(active)) {
                return;
            }
            if (event.shiftKey) {
                event.preventDefault();
                owner.querySelector("textarea")?.focus();
                return;
            }
            const next = nextTabbableAfter(owner, strip.element);
            if (next) {
                event.preventDefault();
                next.focus();
            }
        }
        document.addEventListener("keydown", onKeyDown);
        return () => document.removeEventListener("keydown", onKeyDown);
    }, []);

    return null;
}

const TABBABLE =
    'a[href], area[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), iframe, [contenteditable="true"], [tabindex]';

/**
 * The first element after `after` in document order that the Tab key would
 * reach, skipping anything inside `exclude` (the strip). `null` if none.
 *
 * Elements with a positive `tabindex` are treated as document order: the
 * viewer uses none.
 */
function nextTabbableAfter(
    after: Element,
    exclude: Element,
): HTMLElement | null {
    for (const element of Array.from(
        document.querySelectorAll<HTMLElement>(TABBABLE),
    )) {
        if (
            element.tabIndex < 0 ||
            after.contains(element) ||
            exclude.contains(element) ||
            !(
                after.compareDocumentPosition(element) &
                Node.DOCUMENT_POSITION_FOLLOWING
            ) ||
            element.getClientRects().length === 0
        ) {
            continue;
        }
        return element;
    }
    return null;
}
