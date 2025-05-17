import { DastElement } from "../../types";
import { groupTextAndReferencesBySpacesOutsideParens } from "./utils/lists";

/**
 * There is a special type of sugar for select where, instead of specifying `<option>`s,
 * you can use a space-delimited list.
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
 * The rule is if the children of the select are all text or reference (macro or function) nodes,
 * then attempt to break the children into groups separated by parenthesis,
 * and then wrap each group in
 * - an option node and
 * - a node whose componentType is determined by the select's `type` tag, defaulting to `"math"`.
 *   (Currently supported types are `"math"`, `"number"`, `"text"`, and `"boolean"`.)
 */
export function selectSugar(node: DastElement & { name: "select" }) {
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

    const groupResult = groupTextAndReferencesBySpacesOutsideParens({
        children: node.children,
        componentType: insertType,
    });

    if (groupResult.success) {
        let newChildren = groupResult.newChildren.map((child) => ({
            type: "element" as const,
            name: "option",
            children: [child],
            attributes: {},
        }));
        node.children = newChildren;
    }
}
