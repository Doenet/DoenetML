import { RefObject, useEffect, useState } from "react";

/**
 * Call `callAction` with the `actions.recordVisibilityChange`
 * when any portion of the element referenced by `ref`
 * is visible or stops being visible in the browser's viewport.
 *
 * If `skipRecording` is false, then don't do anything.
 */
export function useRecordVisibilityChanges(
    ref: RefObject<HTMLElement>,
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
 * Returns true if the element referenced by `ref` is anywhere on the page
 * (more precisely, within 1000000px of the browser's viewport).
 *
 * Used to approximately detect if the element is not hidden.
 */
export function useIsOnPage(ref: RefObject<HTMLElement>) {
    const [isIntersecting, setIntersecting] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => setIntersecting(entry.isIntersecting),
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
