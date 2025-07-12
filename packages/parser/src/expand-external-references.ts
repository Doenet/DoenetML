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
 * If the returned DoenetML matches the type of the parent,
 * - add the DoenetML to the `sources` of the `dast`, setting `source_doc` to its index in the `sources` array,
 * - set the `source_doc` of the new components to the `source_doc` of the retrieved DoenetML, and
 * - and add the new dast children parsed from the retrieved DoenetML to the parent.
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
            // add any matching results to to the parent,
            // and recurse on the result
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
                    if (child.name !== parent.name) {
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
                                child.name === parent.name
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
                        message: `Invalid DoenetML retrieved from ${unresolved.sourceAttribute.name}="${unresolved.sourceUri}": it did not match the component type "${parent.name}"`,
                        position: unresolved.sourceAttribute.position,
                    };
                    parent.children.unshift(dastError);

                    continue;
                }

                // Add a `doenetMLSource` for future lookup of DoenetML content from positions calculated when parsing
                if (!dast.sources) {
                    dast.sources = [""];
                }
                const source_doc = dast.sources.length;
                dast.sources.push(externalDoenetML);

                const addDocSource = (node: DastNodes) => {
                    node.source_doc = source_doc;

                    switch (node.type) {
                        case "element":
                            // need to also visit the attributes
                            for (const attrName in node.attributes) {
                                for (const attrChild of node.attributes[
                                    attrName
                                ].children) {
                                    visit(attrChild, addDocSource);
                                }
                            }
                            break;
                        case "macro":
                        case "function":
                            for (const path of node.path) {
                                path.source_doc = source_doc;
                                for (const index of path.index) {
                                    index.source_doc = source_doc;
                                    for (const value of index.value) {
                                        visit(value, addDocSource);
                                    }
                                }
                            }
                            break;
                    }
                };

                visit(child, addDocSource);

                // copy the child attributes to the parent
                const parentAttributes = { ...child.attributes };
                if (parentAttributes.name) {
                    const annotated_name = `name:${source_doc}`;
                    parentAttributes[annotated_name] = parentAttributes.name;
                    parentAttributes[annotated_name].name = annotated_name;
                    delete parentAttributes.name;
                }

                // The original attributes from the parent take precedence
                // TODO: handle duplicates due to capitalization differences

                // Delete the `copy` attribute
                delete parent.attributes[unresolved.sourceAttribute.name];

                Object.assign(parentAttributes, parent.attributes);
                parent.attributes = parentAttributes;

                if (!parent.attributes[`source:sequence`]) {
                    parent.attributes[`source:sequence`] = {
                        type: "attribute",
                        name: "source:sequence",
                        children: [
                            {
                                type: "text",
                                value: parent.source_doc?.toString() ?? "0",
                            },
                        ],
                    };
                }
                parent.attributes["source:sequence"].children.push({
                    type: "text",
                    value: source_doc.toString(),
                });

                counter = unresolved.recursionLevel + 1;

                // in case the parent itself had an external copy
                // check just the parent
                // (but not its children with `visit` because don't want to original children that might already be in the queue)
                findExternalCopyAttributes(parent);

                // check for external copies and add doc source for just the new children
                for (const newChild of child.children) {
                    visit(newChild, findExternalCopyAttributes);
                }

                parent.children.unshift(...child.children);
            }
        };
    };

    let processor = unified().use(pluginSubstituteExternalReferences);
    return await processor.run(dast);
}
