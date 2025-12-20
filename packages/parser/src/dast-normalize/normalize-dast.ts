import { Plugin, unified } from "unified";
import { ELEMENT_EXPANSIONS } from "./element-expansions";
import { pluginConvertPretextAttributes } from "./convert-pretext-attributes";
import {
    DastAttribute,
    DastElement,
    DastElementContent,
    DastRoot,
    DastRootContent,
} from "../types";
import { visit } from "../pretty-printer/normalize/utils/visit";
import { isDastElement } from "../types-util";
import { repeatSugar } from "./component-sugar/repeat";
import { conditionalContentSugar } from "./component-sugar/conditionalContent";
import { selectSugar } from "./component-sugar/select";
import { postponeRenderSugar } from "./component-sugar/postponeRender";
import { pluginEnforceValidNames } from "./enforce-valid-names";
import { pretzelSugar } from "./component-sugar/pretzel";
import { descriptionAttributeSugar } from "./component-sugar/descriptionAttribute";

/**
 * Normalize the DAST tree so that it is contained in a single `<document>` element.
 * As well, remove comments and XML-valid but not-useful-for-DoenetML nodes like XML instructions and doctypes.
 */
export function normalizeDocumentDast(
    dast: DastRoot,
    addCompatibilityNames = false,
) {
    let processor = unified()
        .use(pluginRemoveCommentsInstructionsAndDocStrings)
        .use(pluginChangeCdataToText)
        .use(pluginEnsureDocumentElement)
        .use(pluginConvertPretextAttributes)
        .use(pluginEnforceValidNames)
        .use(pluginExpandAliasedElements);
    if (addCompatibilityNames) {
        processor = processor.use(pluginAddCompatibilityNames);
    }
    processor = processor.use(pluginComponentSugar);

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
 * As a compatibility step before we remove autogenerated names (of the form _componentType3)
 * add names to all the components that don't have an explicit name
 * that match the autogenerated names from the old system.
 */
const pluginAddCompatibilityNames: Plugin<[], DastRoot, DastRoot> = () => {
    const counts: Record<string, number> = {};
    return (tree) => {
        visit(tree, (node) => {
            if (isDastElement(node)) {
                const typeCount = (counts[node.name] =
                    (counts[node.name] ?? 0) + 1);
                if (!node.attributes.name) {
                    const name = `_${node.name}${typeCount}`;
                    node.attributes.name = {
                        type: "attribute",
                        name: "name",
                        children: [{ type: "text", value: name }],
                    };
                }
            }
        });
    };
};

/**
 * Perform substitutions for syntactic sugar based on the component type
 */
const pluginComponentSugar: Plugin<[], DastRoot, DastRoot> = () => {
    return (tree) => {
        visit(tree, (node) => {
            if (!isDastElement(node)) {
                return;
            }
            switch (node.name) {
                case "repeat":
                case "repeatForSequence":
                    repeatSugar(node);
                    break;
                case "conditionalContent":
                    conditionalContentSugar(node);
                    break;
                case "select":
                    selectSugar(node);
                    break;
                case "solution":
                case "givenAnswer":
                    postponeRenderSugar(node);
                    break;
                case "aside":
                case "proof":
                    // For `<aside>` or `<proof>`, add postpone render sugar
                    // only if the `postponeRendering` attribute was specified
                    if (node.attributes.postponeRendering) {
                        const children =
                            node.attributes.postponeRendering.children;
                        if (
                            children.length === 0 ||
                            (children.length === 1 &&
                                children[0].type === "text" &&
                                children[0].value.toLowerCase() === "true")
                        ) {
                            postponeRenderSugar(node);
                        }
                    }
                    break;
                case "pretzel":
                    pretzelSugar(node);
                    break;
                case "image":
                case "video":
                case "graph":
                case "answer":
                case "mathInput":
                case "textInput":
                case "booleanInput":
                case "choiceInput":
                case "matrixInput":
                    descriptionAttributeSugar(node);
                    break;
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
