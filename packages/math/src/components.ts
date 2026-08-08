/**
 * Engine-agnostic component access.
 *
 * `get_component` means slightly different things in the two engines, and the
 * difference is the dangerous kind — silent rather than loud:
 *
 * | receiver | legacy JS | Rust/WASM (PR #84) |
 * | --- | --- | --- |
 * | `["tuple",1,2]`, index 0 | `1` | `1` |
 * | `["tuple",1,2]`, index 5 | **throws** | `undefined` |
 * | `["+","x",1]`, index 0 | **throws** | `"x"` |
 * | `"x"`, index 0 | **throws** | `undefined` |
 *
 * The Rust engine is a strict superset: every operator node has components,
 * associative operators are flattened first, and out-of-range yields `undefined`
 * instead of throwing. That is a better primitive. But DoenetML has call sites
 * written against the legacy contract that use the throw as a *type test* — the
 * clearest being `EssentialValueWriter.ts`, which relies on it to decide whether
 * an inverse definition should write a slot at all. Under the new contract a
 * scalar receiver returns a real component, so that code would write a wrong
 * value rather than skipping the slot.
 *
 * `getComponent` below restores the legacy contract on top of either engine:
 * sequence receivers only, `undefined` for anything else. It never throws, so
 * callers test the result instead of catching — which is what the call sites
 * actually meant. Where a caller genuinely wants the richer Rust behavior
 * (matrix paths, function heads), it should call `.get_component(path)` directly
 * and say so.
 */
import type { Expression, Tree } from "./types";

/** Operators the legacy `get_component` accepted: "list, tuple, vector, or array". */
const SEQUENCE_OPERATORS = new Set([
    "tuple",
    "vector",
    "altvector",
    "list",
    "array",
]);

/**
 * The first element of an expression's tree, when that tree is an operator node.
 * `undefined` for leaves (numbers, symbols, booleans).
 */
function operatorOf(expr: Expression): string | undefined {
    const tree = expr.tree as Tree;
    return Array.isArray(tree) && typeof tree[0] === "string"
        ? tree[0]
        : undefined;
}

/**
 * Component `index` of a sequence-valued expression, or `undefined` when the
 * receiver is not a sequence or the index is out of range.
 *
 * Identical on both engines. Never throws.
 */
export function getComponent(
    expr: Expression | undefined | null,
    index: number,
): Expression | undefined {
    if (!expr || typeof (expr as Expression).tree === "undefined") {
        return undefined;
    }
    const operator = operatorOf(expr);
    if (operator === undefined || !SEQUENCE_OPERATORS.has(operator)) {
        return undefined;
    }
    // `tree.length - 1` operands follow the operator.
    const numComponents = (expr.tree as unknown[]).length - 1;
    if (!Number.isInteger(index) || index < 0 || index >= numComponents) {
        return undefined;
    }
    try {
        const component = expr.get_component(index);
        return component ?? undefined;
    } catch {
        // The legacy engine throws for cases the guards above should already
        // have excluded; treat any residual disagreement as "no component"
        // rather than letting engine choice change control flow.
        return undefined;
    }
}
