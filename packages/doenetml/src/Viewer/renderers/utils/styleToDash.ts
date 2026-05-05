/**
 * Map a Doenet line style (and optional `dashed` override) to JSXgraph's
 * numeric dash code.
 *
 * 0 = solid, 1 = dotted, 2 = dashed.
 *
 * The `dashed` parameter exists because some components (line, curve,
 * regionBetweenCurves) carry an independent `dashed` SV that should force
 * dashed regardless of `selectedStyle.lineStyle`.
 */
export function styleToDash(style: string, dashed?: boolean): number {
    if (style === "dashed" || dashed) {
        return 2;
    }
    if (style === "dotted") {
        return 1;
    }
    return 0;
}
