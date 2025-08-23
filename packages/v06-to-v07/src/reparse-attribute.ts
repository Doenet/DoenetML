import { DastAttribute, DastAttributeV6, lezerToDast } from "@doenet/parser";
import { lezerToDastV6 } from "@doenet/parser/v06";

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

/**
 * Reparse a string into DAST as if it were an attribute.
 */
export function reparseAttributeV6(
    attributeStr: string,
): DastAttributeV6["children"] {
    const parsed = lezerToDastV6(`<p a="${attributeStr}" />`);

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
