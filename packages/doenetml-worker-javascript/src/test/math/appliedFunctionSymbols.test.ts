import { describe, expect, it } from "vitest";
import me from "math-expressions";
import {
    appliedFunctionSymbolsDefault,
    appliedFunctionSymbolsDefaultLatex,
} from "../../utils/math";

/**
 * Every function name an author can type must produce a number on *both* of the
 * engine's numeric paths.
 *
 * There are two, and a head can be missing from either one silently:
 *
 * - `Expression#f()` compiles to math.js, and is what a `<function>` plots and
 *   what root-finding samples. A head math.js does not know is not a compile
 *   error there — it throws once per sample, and
 *   `returnNumericalFunctionFromFormula` turns every throw into `NaN`, so the
 *   curve is simply empty at every input with no warning. `nthroot` (math.js
 *   spells it `nthRoot`) went unnoticed that way.
 * - `evaluate_to_constant` runs the engine's own evaluator, and is what
 *   `<number>$$f(2)</number>` and the extrema sampler use. A head with no
 *   evaluation kernel there answers `NaN`, equally silently. `erf` went
 *   unnoticed *that* way, while plotting the same function looked perfect.
 *
 * The two lists imported above are the authoritative set of typable spellings,
 * so the first test makes the probe table impossible to leave behind: adding a
 * symbol to either list without a probe fails immediately.
 */
const PROBES: Record<string, { src: string; x: number; expected: number }> = {
    abs: { src: "abs(x)", x: -2, expected: 2 },
    exp: { src: "exp(x)", x: 0, expected: 1 },
    log: { src: "log(x)", x: 1, expected: 0 },
    ln: { src: "ln(x)", x: 1, expected: 0 },
    log10: { src: "log10(x)", x: 100, expected: 2 },
    sign: { src: "sign(x)", x: -2, expected: -1 },
    sqrt: { src: "sqrt(x)", x: 9, expected: 3 },
    cbrt: { src: "cbrt(x)", x: 8, expected: 2 },
    nthroot: { src: "nthroot(x,3)", x: 8, expected: 2 },
    erf: { src: "erf(x)", x: 0.5, expected: 0.5204998778130465 },
    cos: { src: "cos(x)", x: 0, expected: 1 },
    cosh: { src: "cosh(x)", x: 0, expected: 1 },
    acos: { src: "acos(x)", x: 1, expected: 0 },
    acosh: { src: "acosh(x)", x: 1, expected: 0 },
    arccos: { src: "arccos(x)", x: 1, expected: 0 },
    arccosh: { src: "arccosh(x)", x: 1, expected: 0 },
    cot: { src: "cot(x)", x: Math.PI / 4, expected: 1 },
    coth: { src: "coth(x)", x: 1, expected: 1 / Math.tanh(1) },
    acot: { src: "acot(x)", x: 1, expected: Math.PI / 4 },
    acoth: { src: "acoth(x)", x: 2, expected: Math.atanh(0.5) },
    arccot: { src: "arccot(x)", x: 1, expected: Math.PI / 4 },
    arccoth: { src: "arccoth(x)", x: 2, expected: Math.atanh(0.5) },
    csc: { src: "csc(x)", x: Math.PI / 2, expected: 1 },
    csch: { src: "csch(x)", x: 1, expected: 1 / Math.sinh(1) },
    acsc: { src: "acsc(x)", x: 1, expected: Math.PI / 2 },
    acsch: { src: "acsch(x)", x: 1, expected: Math.asinh(1) },
    arccsc: { src: "arccsc(x)", x: 1, expected: Math.PI / 2 },
    arccsch: { src: "arccsch(x)", x: 1, expected: Math.asinh(1) },
    sec: { src: "sec(x)", x: 0, expected: 1 },
    sech: { src: "sech(x)", x: 0, expected: 1 },
    asec: { src: "asec(x)", x: 1, expected: 0 },
    asech: { src: "asech(x)", x: 1, expected: 0 },
    arcsec: { src: "arcsec(x)", x: 1, expected: 0 },
    arcsech: { src: "arcsech(x)", x: 1, expected: 0 },
    sin: { src: "sin(x)", x: 0, expected: 0 },
    sinh: { src: "sinh(x)", x: 0, expected: 0 },
    asin: { src: "asin(x)", x: 0, expected: 0 },
    asinh: { src: "asinh(x)", x: 0, expected: 0 },
    arcsin: { src: "arcsin(x)", x: 0, expected: 0 },
    arcsinh: { src: "arcsinh(x)", x: 0, expected: 0 },
    tan: { src: "tan(x)", x: 0, expected: 0 },
    tanh: { src: "tanh(x)", x: 0, expected: 0 },
    atan: { src: "atan(x)", x: 1, expected: Math.PI / 4 },
    atan2: { src: "atan2(x,1)", x: 1, expected: Math.PI / 4 },
    atanh: { src: "atanh(x)", x: 0, expected: 0 },
    arctan: { src: "arctan(x)", x: 1, expected: Math.PI / 4 },
    arctanh: { src: "arctanh(x)", x: 0, expected: 0 },
    arg: { src: "arg(x)", x: 2, expected: 0 },
    min: { src: "min(x,3)", x: 1, expected: 1 },
    max: { src: "max(x,3)", x: 1, expected: 3 },
    mean: { src: "mean(x,3)", x: 1, expected: 2 },
    median: { src: "median(x,3,7)", x: 1, expected: 3 },
    floor: { src: "floor(x)", x: 2.5, expected: 2 },
    ceil: { src: "ceil(x)", x: 2.5, expected: 3 },
    round: { src: "round(x)", x: 2.4, expected: 2 },
    sum: { src: "sum(x,3)", x: 1, expected: 4 },
    prod: { src: "prod(x,3)", x: 2, expected: 6 },
    variance: { src: "variance(x,3,8)", x: 1, expected: 13 },
    std: { src: "std(x,3,8)", x: 1, expected: Math.sqrt(13) },
    count: { src: "count(x,3)", x: 1, expected: 2 },
    mod: { src: "mod(x,3)", x: 7, expected: 1 },
    re: { src: "re(x)", x: -2, expected: -2 },
    // `Re`/`Im` are the LaTeX spellings of `re`/`im`; the parser canonicalizes
    // them, so the probe is the same expression.
    Re: { src: "re(x)", x: -2, expected: -2 },
    im: { src: "im(x)", x: -2, expected: 0 },
    Im: { src: "im(x)", x: -2, expected: 0 },
    det: { src: "det(x)", x: 3, expected: 3 },
    trace: { src: "trace(x)", x: 3, expected: 3 },
    nPr: { src: "nPr(x,3)", x: 5, expected: 60 },
    nCr: { src: "nCr(x,3)", x: 5, expected: 10 },
};

