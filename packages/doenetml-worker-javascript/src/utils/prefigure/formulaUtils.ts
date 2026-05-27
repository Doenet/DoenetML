import me from "math-expressions";
import type { CurveFunctionDefinition } from "./types";

/** A parsed formula with its variable and expression in string form. */
export interface ParsedFormulaDefinition {
    variableName: string;
    expression: string;
}

/**
 * Convert a math-expressions AST to a string representation.
 * Safely handles invalid ASTs by catching exceptions.
 *
 * @param ast - The abstract syntax tree from math-expressions
 * @returns String representation of the expression, or null if conversion fails
 */
export function astToExpressionString(ast: unknown): string | null {
    try {
        return me
            .fromAst(ast as any)
            .toString({ explicitMultiplicationSymbols: true });
    } catch (_e) {
        return null;
    }
}

function escapeRegex(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Rewrite the variable symbol used in an expression string.
 *
 * Used when the variable name produced by `astToExpressionString` differs from
 * the variable name PreFigure expects in the emitted function signature
 * (for example, parametric x/y components authored with different variables,
 * or a child function authored in `u` when the surrounding spec requires `x`).
 */
export function rewriteExpressionVariable({
    expression,
    fromVariable,
    toVariable,
}: {
    expression: string;
    fromVariable: string;
    toVariable: string;
}): string {
    if (!fromVariable || fromVariable === toVariable) {
        return expression;
    }

    const escaped = escapeRegex(fromVariable);
    const symbolPattern = new RegExp(
        `(^|[^A-Za-z0-9_])(${escaped})(?=$|[^A-Za-z0-9_])`,
        "g",
    );

    return expression.replace(symbolPattern, `$1${toVariable}`);
}

/**
 * Parse a simple formula-based curve function definition.
 * Extracts the expression and variable name; returns null if definition
 * is not a formula type or expression conversion fails.
 *
 * @param definition - The curve function definition
 * @param fallbackVariableName - Variable name to use if not specified (e.g., "x" or "t")
 * @returns Parsed definition with variable and expression, or null
 */
export function parseFormulaDefinition(
    definition: CurveFunctionDefinition | null,
    fallbackVariableName: string,
): ParsedFormulaDefinition | null {
    if (!definition || definition.functionType !== "formula") {
        return null;
    }

    const expression = astToExpressionString(definition.formula);
    if (!expression) {
        return null;
    }

    const variables = Array.isArray(definition.variables)
        ? definition.variables
        : [];
    const variableExpression = variables.length
        ? astToExpressionString(variables[0])
        : null;

    return {
        variableName: variableExpression || fallbackVariableName,
        expression,
    };
}
