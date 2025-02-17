export function cleanLatex(latex: string) {
    return latex
        .replace(/\s*/g, "")
        .replace(/\\left/g, "")
        .replace(/\\right/g, "");
}
