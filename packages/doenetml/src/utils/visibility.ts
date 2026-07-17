import { RefObject, useEffect, useState } from "react";

/**
 * Call `callAction` with the `actions.recordVisibilityChange`
 * when any portion of the element referenced by `ref`
 * is visible or stops being visible in the browser's viewport.
 *
 * If `skipRecording` is false, then don't do anything.
 */
export function useRecordVisibilityChanges(
    ref: RefObject<HTMLElement | null>,
    callAction: (argObj: Record<string, any>) => void,
    actions: any,
    skipRecording = false,
) {
    useEffect(() => {
        if (skipRecording) {
            return;
        }
        if (ref.current) {
            const observer = new IntersectionObserver(([entry]) => {
                callAction({
                    action: actions.recordVisibilityChange,
                    args: { isVisible: entry.isIntersecting },
                });
            });

            observer.observe(ref.current);

            return () => {
                observer.disconnect();
                callAction({
                    action: actions.recordVisibilityChange,
                    args: { isVisible: false },
                });
            };
        }
    }, [ref]);
}

/**
 * Interpret an IntersectionObserver entry from `useIsOnPage`'s observer as
 * "the element is on the page".
 *
 * Usually that is just `entry.isIntersecting`, but a zero-area target needs
 * care: branded Chrome 149 (inside a same-origin iframe, e.g. a PreTeXt book)
 * can report a zero-area target as non-intersecting even with the huge
 * `rootMargin`. Taking that at face value deadlocks the viewer — `DocViewer`
 * renders nothing while hidden, so the observed wrapper has zero height, gets
 * reported off-page, and stays hidden forever. A zero-area element that still
 * generates a layout box cannot meaningfully be off the page, so count it as
 * on-page; `display: none` — the hidden state this hook exists to detect —
 * generates no boxes at all and so still reports false.
 */
export function isEntryOnPage(entry: IntersectionObserverEntry): boolean {
    if (entry.isIntersecting) {
        return true;
    }
    const rect = entry.boundingClientRect;
    const zeroArea = rect.width === 0 || rect.height === 0;
    return zeroArea && entry.target.getClientRects().length > 0;
}

/**
 * Returns true if the element referenced by `ref` is anywhere on the page
 * (more precisely, within 1000000px of the browser's viewport), or if it is
 * laid out but has zero area — see `isEntryOnPage` for why.
 *
 * Used to approximately detect if the element is not hidden.
 */
export function useIsOnPage(ref: RefObject<HTMLElement | null>) {
    const [isIntersecting, setIntersecting] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => setIntersecting(isEntryOnPage(entry)),
            { rootMargin: "1000000px" },
        );

        if (ref.current) {
            observer.observe(ref.current);
        }
        return () => {
            observer.disconnect();
        };
    }, [ref]);

    return isIntersecting;
}
