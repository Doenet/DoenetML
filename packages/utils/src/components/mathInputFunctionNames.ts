/**
 * Default identifiers MathQuill auto-formats as function names in the
 * `<mathInput>` editor (the `autoOperatorNames` config). Authors can
 * extend or trim this list via the `additionalFunctionNames` and
 * `removedFunctionNames` attributes (issue #1205) — `kg/min` only stays
 * a unit expression while `min` is absent from the active list.
 *
 * The list is shared between the React renderer
 * (`packages/doenetml/src/Viewer/renderers/mathInput.tsx`) and the LSP
 * context-help layer (`packages/lsp-tools/src/context-help`), so they
 * can't drift apart.
 */
export const DEFAULT_MATH_INPUT_FUNCTION_NAMES: readonly string[] = [
    "arg",
    "deg",
    "det",
    "dim",
    "exp",
    "gcd",
    "hom",
    "ker",
    "lg",
    "lim",
    "ln",
    "log",
    "max",
    "min",
    "Pr",
    "cos",
    "cosh",
    "acos",
    "acosh",
    "arccos",
    "arccosh",
    "cot",
    "coth",
    "acot",
    "acoth",
    "arccot",
    "arccoth",
    "csc",
    "csch",
    "acsc",
    "acsch",
    "arccsc",
    "arccsch",
    "sec",
    "sech",
    "asec",
    "asech",
    "arcsec",
    "arcsech",
    "sin",
    "sinh",
    "asin",
    "asinh",
    "arcsin",
    "arcsinh",
    "tan",
    "tanh",
    "atan",
    "atanh",
    "arctan",
    "arctanh",
    "nPr",
    "nCr",
];

/**
 * Returns true when `token` would be accepted by MathQuill's
 * `autoOperatorNames` validator (see `mathquill.js`,
 * `baseOptionProcessors.autoOperatorNames`). Each accepted token must:
 *
 *   - contain only letters, pipes, and dashes (`[A-Za-z|-]`),
 *   - have a pre-pipe segment of length >= 2 (so `a`, `|word`, and
 *     `a|word` all fail on the length check), and
 *   - contain at most one `|` (the pipe separates the rendered name
 *     from its mathspeak alternative).
 *
 * Tokens that fail validation must be dropped before being passed to
 * MathQuill — MathQuill would otherwise throw during mount and crash
 * the entire `<mathInput>` renderer.
 */
export function isValidMathQuillFunctionName(token: string): boolean {
    if (!/^[a-z|-]+$/i.test(token)) return false;
    const parts = token.split("|");
    if (parts.length > 2) return false;
    if (parts[0].length < 2) return false;
    return true;
}

/**
 * Build the effective `autoOperatorNames` list for a `<mathInput>` by
 * applying the author's deltas to {@link DEFAULT_MATH_INPUT_FUNCTION_NAMES}.
 *
 * Precedence:
 *   - When `reset` is non-null, it wins outright: the result is the
 *     deduped `reset` list, ignoring defaults *and* the
 *     additional/removed deltas. Passing an empty array reset turns off
 *     auto-formatting entirely (no identifier is treated as a function).
 *   - Otherwise, start from defaults, drop entries in `removed`, then
 *     append entries from `additional` not already in the result.
 *     Removed entries win over added ones if a name appears in both,
 *     so an author can confidently drop a default even if their own
 *     `additionalFunctionNames` accidentally repeats it.
 *
 * Names are matched case-sensitively (MathQuill itself is case-sensitive
 * — `Pr` and `pr` are distinct entries). Tokens from `additional` and
 * `reset` that don't pass {@link isValidMathQuillFunctionName} are
 * filtered out of `names` and collected in `dropped` so callers (the
 * renderer in particular) can warn the author once per change instead
 * of letting MathQuill crash on mount.
 *
 * `removed` entries are not validated — they're a deletion set, so an
 * invalid token there is harmless (it just won't match any default).
 */
export function buildEffectiveMathInputFunctionNames({
    additional = [],
    removed = [],
    reset = null,
}: {
    additional?: readonly string[];
    removed?: readonly string[];
    reset?: readonly string[] | null;
}): { names: string[]; dropped: string[] } {
    const droppedSeen = new Set<string>();
    const dropped: string[] = [];
    const recordDropped = (token: string) => {
        if (droppedSeen.has(token)) return;
        droppedSeen.add(token);
        dropped.push(token);
    };

    if (reset !== null) {
        const seen = new Set<string>();
        const out: string[] = [];
        for (const name of reset) {
            if (seen.has(name)) continue;
            seen.add(name);
            if (!isValidMathQuillFunctionName(name)) {
                recordDropped(name);
                continue;
            }
            out.push(name);
        }
        return { names: out, dropped };
    }
    const removedSet = new Set(removed);
    const seen = new Set<string>();
    const out: string[] = [];
    for (const name of DEFAULT_MATH_INPUT_FUNCTION_NAMES) {
        if (removedSet.has(name) || seen.has(name)) continue;
        seen.add(name);
        out.push(name);
    }
    for (const name of additional) {
        if (removedSet.has(name) || seen.has(name)) continue;
        seen.add(name);
        if (!isValidMathQuillFunctionName(name)) {
            recordDropped(name);
            continue;
        }
        out.push(name);
    }
    return { names: out, dropped };
}
