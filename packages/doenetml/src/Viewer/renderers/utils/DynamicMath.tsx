import React, { useLayoutEffect, useRef } from "react";
import { loadMathJax } from "@doenet/utils";
import {
    observeInViewport,
    observeNearViewport,
} from "../../../utils/visibility";

/** Minimum time between typesets of a single element (ms). Caps how often a
 * fast drag re-typesets; the displayed value lags by at most this plus one
 * typeset, which is imperceptible for coordinate read-outs. */
const THROTTLE_MS = 100;

/**
 * How long an `immediate` typeset may take (ms) before the element goes back
 * to the throttled path for the rest of the edit. About a frame: an expression
 * that can be re-typeset within one is drawn in step with the control being
 * edited inside it; one that cannot would hold up every keystroke instead, so
 * it lags a beat, as it would without `immediate`.
 */
const IMMEDIATE_BUDGET_MS = 12;

/** The parts of a loaded MathJax 3/4 engine this component uses. */
interface LoadedMathJax {
    startup: { promise: Promise<unknown> };
    typeset: (nodes: HTMLElement[]) => void;
    typesetPromise: (nodes: HTMLElement[]) => Promise<unknown>;
    typesetClear: (nodes: HTMLElement[]) => void;
}

/** The engine once it has started, so an immediate typeset need not wait. */
let startedMathJax: LoadedMathJax | null = null;

/**
 * How many typesets are handed to MathJax at once. MathJax runs them one at a
 * time in the order given, so the rest wait in `waitingTypesets`, where math
 * in the viewport can go ahead of math that is only near it. Two keeps
 * MathJax from idling between one typeset and the next.
 */
const MAX_TYPESETS_IN_FLIGHT = 2;

interface TypesetRequest {
    /** Whether the element is in the viewport now. */
    inViewport: () => boolean;
    start: () => void;
}

const waitingTypesets: TypesetRequest[] = [];
let typesetsInFlight = 0;
let startScheduled = false;

/**
 * Run `typeset` once MathJax has room for it, giving elements in the viewport
 * precedence over those only near it, and first come first served otherwise.
 * Resolves or rejects as `typeset` does.
 */
function scheduleTypeset(
    inViewport: () => boolean,
    typeset: () => Promise<unknown>,
): Promise<void> {
    return new Promise((resolve, reject) => {
        waitingTypesets.push({
            inViewport,
            start() {
                typesetsInFlight++;
                Promise.resolve()
                    .then(typeset)
                    .then(() => resolve(), reject)
                    .finally(() => {
                        typesetsInFlight--;
                        startWaitingTypesets();
                    });
            },
        });
        // Start after the microtasks already queued, so the requests one
        // update makes are all waiting, and sorted, before the first starts.
        if (!startScheduled) {
            startScheduled = true;
            queueMicrotask(() => {
                startScheduled = false;
                startWaitingTypesets();
            });
        }
    });
}

function startWaitingTypesets() {
    while (
        typesetsInFlight < MAX_TYPESETS_IN_FLIGHT &&
        waitingTypesets.length > 0
    ) {
        const inViewportIndex = waitingTypesets.findIndex((request) =>
            request.inViewport(),
        );
        const [next] = waitingTypesets.splice(
            inViewportIndex === -1 ? 0 : inViewportIndex,
            1,
        );
        next.start();
    }
}

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
 *
 * `onTypeset` runs after each swap, once the new output is in the document and
 * its geometry can be measured. It fires per swap rather than once at the end
 * of the loop: under coalescing the loop may swap several times, and a caller
 * positioning something against the output has to follow every one of them.
 *
 * Once an element has been typeset, a new value that arrives while it is far
 * from the viewport waits until the element comes near. MathJax typesets one
 * expression at a time in the order asked, so this keeps math the reader can
 * see from queuing behind math they can't; the element keeps its last output
 * in the meantime. The first typeset always runs, so what the page lays out
 * around is real output. Among the typesets waiting for MathJax, those of
 * elements in the viewport go first (`scheduleTypeset`).
 *
 * `immediate` is for an expression with a control being edited inside it,
 * whose every keystroke changes the LaTeX: the typeset then runs synchronously
 * in the layout phase, so the new output is on screen in the same frame as the
 * change that asked for it, with no throttle. An element whose typeset takes
 * longer than a frame drops back to the throttled path until `immediate` is
 * withdrawn; see `IMMEDIATE_BUDGET_MS`.
 */
