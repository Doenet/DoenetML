import { DastAttribute, DastElement } from "../../types";
import { isDastElement } from "../../types-util";

/**
 * Depending on the children, perform one of two transformations.
 * 1. If there are no `<case>` or `<else>` children, then wrap all children in a `<case>`
 *   and move the `condition` attribute of the `<conditionalContent>` to the `<case>`.
 * 2. Otherwise, turn any `<else>` children to `<case>`.
 *
 * For example,
 * ```xml
 * <conditionalContent condition="$x">Hello</conditionalContent>
 * ```
 * becomes
 * ```xml
 * <conditionalContent>
 *   <case condition="$x">Hello</case>
 * </conditionalContent>
 * ```
 * and
 * ```xml
 * <conditionalContent>
 *   <case condition="$x">Hello</case>
 *   <else>Bye</else>
 * </conditionalContent>
 * ```
 * becomes
 * ```xml
 * <conditionalContent>
 *   <case condition="$x">Hello</case>
 *   <case>Bye</case>
 * </conditionalContent>
 * ```
 */
export function conditionalContentSugar(node: DastElement) {
    if (node.name !== "conditionalContent") {
        // This should be unreachable
        throw Error(
            "Conditional content sugar can only be applied to a `<conditionalContent>`",
        );
    }

    let nCaseChildren = 0;
    for (const child of node.children) {
        if (!isDastElement(child)) {
            continue;
        }
        if (child.name === "case") {
            nCaseChildren++;
        } else if (child.name === "else") {
            // change `else` to a `case`
            child.name = "case";
            nCaseChildren++;
        }
    }

    if (nCaseChildren === 0) {
        // If there are no `<case>` children (and no `<else>` children that were converted)
        // then wrap all children in a `<case>` child and move the `condition` attribute
        // from the `<conditionalContent>` to the `<case>`.
        const attributes: Record<string, DastAttribute> = {};
        node.children = [
            {
                type: "element",
                name: "case",
                children: node.children,
                attributes,
            },
        ];

        if (node.attributes.condition) {
            attributes.condition = node.attributes.condition;
            delete node.attributes.condition;
        }
    }
}
