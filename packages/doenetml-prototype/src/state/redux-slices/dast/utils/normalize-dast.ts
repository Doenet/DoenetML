import { Plugin } from "unified";
import {
    DastAttribute,
    DastElement,
    DastElementContent,
    DastRoot,
    DastRootContent,
    isDastElement,
    visit,
} from "@doenet/parser";
import { unified } from "unified";
import { ELEMENT_EXPANSIONS } from "./element-expansions";
import { pluginConvertPretextAttributes } from "./convert-pretext-attributes";

/**
 * Normalize the DAST tree so that it is contained in a single `<document>` element.
 * As well, remove commends and XML-valid but not-useful-for-DoenetML nodes like XML instructions and doctypes.
 */
export function normalizeDocumentDast(dast: DastRoot) {
    const processor = unified()
        .use(pluginRemoveCommentsInstructionsAndDocStrings)
        .use(pluginChangeCdataToText)
        .use(pluginEnsureDocumentElement)
        .use(pluginConvertPretextAttributes)
        .use(pluginExpandAliasedElements);
    return processor.runSync(dast);
}

/**
 * Change all CDATA nodes to text nodes.
 */
const pluginChangeCdataToText: Plugin<[], DastRoot, DastRoot> = () => {
    return (tree) => {
        visit(tree, (node) => {
            if (node.type === "cdata") {
                // @ts-ignore
                node.type = "text";
            }
        });
    };
};

/**
 * Remove all comment/instruction/docstring nodes from the DAST tree.
 */
const pluginRemoveCommentsInstructionsAndDocStrings: Plugin<
    [],
    DastRoot,
    DastRoot
> = () => {
    return (tree) => {
        visit(tree, (node) => {
            if (node.type === "element" || node.type === "root") {
                node.children = node.children.filter(
                    (n) =>
                        n.type !== "comment" &&
                        n.type !== "instruction" &&
                        n.type !== "doctype",
                );
            }
        });
    };
};

/**
 * Plugin that ensure the root of the document is a single `<document>` element
 * and that all whitespace is trimmed from the content of `<document>`.
 */
const pluginEnsureDocumentElement: Plugin<[], DastRoot, DastRoot> = () => {
    return (tree) => {
        const existingDocument = tree.children.find(
            (n) => n.type === "element" && n.name === "document",
        ) as DastElement | undefined;
        if (existingDocument) {
            existingDocument.children = trimWhitespaceNodes(
                existingDocument.children,
            );
            if (tree.children.length > 1) {
                tree.children = [existingDocument];
            }
        } else {
            const children = trimWhitespaceNodes(
                // This filtering may be redundant, but it should also be very fast.
                filterNonDoenetXml(tree.children),
            );
            tree.children = [
                {
                    type: "element",
                    name: "document",
                    attributes: {},
                    children,
                },
            ];
        }
    };
};

/**
 * Some elements are aliases for other elements. E.g. `<section>` is an alias for `<division type="section">`.
 * This plugin expands these aliases so that the DAST tree only contains the expanded elements.
 */
const pluginExpandAliasedElements: Plugin<[], DastRoot, DastRoot> = () => {
    return (tree) => {
        visit(tree, (node) => {
            if (isDastElement(node)) {
                const expansion = ELEMENT_EXPANSIONS[node.name];
                if (expansion) {
                    let newAttributes: Record<string, DastAttribute> =
                        Object.fromEntries(
                            Object.entries(expansion.attributes || {}).map(
                                ([key, value]) => {
                                    let newAttr: DastAttribute = {
                                        type: "attribute",
                                        name: key,
                                        children: [{ type: "text", value }],
                                    };
                                    return [key, newAttr];
                                },
                            ),
                        );
                    node.name = expansion.to;
                    node.attributes = {
                        ...node.attributes,
                        ...newAttributes,
                    };
                }
            }
        });
    };
};

/**
 * Remove XML nodes that DoenetML doesn't care about like instructions (`<? foo ?>`) and doctypes.
 */
function filterNonDoenetXml(nodes: DastRootContent[]): DastElementContent[] {
    return nodes.filter(
        (n) => n.type !== "doctype" && n.type !== "instruction",
    ) as DastElementContent[];
}

/**
 * Remove all whitespace from the start and end of `nodes`. This includes whitespace that is combined
 * with text nodes.
 */
function trimWhitespaceNodes(
    nodes: DastElementContent[],
): DastElementContent[] {
    if (nodes.length === 0) {
        return nodes;
    }
    const firstNonWhitespaceIdx = nodes.findIndex(
        (n) => n.type !== "text" || /\S/.test(n.value),
    );
    if (firstNonWhitespaceIdx === -1) {
        return [];
    }
    const lastNonWhitespaceIdx = findLastIndex(
        nodes,
        (n) => n.type !== "text" || /\S/.test(n.value),
    );

    const trimmed = nodes.slice(
        firstNonWhitespaceIdx,
        lastNonWhitespaceIdx + 1,
    );
    // There may be whitespace at the beginning and end of the first and last text nodes.
    const first = trimmed[0];
    const last = trimmed[trimmed.length - 1];
    if (first?.type === "text" && /^\s/.test(first.value)) {
        trimmed[0] = {
            ...first,
            value: first.value.trimStart(),
        };
    }
    if (last?.type === "text" && /\s$/.test(last.value)) {
        trimmed[trimmed.length - 1] = {
            ...last,
            value: last.value.trimEnd(),
        };
    }
    return trimmed;
}

/**
 * Compatibility function since Array.findLastIndex may not be present in all browsers.
 */
function findLastIndex<T>(arr: T[], predicate: (v: T) => boolean): number {
    for (let i = arr.length - 1; i >= 0; i--) {
        if (predicate(arr[i])) {
            return i;
        }
    }
    return -1;
}
