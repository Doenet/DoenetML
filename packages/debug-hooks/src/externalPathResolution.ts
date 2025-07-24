import type {
    FlatPathPart,
    FlatIndex,
    RefResolution,
    PublicDoenetMLCore,
} from "lib-doenetml-worker";

import { PublicDoenetMLCore as PublicDoenetMLCoreJavascript } from "@doenet/doenetml-worker-javascript";

/**
 * Attempt to resolve `name` immediately by parsing `name` to a path
 * and then forcibly resolving any composite components required to determine the ref resolution.
 * If the path is resolved to a node index without any unresolved path left,
 * then return the node index. Otherwise return -1.
 *
 * By default, the search for the path begins at the document root, node 0. Specify a node index for `origin`
 * to change where the search begins.
 *
 * This function is implemented only for string indices within the path.
 * An error is thrown if the index of a path contains any references to other nodes.
 *
 * At present this function uses `rustCore` to resolve the names
 * and `jsCore` to identify and expand components.
 */
export async function resolvePathImmediatelyToNodeIdx(
    name: string,
    rustCore: PublicDoenetMLCore,
    jsCore: PublicDoenetMLCoreJavascript,
    origin = 0,
) {
    // This algorithm is not a careful check of the correct form.
    // It assumes all characters of the `name` of each path piece are word characters.

    if (!jsCore.core) {
        return -1;
    }

    const initialMatch = name.match(/^([\w-]+)((\[\d+\])*)/);

    if (!initialMatch) {
        throw Error(`Invalid name to resolve: ${name}`);
    }

    const path: FlatPathPart[] = [
        {
            type: "flatPathPart",
            name: initialMatch[1],
            index: extractIndex(initialMatch[2]),
        },
    ];

    let nameLeft = name.slice(initialMatch[0].length);

    while (nameLeft.length > 0) {
        const nextMatch = nameLeft.match(/^\.([\w-]+)((\[\d+\])*)/);
        if (!nextMatch) {
            throw Error(`Invalid name to resolve: ${name}`);
        }

        path.push({
            type: "flatPathPart",
            name: nextMatch[1],
            index: extractIndex(nextMatch[2]),
        });

        nameLeft = nameLeft.slice(nextMatch[0].length);
    }

    try {
        // console.log("resolve path", { path, origin });
        let resolution = rustCore.resolve_path({ path }, origin, false);

        while (resolution.unresolvedPath !== null) {
            if (resolution.unresolvedPath[0].name !== "") {
                // We stopped matching on a name.
                // This name will not match a descendant and must match a prop.
                // The entire `path` did no match a node
                return -1;
            }

            const refComponent = jsCore.core._components![resolution.nodeIdx];

            const haveComposite =
                jsCore.core.componentInfoObjects.isCompositeComponent({
                    componentType: refComponent.componentType,
                    includeNonStandard: true,
                });

            if (!haveComposite || refComponent.isExpanded) {
                // If we don't have a composite or the composite is already expanded,
                // there nothing more we can do to try to resolve the remaining path
                return -1;
            }

            const index = resolution.unresolvedPath[0].index;
            if (index.length === 0) {
                throw Error(
                    "Something went wrong as we have a ref resolution without a name or an index",
                );
            }

            const replacementIdx = index[0].value[0];
            if (typeof replacementIdx !== "string") {
                throw Error(
                    "Not implemented: we have not implemented `resolvePathImmediatelyToNodeIdx` for paths that contain references to nodes.",
                );
            }

            // If the component component `refComponent` is not expanded,
            // then we force expand it by forcibly resolving `readyToExpandWhenResolved`
            // before calling `expandCompositeComponent`.
            await refComponent.stateValues.readyToExpandWhenResolved;
            await jsCore.core.expandCompositeComponent(refComponent);

            // try resolving again
            resolution = rustCore.resolve_path({ path }, origin, false);
        }

        return resolution.nodeIdx;
    } catch (err) {
        console.error(err);
        return -1;
    }
}

/**
 * Extract a `FlatIndex` from the string `s`.
 *
 * Assumes the string contains the representation of a `FlatIndex` with digits.
 * For example, `[5][4]` becomes `[{value: ["5"]}, {value: "4"}]`
 */
function extractIndex(s: string) {
    const index: FlatIndex[] = [];

    for (const match of s.matchAll(/\[(\d+)\]/g)) {
        index.push({ value: [match[1]] });
    }

    return index;
}
