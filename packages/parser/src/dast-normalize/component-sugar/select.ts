import { codedDastError } from "../../coded-dast-error";
import { DastElement, DastError } from "../../types";
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
 *
 * A `type` that isn't one of those is reported (`doenet-w0145`, as the list
 * operators report it, D45 decision 7) when there is text to read, and the
 * text is read as math. A `<select>` of `<option>`s, to which this sugar does
 * not apply, ignores its `type`, so is not reported.
 */
export function selectSugar(node: DastElement) {
    if (node.name !== "select") {
        // This should be unreachable
        throw Error("Select sugar can only be applied to a `<select>`");
    }

    // Determine the type from the select's `type` attribute, defaulting to `"math"`
    // if the attribute is not present or is not "math", "text", "number", or "boolean".
    let insertType = "math";
    let invalidType: string | undefined;
    const typeAttribute = node.attributes.type;
    if (typeAttribute) {
        const children = typeAttribute.children;
        if (children.length === 1 && children[0].type === "text") {
            insertType = children[0].value;
            if (!["math", "text", "number", "boolean"].includes(insertType)) {
                invalidType = insertType;
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
        const warnings: DastError[] = [];
        if (invalidType !== undefined && newChildren.length > 0) {
            warnings.push(
                codedDastError({
                    code: "doenet-w0145",
                    error_type: "warning",
                    message: `Invalid type ${invalidType} for select component. Must be one of math, text, number, or boolean. Ignoring it and reading the values as though no type had been given.`,
                    args: { type: invalidType, component: "select" },
                    position: typeAttribute?.position ?? node.position,
                    source_doc: typeAttribute?.source_doc ?? node.source_doc,
                }),
            );
        }
        if (groupResult.unmatchedBrackets) {
            warnings.push(
                listBracketsUnmatchedError(node, insertType === "text"),
            );
        }
        node.children = [...warnings, ...newChildren];
    }
}
