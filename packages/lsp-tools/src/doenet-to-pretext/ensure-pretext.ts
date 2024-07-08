import type { Root as XastRoot, ElementContent as XastElementContent } from "xast";
import { x } from "xastscript";
import { newline } from ".";

/**
 * Ensure that the document is wrapped in a `<pretext>` element that contains a `<article>` or `<book>` element
 * as an immediate child.
 */
export function ensurePretextAndRootDivision(
    xmlAst: XastRoot,
    ensuredDivisionType: "article" | "book" = "article"
) {
    const hasPretextElement = Boolean(
        xmlAst.children.find(
            (child) => child.type === "element" && child.name === "pretext"
        )
    );
    if (!hasPretextElement) {
        const instructions = xmlAst.children.filter(
            (node) => node.type === "doctype" || node.type === "instruction"
        );
        const rest = xmlAst.children.filter(
            (node) => node.type !== "doctype" && node.type !== "instruction"
        );
        xmlAst.children = [
            ...instructions,
            x("pretext", [newline(), ...rest, newline()]),
        ];
    }

    const pretextElement = xmlAst.children.find(
        (node) => node.type === "element" && node.name === "pretext"
    );
    if (!pretextElement || pretextElement.type !== "element") {
        throw new Error("Failed to find <pretext> element");
    }

    const hasRootDivision = pretextElement.children.find(
        (node) => node.type === "element" &&
            (node.name === "article" || node.name === "book")
    );

    if (!hasRootDivision) {
        // Pluck off the `<docinfo>` tag, if there is one.
        const docInfoIndex = pretextElement.children.findIndex(
            (node) => node.type === "element" && node.name === "docinfo"
        );
        const docInfo: XastElementContent[] = [];
        if (docInfoIndex !== -1) {
            docInfo.push(pretextElement.children[docInfoIndex]);
            pretextElement.children.splice(docInfoIndex, 1);
        }

        pretextElement.children = [
            ...docInfo,
            x(ensuredDivisionType, pretextElement.children),
        ];
    }
}
