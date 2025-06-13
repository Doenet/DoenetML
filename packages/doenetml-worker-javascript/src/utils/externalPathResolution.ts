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

    if (!coreWorker.resolvePath) {
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

        const resolution = coreWorker.resolvePath(
            resolver,
            { path },
            origin,
            false,
        );

        const newResolution = await resolveAdditionalPathImmediately(
            resolution,
            resolver,
            coreWorker,
        );

        if (newResolution.unresolvedPath == null) {
            return newResolution.nodeIdx;
        } else {
            // If we have any unresolved path left, then the entire `path` did not match a node.
            return -1;
        }
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

/**
 * An abbreviated version of the algorithm of `determineDownstreamComponents`
 * from `RefResolutionDependency` of `Dependencies.js`
 * that attempts to resolve the unresolvedPath of `resolution`.
 *
 * This function expands any composite component encountered
 */
async function resolveAdditionalPathImmediately(
    resolution: RefResolution,
    resolver: Resolver,
    coreWorker: PublicDoenetMLCore,
): Promise<RefResolution> {
    if (resolution.unresolvedPath === null) {
        return resolution;
    }

    if (!coreWorker.resolvePath || !coreWorker.core) {
        throw Error(
            "Must have resolvePath and core to call resolveAdditionalPath",
        );
    }

    let nodeIdx = resolution.nodeIdx;
    let unresolvedPath = resolution.unresolvedPath;

    while (unresolvedPath?.length > 0) {
        const nextPathPart = unresolvedPath[0];

        // If the next part has a name, it can only match a prop
        if (nextPathPart.name !== "") {
            const refResolution = coreWorker.resolvePath(
                resolver,
                { path: unresolvedPath },
                nodeIdx,
                true,
            );

            if (
                refResolution.unresolvedPath?.length ===
                    unresolvedPath.length &&
                refResolution.unresolvedPath[0].name !== ""
            ) {
                // The resolver didn't make any progress.
                // As a sanity check, make sure the node index and name didn't change
                if (
                    refResolution.nodeIdx !== nodeIdx ||
                    refResolution.unresolvedPath[0].name !== nextPathPart.name
                ) {
                    throw Error(
                        "Something went wrong with resolver as it changed the index or name without making progress",
                    );
                }

                return {
                    nodeIdx,
                    unresolvedPath,
                    originalPath: resolution.originalPath,
                };
            }

            // some progress was made so continue to next loop
            nodeIdx = refResolution.nodeIdx;
            if (refResolution.unresolvedPath === null) {
                break;
            }
            unresolvedPath = refResolution.unresolvedPath;
            continue;
        }

        const refComponent = coreWorker.core._components![nodeIdx];

        const haveComposite =
            coreWorker.core.componentInfoObjects.isCompositeComponent({
                componentType: refComponent.componentType,
                includeNonStandard: true,
            });

        if (!haveComposite) {
            // Since don't have a composite, return the result
            return {
                nodeIdx,
                unresolvedPath,
                originalPath: resolution.originalPath,
            };
        }

        const index = nextPathPart.index;
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
        if (!refComponent.isExpanded) {
            // Calling the getter on `stateValues` forces the state variable to be immediately resolved and evaluated
            await refComponent.stateValues.readyToExpandWhenResolved;
            await coreWorker.core.expandCompositeComponent(refComponent);
        }

        // Note: strings that are not blank do take up a slot for replacement index.
        // However, this non-blank strings that do take up a slot
        // will not be returned as a replacement (instead the replacement will be empty).
        // Rationale: we do not have a mechanism for linking a string to its replacement source,
        // so returning the string would it unlinked and inconsistent with other cases.
        const nonBlankStringReplacements = refComponent.replacements.filter(
            (x: any) => typeof x !== "string" || x.trim() !== "",
        );

        // Replace all copies with their replacements so that copies don't take up an index
        // but are treated as though they were not an intermediary

        // Reverse the replacements so that we can use them as a queue
        nonBlankStringReplacements.reverse();

        const replacementsWithoutCopies: any[] = [];

        let elt = nonBlankStringReplacements.pop();

        while (elt) {
            if (elt.componentType === "_copy") {
                // Add the replacements of the copy to the queue (in reverse order)
                const newNonBlankReplacements = elt.replacements.filter(
                    (x: any) => typeof x !== "string" || x.trim() !== "",
                );
                newNonBlankReplacements.reverse();
                nonBlankStringReplacements.push(...newNonBlankReplacements);
            } else {
                replacementsWithoutCopies.push(elt);
            }

            elt = nonBlankStringReplacements.pop();
        }

        const theReplacement =
            replacementsWithoutCopies[Number(replacementIdx) - 1];
        if (theReplacement && typeof theReplacement !== "string") {
            // found a replacement component that matches
            nodeIdx = theReplacement.componentIdx;

            if (index.length === 1) {
                // we finished off this path part
                unresolvedPath.shift();
            } else {
                nextPathPart.index.shift();
            }

            // We made progress so continue in the loop
            continue;
        } else {
            // No replacement at the given replacement index, so we should return nothing
            console.error(`Couldn't find node at index ${replacementIdx}`);

            return {
                nodeIdx: -1,
                unresolvedPath: null,
                originalPath: resolution.originalPath,
            };
        }
    }

    return {
        nodeIdx,
        unresolvedPath: null,
        originalPath: resolution.originalPath,
    };
}
