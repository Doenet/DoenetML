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
    numberValueForDisplay,
} from "../../utils/valueFunctions/number";
import { textChildValuesFromDesired } from "../../utils/valueFunctions/text";

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
});
