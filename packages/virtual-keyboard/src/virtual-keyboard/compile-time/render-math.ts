import katex from "katex";

const MATH_TO_RENDER = [
    "\\frac{a}{b}",
    "\\sqrt{a}",
    "\\sin",
    "\\cos",
    "\\tan",
    "\\log",
    "\\ln",
    "\\log_{b}",
    "\\tan^{-1}",
    "\\sin^{-1}",
    "\\cos^{-1}",
    "\\sqrt[a]{b}",
    "e^a",
    "10^a",
    "\\frac{d}{dx}",
    "\\int_a^b",
    "n!",
    "⌊a⌋",
    "⌈a⌉",
    "a^2",
    "b^a",
    "\\sqrt{a}",
    "|a|",
    " x",
    " y",
    "\\pi",
    " e",
];
/**
 * A map from math strings to their rendered versions.
 */
export type PrerenderedMath = Record<string, string>;

export default () => {
    const prerendered: PrerenderedMath = Object.fromEntries(
        MATH_TO_RENDER.map((math) => [
            math,
            katex.renderToString(math, { output: "mathml" }),
        ]),
    );
    return {
        data: { prerendered },
    };
};
