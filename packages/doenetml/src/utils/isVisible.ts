import { RefObject, useEffect, useState } from "react";

/**
 * Returns `true` if the any portion of the element referenced by `ref`
 * is visible in the browser's viewport
 *
 * From: https://dev.to/jmalvarez/check-if-an-element-is-visible-with-react-hooks-27h8
 */
export function useIsVisible(ref: RefObject<HTMLElement>) {
    const [isIntersecting, setIntersecting] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) =>
            setIntersecting(entry.isIntersecting),
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
