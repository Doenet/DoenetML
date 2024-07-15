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
 * Assume the result is a math expression and return the `JSON.stringify`ed tree.
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

        return JSON.stringify(eval(source).tree, serializedComponentsReplacer);
    }
    return _eval(me, globalThis);
}

/**
 * Parse the string `text` into math using the `math-expressions` text parser.
 * Return the `JSON.stringify`ed results.
 *
 * Arguments:
 * @text - the source string
 * @splitSymbols - if `true`, we split multi-character symbols into the product of the characters
 * @functionSymbols - a list of the symbols that will be treated as a function,
 *    i.e., one of these symbols followed by arguments in parentheses
 *    will be interpreted as apply that function to the arguments (rather than multiplication)
 * @parseScientificNotation - if `true`, parse expressions such as "1E-10" into scientific notation
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

    return JSON.stringify(expression.tree, serializedComponentsReplacer);
}

/**
 * Return a text string that corresponds to a mathematical expression.
 *
 * Arguments:
 * @mathObject - the stringified math expression
 * @padToDecimals - If present, then pad numbers with zeros so they have at least
 *    this many decimal places after the decimal point displayed.
 * @padToDigits - If present, then pad numbers with zeros so they have at least
 *    this many total digits displayed.
 * @showBlanks - If `true`, then display any blanks in the mathematical expression
 *    as a long underscore.
 */
export function toText(
    mathObject: string,
    padToDecimals?: number,
    padToDigits?: number,
    showBlanks?: boolean,
) {
    let mathExpr = me.fromAst(
        JSON.parse(mathObject, serializedComponentsReviver),
    );

    return mathExpr.toString({
        padToDecimals,
        padToDigits,
        showBlanks,
    });
}

/**
 * Parse the string `latex` into math using the `math-expressions` latex parser.
 * Return the `JSON.stringify`ed results.
 *
 * Arguments:
 * @latex - the source string
 * @splitSymbols - if `true`, we split multi-character symbols into the product of the characters
 * @functionSymbols - a list of the symbols that will be treated as a function,
 *    i.e., one of these symbols followed by arguments in parentheses
 *    will be interpreted as apply that function to the arguments (rather than multiplication)
 * @parseScientificNotation - if `true`, parse expressions such as "1E-10" into scientific notation
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

    return JSON.stringify(expression.tree, serializedComponentsReplacer);
}

/**
 * Return a LaTeX string that corresponds to a mathematical expression.
 *
 * Arguments:
 * @mathObject - the stringified math expression
 * @padToDecimals - If present, then pad numbers with zeros so they have at least
 *    this many decimal places after the decimal point displayed.
 * @padToDigits - If present, then pad numbers with zeros so they have at least
 *    this many total digits displayed.
 * @showBlanks - If `true`, then display any blanks in the mathematical expression
 *    as a long underscore.
 */
export function toLatex(
    mathObject: string,
    padToDecimals?: number,
    padToDigits?: number,
    showBlanks?: boolean,
) {
    let mathExpr = me.fromAst(
        JSON.parse(mathObject, serializedComponentsReviver),
    );

    return mathExpr.toLatex({
        padToDecimals,
        padToDigits,
        showBlanks,
    });
}

/**
 * Create a new mathematical expression formed by substituting variables with new expressions
 *
 * Arguments:
 * @mathObject - the stringified math expression
 * @substitutions - a mapping of variable names and the values to substitute for those variables
 */
export function substituteIntoMath(
    mathObject: string,
    substitutions: Map<string, any>,
) {
    let mathExpr = me.fromAst(
        JSON.parse(mathObject, serializedComponentsReviver),
    );

    // math-expressions substitute expects an object, not a Map
    let subs_object: Record<string, any> = {};
    for (const [key, value] of substitutions.entries()) {
        subs_object[key] = me.fromAst(
            JSON.parse(value, serializedComponentsReviver),
        );
    }

    let newExpr = mathExpr.substitute(subs_object);

    return JSON.stringify(newExpr.tree, serializedComponentsReplacer);
}

/**
 * Return a normalize mathematical expression as specified by the parameters
 *
 * Arguments:
 * @mathObject - the stringified math expression
 * @simplify - We currently support four options for `simplify`:
 * - `"none"`: no simplification
 * - `"numberspreserveorder"`: simplify numbers within the expression, such as simplify `1+1` to 2,
 *    except do not change the order between numerical and non-numerical operands (such as a variable).
 * - `"numbers"`: simplify numbers within the expression, such as simplify `1+1` to 2,
 * - `"full"`: simplify the mathematical expression using the currently
 *    implemented features. These features are limited and subject to change.
 *    For example, simplification of ratio expressions is essentially non-existent.
 * @expand - if `true`, expand out multiplication over addition/subtraction.
 * @createVectors - if `true`, create vectors out of tuples (that haven't previously been turned into intervals).
 * @createIntervals - if `true`, create closed intervals out of arrays and open intervals out of tuples
 *  (that haven't previously been turned into vectors).
 *  If both `create_vectors` and `create_intervals` are `true`,
 *  `create_vectors` is applied first so that only arrays will be affected by `create_intervals`.
 */
export function normalizeMath(
    mathObject: string,
    simplify: "none" | "numberspreserveorder" | "numbers" | "full",
    expand: boolean,
    createVectors: boolean,
    createIntervals: boolean,
) {
    let mathExpr = me.fromAst(
        JSON.parse(mathObject, serializedComponentsReviver),
    );

    let newExpr = normalizeMathExpression({
        value: mathExpr,
        simplify,
        expand,
        createVectors,
        createIntervals,
    });

    return JSON.stringify(newExpr.tree, serializedComponentsReplacer);
}

/**
 * Attempts to evaluate the math expression to a constant number, returning NaN if failure
 *
 * Arguments:
 * @mathObject - the stringified math expression
 */
export function evaluateToNumber(mathObject: string) {
    let mathExpr = me.fromAst(
        JSON.parse(mathObject, serializedComponentsReviver),
    );

    let newNumber = mathExpr.evaluate_to_constant();

    return newNumber;
}

/**
 * Attempts to parse the string into a math expression using the text parses,
 * and then evaluate the math expression to a constant number, returning NaN if failure
 *
 * Arguments:
 * @text - the source string
 */
export function parseTextIntoNumber(text: string): number {
    let fromText = textToMathFactory({
        splitSymbols: true,
        functionSymbols: [],
    });
    let expression;
    try {
        expression = fromText(text);
    } catch (e) {
        console.warn("Invalid value for a math of text format: " + text);
        return NaN;
    }

    let newNumber = expression.evaluate_to_constant();

    return newNumber;
}
