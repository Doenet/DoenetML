import { describe, expect, it } from "vitest";
import me from "math-expressions";
import { normalizeMathExpression } from "@doenet/utils";
import {
    invertMathValue,
    mathCodePre,
    mathCodesAdjacentToStrings,
    mathDisplayString,
    mathExpressionWithCodes,
    mathInverseAnalysis,
    mathStringsFromExpressionWithCodes,
    mathValueForDisplay,
    mathValueFromCodes,
} from "../../utils/valueFunctions/math";
import {
    numberDisplayString,
    numberFromDesiredText,
    numberFromDesiredValue,
    numberFromString,
    numberValueForDisplay,
    numberValueFromCodes,
} from "../../utils/valueFunctions/number";
import {
    textChildValuesFromDesired,
    textFromMath,
    textToMath,
} from "../../utils/valueFunctions/text";
import { booleanValueFromCodes } from "../../utils/valueFunctions/boolean";

/**
 * The value functions used the way a list that evaluates a template at each
 * index (Doenet/DoenetML#2163) uses them: the content is parsed and analysed
 * once, and only the children's values change from one index to the next.
 * A math child is any non-string in `content`.
 */
describe("value functions", () => {
    const CHILD = {};

    function parse(content: any[]) {
        const strings = content.filter((x) => typeof x === "string");
        const codePre = mathCodePre(strings);
        const expressionWithCodes = mathExpressionWithCodes({
            content,
            codePre,
            format: "text",
            functionSymbols: ["f", "g"],
            functionSymbolChildIndices: [],
            splitSymbols: true,
            parseScientificNotation: false,
        });
        return { codePre, expressionWithCodes };
    }

    const display = {
        displayDigits: 10,
        displayDecimals: 2,
        displaySmallAsZero: 1e-14,
        padZeros: false,
        avoidScientificNotation: false,
        displayBlanks: true,
    };

    it("a math template parsed once and evaluated at each index", () => {
        // <math simplify>$v x^2 + $c</math>, with v = 1, 2, 3 and c = 2
        const { codePre, expressionWithCodes } = parse([
            CHILD,
            " x^2 + ",
            CHILD,
        ]);
        expect(codePre).eq("math");
        expect(expressionWithCodes.toString()).eq("math0 x^2 + math1");

        const texts = [1, 2, 3].map((v) => {
            const value = normalizeMathExpression({
                value: mathValueFromCodes({
                    expressionWithCodes,
                    codePre,
                    codeValues: [me.fromAst(v), me.fromAst(2)],
                }),
                simplify: "full",
            });
            return mathDisplayString({
                valueForDisplay: mathValueForDisplay({
                    value,
                    ...display,
                    simplify: "full",
                    expand: false,
                }),
                format: "text",
                ...display,
            });
        });
        expect(texts).eqls(["x² + 2", "2 x² + 2", "3 x² + 2"]);
    });

    it("a code prefix that a string already contains is extended", () => {
        expect(mathCodePre(["math is fun"])).eq("mathm");
        expect(mathCodePre(["math", "mathm"])).eq("mathmm");
    });

    it("no content means the value comes from elsewhere; empty content is a blank", () => {
        expect(parse([]).expressionWithCodes).eq(null);
        expect(parse([""]).expressionWithCodes.tree).eq("＿");
    });

    it("a write through ($l[$i], 1) goes to the list entry and the literal", () => {
        // what a drag of the point at index 2 to (5, 7) writes
        const content = ["(", CHILD, ", 1)"];
        const { codePre, expressionWithCodes } = parse(content);
        const analysis = mathInverseAnalysis({
            expressionWithCodes,
            codePre,
            childCanBeModified: [true],
            modifyIndirectly: true,
            fixed: false,
            fixLocation: false,
        });
        expect(analysis.canBeModified).eq(true);

        const inverse = invertMathValue({
            desiredValue: me.fromText("(5, 7)"),
            numStrings: 2,
            codeValues: [me.fromAst(2)],
            childCanBeModified: [true],
            childrenToSkip: [],
            analysis,
            expressionWithCodes,
            codePre,
            simplify: "none",
            expand: false,
            createVectors: false,
            createIntervals: false,
        });
        expect(inverse.success).eq(true);
        expect(inverse.childValues[0].tree).eq(5);
        expect(
            mathStringsFromExpressionWithCodes({
                expressionWithCodes: inverse.expressionWithCodes,
                format: "text",
                numStrings: 2,
                numMaths: 1,
                codesAdjacentToStrings: mathCodesAdjacentToStrings({
                    content,
                    codePre,
                    format: "text",
                }),
            }),
        ).eqls(["(", ", 7)"]);
    });

    it("a write through ($i, $c) goes to c only, as $i is fixed", () => {
        const { codePre, expressionWithCodes } = parse([
            "(",
            CHILD,
            ",",
            CHILD,
            ")",
        ]);
        const childCanBeModified = [false, true];
        const analysis = mathInverseAnalysis({
            expressionWithCodes,
            codePre,
            childCanBeModified,
            modifyIndirectly: true,
            fixed: false,
            fixLocation: false,
        });
        const inverse = invertMathValue({
            desiredValue: me.fromText("(9, 3)"),
            numStrings: 3,
            codeValues: [me.fromAst(2), me.fromAst(1)],
            childCanBeModified,
            childrenToSkip: [],
            analysis,
            expressionWithCodes,
            codePre,
            simplify: "none",
            expand: false,
            createVectors: false,
            createIntervals: false,
        });
        expect(inverse.success).eq(true);
        expect(Object.keys(inverse.childValues)).eqls(["1"]);
        expect(inverse.childValues[1].tree).eq(3);
        expect(inverse.expressionWithCodes).eq(undefined);
    });

    it("a nonlinear expression cannot be written", () => {
        const { codePre, expressionWithCodes } = parse([CHILD, "^2"]);
        expect(
            mathInverseAnalysis({
                expressionWithCodes,
                codePre,
                childCanBeModified: [true],
                modifyIndirectly: true,
                fixed: false,
                fixLocation: false,
            }).canBeModified,
        ).eq(false);
    });

    it("a number for display", () => {
        const valueForDisplay = numberValueForDisplay({
            value: Math.PI,
            displayDigits: 3,
            displayDecimals: 2,
            displaySmallAsZero: 1e-14,
        });
        expect(
            numberDisplayString({
                valueForDisplay,
                format: "text",
                padZeros: false,
                avoidScientificNotation: false,
                displayDigits: 3,
                displayDecimals: 2,
            }),
        ).eq("3.14");
    });

    it("a desired text split among the children of a list", () => {
        expect(
            textChildValuesFromDesired({
                desiredValue: "a, b",
                numChildren: 1,
            }),
        ).eqls(["a, b"]);
        expect(
            textChildValuesFromDesired({
                desiredValue: "a, b",
                numChildren: 2,
                compositeReplacementRange: [
                    { firstInd: 0, lastInd: 1, asList: true },
                ],
            }),
        ).eqls(["a", "b"]);
        expect(
            textChildValuesFromDesired({
                desiredValue: "a, b",
                numChildren: 2,
            }),
        ).eq(null);
    });

    it("a math with no math children is written whole", () => {
        expect(
            mathInverseAnalysis({
                expressionWithCodes: me.fromText("x+1"),
                codePre: "math",
                childCanBeModified: [],
                modifyIndirectly: true,
                fixed: false,
                fixLocation: false,
            }).canBeModified,
        ).eq(true);
        expect(
            mathInverseAnalysis({
                expressionWithCodes: me.fromText("x+1"),
                codePre: "math",
                childCanBeModified: [],
                modifyIndirectly: true,
                fixed: true,
                fixLocation: false,
            }).canBeModified,
        ).eq(false);

        const desiredValue = me.fromText("y");
        const common = {
            desiredValue,
            codeValues: [],
            childCanBeModified: [],
            childrenToSkip: [],
            analysis: {},
            expressionWithCodes: me.fromText("x"),
            codePre: "math",
            simplify: "none",
            expand: false,
            createVectors: false,
            createIntervals: false,
        };
        expect(invertMathValue({ ...common, numStrings: 2 })).eqls({
            success: true,
            expressionWithCodes: desiredValue,
        });
        expect(
            invertMathValue({
                ...common,
                numStrings: 0,
                expressionWithCodes: null,
            }),
        ).eqls({ success: true, valueShadow: desiredValue });

        // the first string piece gets the expression, the others are emptied
        expect(
            mathStringsFromExpressionWithCodes({
                expressionWithCodes: me.fromText("x+1"),
                format: "text",
                numStrings: 3,
                numMaths: 0,
                codesAdjacentToStrings: [],
            }),
        ).eqls(["x + 1", "", ""]);
    });

    it("an inverse leaves a skipped child alone and refuses a value that does not match", () => {
        const content = ["(", CHILD, ",", CHILD, ")"];
        const { codePre, expressionWithCodes } = parse(content);
        const childCanBeModified = [true, true];
        const analysis = mathInverseAnalysis({
            expressionWithCodes,
            codePre,
            childCanBeModified,
            modifyIndirectly: true,
            fixed: false,
            fixLocation: false,
        });
        const common = {
            numStrings: 3,
            codeValues: [me.fromAst(1), me.fromAst(2)],
            childCanBeModified,
            analysis,
            expressionWithCodes,
            codePre,
            simplify: "none",
            expand: false,
            createVectors: false,
            createIntervals: false,
        };
        const inverse = invertMathValue({
            ...common,
            desiredValue: me.fromText("(5, 7)"),
            childrenToSkip: [0],
        });
        expect(inverse.success).eq(true);
        expect(Object.keys(inverse.childValues)).eqls(["1"]);
        expect(inverse.childValues[1].tree).eq(7);

        expect(
            invertMathValue({
                ...common,
                desiredValue: me.fromText("5"),
                childrenToSkip: [],
            }),
        ).eqls({ success: false });
    });

    it("in LaTeX the codes beside a string piece are operator names", () => {
        expect(
            mathCodesAdjacentToStrings({
                content: ["(", CHILD, ", 1)"],
                codePre: "math",
                format: "latex",
            }),
        ).eqls([
            { nextCode: "\\operatorname{math0}" },
            { prevCode: "\\operatorname{math0}" },
        ]);
        // a string piece followed by another gets no entry
        expect(
            mathCodesAdjacentToStrings({
                content: ["x", "+ ", CHILD],
                codePre: "math",
                format: "text",
            }),
        ).eqls([{ nextCode: "math0" }]);
        expect(
            mathDisplayString({
                valueForDisplay: me.fromText("x^2"),
                format: "latex",
                ...display,
            }),
        ).eq("x^{2}");
    });

    it("a number from its children's values by code", () => {
        // 2 a + b, with a math child a = 3 and a number child b = 4
        const parsedExpression = me.fromAst(["+", ["*", 2, "a"], "b"]);
        expect(
            numberValueFromCodes({
                parsedExpression,
                mathValuesByCode: { a: me.fromAst(3) },
                numberValuesByCode: { b: 4 },
                valueOnNaN: NaN,
            }),
        ).eq(10);
        // a currency marker is dropped
        expect(
            numberValueFromCodes({
                parsedExpression: me.fromAst(["*", 2, "$"]),
                mathValuesByCode: {},
                numberValuesByCode: {},
                valueOnNaN: NaN,
            }),
        ).eq(2);
        // a free variable is not a number: the caller falls back
        expect(
            numberValueFromCodes({
                parsedExpression,
                mathValuesByCode: { a: me.fromAst("x") },
                numberValuesByCode: { b: 4 },
                valueOnNaN: NaN,
            }),
        ).eq(null);
    });

    it("a number from a string, and from a desired value or text", () => {
        expect(numberFromString("1e3")).eq(1000);
        expect(numberFromString("pi")).eq(Math.PI);
        expect(numberFromString("")).eqls(NaN);
        expect(numberFromString("x", { valueOnNaN: 0 })).eq(0);
        expect(numberFromString("1 < 2")).eqls(NaN);
        expect(numberFromString("1 < 2", { convertBoolean: true })).eq(1);

        expect(numberFromDesiredValue(me.fromText("2+3"), NaN)).eq(5);
        expect(numberFromDesiredValue(me.fromText("x"), 7)).eq(7);
        expect(numberFromDesiredValue("4", NaN)).eq(4);
        expect(numberFromDesiredValue("a", 7)).eq(7);

        expect(numberFromDesiredText("1e3")).eq(1000);
        expect(numberFromDesiredText("pi")).eq(Math.PI);
        expect(numberFromDesiredText("x")).eq(null);
        expect(numberFromDesiredText("Infinity")).eq(null);
    });

    it("a text read as math and written from math", () => {
        expect(textToMath({ value: "x^2", isLatex: false }).tree).eqls([
            "^",
            "x",
            2,
        ]);
        expect(textToMath({ value: "\\frac{1}{2}", isLatex: true }).tree).eqls([
            "/",
            1,
            2,
        ]);
        expect(textToMath({ value: "(", isLatex: false }).tree).eq("＿");
        expect(textFromMath({ math: me.fromText("x^2"), isLatex: true })).eq(
            "x^{2}",
        );
        expect(textFromMath({ math: me.fromText("x^2"), isLatex: false })).eq(
            "x^2",
        );
    });

    it("a boolean whose content did not parse is false", () => {
        expect(
            booleanValueFromCodes({
                parsedExpression: null,
                childrenAndSettings: {},
                canOverrideUnorderedCompare: true,
            }),
        ).eq(false);
    });
});
