/**
 * The math key strip for a page that embeds a DoenetML activity in an iframe.
 *
 * A strip drawn inside the iframe would sit at the bottom of the iframe, not
 * on top of the device's keyboard: the iframe cannot see the top-level visual
 * viewport (#2505). So the page that holds the iframe draws it, and talks to
 * the viewer over the channel `ExternalVirtualKeyboard` already uses for the
 * tray: the viewer reports `keyboard-focus`, and keys go back down as
 * `{ subject: "keyboard", keyCommands }`.
 *
 * The viewer inside must be rendered with `externalVirtualKeyboardProvided`
 * and `mathKeyStrip`, and without its own keyboard (`addVirtualKeyboard:
 * false`), which leaves the device's keyboard in play.
 *
 * No React and no stylesheet, so `@doenet/standalone` can ship this as a
 * small script for static pages. See `math-key-strip.ts`.
 */

import type { Translator } from "@doenet/i18n";
import type {
    IframeFocusMessage,
    IframeMessage,
} from "./external-virtual-keyboard";
import { createMathKeyStrip, MathKeyStripTheme } from "./math-key-strip";

export type HostMathKeyStripOptions = {
    /** `"system"` (the default) follows `prefers-color-scheme`. */
    theme?: MathKeyStripTheme | "system";
    /** Translator for the strip's labels. English when omitted. */
    translate?: Translator;
};

type Rect = { top: number; bottom: number };

/**
 * Reads a `keyboard-focus` message. `null` for anything else. `inputRect` is
 * optional: viewers from before it was added send only the focus bit, and the
 * strip is then placed without checking what it covers.
 */
export function readKeyboardFocusMessage(
    data: unknown,
): { focused: boolean; inputRect: Rect | null } | null {
    if (
        typeof data !== "object" ||
        data === null ||
        (data as { subject?: unknown }).subject !== "keyboard-focus"
    ) {
        return null;
    }
    const message = data as Partial<IframeFocusMessage>;
    const rect = message.inputRect;
    const inputRect =
        rect &&
        typeof rect === "object" &&
        Number.isFinite(rect.top) &&
        Number.isFinite(rect.bottom)
            ? { top: rect.top, bottom: rect.bottom }
            : null;
    return { focused: message.mathInputFocused === true, inputRect };
}

/**
 * Converts a box inside the iframe's viewport to the host page's layout
 * viewport, given where the iframe's content box is on the host page.
 */
export function iframeRectToHost(inner: Rect, frameContentTop: number): Rect {
    return {
        top: inner.top + frameContentTop,
        bottom: inner.bottom + frameContentTop,
    };
}

/**
 * Draws the math key strip for the activity in `iframe` and returns a
 * function that removes it. The strip shows only on a touch device (a coarse
 * primary pointer), while a math input in that iframe has focus.
 */
export function attachMathKeyStrip(
    iframe: HTMLIFrameElement,
    options: HostMathKeyStripOptions = {},
): () => void {
    const doc = iframe.ownerDocument;
    const win = doc.defaultView ?? window;

    // The same test the viewer uses for a touch device (`@doenet/utils`'s
    // `hasCoarsePrimaryPointer`), inlined to keep this script dependency-free.
    const coarse = win.matchMedia?.("(pointer: coarse)");
    const darkScheme = win.matchMedia?.("(prefers-color-scheme: dark)");

    function resolvedTheme(): MathKeyStripTheme {
        if (options.theme === "light" || options.theme === "dark") {
            return options.theme;
        }
        return darkScheme?.matches ? "dark" : "light";
    }

    let inputFocused = false;
    let inputRect: Rect | null = null;

    const strip = createMathKeyStrip({
        document: doc,
        theme: resolvedTheme(),
        translate: options.translate,
        onKeys(keyCommands) {
            iframe.contentWindow?.postMessage(
                { subject: "keyboard", keyCommands } satisfies IframeMessage,
                // The iframe may be on another origin; see
                // `ExternalVirtualKeyboard`. The viewer only acts on messages
                // whose `event.source` is its parent.
                "*",
            );
        },
        getAvoidRect() {
            if (!inputRect || !iframe.isConnected) {
                return null;
            }
            const frame = iframe.getBoundingClientRect();
            return iframeRectToHost(inputRect, frame.top + iframe.clientTop);
        },
    });

    function sync() {
        const focusInStrip = strip.contains(doc.activeElement);
        const wanted =
            iframe.isConnected &&
            (coarse?.matches ?? false) &&
            (inputFocused || (focusInStrip && strip.shown));
        if (wanted) {
            if (strip.shown) {
                strip.update();
            } else {
                strip.show();
            }
        } else {
            strip.hide();
        }
    }

    function onMessage(event: MessageEvent) {
        // Only this strip's own iframe may move it.
        if (event.source !== iframe.contentWindow) {
            return;
        }
        const message = readKeyboardFocusMessage(event.data);
        if (!message) {
            return;
        }
        inputFocused = message.focused;
        inputRect = message.inputRect;
        sync();
    }

    // Focus leaving the strip (a hardware keyboard's Tab) for somewhere that
    // is not a math input in the iframe hides it; going back into the iframe
    // brings a fresh `keyboard-focus` report that shows it again.
    function onFocusOut() {
        setTimeout(sync, 0);
    }

    function onThemeChange() {
        strip.setTheme(resolvedTheme());
    }

    win.addEventListener("message", onMessage);
    strip.element.addEventListener("focusout", onFocusOut);
    coarse?.addEventListener?.("change", sync);
    darkScheme?.addEventListener?.("change", onThemeChange);

    return function detach() {
        win.removeEventListener("message", onMessage);
        strip.element.removeEventListener("focusout", onFocusOut);
        coarse?.removeEventListener?.("change", sync);
        darkScheme?.removeEventListener?.("change", onThemeChange);
        strip.destroy();
    };
}
