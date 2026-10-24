import { describe, expect, it } from "vitest";
import me from "math-expressions";
import {
    astToPythonExpression,
    astToVariableName,
    parseFormulaDefinition,
} from "../../utils/prefigure/formulaUtils";

function fromText(text: string, allowedSymbols?: string[]) {
    return astToPythonExpression(
        me.fromText(text).tree,
        allowedSymbols ? new Set(allowedSymbols) : undefined,
    );
}

function fromLatex(latex: string) {
    return astToPythonExpression(me.fromLatex(latex).tree);
}

describe("PreFigure formula translation @group4", () => {
    it("keeps the formatting of ordinary arithmetic", () => {
        expect(fromText("x^2").expression).eq("x^2");
        expect(fromText("3x").expression).eq("3*x");
        expect(fromText("x+1").expression).eq("x + 1");
        expect(fromText("(x-2)(x-5)").expression).eq("(x - 2)*(x - 5)");
        expect(fromText("e^(x/5)").expression).eq("e^(x/5)");
        expect(fromText("sqrt(x)").expression).eq("sqrt(x)");
    });

    it("writes pi as a name PreFigure knows", () => {
        expect(fromText("sin(pi x)").expression).eq("sin(pi*x)");
        expect(fromLatex("\\pi x").expression).eq("pi*x");
    });

    it("writes absolute value as abs()", () => {
        expect(fromText("|x|").expression).eq("abs(x)");
        expect(fromLatex("\\left|x-1\\right|").expression).eq("abs(x - 1)");
    });

    it("maps inverse trig and hyperbolic names to Python's", () => {
        expect(fromText("arcsin(x/10)").expression).eq("asin(x/10)");
        expect(fromText("arccos(x)").expression).eq("acos(x)");
        expect(fromText("arctan(x)").expression).eq("atan(x)");
        expect(fromText("arcsinh(x)").expression).eq("asinh(x)");
        expect(fromText("arccosh(x)").expression).eq("acosh(x)");
        expect(fromText("arctanh(x)").expression).eq("atanh(x)");
        expect(fromLatex("\\sin^{-1}(x)").expression).eq("asin(x)");
    });

    it("rewrites functions Python's math module lacks", () => {
        expect(fromText("arcsec(x)").expression).eq("acos(1/(x))");
        expect(fromText("arccsc(x)").expression).eq("asin(1/(x))");
        expect(fromText("arccot(x)").expression).eq("atan(1/(x))");
        expect(fromText("sech(x)").expression).eq("1/cosh(x)");
        expect(fromText("x/sech(x)").expression).eq("x/(1/cosh(x))");
        expect(fromText("x!").expression).eq("gamma(x + 1)");
        // Half away from zero, as math-expressions rounds.
        expect(fromText("round(x)").expression).eq(
            "copysign(floor(abs(x) + 0.5), x)",
        );
        expect(fromLatex("\\sqrt[3]{x}").expression).eq("cbrt(x)");
        expect(fromLatex("\\log_2 x").expression).eq("log(x, 2)");
        expect(fromText("log_10(x)").expression).eq("log10(x)");
    });

    it("passes through functions whose names already match", () => {
        for (const name of ["sin", "cos", "tan", "sec", "exp", "ln", "log"]) {
            expect(fromText(`${name}(x)`).expression).eq(`${name}(x)`);
        }
        expect(fromText("floor(x)").expression).eq("floor(x)");
        expect(fromText("ceil(x)").expression).eq("ceil(x)");
    });

    it("writes powers of functions", () => {
        expect(fromText("sin^2(x)").expression).eq("sin(x)^2");
    });

    it("parenthesizes so Python's precedence matches the AST", () => {
        // math-expressions parses x^y^z as (x^y)^z; Python's ** is
        // right-associative.
        expect(fromText("x^y^z").expression).eq("(x^y)^z");
        // Python's ** binds tighter than a leading minus.
        expect(fromText("(-x)^2").expression).eq("(-x)^2");
        expect(fromText("-x^2").expression).eq("-x^2");
        expect(fromText("x^(-2)").expression).eq("x^(-2)");
        expect(fromText("x/(2y)").expression).eq("x/(2*y)");
        expect(fromText("x/y/z").expression).eq("x/y/z");
        expect(fromText("1/(2/x)").expression).eq("1/(2/x)");
        expect(fromText("a-(b-c)").expression).eq("a - (b - c)");
        expect(fromText("-(x+1)").expression).eq("-(x + 1)");
        expect(fromText("x*(-y)").expression).eq("x*(-y)");
        expect(fromText("x+-1").expression).eq("x - 1");
    });

    it("keeps subscripted names as identifiers", () => {
        expect(fromText("x_1^2").expression).eq("x_1^2");
    });

    it("reports functions and operators PreFigure cannot evaluate", () => {
        expect(fromText("sign(x)").unsupportedFeature).eq("sign");
        expect(fromText("f(x)").unsupportedFeature).eq("f");
        expect(fromText("x'").unsupportedFeature).eq("prime");
        expect(fromText("x < 2").unsupportedFeature).eq("<");
        expect(fromText("nthroot(x,3)").unsupportedFeature).eq("nthroot");
        // Names of Object.prototype members are not mapped functions.
        for (const name of ["toString", "constructor"]) {
            expect(
                astToPythonExpression(["apply", name, "x"]).unsupportedFeature,
            ).eq(name);
            expect(
                astToPythonExpression(["apply", ["^", name, -1], "x"])
                    .unsupportedFeature,
            ).eq(name);
        }
    });

    it("reports free symbols other than the allowed variables", () => {
        expect(fromText("a x^2", ["x"]).unsupportedFeature).eq("a");
        expect(fromText("x + 2i", ["x"]).unsupportedFeature).eq("i");
        expect(fromText("pi x + e", ["x"]).expression).eq("pi*x + e");
    });

    it("rejects Python keywords as names", () => {
        expect(fromText("lambda^2").unsupportedFeature).eq("lambda");
        expect(astToVariableName("lambda")).eq(null);
        expect(astToVariableName("theta")).eq("theta");
    });

    it("parseFormulaDefinition warns about a formula it cannot translate", () => {
        const diagnostics: any[] = [];
        const parsed = parseFormulaDefinition(
            {
                functionType: "formula",
                formula: me.fromText("sign(x)").tree,
                variables: ["x"],
            },
            "x",
            { diagnostics, subject: "<curve>" },
        );

        expect(parsed).eq(null);
        expect(diagnostics).toHaveLength(1);
        expect(diagnostics[0].code).eq("doenet-w0170");
        expect(diagnostics[0].message).eq(
            "<curve>: the PreFigure renderer cannot evaluate 'sign' in this formula; formula not drawn.",
        );
    });

    it("parseFormulaDefinition allows the fallback variable", () => {
        const parsed = parseFormulaDefinition(
            { functionType: "formula", formula: me.fromText("t^2").tree },
            "t",
        );

        expect(parsed).toEqual({ variableName: "t", expression: "t^2" });
    });
});
