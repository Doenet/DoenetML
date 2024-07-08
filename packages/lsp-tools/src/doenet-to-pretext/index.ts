import type {
    Root as XastRoot,
    RootContent as XastRootContent,
    ElementContent as XastElementContent,
} from "xast";
import type {
    FlatDastRoot,
    FlatDastElementContent,
} from "@doenet/doenetml-worker-rust";
import { x } from "xastscript";
import { textContent } from "./text-content";
import { ensurePretextAndRootDivision } from "./ensure-pretext";
import { ensureDocType } from "./ensure-doctype";
import { expandDoenetElementsToPretext } from "./expanders";

export function newline(): XastElementContent {
    return { type: "text", value: "\n" };
}

/**
 * Convert a FlatDastRoot into a XastRoot satisfying PreTeXt's structure.
 * Note: The result is not guaranteed to be valid PreTeXt; it's merely a conversion
 * of DoenetML elements to their PreTeXt equivalents.
 */
export function doenetToPretext(flatDast: FlatDastRoot): XastRoot {
    let xmlAst = x(
        null,
        flatDast.children.map((child) =>
            recursiveToPretext(child, flatDast.elements),
        ),
    );

    // All doenet documents have a surrounding `<document>` element.
    // Strip it off.
    const firstChild = xmlAst.children.find(
        (child) => child.type === "element",
    );
    if (
        firstChild &&
        firstChild.type === "element" &&
        firstChild.name === "document"
    ) {
        xmlAst.children = firstChild.children;
    }

    ensurePretextAndRootDivision(xmlAst);
    ensureDocType(xmlAst);

    // Now that the whole tree is built, we can replace the doenet-specific elements with their PreTeXt equivalents
    expandDoenetElementsToPretext(xmlAst, flatDast.elements);

    return xmlAst;
}

/**
 * Recursively construct an XML tree from `node`.
 */
function recursiveToPretext(
    node: FlatDastElementContent,
    elements: FlatDastRoot["elements"],
): XastElementContent {
    if (typeof node === "string") {
        return { type: "text", value: node };
    }
    const element = elements[node.id];
    if (!element) {
        throw new Error(`Element with id ${node.id} not found`);
    }

    const children: XastElementContent[] = element.children.map((child) =>
        recursiveToPretext(child, elements),
    );

    const attributes = Object.fromEntries(
        Object.entries(element.attributes).map(([name, value]) => [
            name,
            value.children.map((c) => textContent(c, elements)).join(""),
        ]),
    );
    const ret = x(element.name, attributes, children);
    ret.data ??= {};
    Object.assign(ret.data, { doenetId: element.data.id });
    return ret;
}
