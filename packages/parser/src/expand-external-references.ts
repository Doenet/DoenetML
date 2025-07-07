import { unified, Plugin } from "unified";
import {
    DastAttribute,
    DastElement,
    DastError,
    DastNodes,
    DastRoot,
} from "./types";
import { visit } from "./pretty-printer/normalize/utils/visit";
import { isDastElement } from "./types-util";
import { toXml } from "./dast-to-xml/dast-util-to-xml";
import { lezerToDast } from "./lezer-to-dast";

type RemoteSource = {
    sourceUri: string;
    source: Promise<string>;
    parent: DastElement;
    sourceAttribute: DastAttribute;
    recursionLevel: number;
};

/**
 * Find any `copy` attribute that is not accompanied by a `extend` attribute and is not a reference.
 * Attempt to look up its associated DoenetML by passing its value to `retrieveDoenetML`.
 * If the returned DoenetML matches the type of the parent, add a `_externalContent` to the children of the parent
 * and add the new dast children parsed from the retrieved DoenetML to the `_externalContent`.
 */
export async function expandExternalReferences(
    dast: DastRoot,
    retrieveDoenetML: (arg: string) => Promise<string>,
) {
    const pluginSubstituteExternalReferences: Plugin<
        [],
        DastRoot,
        DastRoot
    > = () => {
        return async (tree) => {
            const promiseStack: RemoteSource[] = [];

            let maxRecursion = 10;
            let counter = 0;

            /**
             * If `node` has `copy` attribute that is not a reference (and no `extend` attribute),
             * then look up the attribute value via `retrieveDoenetML`,
             * adding the resulting promise and meta-data to `promiseStack`
             */
            const findExternalCopyAttributes = (node: DastNodes) => {
                if (!isDastElement(node)) {
                    return;
                }

                let copyAttribute: DastAttribute | null = null;

                for (const attrName in node.attributes) {
                    if (attrName.toLowerCase() === "extend") {
                        // If the component as an `extend` attribute, we ignore it
                        return;
                    } else if (attrName.toLowerCase() === "copy") {
                        // Note if a component has multiple copy attributes, we just use the last one encountered
                        copyAttribute = node.attributes[attrName];
                    }
                }

                if (copyAttribute === null) {
                    return;
                }

                const sourceUri = toXml(copyAttribute.children);

                // If copy attribute is a reference, skip
                if (sourceUri.charAt(0) === "$") {
                    return;
                }

                promiseStack.push({
                    sourceUri,
                    source: retrieveDoenetML(sourceUri),
                    parent: node,
                    sourceAttribute: copyAttribute,
                    recursionLevel: counter,
                });
            };

            // Find any `copy` attributes in the dast and append the results to `promiseStack`
            visit(tree, findExternalCopyAttributes);

            // Process any DoenetML returned by the promises in `promiseStack`,
            // add any matching results to an `_externalContent` child of the parent,
            // and recurse on the `_externalContent`
            let unresolved: RemoteSource | undefined;
            while ((unresolved = promiseStack.pop())) {
                const parent = unresolved.parent;

                if (unresolved.recursionLevel > maxRecursion) {
                    const dastError: DastError = {
                        type: "error",
                        message: `Unable to retrieve external DoenetML due to too many levels of recursion. Is there a circular reference?`,
                        position: unresolved.sourceAttribute.position,
                    };

                    parent.children.unshift(dastError);

                    continue;
                }

                let externalDoenetML;

                try {
                    externalDoenetML = await unresolved.source;
                } catch (_e) {
                    const dastError: DastError = {
                        type: "error",
                        message: `Unable to retrieve DoenetML from ${unresolved.sourceAttribute.name}="${unresolved.sourceUri}"`,
                        position: unresolved.sourceAttribute.position,
                    };
                    parent.children.unshift(dastError);

                    continue;
                }

                const externalDast = lezerToDast(externalDoenetML);

                // In case we are recursing, a component may have been turned into an `_externalContent`,
                // in which case we want the type of its parent, which is stored in its `forType` attribute.
                const parentType =
                    parent.name === "_externalContent"
                        ? toXml(parent.attributes.forType.children)
                        : parent.name;

                // An `externalDast` matches a parent only its root contains a single child of the same type as `parent`,
                // or if it is a `document` with a single child of the same type as `parent`.
                // We ignore any blank text elements.

                // Filter out any blank text children
                const rootChildren = externalDast.children.filter(
                    (node) => node.type !== "text" || node.value.trim() !== "",
                );

                let child: DastElement | null = null;

                if (
                    rootChildren.length === 1 &&
                    isDastElement(rootChildren[0])
                ) {
                    // Check if the single root child matches the parent type
                    child = rootChildren[0];
                    if (child.name !== parentType) {
                        if (child.name === "document") {
                            // if child is a document, check if it has one non-blank child that matches the parent type
                            const documentChildren = child.children.filter(
                                (node) =>
                                    node.type !== "text" ||
                                    node.value.trim() !== "",
                            );
                            if (
                                documentChildren.length === 1 &&
                                isDastElement(documentChildren[0]) &&
                                child.name === parentType
                            ) {
                                child = documentChildren[0];
                            } else {
                                child = null;
                            }
                        } else {
                            child = null;
                        }
                    }
                }

                if (child === null) {
                    const dastError: DastError = {
                        type: "error",
                        message: `Invalid DoenetML retrieved from ${unresolved.sourceAttribute.name}="${unresolved.sourceUri}": it did not match the component type "${parentType}"`,
                        position: unresolved.sourceAttribute.position,
                    };
                    parent.children.unshift(dastError);

                    continue;
                }

                // copy the child attributes onto the external node
                const externalContentAttributes = { ...child.attributes };

                // Add a `doenetMLSource` for future lookup of DoenetML content from positions calculated when parsing
                externalContentAttributes.doenetMLSource = {
                    type: "attribute",
                    name: "doenetMLSource",
                    children: [{ type: "text", value: externalDoenetML }],
                };

                // For any `copy` attributes found when recursing, treat the `_externalContent` as its parent's type.
                externalContentAttributes.forType = {
                    type: "attribute",
                    name: "forType",
                    children: [{ type: "text", value: parentType }],
                };

                const externalNode: DastElement = {
                    type: "element",
                    name: "_externalContent",
                    children: child.children,
                    attributes: externalContentAttributes,
                };

                parent.children.unshift(externalNode);

                // Delete the `copy` attribute
                delete parent.attributes.copy;

                counter = unresolved.recursionLevel + 1;
                visit(externalNode, findExternalCopyAttributes);
            }
        };
    };

    let processor = unified().use(pluginSubstituteExternalReferences);
    return await processor.run(dast);
}
