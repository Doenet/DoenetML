import { DastElement, DastElementContent } from "../../types";
import { groupTextAndReferencesBySpacesOutsideParens } from "./utils/lists";

/**
 * Two transformations to the repeat children are made
 * 1. All children are wrapped in a `<template>` tag.
 * 1. If the `"itemName"` and/or `"indexName"` attribute contain a single text child,
 * then add a `<_repeatSetup>` child to the `<repeat>` that contains children
 * named by the values of those attributes.
 * (These children will not be rendered, but they create targets for references to `itemName` and `indexName`.
 * Mapping those references to the correct target will be addressed when the `<repeat>` is expanded.)
 *
 * For example, `<repeat itemName="v" indexName="i">$v+$i</repeat>` becomes
 *
 * ```xml
 * <repeat itemName="v" indexName="i">
 *  <template>
 *    $v+$i
 *  </template>
 *  <_repeatSetup>
 *     <_placeholder name="v" />
 *     <integer name="i" />
 *   </_repeatSetup>
 * </repeat>
 * ```
 */
export function repeatSugar(node: DastElement) {
    if (node.name !== "repeat" && node.name !== "repeatForSequence") {
        // This should be unreachable
        throw Error(
            "Repeat sugar can only be applied to a `<repeat>` or a `<repeatForSequence>`",
        );
    }

    let setupChildren: DastElementContent[] = [];

    if (node.attributes.itemName) {
        const attrChildren = node.attributes.itemName.children;
        if (attrChildren.length === 1 && attrChildren[0].type === "text") {
            // We don't know what type of component the value will be,
            // so we use `"_placeholder"` for now.
            setupChildren.push({
                type: "element",
                name: "_placeholder",
                children: [],
                attributes: {
                    name: {
                        type: "attribute",
                        name: "name",
                        children: [
                            { type: "text", value: attrChildren[0].value },
                        ],
                    },
                },
            });
        }
    }
    if (node.attributes.indexName) {
        const attrChildren = node.attributes.indexName.children;
        if (attrChildren.length === 1 && attrChildren[0].type === "text") {
            setupChildren.push({
                type: "element",
                name: "integer",
                children: [],
                attributes: {
                    name: {
                        type: "attribute",
                        name: "name",
                        children: [
                            { type: "text", value: attrChildren[0].value },
                        ],
                    },
                },
            });
        }
    }

    if (setupChildren.length > 0) {
        node.children.push({
            type: "element",
            name: "_repeatSetup",
            children: setupChildren,
            attributes: {},
        });
    }

    if (node.name === "repeat") {
        let type = "math";
        if (node.attributes.type) {
            const attrChildren = node.attributes.type.children;
            if (attrChildren.length === 1 && attrChildren[0].type === "text") {
                type = attrChildren[0].value;
                if (!["math", "text", "number", "boolean"].includes(type)) {
                    type = "math";
                }
            }
        }

        if (node.attributes.for) {
            const attrChildren = node.attributes.for.children;
            const groupResult = groupTextAndReferencesBySpacesOutsideParens({
                children: attrChildren,
                componentType: type,
                wrapSingleNonTextNodes: false,
            });

            if (groupResult.success) {
                groupResult.newChildren.map((child) => ({
                    type: "element" as const,
                    name: "option",
                    children: [child],
                    attributes: {},
                }));
                node.attributes.for.children = groupResult.newChildren;
            }
        }
    }
}
