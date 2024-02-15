// @ts-ignore
import me from "math-expressions";
import { globalThis } from "./global-this";
import {
    serializedComponentsReplacer,
    serializedComponentsReviver,
    normalizeMathExpression,
} from "@doenet/utils";
import { latexToMathFactory, textToMathFactory } from "./math-utils";

/**
 * Evaluate the Javascript source code with `MathExpressions` and `window` in scope.
 * Return the `JSON.stringify`ed results.
 */
export function evalWithMathExpressionsInScope(source: string) {
    function _eval(MathExpressions: any, window: Window) {
        // This is a hack to make sure that `MathExpressions` and `window` are
        // not eliminated by tree shaking. The body of the if statement should never
        // execute, but the code compilers/minifiers shouldn't be smart enough to
        // eliminate it.
        // XXX: Is there a better way to prevent these from being eliminated?
        if (Math.random() < -1) {
            console.log(
                "Running with MathExpressions in scope",
                MathExpressions,
                window,
                serializedComponentsReviver,
            );
        }

        return JSON.stringify(eval(source), serializedComponentsReplacer);
    }
    return _eval(me, globalThis);
}

/**
 * Parse the string `text` into math using the `math-expressions` text parser.
 * Return the `JSON.stringify`ed results.
 */
export function parseTextIntoMath(
    text: string,
    splitSymbols: boolean,
    functionSymbols: string[],
    parseScientificNotation: boolean,
) {
    let fromText = textToMathFactory({
        splitSymbols: splitSymbols,
        parseScientificNotation: parseScientificNotation,
        functionSymbols,
    });
    let expression;
    try {
        expression = fromText(text);
    } catch (e) {
        expression = me.fromAst("\uFF3F"); // long underscore
        console.warn("Invalid value for a math of text format: " + text);
    }

    return JSON.stringify(expression, serializedComponentsReplacer);
}

/**
 * Parse the string `latex` into math using the `math-expressions` latex parser.
 * Return the `JSON.stringify`ed results.
 */
export function parseLatexIntoMath(
    latex: string,
    splitSymbols: boolean,
    functionSymbols: string[],
    parseScientificNotation: boolean,
) {
    let fromLatex = latexToMathFactory({
        splitSymbols: splitSymbols,
        parseScientificNotation: parseScientificNotation,
        functionSymbols,
    });
    let expression;
    try {
        expression = fromLatex(latex);
    } catch (e) {
        expression = me.fromAst("\uFF3F"); // long underscore
        console.warn("Invalid value for a math of latex format: " + latex);
    }

    return JSON.stringify(expression, serializedComponentsReplacer);
}

/**
 * Return a LaTeX string that corresponds to a mathematical expression.
 */
export function toLatex(
    mathObject: string,
    padToDecimals?: number,
    padToDigits?: number,
    showBlanks?: boolean,
) {
    let mathExpr = JSON.parse(mathObject, serializedComponentsReviver);

    return mathExpr.toLatex({
        padToDecimals,
        padToDigits,
        showBlanks,
    });
}

/**
 * Create a new mathematical expression formed by substituting variables with new expressions
 */
export function substituteIntoMath(
    mathObject: string,
    substitutions: Map<string, any>,
) {
    let mathExpr = JSON.parse(mathObject, serializedComponentsReviver);

    // math-expressions substitute expects an object, not a Map
    let subs_object = Object.fromEntries(substitutions.entries());

    let newExpr = mathExpr.substitute(subs_object);

    return JSON.stringify(newExpr, serializedComponentsReplacer);
}

enum Simplify {
    None = "none",
    NumbersPreserveOrder = "numberspreserveorder", // TODO: modify to use "numbersPreserveOrder"
    Numbers = "numbers",
    Full = "full",
}

export function normalizeMath(
    mathObject: string,
    simplify: Simplify,
    expand: boolean,
    createVectors: boolean,
    createIntervals: boolean,
) {
    let mathExpr = JSON.parse(mathObject, serializedComponentsReviver);

    let newExpr = normalizeMathExpression({
        value: mathExpr,
        simplify,
        expand,
        createVectors,
        createIntervals,
    });

    return JSON.stringify(newExpr, serializedComponentsReplacer);
}
