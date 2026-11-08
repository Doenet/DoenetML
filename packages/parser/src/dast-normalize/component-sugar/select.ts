import { DastElement } from "../../types";
import {
    groupTextAndReferencesIntoListEntries,
    listBracketsUnmatchedError,
} from "./utils/lists";

/**
 * There is a special type of sugar for select where, instead of specifying `<option>`s,
 * you can write the options as a list, separated by commas or spaces by the
 * one rule for lists (`groupTextAndReferencesIntoListEntries`).
 *
 * For example `<select>a $b $$f(x) (c - $d) e$g</select>` becomes:
 * ```xml
 * <select>
 *   <option><math>a</math></option>
 *   <option><math>$b</math></option>
 *   <option><math>$$f(x)</math></option>
 *   <option><math>(c - $d)</math></option>
 *   <option><math>e$g</math></option>
 * </select>
 * ```
 *
 * Written `<select>x + 1, $b, (c - $d)</select>`, it has three options.
 *
 * The rule is if the children of the select are all text or reference (macro or function) nodes,
 * then break the children into the entries of a list,
 * and then wrap each group in
 * - an option node and
 * - a node whose componentType is determined by the select's `type` tag, defaulting to `"math"`.
 *   (Currently supported types are `"math"`, `"number"`, `"text"`, and `"boolean"`.)
 */
export function selectSugar(node: DastElement) {
    if (node.name !== "select") {
        // This should be unreachable
        throw Error("Select sugar can only be applied to a `<select>`");
    }

    // Determine the type from the select's `type` attribute, defaulting to `"math"`
    // if the attribute is not present or is not "math", "text", "number", or "boolean".
    // TODO: issue a warning if invalid type attribute?
    let insertType = "math";
    if (node.attributes.type) {
        const children = node.attributes.type.children;
        if (children.length === 1 && children[0].type === "text") {
            insertType = children[0].value;
            if (!["math", "text", "number", "boolean"].includes(insertType)) {
                insertType = "math";
            }
        }
    }

    const groupResult = groupTextAndReferencesIntoListEntries({
        children: node.children,
        componentType: insertType,
    });

    if (groupResult.success) {
        let newChildren: DastElement[] = groupResult.newChildren.map(
            (child) => ({
                type: "element" as const,
                name: "option",
                children: [child],
                attributes: {},
                source_doc: child.source_doc,
            }),
        );
        node.children = groupResult.unmatchedBrackets
            ? [listBracketsUnmatchedError(node), ...newChildren]
            : newChildren;
    }
}
