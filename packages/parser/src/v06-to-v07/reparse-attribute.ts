import { lezerToDast } from "../lezer-to-dast";
import { DastAttribute } from "../types";

/**
 * Reparse a string into DAST as if it were an attribute.
 */
export function reparseAttribute(
    attributeStr: string,
): DastAttribute["children"] {
    const parsed = lezerToDast(`<p a="${attributeStr}" />`);

    if (parsed.children.length !== 1 || parsed.children[0].type !== "element") {
        throw new Error("Failed to parse attribute string into DAST element.");
    }
    const element = parsed.children[0];
    if (!element.attributes || !element.attributes.a) {
        throw new Error(
            "Parsed element does not have the expected attribute 'a'.",
        );
    }
    const attr = element.attributes.a;
    if (attr.type !== "attribute") {
        throw new Error("Parsed attribute 'a' is not of type 'attribute'.");
    }
    return attr.children;
}
