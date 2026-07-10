import React, { useEffect, useRef } from "react";
import { loadMathJax } from "@doenet/utils";

/**
 * Renders continuously-updating inline math (e.g. `$P` while a point is
 * dragged) without the flash of raw LaTeX.
 *
 * `better-react-mathjax`'s `<MathJax dynamic>` writes the new raw LaTeX into the
 * DOM and typesets it *asynchronously*. When updates outpace MathJax (dragging a
 * point referenced many times), that leaves raw LaTeX on screen, and its update
 * effect can drop the final typeset, leaving one element stuck showing raw
 * LaTeX until the next unrelated re-render.
 *
 * This component double-buffers instead: it typesets the new LaTeX on an
 * off-screen buffer and swaps the rendered result into place only once it is
 * ready, keeping the previously rendered output visible in the meantime. Rapid
 * updates are coalesced to the latest value (so nothing is ever left
 * un-typeset) and throttled (so a fast drag doesn't flood MathJax). The visible
 * math is therefore always rendered — momentarily stale during a fast drag,
 * never raw and never blank.
 *
 * `latex` is the full inline string including delimiters, e.g. `\(x^2\)`.
 */

/** Minimum time between typesets of a single element (ms). Caps how often a
 * fast drag re-typesets; the displayed value lags by at most this plus one
 * typeset, which is imperceptible for coordinate read-outs. */
const THROTTLE_MS = 100;

/** The parts of a loaded MathJax 3/4 engine this component uses. */
interface LoadedMathJax {
    startup: { promise: Promise<unknown> };
    typesetPromise: (nodes: HTMLElement[]) => Promise<unknown>;
    typesetClear: (nodes: HTMLElement[]) => void;
}

export function DynamicMath({ latex }: { latex: string }) {
    const visibleRef = useRef<HTMLSpanElement>(null);
    const bufferRef = useRef<HTMLSpanElement | null>(null);
    // Latest requested value, the one currently displayed, and a re-entrancy
    // guard so only one typeset runs at a time per element.
    const pending = useRef<string | null>(null);
    const current = useRef<string | null>(null);
    const busy = useRef(false);
    const lastTypesetAt = useRef(0);
    // False once unmounted, so an in-flight `pump` stops before touching a
    // detached node or re-creating the off-screen buffer after cleanup.
    const mounted = useRef(true);

    useEffect(() => {
        pending.current = latex;
        void pump();
        // `pump` reads refs only; re-running it whenever `latex` changes is all
        // that is needed.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [latex]);

    useEffect(() => {
        // Set on setup (not just at declaration) so a StrictMode remount, which
        // reruns this effect after the cleanup below, re-arms the guard.
        mounted.current = true;
        return () => {
            mounted.current = false;
            bufferRef.current?.remove();
            bufferRef.current = null;
        };
    }, []);

    async function pump() {
        if (busy.current) {
            return;
        }
        const visible = visibleRef.current;
        if (!visible) {
            return;
        }
        busy.current = true;
        try {
            const MathJax = (await loadMathJax()) as unknown as LoadedMathJax;
            await MathJax.startup.promise;
            while (
                mounted.current &&
                pending.current !== null &&
                pending.current !== current.current
            ) {
                const wait =
                    THROTTLE_MS - (performance.now() - lastTypesetAt.current);
                if (wait > 0) {
                    await new Promise((resolve) => setTimeout(resolve, wait));
                }
                // Bail if we unmounted while waiting, before creating the
                // buffer (which cleanup has already removed) or typesetting.
                if (!mounted.current) {
                    break;
                }
                // Grab the newest requested value, skipping any intermediate
                // ones that arrived while we were waiting or typesetting.
                const next = pending.current;
                if (next === null) {
                    break;
                }
                pending.current = null;

                const buffer = ensureBuffer(bufferRef);
                buffer.innerHTML = next;
                // Drop MathJax's record of the previous render so its internal
                // list doesn't grow without bound under frequent updates.
                MathJax.typesetClear([buffer]);
                await MathJax.typesetPromise([buffer]);
                // Bail if we unmounted during the typeset: the buffer was
                // removed by cleanup and `visible` is detached, so there is
                // nothing to swap into.
                if (!mounted.current) {
                    break;
                }
                // Swap the freshly rendered output in; the old output stayed
                // visible until exactly now, so there is no raw/blank flash.
                visible.replaceChildren(...Array.from(buffer.childNodes));

                current.current = next;
                lastTypesetAt.current = performance.now();
            }
        } catch (e) {
            // On failure, keep the last good render rather than flashing raw
            // LaTeX or going blank.
            console.error("DynamicMath: MathJax typesetting failed", e);
        } finally {
            busy.current = false;
        }
    }

    return <span ref={visibleRef} style={{ display: "inline" }} />;
}

/** Lazily create the off-screen, assistive-tech-hidden typeset buffer. */
function ensureBuffer(
    bufferRef: React.MutableRefObject<HTMLSpanElement | null>,
): HTMLSpanElement {
    let buffer = bufferRef.current;
    if (!buffer) {
        buffer = document.createElement("span");
        buffer.setAttribute("aria-hidden", "true");
        buffer.style.position = "absolute";
        buffer.style.visibility = "hidden";
        buffer.style.left = "-9999px";
        buffer.style.top = "0";
        document.body.appendChild(buffer);
        bufferRef.current = buffer;
    }
    return buffer;
}
