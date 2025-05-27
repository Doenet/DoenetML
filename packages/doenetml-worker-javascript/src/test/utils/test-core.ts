import { PublicDoenetMLCore } from "../../CoreWorker";
import fs from "node:fs";
import path from "path";

import init, {
    PublicDoenetMLCore as PublicDoenetMLCoreRust,
    DastRoot as DastRootInCore,
    FlatPathPart,
    FlatIndex,
    RefResolution,
} from "lib-doenetml-worker";
import { lezerToDast, normalizeDocumentDast } from "@doenet/parser";
import util from "util";

const origLog = console.log;
console.log = (...args) => {
    origLog(...args.map((x) => util.inspect(x, false, 10, true)));
};

type DoenetMLFlags = {
    showCorrectness: boolean;
    readOnly: boolean;
    solutionDisplayMode:
        | "button"
        | "buttonRequirePermission"
        | "displayed"
        | "none";
    showFeedback: boolean;
    showHints: boolean;
    allowLoadState: boolean;
    allowSaveState: boolean;
    allowLocalState: boolean;
    allowSaveEvents: boolean;
    autoSubmit: boolean;
};

type DoenetMLFlagsSubset = Partial<DoenetMLFlags>;

const defaultFlags: DoenetMLFlags = {
    showCorrectness: true,
    readOnly: false,
    solutionDisplayMode: "button",
    showFeedback: true,
    showHints: true,
    allowLoadState: false,
    allowSaveState: false,
    allowLocalState: false,
    allowSaveEvents: false,
    autoSubmit: false,
};

export async function createTestCore({
    doenetML,
    requestedVariantIndex = 1,
    flags: specifiedFlags = {},
    theme,
    initializeCounters = {},
    requestSolutionView = async () => ({ allowView: true }),
}: {
    doenetML: string;
    requestedVariantIndex?: number;
    flags?: DoenetMLFlagsSubset;
    theme?: "dark" | "light";
    initializeCounters?: Record<string, number>;
    requestSolutionView?: (componentIdx: string) => Promise<{
        allowView: boolean;
    }>;
}) {
    const wasmBuffer = fs.readFileSync(
        path.resolve(
            __dirname,
            "../../../../doenetml-worker/lib-js-wasm-binding/pkg/lib_doenetml_worker_bg.wasm",
        ),
    );

    await init(wasmBuffer);

    const rustCore = PublicDoenetMLCoreRust.new();

    const dast = normalizeDocumentDast(lezerToDast(doenetML), true);
    rustCore.set_source(dast as DastRootInCore, doenetML);

    const { normalizedRoot, resolver } = rustCore.return_normalized_dast_root();
    const addNodesToResolver = PublicDoenetMLCoreRust.add_nodes_to_resolver;
    const deleteNodesFromResolver =
        PublicDoenetMLCoreRust.delete_nodes_from_resolver;
    const resolvePath = PublicDoenetMLCoreRust.resolve_path;

    const flags: DoenetMLFlags = { ...defaultFlags, ...specifiedFlags };

    const core = new PublicDoenetMLCore();

    core.setSource(doenetML);
    core.setFlags(flags);

    await core.initializeWorker({
        activityId: "",
        docId: "1",
        requestedVariantIndex,
        attemptNumber: 1,
        normalizedRoot,
        resolver,
        addNodesToResolver,
        deleteNodesFromResolver,
        resolvePath,
    });

    const dastResult = await core.createCoreGenerateDast(
        {
            coreId: "",
            cid: "",
            initializeCounters,
            theme,
        },
        () => null,
        () => null,
        () => null,
        () => null,
        () => null,
        () => null,
        requestSolutionView,
    );

    if (!dastResult.success) {
        throw Error(dastResult.errMsg);
    }

    /**
     * Attempts to resolve the component name `name` to a componentIdx,
     * starting the search algorithm at node `origin`.
     *
     * Throws an error if the name is not resolved.
     */
    function resolveComponentName(name: string, origin = 0) {
        // Note: invalid pieces inside `name` are ignored.
        // This algorithm is not a careful check of the correct form.
        // It assume all characters of the `name` of each path piece are word characters.

        const initialMatch = name.match(/^(\w+)((\[\d+\])*)/);

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
        for (const match of name.matchAll(/\.(\w+)((\[\d+\])*)/g)) {
            path.push({
                type: "flatPathPart",
                name: match[1],
                index: extractIndex(match[2] ?? ""),
            });
        }

        try {
            const resolution = PublicDoenetMLCoreRust.resolve_path(
                core.getResolver(),
                { path },
                origin,
                false,
            );

            const newResolution = resolveAdditionalPath(core, resolution);

            if (newResolution.unresolvedPath == null) {
                return newResolution.nodeIdx;
            } else {
                return -1;
            }
        } catch (e) {
            console.log("error when resolving", { path, origin });
            throw e;
        }
    }

    return { core, rustCore, resolveComponentName };
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
 */
function resolveAdditionalPath(
    core: PublicDoenetMLCore,
    resolution: RefResolution,
): RefResolution {
    if (resolution.unresolvedPath === null) {
        return resolution;
    }

    let nodeIdx = resolution.nodeIdx;
    let unresolvedPath = resolution.unresolvedPath;

    const doenetCore = core.core!;

    while (unresolvedPath?.length > 0) {
        const nextPathPart = unresolvedPath[0];

        // If the next part has a name, it can only match a prop
        if (nextPathPart.name !== "") {
            const refResolution = doenetCore.resolvePath(
                doenetCore.resolver,
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
            unresolvedPath = refResolution.unresolvedPath;
            continue;
        }

        const refComponent = core.core!._components![nodeIdx];

        const haveComposite =
            doenetCore.componentInfoObjects.isCompositeComponent({
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
                "Something went wrong as we should only have string indices",
            );
        }

        // Note: strings that are not blank do take up a slot for replacement index.
        // However, this non-blank strings that do take up a slot
        // will not be returned as a replacement (instead the replacement will be empty).
        // Rationale: we do not have a mechanism for linking a string to its replacement source,
        // so returning the string would it unlinked and inconsistent with other cases.
        const nonBlankStringReplacements = refComponent.replacements.filter(
            (x) => typeof x !== "string" || x.trim() !== "",
        );

        // Replace all copies with their replacements so that copies don't take up an index
        // but are treated as though they were not an intermediary

        // Reverse the replacements so that we can use them as a queue
        nonBlankStringReplacements.reverse();

        const replacementsWithoutCopies: any[] = [];

        let elt = nonBlankStringReplacements.pop();

        while (elt) {
            if (elt.componentType === "copy") {
                // Add the replacements of the copy to the queue (in reverse order)
                const newNonBlankReplacements = elt.replacements.filter(
                    (x) => typeof x !== "string" || x.trim() !== "",
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
