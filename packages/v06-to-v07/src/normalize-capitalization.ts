import { Plugin, unified } from "unified";
import {
    DastAttribute,
    DastElement,
    DastElementContent,
    DastRoot,
    DastRootContent,
    isDastElement,
    visit,
} from "@doenet/parser";
import { createComponentInfoObjects } from "@doenet/doenetml-worker-javascript";

/**
 * A list of attributes that we assume are capitalized correctly during processing.
 * If any of these attributes are found in the DAST, they will be normalized to the
 * capitalization used in this list.
 */
const AFFECTED_ATTRIBUTES = [
    "target",
    "triggerWith",
    "triggerWhenObjectsClicked",
    "triggerWhenObjectsFocused",
    "referencesAreFunctionSymbols",
    "updateWith",
    "forObject",
    "paginator",
    "newName",
    "copySource",
    "copyProp",
    "assignNames",
    "link",
    "source",
    "componentType",
    "componentTypes",
    "name",
];

/**
 * Other plugins rely on specific attributes having the correct capitalization.
 * This plugin fixes the capitalization.
 */
export const correctAttributeCapitalization: Plugin<
    [],
    DastRoot,
    DastRoot
> = () => {
    const correctCapitalization = Object.fromEntries(
        AFFECTED_ATTRIBUTES.map((attr) => [attr.toLowerCase(), attr]),
    );
    return (tree) => {
        visit(tree, (node) => {
            if (!isDastElement(node)) {
                return;
            }
            if (
                !Object.keys(node.attributes).some(
                    (name) =>
                        correctCapitalization[name.toLowerCase()] &&
                        name !== correctCapitalization[name.toLowerCase()],
                )
            ) {
                // No affected attributes, nothing to do
                return;
            }
            // We will be changing around some attributes, but we want to preserve the order.
            const newAttrs = Object.fromEntries(
                Object.entries(node.attributes).map(([name, attr]) => {
                    if (
                        correctCapitalization[name.toLowerCase()] &&
                        correctCapitalization[name.toLowerCase()] !== name
                    ) {
                        const correctName =
                            correctCapitalization[name.toLowerCase()];
                        attr.name = correctName;
                        return [correctName, attr];
                    }
                    return [name, attr];
                }),
            );

            node.attributes = newAttrs;
        });
    };
};

/**
 * Normalize the capitalization of all recognized DoenetML elements.
 */
export const correctElementCapitalization: Plugin<
    [],
    DastRoot,
    DastRoot
> = () => {
    const componentInfoObjects = createComponentInfoObjects();
    const correctCapitalization = Object.keys(
        componentInfoObjects.allComponentClasses,
    );
    const correctCapitalizationMap = Object.fromEntries(
        correctCapitalization.map((name) => [name.toLowerCase(), name]),
    );

    return (tree) => {
        visit(tree, (node) => {
            if (!isDastElement(node)) {
                return;
            }
            if (
                !correctCapitalizationMap[node.name.toLowerCase()] ||
                node.name === correctCapitalizationMap[node.name.toLowerCase()]
            ) {
                // No affected elements, nothing to do
                return;
            }
            // We will be changing the element name, but we want to preserve the order.
            const correctName =
                correctCapitalizationMap[node.name.toLowerCase()];
            node.name = correctName;
        });
    };
};