export function DynamicMath({
    latex,
    onTypeset,
    immediate = false,
}: {
    latex: string;
    onTypeset?: () => void;
    immediate?: boolean;
}) {
    const visibleRef = useRef<HTMLSpanElement>(null);
    const bufferRef = useRef<HTMLSpanElement | null>(null);
    // Latest requested value, the one currently displayed, and a re-entrancy
    // guard so only one typeset runs at a time per element.
    const pending = useRef<string | null>(null);
    const current = useRef<string | null>(null);
    const busy = useRef(false);
    const lastTypesetAt = useRef(0);
    // Set once an immediate typeset overran its budget; cleared when the
    // caller withdraws `immediate`.
    const overBudget = useRef(false);
    // False once unmounted, so an in-flight `renderPendingLatex` stops before touching a
    // detached node or re-creating the off-screen buffer after cleanup.
    const mounted = useRef(true);
    // Held in a ref so that a caller passing an inline arrow function does not
    // re-run the [latex] effect on every render.
    const onTypesetRef = useRef(onTypeset);
    onTypesetRef.current = onTypeset;
    // Whether the element is near the viewport, or null until the observer
    // first reports, which counts as near.
    const near = useRef<boolean | null>(null);
    // Whether any of the element is in the viewport, or null until the
    // observer first reports, which counts as in it.
    const inViewport = useRef<boolean | null>(null);
    // Restarts the typeset loop for a value that waited while far away.
    const resumeRef = useRef<(() => void) | null>(null);

    useLayoutEffect(() => {
        const visible = visibleRef.current;
        if (!visible) {
            return;
        }
        const stopNear = observeNearViewport(visible, (isNear) => {
            near.current = isNear;
            if (isNear) {
                resumeRef.current?.();
            }
        });
        const stopInViewport = observeInViewport(visible, (isIn) => {
            inViewport.current = isIn;
        });
        return () => {
            stopNear();
            stopInViewport();
        };
    }, []);

    // Arm/re-arm the unmount guard and clean up the off-screen buffer. Runs
    // before the [latex] effect below on every (re)mount, so the loop there
    // always starts with `mounted.current === true`.
    useLayoutEffect(() => {
        // Set on setup (not just at declaration) so a StrictMode remount, which
        // reruns this effect after the cleanup below, re-arms the guard.
        mounted.current = true;
        return () => {
            mounted.current = false;
            bufferRef.current?.remove();
            bufferRef.current = null;
        };
    }, []);

    useLayoutEffect(() => {
        if (!immediate) {
            overBudget.current = false;
        }
    }, [immediate]);

    useLayoutEffect(() => {
        pending.current = latex;
        if (immediate && !overBudget.current && typesetNow()) {
            return;
        }
        // On failure, keep the last good render rather than flashing raw LaTeX
        // or going blank.
        const startLoop = () => {
            renderPendingLatex().catch((e) => {
                console.error("DynamicMath: MathJax typesetting failed", e);
            });
        };
        resumeRef.current = startLoop;
        startLoop();

        /** Whether a new value must wait for the element to come near. */
        function waitsUntilNear(): boolean {
            return current.current !== null && near.current === false;
        }

        /**
         * Typeset the pending value here and now, in the layout phase, so the
         * swap is painted with the render that requested it. Declines — and
         * leaves the value to the loop below — when the engine has not started,
         * when the loop is mid-flight, or when the engine needs to load
         * something first, which it signals by throwing.
         */
        function typesetNow(): boolean {
            const MathJax = startedMathJax;
            const visible = visibleRef.current;
            if (!MathJax || !visible || busy.current || !mounted.current) {
                return false;
            }
            const next = pending.current;
            if (next === null || next === current.current) {
                return true;
            }
            const buffer = ensureBuffer(bufferRef);
            const start = performance.now();
            try {
                buffer.innerHTML = next;
                MathJax.typeset([buffer]);
            } catch {
                // The engine may already have recorded the buffer's math
                // before it threw; forget that record while the nodes are
                // still in the buffer, as the loop below does after a typeset.
                MathJax.typesetClear([buffer]);
                buffer.innerHTML = "";
                return false;
            }
            MathJax.typesetClear([buffer]);
            visible.replaceChildren(...Array.from(buffer.childNodes));
            current.current = next;
            pending.current = null;
            lastTypesetAt.current = performance.now();
            if (lastTypesetAt.current - start > IMMEDIATE_BUDGET_MS) {
                overBudget.current = true;
            }
            onTypesetRef.current?.();
            return true;
        }

        /**
         * The typeset-and-swap loop, (re)invoked on every `latex` change. It
         * runs at most one instance at a time (guarded by `busy`), so
         * overlapping invocations return immediately and the already-running
         * loop picks up the newer value. It waits for MathJax, then repeatedly:
         * throttles, takes the latest `pending` value (skipping any intermediate
         * ones), typesets it on the off-screen buffer, drops MathJax's record of
         * that render, and swaps the rendered nodes into the visible span. It
         * exits once `pending` has caught up to what is displayed, leaving the
         * newest value on screen. It also exits when the component unmounts,
         * and when the element is far from the viewport (see `waitsUntilNear`),
         * leaving the value pending until the element comes near.
         */
        async function renderPendingLatex() {
            if (busy.current) {
                return;
            }
            const visible = visibleRef.current;
            if (!visible) {
                return;
            }
            busy.current = true;
            try {
                const MathJax =
                    (await loadMathJax()) as unknown as LoadedMathJax;
                await MathJax.startup.promise;
                startedMathJax = MathJax;
                while (
                    mounted.current &&
                    pending.current !== null &&
                    pending.current !== current.current &&
                    !waitsUntilNear()
                ) {
                    const wait =
                        THROTTLE_MS -
                        (performance.now() - lastTypesetAt.current);
                    if (wait > 0) {
                        await new Promise((resolve) =>
                            setTimeout(resolve, wait),
                        );
                    }
                    // Bail if we unmounted while waiting, before creating the
                    // buffer (which cleanup has already removed) or typesetting.
                    // Also stop if the element went far away meanwhile; the
                    // value stays pending until it comes back.
                    if (!mounted.current || waitsUntilNear()) {
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
                    // An element that unmounts while its typeset waits in
                    // the queue has nothing to show it in, so it skips it.
                    // One with a control being edited in it goes straight to
                    // MathJax, since the reader is watching it change.
                    const typeset = async () => {
                        if (mounted.current) {
                            await MathJax.typesetPromise([buffer]);
                        }
                    };
                    await (immediate
                        ? typeset()
                        : scheduleTypeset(
                              () => inViewport.current !== false,
                              typeset,
                          ));
                    // Drop MathJax's record of this render as soon as the
                    // typeset finishes — before the unmount check below and
                    // before moving the rendered nodes out of the buffer.
                    // `typesetClear` prunes math items whose nodes are still
                    // inside the buffer (matched via `buffer.contains(...)`,
                    // which holds even once cleanup has detached the buffer from
                    // the document), so clearing here — while the fresh output
                    // is still in the buffer — is what keeps MathJax's internal
                    // math list (and the detached DOM it would otherwise retain
                    // across every swap) from growing without bound under
                    // frequent updates. Clearing before the unmount check is
                    // deliberate: if we bailed first, an unmount mid-drag would
                    // re-leak exactly this item. Clearing only forgets the item;
                    // the rendered DOM stays fully functional.
                    MathJax.typesetClear([buffer]);
                    // Bail if we unmounted during the typeset: the buffer was
                    // removed by cleanup and `visible` is detached, so there is
                    // nothing to swap into. MathJax's record was already cleared
                    // above, so bailing here leaks nothing.
                    if (!mounted.current) {
                        break;
                    }
                    // Swap the freshly rendered output in; the old output stayed
                    // visible until exactly now, so there is no raw/blank flash.
                    visible.replaceChildren(...Array.from(buffer.childNodes));

                    current.current = next;
                    lastTypesetAt.current = performance.now();
                    onTypesetRef.current?.();
                }
            } finally {
                busy.current = false;
            }
        }
    }, [latex, immediate]);

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