const allSpellings = [
    ...new Set([
        ...appliedFunctionSymbolsDefault,
        ...appliedFunctionSymbolsDefaultLatex,
    ]),
];

/**
 * Spellings with no *scalar* kernel on the engine's own evaluator, listed so the
 * second test below can still be exhaustive over everything else.
 *
 * `det` is a matrix reducer, and the probe table above can only hand it a
 * scalar. The engine has no scalar `det` kernel, so `evaluate_to_constant` of
 * the degenerate `det(3)` is `NaN` while `f()` compiles it to math.js's `det`,
 * which accepts a scalar and answers `3`. Applied to what an author would
 * actually write — a matrix — both paths agree, which is what
 * `matrix reducers` below pins; `trace` needs no exemption only because its
 * kernel is the identity, so the degenerate scalar case happens to work.
 */
const NO_SCALAR_KERNEL = new Set(["det"]);

function parse(src: string) {
    return me.fromText(src, {
        appliedFunctionSymbols: appliedFunctionSymbolsDefault,
    });
}

function parseLatex(src: string) {
    return me.fromLatex(src, {
        appliedFunctionSymbols: appliedFunctionSymbolsDefaultLatex,
    });
}

describe("every applied function symbol evaluates numerically", () => {
    it("has a probe for every spelling an author can type", () => {
        expect(allSpellings.filter((s) => !(s in PROBES))).toEqual([]);
    });

    it.each(allSpellings)("%s compiles and evaluates through f()", (name) => {
        const { src, x, expected } = PROBES[name];
        expect(parse(src).f()({ x })).closeTo(expected, 1e-12);
    });

    it.each(allSpellings.filter((s) => !NO_SCALAR_KERNEL.has(s)))(
        "%s evaluates through the engine's own evaluator",
        (name) => {
            const { src, x, expected } = PROBES[name];
            const value = parse(src)
                .substitute({ x })
                .evaluate_to_constant() as number;
            expect(value).closeTo(expected, 1e-12);
        },
    );
});

/**
 * The two matrix reducers, probed on a matrix rather than on the scalar the
 * table above can express. This is the form an author writes, and it is where
 * `det`'s exemption from the scalar loop stops being an excuse to skip it.
 *
 * Both are reached through LaTeX because that is the only notation with matrix
 * syntax; the head is the same one the text list carries.
 */
describe("matrix reducers evaluate on both numeric paths", () => {
    const M = String.raw`\begin{pmatrix}${"x"}&2\\3&4\end{pmatrix}`;

    it.each([
        { name: "det", src: String.raw`\det${M}`, x: 1, expected: -2 },
        { name: "det", src: String.raw`\det${M}`, x: 5, expected: 14 },
        {
            name: "trace",
            src: String.raw`\operatorname{trace}${M}`,
            x: 1,
            expected: 5,
        },
    ])("$name at x=$x", ({ src, x, expected }) => {
        const expr = parseLatex(src);
        expect(expr.f()({ x })).closeTo(expected, 1e-12);
        expect(expr.substitute({ x }).evaluate_to_constant() as number).closeTo(
            expected,
            1e-12,
        );
    });
});
