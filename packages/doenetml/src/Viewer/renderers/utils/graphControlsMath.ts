import me from "math-expressions";
import { roundForDisplay } from "@doenet/utils";
import type { GraphControlPoint } from "./graphControls";

/**
 * Parse a single numeric expression used by x/y text inputs.
 *
 * Returns null for invalid expressions or non-finite results.
 */
export function parseSingleMathNumber(input: string): number | null {
    try {
        const expression = me.fromText(input);
        const value = expression?.evaluate_to_constant?.();
        return Number.isFinite(value) ? value : null;
    } catch (_error) {
        return null;
    }
}

/**
 * Parse an ordered pair from text input.
 *
 * Accepts tuple/vector syntax and returns null unless both coordinates
 * evaluate to finite constants.
 */
export function parseOrderedPair(
    input: string,
): { x: number; y: number } | null {
    try {
        const expression = me.fromText(input);
        const tree = expression?.tree;
        if (!Array.isArray(tree) || tree.length !== 3) {
            return null;
        }

        const operator = tree[0];
        if (operator !== "tuple" && operator !== "vector") {
            return null;
        }

        const x = me.fromAst(tree[1])?.evaluate_to_constant?.();
        const y = me.fromAst(tree[2])?.evaluate_to_constant?.();

        if (x === null || y === null) {
            return null;
        }

        if (!Number.isFinite(x) || !Number.isFinite(y)) {
            return null;
        }

        return { x, y };
    } catch (_error) {
        return null;
    }
}

/**
 * Format coordinates using the same display/padding settings as point labels.
 */
export function formatCoordinateForControls(
    value: number,
    point: GraphControlPoint,
): string {
    const rounded = roundForDisplay({
        value,
        dependencyValues: {
            displayDigits: point.displayDigits,
            displayDecimals: point.displayDecimals,
            displaySmallAsZero: point.displaySmallAsZero,
        },
    });

    const params: any = {};
    if (point.padZeros) {
        if (Number.isFinite(point.displayDecimals)) {
            params.padToDecimals = point.displayDecimals;
        }
        if (point.displayDigits >= 1) {
            params.padToDigits = point.displayDigits;
        }
    }

    return rounded.toString(params);
}
