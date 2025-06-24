// TODO: move this function into a `debug-hooks` package or something similar to make it clear that this is a debugging tool.

import {
    FlatPathPart,
    FlatIndex,
    RefResolution,
    Resolver,
} from "lib-doenetml-worker";
import { PublicDoenetMLCore } from "../CoreWorker";

/**
 * Attempts to resolve the component name `name` to a componentIdx,
 * starting the search algorithm at node `origin`.
 *
 * Throws an error if the name is not resolved.
 */
export async function resolvePathImmediatelyToNodeIdx(
    name: string,
    coreWorker: PublicDoenetMLCore,
    origin = 0,
) {
    // This algorithm is not a careful check of the correct form.
    // It assumes all characters of the `name` of each path piece are word characters.

    if (!coreWorker.resolvePath || !coreWorker.core) {
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
        const resolver = coreWorker.getResolver();

        // console.log("resolve path", { path, origin });
        let resolution = coreWorker.resolvePath(
            resolver,
            { path },
            origin,
            false,
        );

        while (resolution.unresolvedPath !== null) {
            if (resolution.unresolvedPath[0].name !== "") {
                // We stopped matching on a name.
                // This name will not match a descendant and must match a prop.
                // The entire `path` did no match a node
                return -1;
            }

            const refComponent =
                coreWorker.core._components![resolution.nodeIdx];

            const haveComposite =
                coreWorker.core.componentInfoObjects.isCompositeComponent({
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
            await coreWorker.core.expandCompositeComponent(refComponent);

            // try resolving again
            resolution = coreWorker.resolvePath(
                resolver,
                { path },
                origin,
                false,
            );
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
