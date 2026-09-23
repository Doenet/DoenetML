import { RefObject, useEffect, useState } from "react";

/**
 * How far beyond the viewport a block still counts as near it. Core sends
 * renderer updates for blocks near the viewport straight away and holds the
 * rest until it is idle, so this margin is what lets content just past the
 * edge be current by the time the reader scrolls to it.
 *
 * Inside a cross-origin iframe the browser ignores a root margin, and "near"
 * then means visible.
 */
const NEAR_VIEWPORT_MARGIN = "50% 0px";

type EntryListener = (entry: IntersectionObserverEntry) => void;

/**
 * One IntersectionObserver per root margin, shared by every element observed
 * with that margin.
 */
const sharedObservers = new Map<
    string,
    {
        observer: IntersectionObserver;
        listeners: Map<Element, Set<EntryListener>>;
    }
>();

/**
 * Call `listener` with each intersection change of `element` against the
 * viewport grown by `rootMargin`. Returns a function that stops it.
 */
function observeIntersection(
    element: Element,
    rootMargin: string,
    listener: EntryListener,
): () => void {
    let shared = sharedObservers.get(rootMargin);
    if (!shared) {
        const listeners = new Map<Element, Set<EntryListener>>();
        const observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    for (const callback of listeners.get(entry.target) ?? []) {
                        callback(entry);
                    }
                }
            },
            { rootMargin },
        );
        shared = { observer, listeners };
        sharedObservers.set(rootMargin, shared);
    }

    const { observer, listeners } = shared;
    let forElement = listeners.get(element);
    if (!forElement) {
        forElement = new Set();
        listeners.set(element, forElement);
        observer.observe(element);
    }
    forElement.add(listener);

    return () => {
        forElement.delete(listener);
        if (forElement.size === 0) {
            listeners.delete(element);
            observer.unobserve(element);
        }
    };
}

/**
 * Call `callAction` with the `actions.recordVisibilityChange`
 * when any portion of the element referenced by `ref`
 * becomes or stops being visible in the browser's viewport (`isVisible`), or
 * near it (`isNear`).
 *
 * If `skipRecording` is true, then don't do anything.
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
        const element = ref.current;
        if (!element) {
            return;
        }

        // Each observer reports once on its own when observing starts; wait
        // for both, so the first report carries both.
        let isVisible: boolean | undefined;
        let isNear: boolean | undefined;
        const report = () => {
            if (isVisible !== undefined && isNear !== undefined) {
                callAction({
                    action: actions.recordVisibilityChange,
                    args: { isVisible, isNear },
                });
            }
        };

        const stopVisible = observeIntersection(element, "0px", (entry) => {
            isVisible = entry.isIntersecting;
            report();
        });
        const stopNear = observeIntersection(
            element,
            NEAR_VIEWPORT_MARGIN,
            (entry) => {
                isNear = entry.isIntersecting;
                report();
            },
        );

        return () => {
            stopVisible();
            stopNear();
            callAction({
                action: actions.recordVisibilityChange,
                args: { isVisible: false, isNear: false },
            });
        };
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
