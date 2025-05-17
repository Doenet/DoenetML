import { DastElement, DastElementContent } from "../../types";

/**
 * Two transformations to the repeat children are made
 * 1. All children are wrapped in a `<template>` tag.
 * 1. If the `"valueName"` and/or `"indexName"` attribute contain a single text child,
 * then add a `<_repeatSetup>` child to the `<repeat>` that contains children
 * named by the values of those attributes.
 * (These children will not be rendered, but they create targets for references to `valueName` and `indexName`.
 * Mapping those references to the correct target will be addressed when the `<repeat>` is expanded.)
 *
 * For example, `<repeat valueName="v" indexName="i">$v+$i</repeat>` becomes
 *
 * ```xml
 * <repeat valueName="v" indexName="i">
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
    let setupChildren: DastElementContent[] = [];

    if (node.attributes.valueName) {
        const attrChildren = node.attributes.valueName.children;
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
}
