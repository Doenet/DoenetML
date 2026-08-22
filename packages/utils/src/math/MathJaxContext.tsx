import React, { useMemo } from "react";
import { MathJaxBaseContext } from "better-react-mathjax";
import type { MathJaxSubscriberProps } from "better-react-mathjax";
import { loadMathJax } from "./mathjax-loader";
import type { LoadMathJaxOptions } from "./mathjax-loader";

export type { LoadMathJaxOptions } from "./mathjax-loader";
export { loadMathJax, DEFAULT_MATHJAX_SRC } from "./mathjax-loader";

export interface MathJaxContextProps extends LoadMathJaxOptions {
    /**
     * Which MathJax major version the consuming `<MathJax>` components should
     * assume. Only 3 and 4 share the API Doenet relies on and they take the
     * same code path, so this defaults to 4 and rarely needs changing.
     */
    version?: 3 | 4;
    /**
     * Cancels the context: once aborted, no `<MathJax>` element below starts a
     * typeset, and none of them reports a failure.
     *
     * For tearing down a React root that holds `<MathJax>` elements. Unmounting
     * clears their refs, and a typeset that starts across that gap reaches
     * MathJax with a null element and rejects — an unhandled rejection that
     * lands in whatever the host page has on `window.onunhandledrejection`.
     * Abort first and unmount a tick later, and nothing is left in flight to
     * land that way.
     */
    signal?: AbortSignal;
    children?: React.ReactNode;
}

/**
 * `promise`, except that it never settles once `signal` is aborted — so the
 * work waiting on it is dropped rather than run against a torn-down tree.
 */
function untilAborted<T>(promise: Promise<T>, signal: AbortSignal): Promise<T> {
    return new Promise<T>((resolve, reject) => {
        promise.then(
            (value) => {
                if (!signal.aborted) {
                    resolve(value);
                }
            },
            (reason) => {
                if (!signal.aborted) {
                    reject(reason);
                }
            },
        );
    });
}

/**
 * The engine as seen through `signal`: its startup promise never settles once
 * aborted, and its typesetting entry points become no-ops.
 *
 * `<MathJax>` reaches the engine in stages — it waits on the context promise,
 * then on `startup.promise`, and only then reads the element it is to typeset
 * and hands it to `typesetClear`/`typesetPromise` — so every one of those
 * stages is gated, wherever the abort lands among them.
 *
 * The rest of the engine is passed through untouched, and this is a view of
 * the page's one shared MathJax rather than a copy: cancelling one context's
 * view of it must leave every other user of it working.
 */
function untilAbortedEngine<T extends object>(
    engine: T,
    signal: AbortSignal,
): T {
    return new Proxy(engine, {
        get(target, property, receiver) {
            const value = Reflect.get(target, property, receiver);
            if (
                property === "startup" &&
                value &&
                // MathJax 4 exposes `startup` as a callable function with the
                // startup members attached; MathJax 3 as a plain object. Either
                // way, the recursion is what gates `startup.promise` below.
                (typeof value === "object" || typeof value === "function")
            ) {
                return untilAbortedEngine(value as object, signal);
            }
            if (property === "promise" && value instanceof Promise) {
                return untilAborted(value, signal);
            }
            if (typeof value === "function") {
                // `typesetClear` reports nothing; `typesetPromise` resolves, so
                // that the caller's `.then` still runs and it does not look
                // like a typeset that failed.
                if (property === "typesetClear") {
                    return (...args: unknown[]) =>
                        signal.aborted ? undefined : value.apply(target, args);
                }
                if (property === "typesetPromise") {
                    return (...args: unknown[]) =>
                        signal.aborted
                            ? Promise.resolve()
                            : value.apply(target, args);
                }
            }
            return value;
        },
    });
}

/**
 * Drop-in replacement for `better-react-mathjax`'s `MathJaxContext` that
 * coexists with a MathJax the host page may already provide.
 *
 * It provides the same `MathJaxBaseContext` that `better-react-mathjax`'s
 * `<MathJax>` render components consume, but its `promise` comes from
 * {@link loadMathJax}, which reuses an existing/loading host engine instead of
 * unconditionally injecting a second copy and clobbering `window.MathJax`.
 *
 * See {@link loadMathJax} for the detection/coexistence rules and the range of
 * supported MathJax versions.
 */
export function MathJaxContext({
    config,
    src,
    useExistingMathJax,
    timeoutMs,
    version = 4,
    signal,
    children,
}: MathJaxContextProps) {
    const value = useMemo<MathJaxSubscriberProps>(() => {
        const loaded = loadMathJax({
            config,
            src,
            useExistingMathJax,
            timeoutMs,
        });
        // The load itself is gated too, not just the engine it resolves: a
        // load that fails after the abort would otherwise be reported by
        // elements that are on their way out.
        const promise = signal
            ? untilAborted(loaded, signal).then((engine) =>
                  untilAbortedEngine(engine, signal),
              )
            : loaded;
        // `loadMathJax` resolves the live engine. `better-react-mathjax` keys
        // its subscriber type on a literal version discriminant, which our
        // `3 | 4` prop does not narrow to, so build the value untyped and cast.
        return { version, promise } as unknown as MathJaxSubscriberProps;
    }, [config, src, useExistingMathJax, timeoutMs, version, signal]);

    return (
        <MathJaxBaseContext.Provider value={value}>
            {children}
        </MathJaxBaseContext.Provider>
    );
}

export default MathJaxContext;
