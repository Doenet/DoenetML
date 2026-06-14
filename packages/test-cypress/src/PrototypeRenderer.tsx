import React from "react";
import { DoenetML } from "@doenet/doenetml-prototype";
// Importing the prototype stylesheet here (rather than at the top of
// `CypressTest.tsx`) keeps it out of the default bundle: this module is only
// loaded lazily when a spec renders the prototype (`usePrototype`). The
// stylesheet begins with a Tailwind preflight reset (`*{box-sizing:border-box}`)
// that, if loaded globally, would alter the layout of the `@doenet/doenetml`
// viewer used by the existing specs (e.g. graph pixel widths).
import "@doenet/doenetml-prototype/style.css";

/**
 * Thin wrapper around the prototype `DoenetML` so `CypressTest.tsx` can
 * `React.lazy`-load it (and its stylesheet) only when needed.
 */
export default function PrototypeRenderer(
    props: React.ComponentProps<typeof DoenetML>,
) {
    return <DoenetML {...props} />;
}
