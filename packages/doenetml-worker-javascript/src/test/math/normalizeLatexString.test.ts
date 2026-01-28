import { describe, expect, it } from "vitest";
import { normalizeLatexString } from "../../utils/math";

describe("normalizeLatexString unicode substitutions", () => {
    it("converts Greek letter alpha", () => {
        const input = "α + β";
        const output = normalizeLatexString(input);
        expect(output).toContain("\\alpha");
        expect(output).toContain("\\beta");
    });

    it("converts Greek letters pi and theta", () => {
        const input = "π θ";
        const output = normalizeLatexString(input);
        expect(output).toContain("\\pi");
        expect(output).toContain("\\theta");
    });

    it("converts uppercase Greek letters", () => {
        const input = "Γ Δ Σ Ω";
        const output = normalizeLatexString(input);
        expect(output).toContain("\\Gamma");
        expect(output).toContain("\\Delta");
        expect(output).toContain("\\Sigma");
        expect(output).toContain("\\Omega");
    });

    it("converts minus sign", () => {
        const input = "x − y";
        const output = normalizeLatexString(input);
        expect(output).toContain("-");
    });

    it("converts dot operator", () => {
        const input = "a ⋅ b";
        const output = normalizeLatexString(input);
        expect(output).toContain("\\cdot");
    });

    it("converts middle dot operator", () => {
        const input = "a · b";
        const output = normalizeLatexString(input);
        expect(output).toContain("\\cdot");
    });

    it("converts times operator", () => {
        const input = "a × b";
        const output = normalizeLatexString(input);
        expect(output).toContain("\\times");
    });

    it("converts union and intersection", () => {
        const input = "A ∪ B ∩ C";
        const output = normalizeLatexString(input);
        expect(output).toContain("\\cup");
        expect(output).toContain("\\cap");
    });

    it("converts infinity and empty set", () => {
        const input = "∞ ∅";
        const output = normalizeLatexString(input);
        expect(output).toContain("\\infty");
        expect(output).toContain("\\emptyset");
    });

    it("converts prime symbol", () => {
        const input = "f′(x)";
        const output = normalizeLatexString(input);
        expect(output).toContain("'");
        expect(output).not.toContain("′");
    });

    it("handles multiple unicode substitutions in one string", () => {
        const input = "α + β − π × ∞";
        const output = normalizeLatexString(input);
        expect(output).toContain("\\alpha");
        expect(output).toContain("\\beta");
        expect(output).toContain("\\pi");
        expect(output).toContain("\\times");
        expect(output).toContain("\\infty");
    });

    it("converts alternative Greek letter variants", () => {
        const input = "ϐ ϑ ϵ ϱ ϖ";
        const output = normalizeLatexString(input);
        expect(output).toContain("\\beta");
        expect(output).toContain("\\theta");
        expect(output).toContain("\\epsilon");
        expect(output).toContain("\\rho");
        expect(output).toContain("\\pi");
    });
});

describe("normalizeLatexString double script handling", () => {
    it("collapses double exponents", () => {
        const input = "x^{^{8}}";
        const output = normalizeLatexString(input);
        expect(output).toBe("x^{8}");
    });

    it("collapses double exponents with nested braces", () => {
        const input = "x^{^{\\frac{8}{3}}}";
        const output = normalizeLatexString(input);
        expect(output).toBe("x^{\\frac{8}{3}}");
    });

    it("collapses double subscripts", () => {
        const input = "x_{_{5}}";
        const output = normalizeLatexString(input);
        expect(output).toBe("x_{5}");
    });

    it("collapses double subscripts with nested braces", () => {
        const input = "x_{_{\\frac{5}{8}}}";
        const output = normalizeLatexString(input);
        expect(output).toBe("x_{\\frac{5}{8}}");
    });

    it("handles whitespace between double exponents", () => {
        const input = "x^ {^ {2}}";
        const output = normalizeLatexString(input);
        expect(output).toBe("x^{2}");
    });

    it("does not collapse non-double exponents", () => {
        const input = "x^{2}";
        const output = normalizeLatexString(input);
        expect(output).toBe("x^{2}");
    });

    it("does not collapse mixed exponent and subscript", () => {
        const input = "x^{_{5}}";
        const output = normalizeLatexString(input);
        expect(output).toBe("x^{_{5}}");
    });

    it("handles multiple double exponents in same expression", () => {
        const input = "x^{^{2}} + y^{^{3}}";
        const output = normalizeLatexString(input);
        expect(output).toBe("x^{2} + y^{3}");
    });

    it("collapses double exponents with complex nested expression", () => {
        const input = "x^{^{\\sqrt{\\frac{a}{b}}}}";
        const output = normalizeLatexString(input);
        expect(output).toBe("x^{\\sqrt{\\frac{a}{b}}}");
    });

    it("handles double subscripts with whitespace", () => {
        const input = "x_ {_ {n}}";
        const output = normalizeLatexString(input);
        expect(output).toBe("x_{n}");
    });

    it("handles three superscripts in a row", () => {
        const input = "x^{^{^{2}}}";
        const output = normalizeLatexString(input);
        expect(output).toBe("x^{2}");
    });

    it("handles three subscripts in a row", () => {
        const input = "x_{_{_{5}}}";
        const output = normalizeLatexString(input);
        expect(output).toBe("x_{5}");
    });
});
