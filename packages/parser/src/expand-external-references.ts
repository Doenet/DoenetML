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
 * Find any `extend` or `copy` attribute that is begins with `doenet:`.
 * Attempt to look up its associated DoenetML by passing its value to `fetchExternalDoenetML`.
 * If the returned DoenetML matches the type of the parent,
 * - add the DoenetML to the `sources` of the `dast`, setting `source_doc` to its index in the `sources` array,
 * - set the `source_doc` of the new components to the `source_doc` of the retrieved DoenetML, and
 * - and add the new dast children parsed from the retrieved DoenetML to the parent.
 */
export async function expandExternalReferences(
    dast: DastRoot,
    fetchExternalDoenetML: (arg: string) => Promise<string>,
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
             * If `node` has an `extend` or `copy` attribute that begins with `doenet:`,
             * then look up the attribute value via `fetchExternalDoenetML`,
             * adding the resulting promise and meta-data to `promiseStack`
             */
            const findExternalReferenceAttribute = (node: DastNodes) => {
                if (!isDastElement(node)) {
                    return;
                }

                const sourceAttributeName = Object.keys(node.attributes).find(
                    (attrName) =>
                        ["extend", "copy"].includes(attrName.toLowerCase()),
                );
                if (sourceAttributeName === undefined) {
                    return;
                }

                const sourceAttribute = node.attributes[sourceAttributeName];

                const sourceUri = toXml(sourceAttribute.children);

                // If attribute does not begin with "doenet", skip
                if (!sourceUri.startsWith("doenet:")) {
                    return;
                }

                promiseStack.push({
                    sourceUri,
                    source: fetchExternalDoenetML(sourceUri),
                    parent: node,
                    sourceAttribute,
                    recursionLevel: counter,
                });
            };

            // Find any `extend` or `copy` attributes that begin with `doenet:` in the dast and append the results to `promiseStack`
            visit(tree, findExternalReferenceAttribute);

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
                } catch (e) {
                    console.error(e);
                    const dastError: DastError = {
                        type: "error",
                        message: `Unable to retrieve DoenetML from ${unresolved.sourceAttribute.name}="${unresolved.sourceUri}"`,
                        position: unresolved.sourceAttribute.position,
                    };
                    parent.children.unshift(dastError);

                    continue;
                }

                const externalDast = lezerToDast(externalDoenetML);

                // For `externalDast` to be extended by `parent`, it must be a single element of the same type as `parent`.
                // Alternatively, it could be a `<document>` tag with a single child that matches the type `parent`.
                // (We ignore any blank text elements.)
                const matchResult = findMatchingChild(
                    externalDast,
                    parent.name,
                );

                if (!matchResult.success) {
                    const dastError: DastError = {
                        type: "error",
                        message: `Invalid DoenetML retrieved from ${unresolved.sourceAttribute.name}="${unresolved.sourceUri}": it did not match the component type "${parent.name}"`,
                        position: unresolved.sourceAttribute.position,
                    };
                    parent.children.unshift(dastError);

                    continue;
                }

                const child = matchResult.child;

                // Add a `doenetMLSource` for future lookup of DoenetML content from positions calculated when parsing
                if (!dast.sources) {
                    dast.sources = [""];
                }
                const source_doc = dast.sources.length;
                dast.sources.push(externalDoenetML);

                // Delete all `extend` or `copy` attributes from the parent.
                // (The external reference supersedes any others.)
                for (const attrName in parent.attributes) {
                    if (["extend", "copy"].includes(attrName.toLowerCase())) {
                        delete parent.attributes[attrName];
                    }
                }

                // add another level of recursion to the counter
                counter = unresolved.recursionLevel + 1;

                mergeExternalChildIntoParent(
                    parent,
                    child,
                    source_doc,
                    findExternalReferenceAttribute,
                );
            }
        };
    };

    let processor = unified().use(pluginSubstituteExternalReferences);
    return await processor.run(dast);
}

/**
 * Merge `child` retrieved from external `source_doc` into `parent`.
 *
 * The children of `children` are marked with `source_doc` and prepended
 * to the children of `parent`.
 *
 * `parent` is assigned the attributes of both `parent` and `child`,
 * with attributes from `parent` taking precedence.
 *
 * If `child` has a `name` attribute, it is recorded as the name of `parent`
 * that is valid in the context of `source_doc`. To accomplish this,
 * the new name is stored in the attribute `source-${source_doc}:name`.
 *
 * The algorithm assumes that `child` is the same element type as `parent`,
 * though it is not verified.
 */
