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
    children?: React.ReactNode;
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
    children,
}: MathJaxContextProps) {
    const value = useMemo<MathJaxSubscriberProps>(() => {
        const promise = loadMathJax({
            config,
            src,
            useExistingMathJax,
            timeoutMs,
        });
        // `loadMathJax` resolves the live engine. `better-react-mathjax` keys
        // its subscriber type on a literal version discriminant, which our
        // `3 | 4` prop does not narrow to, so build the value untyped and cast.
        return { version, promise } as unknown as MathJaxSubscriberProps;
    }, [config, src, useExistingMathJax, timeoutMs, version]);

    return (
        <MathJaxBaseContext.Provider value={value}>
            {children}
        </MathJaxBaseContext.Provider>
    );
}

export default MathJaxContext;
