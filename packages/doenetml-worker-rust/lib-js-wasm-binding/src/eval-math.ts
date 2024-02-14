// @ts-ignore
import me from "math-expressions";
import { globalThis } from "./global-this";
import {
    serializedComponentsReplacer,
    serializedComponentsReviver,
} from "@doenet/utils";
import { getLatexToMathConverter, getTextToMathConverter } from "./math";

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
    let fromText = getTextToMathConverter({
        splitSymbols: splitSymbols,
        parseScientificNotation: parseScientificNotation,
        functionSymbols,
    });
    let expression;
    try {
        expression = fromText(text);
    } catch (e) {
        expression = me.fromAst("\uFF3F"); // long underscore
        console.log("Invalid value for a math of text format: " + text);
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
    let fromLatex = getLatexToMathConverter({
        splitSymbols: splitSymbols,
        parseScientificNotation: parseScientificNotation,
        functionSymbols,
    });
    let expression;
    try {
        expression = fromLatex(latex);
    } catch (e) {
        expression = me.fromAst("\uFF3F"); // long underscore
        console.log("Invalid value for a math of latex format: " + latex);
    }

    return JSON.stringify(expression, serializedComponentsReplacer);
}

/**
 * Return a LaTeX string that corresponds to a mathematical expression.
 */
export function toLatex(
    math_object: string,
    padToDecimals?: number,
    padToDigits?: number,
    showBlanks?: boolean,
) {
    let math_expr = JSON.parse(math_object, serializedComponentsReviver);

    return math_expr.toLatex({
        padToDecimals,
        padToDigits,
        showBlanks,
    });
}

/**
 * Create a new mathematical expression formed by substituting variables with new expressions
 */
export function substituteIntoMath(
    math_object: string,
    substitutions: Map<string, any>,
) {
    let math_expr = JSON.parse(math_object, serializedComponentsReviver);

    // math-expressions substitute expects an object, not a Map
    let subs_object = Object.fromEntries(substitutions.entries());

    let new_expr = math_expr.substitute(subs_object);

    return JSON.stringify(new_expr, serializedComponentsReplacer);
}