function mergeExternalChildIntoParent(
    parent: DastElement,
    child: DastElement,
    source_doc: number,
    findExternalReferenceAttribute: (node: DastNodes) => void,
) {
    // Step 1: annotate `child` and descendants with `source_doc`
    const addDocSource = (node: DastNodes) => {
        node.source_doc = source_doc;

        switch (node.type) {
            case "element":
                // need to also visit the attributes
                for (const attrName in node.attributes) {
                    const attribute = node.attributes[attrName];
                    attribute.source_doc = source_doc;
                    for (const attrChild of attribute.children) {
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

    // Step 2: merge in the attributes of `child` into `parent`.

    // copy the child attributes to the parent
    const parentAttributes = { ...child.attributes };

    // If the child had an attribute `name`,
    // then that name is valid only in the context of the external document, i.e., in `source_doc`.
    // We annotate the name as `source-${source_doc}:name` to indicate it is for `source_doc`.
    if (parentAttributes.name) {
        const annotated_name = `source-${source_doc}:name`;
        parentAttributes[annotated_name] = parentAttributes.name;
        parentAttributes[annotated_name].name = annotated_name;
        delete parentAttributes.name;
    }

    // The original attributes from the parent take precedence
    // TODO: handle duplicates due to capitalization differences
    Object.assign(parentAttributes, parent.attributes);
    parent.attributes = parentAttributes;

    // The attribute `source:sequence` is used to indicate the different `source_doc`s
    // from which elements have been merged into `parent`.
    // It should begin with `parent`'s original `source_doc`,
    // followed by any `source_doc` that it extended.
    // The attribute `source:sequence` is used to allow references that originate
    // from `parent`'s original `source_doc` to reach into names from the subsequent external document,
    // if the names are prepended by the parent's name.
    //
    // For example, if in this DoenetML from source document `0`
    // ```
    // <section extend="doenet:abc" name="s" />$s.foo
    // ```
    // the `<section/>` extends this external DoenetML from source document `1`:
    // ```
    // <section><text name="foo" /></section>
    // ```
    // then `source:sequence` of the `<section>` will be `[0, 1]`.
    // When resolving the reference `$s.foo` from source document `0`,
    // `$s` will match the original `<section>`,
    // but `foo` will not match any descendants of `s` in source document `0`.
    // But, because source document `1` follows `0` in `source:sequence`,
    // the name `foo` will be searched in source document `1`,
    // returning the match to `<text name="foo" />`.
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

    // Step 3: recurse to `child` and its `children`.

    // If `child` itself extended another external reference,
    // then its `extend` or `copy` attribute was copied to be an attribute of `parent`, above.
    // To find that reference, we check just `parent`.
    // Note: we don't use the `visit` function because we don't want to check the parent's original children
    // which have already have been visited and so might already be in the queue.
    findExternalReferenceAttribute(parent);

    // We haven't yet checked the children of `child`, so check those elements (and their descendants) now.
    for (const newChild of child.children) {
        visit(newChild, findExternalReferenceAttribute);
    }

    // Step 4. merge in the new children coming from `child`
    parent.children.unshift(...child.children);
}

/**
 * If `dastRoot` has a child that is an element with name `elementName`, return that child.
 * Alternatively, if it has a single `<document>` child that, in turn,
 * has a child that is an element with name `elementName`, return that child.
 *
 * Blank text children are ignored.
 *
 * Returns:
 * - `success`: `true` if matching child was found, else `false`.
 * - `child`: the `child` found
 */
function findMatchingChild(
    dastRoot: DastRoot,
    elementName: string,
): { success: true; child: DastElement } | { success: false } {
    // Filter out any blank text children
    const rootChildren = dastRoot.children.filter(
        (node) => node.type !== "text" || node.value.trim() !== "",
    );

    if (rootChildren.length === 1 && isDastElement(rootChildren[0])) {
        // Check if the single root child matches `elementName`
        let child = rootChildren[0];
        if (child.name === elementName) {
            return { success: true, child };
        }
        if (child.name === "document") {
            // if child is a document, check if it has one non-blank child that matches`elementName`
            const documentChildren = child.children.filter(
                (node) => node.type !== "text" || node.value.trim() !== "",
            );
            if (
                documentChildren.length === 1 &&
                isDastElement(documentChildren[0])
            ) {
                child = documentChildren[0];
                if (child.name === elementName) {
                    return { success: true, child };
                }
            }
        }
    }

    return { success: false };
}
