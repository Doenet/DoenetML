import { ElementRefAnnotation, FlatDastElement } from "@doenet/doenetml-worker";

/**
 * A list of ancestors of a specific node, with the closest ancestor first.
 * In addition to the id of the ancestor, we also store the annotation of the ancestor.
 * This type is a string so that it can be compared during memoization (since a component's ancestor chain is created
 * dynamically).
 */
export type AncestorChain = string;

/**
 * Generate a unique html id for a given node if `annotation` is `"original"` and the ancestor chain
 * only includes `"original"` elements, otherwise return `undefined`.
 *
 * Items annotated with `"duplicate"` should not be given an html id at all (since there is another item on the page
 * that "claims" that id).
 */
export function generateHtmlId(
    node: FlatDastElement,
    annotation: ElementRefAnnotation | undefined,
    ancestorChain: AncestorChain | undefined,
): string | undefined {
    const shouldSkip =
        annotation === "duplicate" ||
        (ancestorChain != null && ancestorChainHasDuplicate(ancestorChain));
    if (!shouldSkip) {
        return `doenet-id-${node.data.id}`;
    }
    return undefined;
}

/**
 * Extend a list of `AncestorChain` with a new node.
 */
export function extendAncestorChain(
    chain: AncestorChain,
    id: number,
    annotation?: ElementRefAnnotation,
): AncestorChain {
    return `${id}(${annotation})-${chain}`;
}

/**
 * Returns whether or not there is a duplicate element somewhere in the ancestor chain.
 */
export function ancestorChainHasDuplicate(chain: AncestorChain): boolean {
    return chain.includes("(duplicate)");
}
